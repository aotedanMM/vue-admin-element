<template>
  <div id="systemTime">
    <p> {{ systemTime | formatDate }} {{ systemWeek | formateWeek }} </p>
  </div>
</template>

<script>
export default {
  name: 'SystemTime',
  data() {
    return {
      systemTime: '',
      systemWeek: ''
    }
  },
  // 在created中获取当前系统时间,否则刷新瞬间会出现NANA情况
  created() {
    this.systemWeek = new Date().getDay() // 获取星期
    this.systemTime = new Date().getTime()// 获取时间
  },
  mounted() {
    this.timer = setInterval(() => {
      this.systemWeek = new Date().getDay()
      this.systemTime = new Date().getTime()
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)// 清除定时器
    }
  }
}
</script>
