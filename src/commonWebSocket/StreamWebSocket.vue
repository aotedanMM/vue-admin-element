<template>
  <div/>
</template>
<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'StreamWebSocket',
  data() {
    return {
      socketOfStream: null
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('openStreamWebSocket')
    eventVue.$off('closeStreamWebSocket')
    eventVue.$off('sendStream')
  },
  methods: {
    handleCommit() {
      // 开启语音流
      eventVue.$on('openStreamWebSocket', () => {
        this.openWebSocketStream()
      })
      // 关闭语音流
      eventVue.$on('closeStreamWebSocket', () => {
        // 判断当前webSocket的连接状态,如果是未关闭的状态则关闭webSocket
        if (this.socketOfStream.readyState !== 3) {
          this.socketOfStream.close()
          console.log('socketOfStream流处理关闭')
        }
      })
      // 发送语音流
      eventVue.$on('sendStream', (dataAsInt16Array) => {
        // 判断当前webSocket的连接状态,如果是连接状态则发送语音流数据
        if (this.socketOfStream.readyState === 1) {
          console.log('前端发送数据流')
          console.log(dataAsInt16Array)
          this.socketOfStream.send(dataAsInt16Array)
        }
      })
    },
    openWebSocketStream() {
      console.log('开启语音流')
      this.socketOfStream = new WebSocket(process.env.VOICE_WS + 'voiceStreamWebSocket')
      this.socketOfStream.binaryType = 'arraybuffer'
      this.socketOfStream.onopen = this.handleOpenMethod
      this.socketOfStream.onmessage = this.handleMessageMethod
      this.socketOfStream.onerror = this.handleErrorMethod
    },
    handleOpenMethod() {
      console.log('开启socketOfStream音频流的连接')
      eventVue.$emit('getUserMedia')
    },
    // 接收数据（硬件传输语音流）
    handleMessageMethod(message) {
      console.log('接收硬件语音流')
      console.log(message.data)
      eventVue.$emit('messageStream', message.data)
    },
    handleErrorMethod() {
      console.log('webSocket异常')
    }
  }
}
</script>
