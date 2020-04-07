<template>
  <div/>
</template>
<script>
const dataOfJson = {}
function createJsonData(key, val) {
  // 如果 val 被忽略
  if (typeof val === 'undefined') {
    // 删除属性
    delete dataOfJson[key]
  } else {
    // 添加 或 修改
    dataOfJson[key] = val
  }
}
import eventVue from '@/api/eventVue'
import ReconnectingWebSocket from 'ReconnectingWebSocket'
export default {
  name: 'PositionWebSocket',
  data() {
    return {
      positionWebSocket: null,
      positionWebSocket2: null
    }
  },
  created() {
    this.handleCommit() // 兄弟组件通信
    this.initMapWebSocket()// 运行地图页面的webSocket1
    this.InitMapWebSocket2()// 运行地图页面的webSocket2
  },
  beforeDestroy() {
    eventVue.$off('filterPushCondition')
    eventVue.$off('closePositionWebSocket')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('filterPushCondition', (wsZoneId, wsOrgId) => {
        this.wsZoneId = wsZoneId
        this.wsOrgId = wsOrgId
        this.handleFilterPushConditionData()
      })
      eventVue.$on('closePositionWebSocket', () => {
        this.positionWebSocketOnClose()
      })
    },
    // 筛选推送数据条件
    handleFilterPushConditionData() {
      createJsonData('zoneId', this.wsZoneId)
      createJsonData('orgId', this.wsOrgId)
      this.positionWebSocketSend(JSON.stringify(dataOfJson))
    },
    // 加载地图webSocket1
    initMapWebSocket() {
      const wsUrl = process.env.BASE_WS + 'siteToWs'
      this.positionWebSocket = new ReconnectingWebSocket(wsUrl)
      this.positionWebSocket.onopen = this.positionWebSocketOnOpen // 连接建立
      this.positionWebSocket.onmessage = this.positionWebSocketOnMessage // 数据接收
      this.positionWebSocket.onclose = this.positionWebSocketOnClose // 连接关闭
      this.positionWebSocket.onerror = this.positionWebSocketOnError // 连接错误
    },
    // 建立连接
    positionWebSocketOnOpen() {
      // console.log('开启positionWebSocket1')
    },
    // 接收数据
    positionWebSocketOnMessage(e) {
      const data = JSON.parse(e.data)
      const type = data.type
      if (type === 1) {
        // console.log('接收打点数据')
        // console.log(data.gasWSRespVO)
        eventVue.$emit('changeStation', data.gasWSRespVO)
      } else {
        // 掉线移除人员定位信息
        eventVue.$emit('removeStation', data.staffId)
      }
    },
    // 发送数据
    positionWebSocketSend(Data) {
      this.positionWebSocket.send(Data)
    },
    // 关闭连接
    positionWebSocketOnClose() {
      this.positionWebSocket.close()
      // console.log('positionWebSocket关闭')
    },
    // 连接错误
    positionWebSocketOnError() {
    },
    // 加载地图webSocket2
    InitMapWebSocket2() {
      const wsServer = process.env.BASE_WS + 'WSPersonNumberServer'
      this.positionWebSocket2 = new ReconnectingWebSocket(wsServer)
      this.positionWebSocket2.onopen = this.positionWebSocketOnOpen2 // 连接建立
      this.positionWebSocket2.onmessage = this.positionWebSocketOnMessage2 // 数据接收
      this.positionWebSocket2.onclose = this.positionWebSocketOnClose2 //  连接关闭
      this.positionWebSocket2.onerror = this.positionWebSocketOnError2 //  连接错误
    },
    // 建立连接
    positionWebSocketOnOpen2() {
      // console.log('开启positionWebSocket2')
    },
    // 数据接收
    positionWebSocketOnMessage2(resp) {
      const data = JSON.parse(resp.data)
      const type = data.type
      if (type === 1) {
        console.log('超时未上井人数:' + data.data)
        eventVue.$emit('changeTimeoutNum', data.data)
      }
      if (type === 2) {
        console.log('严重超时人数:' + data.data)
        eventVue.$emit('changeSevereTimeOutNum', data.data)
      }
      if (type === 3) {
        console.log('type=3')
        console.log(data.data)
        console.log('井下总人数:' + data.data)
        eventVue.$emit('changeTotalNum', data.data)
      }
      if (type === 4) {
        console.log('缺勤人数:' + data.data)
        eventVue.$emit('changeAbsenceNum', data.data)
      }
      if (type === 5) {
        // console.log('移除地图mark点')
      }
      if (type === 6) {
        if (data.data.code === 1) {
          // 重点区域
          console.log('重点区域人数')
          console.log(data.data)
          eventVue.$emit('changeImportantNum', data.data.data)
          if (data.data.data === 1) {
            this.enterImportantData = data.data
            this.handleEnterImportArea()
          } else {
            this.leaveImportantData = data.data
            this.handleLeaveImportArea()
          }
        } else {
          // 限制区域
          console.log('限制区域人数:' + data.data)
          eventVue.$emit('changeLimitNum', data.data.data)
          if (data.data.data === 1) {
            this.enterLimitData = data.data
            this.handleEnterLimitArea()
          } else {
            this.leaveLimitData = data.data
            this.handleLeaveLimitArea()
          }
        }
      }
      if (type === 7) {
        if (data.data.code === 1) {
          this.accessWarningAreaData = data.data.data
          console.log('进出重点区域工作时间提醒')
          console.log(data.data)
          this.handleAccessWarningAreaData() // 进出重点区域工作时间提醒
        } else {
          this.accessWarningAreaData = data.data.data
          console.log('进出限制区域滞留时间提醒')
          console.log(data.data)
          this.handleAccessWarningAreaData() // 进出限制区域滞留时间提醒
        }
      }
      if (type === 9) {
        console.log('重点区域超员')
        console.log(data)
        this.impOvercrowd = data.data
        this.handleImportantOvercrowd()
      }
      if (type === 10) {
        console.log('限制区域超员')
        console.log(data.data)
        this.limitOvercrowd = data.data
        this.handleLimitOvercrowd()
      }
    },
    // 关闭连接
    positionWebSocketOnClose2() {
      this.positionWebSocket2.close()
      console.log('positionWebSocket2关闭')
    },
    // 连接建立失败
    positionWebSocketOnError2() {
    },
    // 出入警告区域工作时间提醒
    handleAccessWarningAreaData() {
      const that = this
      const h = this.$createElement
      this.instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: this.accessWarningAreaData.staffName,
        message: h('a', this.accessWarningAreaData.deptName + '\n' + this.accessWarningAreaData.areaName + '  ' + this.accessWarningAreaData.timeLong),
        duration: 10 * 1000,
        onClick: function() {
          that.$router.push({
            path: '/monitor/positionMonitoring',
            name: 'PositionMonitoring'
          })
          that.instance.close()
        }
      })
    },
    // 进入重点区域
    handleEnterImportArea() {
      this.$notify({
        title: '重点区域',
        message: this.enterImportantData.staffInfo.staffName + ' 进入-> ' + this.enterImportantData.staffInfo.areaInfo.warningAreaName,
        type: 'warning',
        duration: 10 * 1000
      })
    },
    // 离开重点区域
    handleLeaveImportArea() {
      this.$notify({
        title: '重点区域',
        message: this.leaveImportantData.staffInfo.staffName + ' 离开-> ' + this.leaveImportantData.staffInfo.areaInfo.warningAreaName,
        type: 'warning',
        duration: 10 * 1000
      })
    },
    // 进入限制区域
    handleEnterLimitArea() {
      this.$notify({
        title: '限制区域',
        message: this.enterLimitData.staffInfo.staffName + ' 进入-> ' + this.enterLimitData.staffInfo.areaInfo.warningAreaName,
        type: 'warning',
        duration: 10 * 1000
      })
    },
    // 离开限制区域
    handleLeaveLimitArea() {
      this.$notify({
        title: '限制区域',
        message: this.leaveLimitData.staffInfo.staffName + ' 离开-> ' + this.leaveLimitData.staffInfo.areaInfo.warningAreaName,
        type: 'warning',
        duration: 10 * 1000
      })
    },
    // 重点区域超员
    handleImportantOvercrowd() {
      const that = this
      const h = this.$createElement
      this.instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: '重点区域超员',
        message: h('a', this.impOvercrowd.areaInfo.warningAreaName + '当前人数:' + this.impOvercrowd.personNum),
        duration: 10 * 1000,
        onClick: function() {
          that.$router.push({
            path: 'monitor/positionMonitoring',
            name: 'PositionMonitoring'
          })
          that.instance.close()
        }
      })
    },
    // 限制区域超员
    handleLimitOvercrowd() {
      const that = this
      const h = this.$createElement
      this.instance = this.$notify({
        type: 'warning',
        dangerouslyUseHTMLString: true,
        title: '限制区域超员',
        message: h('a', this.limitOvercrowd.areaInfo.warningAreaName + '当前人数:' + this.limitOvercrowd.personNum),
        duration: 10 * 1000,
        onClick: function() {
          that.$router.push({
            path: 'monitor/positionMonitoring',
            name: 'PositionMonitoring'
          })
          that.instance.close()
        }
      })
    }
  }
}
</script>

