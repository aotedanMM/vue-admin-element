<template>
  <div class="app-container">
    <!--查询筛选条件-->
    <gas-monitor-filter :data-of-json = "dataOfJson" @sendJson="handleSendJson" />
    <!--实时气体滚动部分-->
    <gas-monitor-table/>
    <!--查询员工气体信息弹窗-->
    <gas-monitor-staff/>
  </div>
</template>
<script>
import ReconnectingWebSocket from 'ReconnectingWebSocket'
import GasMonitorFilter from './GasMonitorFilter'
import GasMonitorTable from './GasMonitorTable'
import GasMonitorStaff from './GasMonitorStaff'
export default {
  name: 'GasMonitoring',
  inject: ['reload'],
  components: { GasMonitorStaff, GasMonitorTable, GasMonitorFilter },
  data: function() {
    return {
      dataOfJson: null,
      webSocket: null
    }
  },
  created() {
    this.initWebSocket() // 进入路由开启webSocket连接
  },
  destroyed() {
    this.webSocketClose() // 离开路由之后断开webSocket连接
  },
  methods: {
    handleSendJson(dataOfJson) {
      this.webSocketSend(JSON.stringify(dataOfJson))
      this.reload()
    },
    initWebSocket() {
      // 初始化webSocket
      const wsUrl = process.env.BASE_WS + 'websocket'
      this.webSocket = new ReconnectingWebSocket(wsUrl)
      this.webSocket.onopen = this.webSocketOnOpen // 连接建立
      this.webSocket.onmessage = this.webSocketOnMessage // 数据接收
      this.webSocket.onclose = this.webSocketClose // 连接关闭
      this.webSocket.onerror = this.webSocketOnError // 连接错误

      this.webSocket.debug = true // 记录调试消息(默认false)
      this.webSocket.automaticOpen = true // 实例化时立即尝试连接(默认true)
      this.webSocket.reconnectInterval = 1000 // 尝试重新连接之前延迟的毫秒数(默认1000)
      this.webSocket.maxReconnectInterval = 30000 // 延迟重新连接尝试的最大毫秒数(默认30000)
      this.webSocket.reconnectDecay = 1.5 // 重新连接延迟的增加率。允许重新连接尝试在问题仍然存在时退出。(默认1.5)
      this.webSocket.timeoutInterval = 2000 // 在关闭和重试之前等待连接成功的最长时间(默认2000,毫秒单位)
      this.webSocket.maxReconnectAttempts = null // 在放弃之前将进行的最大重新连接尝试次数。如果为null，则将继续永久重新连接尝试(默认null)
    },
    // 建立连接
    webSocketOnOpen() {
    },
    // 数据接收
    webSocketOnMessage: function(e) {
      if (Object.keys(e.data).length != null) {
        this.listData = JSON.parse(e.data)
        this.$emit('webSocketPushData', this.listData)
      }
    },
    // 数据发送
    webSocketSend(Data) {
      this.webSocket.send(Data)
    },
    // 关闭连接
    webSocketClose() {
      this.webSocket.close()
    },
    // 连接出错
    webSocketOnError() {
    }
  }
}
</script>
