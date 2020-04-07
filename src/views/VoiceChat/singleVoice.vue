<template>
  <div/>
</template>

<script>
/* eslint-disable */
import { uploadVoice } from '@/api/chat'
import eventVue from '@/api/eventVue'
// import Recorder from '../../../../static/js/recorder.js'
// import Recorderx, { ENCODE_TYPE } from 'recorderx'
// 录音
let rec
let calledStaffId
let newItems // 语音列表数组
let voiceSendStatus = false // 语音发送状态
// 编码，发送
function recStop(batCall) {
  if (rec) {
    if (!batCall) {
      // console.log('正在编码' + rec.set.type + '...')
    }
    rec.stop(function(blob) {
      // 停止录音，发送
      const formData = new FormData()
      formData.append('wavFile', blob)
      formData.append('staffId', calledStaffId)
      uploadVoice(formData).then(resp => {
        if (resp.data.code === 200) {
          newItems = resp.data.data
          voiceSendStatus = true
          eventVue.$emit('transferSendStatus', voiceSendStatus)
          eventVue.$emit('createSendVoice', newItems) // 录音完成并发送成功后,新增一条语音
        } else {
          newItems = []
          voiceSendStatus = false
          eventVue.$emit('transferSendStatus', voiceSendStatus)
        }
      }).catch(e => {
        console.log(e)
      })
      batCall && batCall()
    }, function(s) {
      console.log(s)
      batCall && batCall()
    })
  }
}
// 关闭录音，编码，发送
function recClose() {
  recStop()
  if (rec) {
    rec.close(function() {
      // console.log('已关闭...')
      // console.log('释放占用麦克风资源...')
    })
  }
}
// 关闭录音，发送时间过短，不发送
function stopRecord() {
  if (rec) {
    rec.close(function() {
      // console.log('已关闭...')
      // console.log('释放占用麦克风资源...')
    })
  }
}
// 初始化结束，开始录音
function recStart() {
  if (rec) {
    rec.start()
    // console.log('录制中...')
    eventVue.$emit('transferPlayer', rec) // 传递rec对象
  }
}
// 录音初始化
function recOpen() {
  const type = 'ogg'
  const bit = 16
  // const sample = 44100
  const sample = 16000
  rec = Recorder({
    type: type,
    bitRate: bit,
    sampleRate: sample,
    function(e) {}
  })
  rec.open(function() {
    // console.log('录音打开中...')
    // 初始化成功回调函数
    recStart()
  }, function(e, isUserNotAllow) {
    // 麦克风调用失败回调函数
    console.log(isUserNotAllow ? 'UserNotAllow' : '打开失败：' + e)
  })
}
// 录音
function startRecord() {
  recOpen()
}
// 发送
function pauseRecord() {
  // 结束录音，编码，发送
  recClose()
}

export default {
  name: 'SingleVoice',
  data() {
    return {
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('startRecord')
    eventVue.$off('stopRecord')
    eventVue.$off('pauseRecord')
  },
  methods: {
    handleCommit() {
      // 开始录音
      eventVue.$on('startRecord', () => {
        calledStaffId = this.$store.state.voice.globalCurrentUserId // 员工ID
        startRecord()
      })
      // 暂停录音，发送时间过短，不发送
      eventVue.$on('stopRecord', () => {
        stopRecord()
      })
      // 结束录音并发送
      eventVue.$on('pauseRecord', () => {
        pauseRecord()
      })
    }
  }
}
</script>

