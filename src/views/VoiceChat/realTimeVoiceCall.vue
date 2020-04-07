<template>
  <div/>
</template>
<script>
/* eslint-disable */
import eventVue from '@/api/eventVue'
let context
let source
let player
/**
 * PCM播放，初始化
 */
function PCMPlayer(option) {
  this.init(option)
}
function InitPCMPlayer() {
  // console.log('初始化PCMPlayer')
  player = new PCMPlayer({
    encoding: '16bitInt',
    channels: 1,
    sampleRate: 16000,
    flushingTime: 1000
  })
}
PCMPlayer.prototype.init = function(option) {
  // 默认配置
  var defaults = {
    encoding: '16bitInt',
    channels: 1,
    sampleRate: 16000,
    flushingTime: 1000
  }
  this.option = Object.assign({}, defaults, option) // 配置项
  this.samples = new Float32Array() // 样本
  this.flush = this.flush.bind(this) // 刷新时间
  this.interval = setInterval(this.flush, this.option.flushingTime) // 定时器 每隔一秒(flushingTime)执行一次刷新(this.flush)
  this.maxValue = this.getMaxValue() // 获取最大编码值
  this.typedArray = this.getTypedArray() // 二进制缓冲区
  this.createContext() // 新建AudioContext对象
}
// 获取最大编码值
PCMPlayer.prototype.getMaxValue = function() {
  var encodings = {
    '8bitInt': 128,
    '16bitInt': 32768,
    '32bitInt': 2147483648,
    '32bitFloat': 1
  }

  return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt']
}
PCMPlayer.prototype.getTypedArray = function() {
  var typedArrays = {
    '8bitInt': Int8Array,
    '16bitInt': Int16Array,
    '32bitInt': Int32Array,
    '32bitFloat': Float32Array
  }

  return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt']
}
// 新建AudioContext对象
PCMPlayer.prototype.createContext = function() {
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)() // 初始化AudioContext对象
  this.gainNode = this.audioCtx.createGain() // 创建一个GainNode,它可以控制音频的总音量
  this.gainNode.gain.value = 1 // 设置初始音量
  this.gainNode.connect(this.audioCtx.destination) // 表示当前audio context中所有节点的最终节点，一般表示音频渲染设备。
  this.startTime = this.audioCtx.currentTime
}
// 判断是否为typeArray类型
PCMPlayer.prototype.isTypedArray = function(data) {
  return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer)
}
// 播放
PCMPlayer.prototype.feed = function(data) {
  if (!this.isTypedArray(data)) return
  data = this.getFormatedValue(data)
  var tmp = new Float32Array(this.samples.length + data.length)
  tmp.set(this.samples, 0)
  tmp.set(data, this.samples.length)
  this.samples = tmp
  // console.log(this.samples.length)
}
// 8位转32位
PCMPlayer.prototype.getFormatedValue = function(data) {
  var data = new this.typedArray(data.buffer),
    float32 = new Float32Array(data.length),
    i
  for (i = 0; i < data.length; i++) {
    float32[i] = data[i] / this.maxValue
  }
  return float32
}
// 音量
PCMPlayer.prototype.volume = function(volume) {
  this.gainNode.gain.value = volume
}
// 关闭PCMPlayer流
PCMPlayer.prototype.destroy = function() {
  if (this.interval) {
    clearInterval(this.interval)
  }
  this.samples = new Float32Array()
  if (this.audioCtx) {
    this.audioCtx.close()
  }
  // this.audioCtx = null
}
PCMPlayer.prototype.flush = function() {
  if (!this.samples.length) return
  // createBufferSource() 方法用于创建一个新的AudioBufferSourceNode接口, 该接口可以通过AudioBuffer 对象来播放音频数据
  var bufferSource = this.audioCtx.createBufferSource(),
    // length等于样本长度 / 声道
    length = this.samples.length / this.option.channels,
    // createBuffer() 方法用于新建一个空白的 AudioBuffer 对象，以便用于填充数据，通过 AudioBufferSourceNode 播放。
    // 声道、buffer中的样本帧数、采样率
    audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate),
    audioData,
    channel,
    offset,
    i,
    decrement

  for (channel = 0; channel < this.option.channels; channel++) {
    audioData = audioBuffer.getChannelData(channel)
    offset = channel
    decrement = 50
    for (i = 0; i < length; i++) {
      audioData[i] = this.samples[offset]
      /* fadein */
      if (i < 50) {
        audioData[i] = (audioData[i] * i) / 50
      }
      /* fadeout*/
      if (i >= (length - 51)) {
        audioData[i] = (audioData[i] * decrement--) / 50
      }
      offset += this.option.channels
    }
  }

  if (this.startTime < this.audioCtx.currentTime) {
    this.startTime = this.audioCtx.currentTime
  }
  // console.log('start vs current ' + this.startTime + ' vs ' + this.audioCtx.currentTime + ' duration: ' +
  //   audioBuffer.duration)
  // 通过AudioBuffer 对象来播放音频数据
  bufferSource.buffer = audioBuffer
  bufferSource.connect(this.gainNode)
  bufferSource.start(this.startTime)
  this.startTime += audioBuffer.duration
  this.samples = new Float32Array()
}
// const player = new PCMPlayer({
//   encoding: '16bitInt',
//   channels: 1,
//   sampleRate: 16000,
//   flushingTime: 1000
// })
export default {
  name: 'RealTimeVoiceCall',
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('getUserMedia')
    eventVue.$off('messageStream')
    eventVue.$off('closePlayer')
    eventVue.$off('closeContext')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      // 获取用户流
      eventVue.$on('getUserMedia', () => {
        InitPCMPlayer() // 初始化PCMPlayer
        this.getUserMedia()
      })
      eventVue.$on('messageStream', (message) => {
        const data = new Uint8Array(message)
        player.feed(data)
      })
      // 关闭播放语音流的player对象
      eventVue.$on('closePlayer', () => {
        if (player) {
          player.destroy() // 关闭播放来自硬件的语音流
        }
      })
      // 接收硬件传输过来的语音流播放
      // 关闭用户的麦克风输入语音流
      eventVue.$on('closeContext', () => {
        if (context) {
          context.close() // 关闭用户录音的语音流
        }
      })
    },
    // 初始化，获取用户流
    getUserMedia() {
      // AudioContext接口代表由音频模块构成的音频处理图。
      // 音频上下文控制其所包含节点的创建和音频处理、解码。
      // 使用其它接口前你必需创建一个音频上下文，一切操作都在这个环境里进行。
      context = new (window.AudioContext || window.webkitAudioContext)()

      // context.sampleRate = 44100
      // 用于创建一个新的AudioBufferSourceNode接口, 该接口可以通过AudioBuffer 对象来播放音频数据.
      source = context.createBufferSource()
      // 提醒用户需要使用音频和视频输入设备，比如相机，屏幕共享，或者麦克风。
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      // 获取用户流后的回调函数
      navigator.getUserMedia({
        audio: true
      }, this.getUserMediaSuccess, this.getUserMediaError)
    },
    // 获取用户流成功回调函数
    getUserMediaSuccess(stream) {
      // createMediaElementSource 用于创建新MediaElementAudioSourceNode对象，然后可以播放和操纵音频
      // createMediaStreamSource 用于在MediaStreamAudioSourceNode给定媒体流的情况下创建新对象，然后可以播放和操纵音频。
      const media = Object.prototype.toString.call(stream) !== '[object MediaStream]' ? context.createMediaElementSource(
        stream) : context.createMediaStreamSource(stream)
      // 创建一个ScriptProcessorNode 用于通过JavaScript直接处理音频. 缓冲区大小、输入声道、输出声道
      const processor = context.createScriptProcessor(1024, 2, 2)
      media.connect(processor)
      processor.connect(context.destination)
      source.connect(processor)
      source.start()
      const buffer48 = new Float32Array(1024 * 3)
      const buffer16 = new Float32Array(buffer48.length / 3)
      let pos = 0
      let transcount = 0
      // 控制节点的过程处理
      processor.onaudioprocess = function(e) {
        // 获取输入和输出的数据缓冲区(48000,32,1)
        const input = e.inputBuffer.getChannelData(0)
        // 缓存数据
        for (let n = 0; n < input.length; n++) {
          buffer48[pos++] = input[n]
        }
        transcount++
        if (transcount === 3) {
          // 重置参数
          transcount = 0
          pos = 0
          // 48k转16k
          let offset = 0
          for (let k = 0; k < buffer48.length; k += 3) {
            buffer16[offset++] = buffer48[k]
          }
          // 32转16位
          const dataAsInt16Array = new Int16Array(buffer16.length)
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, buffer16[i]))
            if (s < 0) {
              dataAsInt16Array[i] = 0x8000 * s
            } else {
              dataAsInt16Array[i] = 0x7FFF * s
            }
          }
          eventVue.$emit('sendStream', dataAsInt16Array)
        }
      }
    },
    // 获取用户流，失败回调函数
    getUserMediaError() {
      this.$message({
        message: '获取用户流失败,请刷新页面后重试',
        type: 'info'
      })
      // console.log('获取用户流失败！')
    }
  }
}
</script>

