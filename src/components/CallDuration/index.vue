<template>
  <div class="wrapper">
    正在通话，通话时长  <span id="mytime">{{ str }}</span>
  </div>

</template>
<script>
export default {
  name: 'CallDuration',
  data() {
    return {
      h: 0, // 定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: null,
      str: '',
      mytime: '00:00:00'
    }
  },
  // 实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el 还不可用。需要初始化处理一些数据时会比较有用
  created() {
    // this.stop()
    // this.reset()
    // this.start()
  },
  methods: {
    timer() { // 定义计时函数
      this.ms = this.ms + 100 // 毫秒
      if (this.ms >= 1000) {
        this.ms = 0
        this.s = this.s + 1 // 秒
      }
      if (this.s >= 60) {
        this.s = 0
        this.m = this.m + 1 // 分钟
      }
      if (this.m >= 60) {
        this.m = 0
        this.h = this.h + 1 // 小时
      }
      this.str = this.toDub(this.h) + ':' + this.toDub(this.m) + ':' + this.toDub(this.s) + ''/* +this.toDubms(this.ms)+"毫秒"*/
      // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },
    reset() { // 重置
      // clearInterval(this.time)
      this.h = 0
      this.m = 0
      this.ms = 0
      this.s = 0
      this.str = ''
    },

    start() { // 开始
      this.$store.dispatch('handleChangeCallDuration', this.str)
      this.time = setInterval(this.timer, 100)
    },

    stop() { // 暂停
      clearInterval(this.time)
      this.$store.dispatch('handleChangeCallDuration', this.str)
      this.reset() // 每次重新计时
    },

    toDub(n) { // 补0操作
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    toDubms(n) { // 给毫秒补0操作
      if (n < 10) {
        return '00' + n
      } else {
        return '0' + n
      }
    }
  }
}
</script>
<style scoped>
</style>
