<template>
  <div class="window_body" @mouseenter="handleMouseEnter()">
    <div id="m_voiceDialog">
      <div class="m_gasInfo">
        <div
          :data="gasInfo"
          class="m_gasInfoTop">
          <p v-if="gasInfo.co">一氧化碳:{{ gasInfo.co }}ppm</p>
          <p v-else> 一氧化碳:0ppm</p>
          <p v-if="gasInfo.ch4">甲烷:{{ gasInfo.ch4 }}%</p>
          <p v-else>甲烷:0%</p>
          <p v-if="gasInfo.o2">氧气:{{ gasInfo.o2 }}%</p>
          <p v-else>氧气:0%</p>
          <p v-if="gasInfo.temperature">温度:{{ gasInfo.temperature }}℃</p>
          <p v-else>温度:0℃</p>
          <p v-if="gasInfo.humidity">湿度:{{ gasInfo.humidity }}%</p>
          <p v-else>湿度:0%</p>
        </div>
        <div class="m_gasInfoBottom"><a @click="routerToMap">在地图显示</a></div>
      </div>
      <div class="scrollWrap">
        <!--气体信息-->
        <!--<el-button style="position: absolute;top:0;right: 100px;z-index: 99" @click="handleTest">测试</el-button>-->
        <scroller
          ref="scrollBottom3"
          :on-refresh="handleRefreshVoiceData"
          no-data-text="">
          <div class="scrollContent">
            <!--收发语音列表-->
            <div ref="scroll2" class="voiceMain">
              <div class="voiceMain2">
                <ul>
                  <li
                    v-for="(item,index) in items"
                    :is="item.component"
                    :sequence-id="item.sequenceId"
                    :voice-url="item.voiceUrl"
                    :badge-status="item.badgeStatus"
                    :seq-id="seqId"
                    :current-chat-time="item.currentChatTime"
                    :voice-call-tips="item.voiceCallTips"
                    :name="index"
                    :key="item.index"
                    @updateSendVoiceStatus="handleUpdateSendVoiceStatus"
                    @updateReceiveVoiceStatus="handleUpdateReceiveVoiceStatus(item)">
                    语音消息
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import VueAudio2 from '@/components/VueAudio2'
import VueAudio from '@/components/VueAudio'
import { fetchStaffChatInfo, fetchStaffGasInfo, updateVoiceStatusById } from '@/api/chat'
import VoiceCallRecordReceive from '@/components/VoiceCallRecordReceive/index'
import VoiceCallRecordSend from '@/components/VoiceCallRecordSend/index'
import VoiceChatTime from '@/components/VoiceChatTime/index'
export default {
  name: 'WindowMain',
  components: { VoiceChatTime, VoiceCallRecordSend, VoiceCallRecordReceive, VueAudio, VueAudio2 },
  data() {
    return {
      setGasInfoTimeout: null,
      setGasInfoInterval: null,
      scrollWrapHeight: null,
      onlineStatus: false,
      lastChatTime: '',
      voiceCallTips: '',
      staffInfo: [],
      seqId: null,
      voiceQuery: { pageSize: 10, startPage: 1, staffId: null },
      items: [{ sequenceId: null, voiceUrl: '', badgeStatus: false }],
      callingVisible: false,
      gasInfo: {},
      voiceListData: [],
      newVoiceListData: []
    }
  },
  computed: {
    globalLoadDataFlag() {
      return this.$store.state.voice.globalLoadDataFlag
    },
    globalCurrentUserId() {
      return this.$store.state.voice.globalCurrentUserId
    },
    globalStartUserId() {
      return this.$store.state.voice.globalStartUserId
    }
  },
  watch: {
    globalCurrentUserId() {
      this.lastChatTime = ''
    }
  },
  created() {
    this.handleFetchStaffInfoToMain() // 将聊天列表数据传送到main
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('setGasInfoTimeout')
    eventVue.$off('clearGasInfoInterval')
    eventVue.$off('resetScrollWrapHeight')
    eventVue.$off('onlineStatus')
    eventVue.$off('addReceiveVoice')
    eventVue.$off('createSendVoice')
    eventVue.$off('AddVoiceCallRecordSend')
    eventVue.$off('AddVoiceCallRecordReceive')
  },
  methods: {
    handleTest() {
      eventVue.$emit('test')
    },
    // 加载完当前窗口的聊天数据，跳转到最底部
    handelScrollToBottom() {
      if (this.scrollWrapHeight > 350) {
        setTimeout(() => {
          this.$refs.scrollBottom3.scrollTo(0, this.scrollWrapHeight - 150)
        }, 10)
      }
    },
    handleCommit() {
      // 点击聊天列表开始计时
      eventVue.$on('setGasInfoTimeout', () => {
        if (this.setGasInfoTimeout) {
          clearTimeout(this.setGasInfoTimeout)
          this.setGasInfoTimeout = null
        }
        if (this.setGasInfoInterval) {
          clearInterval(this.setGasInfoInterval)
          this.setGasInfoInterval = null
        }
        // 计时一分钟,不改变staffId一分钟后设置定时器
        this.setGasInfoTimeout = setTimeout(() => {
          this.handleSetGasInfoInterval()
          // console.log('设置定时器')
        }, 5 * 1000)
      })
      // 清空计时器
      eventVue.$on('clearGasInfoInterval', () => {
        if (this.setGasInfoInterval) {
          clearInterval(this.setGasInfoInterval)
          this.setGasInfoInterval = null
        }
        if (this.setGasInfoTimeout) {
          clearTimeout(this.setGasInfoTimeout)
          this.setGasInfoTimeout = null
        }
      })
      // 清空滚动条高度
      eventVue.$on('resetScrollWrapHeight', () => {
        this.scrollWrapHeight = 0
      })
      eventVue.$on('onlineStatus', (onlineStatus) => {
        this.onlineStatus = onlineStatus
      })
      // 新增一条接收单条语音
      eventVue.$on('addReceiveVoice', (newItems) => {
        // 判断开始录音的员工ID与当前员工ID是否相同，判断是否添加一条语音
        this.handleJudeDiffTime()
        const m = this.handleCreateReceiveVoice(newItems)
        // eventVue.$emit('addUnListenSingleAmount', data.voiceInfo.staffId) // 单体语音未读数量+1
        this.scrollWrapHeight += 70 // 增加滚动条高度
        if (m) {
          this.handelScrollToBottom()
        }
      })
      // 新增一条发送单条语音
      eventVue.$on('createSendVoice', (newItems) => {
        // 判断开始录音的员工ID与当前员工ID是否相同，判断是否添加一条语音
        if (this.globalStartUserId === this.globalCurrentUserId) {
          this.handleJudeDiffTime()
          const m = this.handleCreateSendVoice(newItems)
          this.scrollWrapHeight += 70 // 增加滚动条高度
          if (m) {
            this.handelScrollToBottom()
          }
        }
      })
      // 新增一条发送呼叫语音通话记录
      eventVue.$on('AddVoiceCallRecordSend', (callDuration) => {
        // 判断开始语音通话的员工ID与当前员工ID是否相同，判断是否添加一条语音通话记录
        if (this.globalStartUserId === this.globalCurrentUserId) {
          this.handleJudeDiffTime()
          const m = this.handleCreateSendVoiceCallRecord(callDuration)
          this.scrollWrapHeight += 70 // 增加滚动条高度
          if (m) {
            this.handelScrollToBottom()
          }
        }
      })
      // 新增一条接收呼叫的语音通话记录
      eventVue.$on('AddVoiceCallRecordReceive', (callDuration) => {
        // console.log('新增一条接收呼叫的语音通话记录')
        // console.log(this.globalStartUserId)
        // console.log(this.globalCurrentUserId)
        // 判断开始语音通话的员工ID与当前员工ID是否相同，判断是否添加一条语音通话记录
        if (this.globalStartUserId === this.globalCurrentUserId) {
          this.handleJudeDiffTime()
          const m = this.handleCreateReceiveVoiceCallRecord(callDuration)
          this.scrollWrapHeight += 70 // 增加滚动条高度
          if (m) {
            this.handelScrollToBottom()
          }
        }
      })
    },
    // 定时器 每隔5秒获取一次气体数据
    handleSetGasInfoInterval() {
      if (this.setGasInfoInterval) {
        clearInterval(this.setGasInfoInterval)
        this.setGasInfoInterval = null
      }
      this.setGasInfoInterval = setInterval(() => {
        console.log('定时获取员工ID：' + this.globalCurrentUserId + ' 的气体数据')
        this.handleFetchGasInfo(this.globalCurrentUserId)
      }, 5 * 1000)
    },
    // 判断时间差，大于十分钟显示当前语音时间
    handleJudeDiffTime() {
      const sendTime = new Date().getTime()
      // 判断当前是否有最近聊天时间，如果没有则直接添加当前聊天时间
      if (this.lastChatTime) {
        const diffTime = parseInt((sendTime - this.lastChatTime) / 1000 / 60)
        // 若时间间隔大于10分钟,则新增一条聊天时间显示
        if (diffTime > 10) {
          this.handleAddTimeComponent(sendTime)
          this.lastChatTime = sendTime
        }
      } else {
        this.handleAddTimeComponent(sendTime)
        this.lastChatTime = sendTime
      }
    },
    // 点击聊天列表将数据传送到main
    handleFetchStaffInfoToMain() {
      eventVue.$on('chatListToWindowMain', (message) => {
        this.staffInfo = message
        this.voiceQuery.staffId = message.staffId
        this.voiceQuery.startPage = 1 // 初始化开始页数
        this.gasInfo = [] // 清空气体数据列表
        this.items = [] // 清空语音数据列表
        this.voiceListData = [] // 每次获取聊天数据之前先清空
        this.newVoiceListData = []
        this.handleFetchGasInfo(message.staffId) // 根据员工ID获取员工气体数据
        this.handleFetchVoiceInfo() // 根据员工ID获取聊天记录
      })
    },
    // 获取气体信息
    handleFetchGasInfo(staffId) {
      fetchStaffGasInfo(staffId).then(resp => {
        // console.log('获取气体信息')
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.gasInfo = resp.data.data
        } else if (resp.data.code === 111) {
          this.gasInfo = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 通过员工ID获取聊天记录
    handleFetchVoiceInfo() {
      // console.log('通过员工ID获取聊天记录')
      fetchStaffChatInfo(this.voiceQuery).then(resp => {
        if (resp.data.code === 200) {
          // console.log(this.voiceQuery)
          // console.log(resp.data.data)
          this.pagination = resp.data.data.hasNextPage // 是否有下一页
          this.totalpage = resp.data.data.pages // 总页数
          if (this.globalLoadDataFlag) {
            // 第一次获取数据
            this.voiceListData = resp.data.data.list
            this.handleCreateComponentToMain(this.voiceListData)
            this.handleComputedScrollHeight(this.voiceListData) // 计算当前滚动条高度
          } else {
            // 加载更多数据
            this.newVoiceListData = resp.data.data.list
            this.handleComputedScrollHeight(this.newVoiceListData) // 计算当前滚动条高度
          }
        } else if (resp.data.code === 111) {
          this.pagination = false
          this.totalpage = 0
          this.voiceListData = []
          this.newVoiceListData = []
        } else {
          this.pagination = false
          this.totalpage = 0
          this.voiceListData = []
          this.newVoiceListData = []
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 添加一条时间组件
    handleAddTimeComponent(postTime) {
      this.items.push({ 'component': VoiceChatTime, 'currentChatTime': postTime })
      this.scrollWrapHeight += 40 // 增加滚动条高度
    },
    // 添加一条时间组件
    handleJudgeAddTimeComponent(m) {
      // 若时间差大于十分钟则添加时间组件
      if (m.isShow) {
        if (this.globalLoadDataFlag) {
          this.items.push({ 'component': VoiceChatTime, 'currentChatTime': m.postTime })
        } else {
          this.items.push({ 'component': VoiceChatTime, 'currentChatTime': m.postTime })
        }
      }
    },
    // 动态添加语音列表中的组件
    handleCreateComponentToMain(dynamicData) {
      // console.log('动态添加语音列表中的组件')
      // console.log(dynamicData)
      for (const m of dynamicData) {
        switch (m.lengthMsg) {
          case 0:
            this.handleJudgeAddTimeComponent(m)
            if (m.postUserId === 0) {
              this.handleCreateSendVoice(m)
            } else {
              this.handleCreateReceiveVoice(m)
            }
            break
          case 1:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateSendVoiceCallRecord('已取消')
            break
          case 2:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateSendVoiceCallRecord('对方已拒绝')
            break
          case 3:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateReceiveVoiceCallRecord('对方已取消')
            break
          case 4:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateReceiveVoiceCallRecord('已拒绝')
            break
          case 5:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateSendVoiceCallRecord('通话时长' + m.postMsg)
            break
          case 6:
            this.handleJudgeAddTimeComponent(m)
            this.handleCreateReceiveVoiceCallRecord('通话时长' + m.postMsg)
            break
        }
      }
      const len = dynamicData.length
      this.lastChatTime = dynamicData[len - 1].postTime
    },
    // 动态添加语音列表中的组件 (加载数据,添加时间组件和添加语音组件顺序颠倒)
    handleCreateLoadComponentToMain(dynamicData) {
      for (const m of dynamicData) {
        switch (m.lengthMsg) {
          case 0:
            if (m.postUserId === 0) {
              this.handleCreateSendVoice(m)
            } else {
              this.handleCreateReceiveVoice(m)
            }
            // this.handleJudgeAddTimeComponent(m)
            break
          case 1:
            this.handleCreateSendVoiceCallRecord('已取消')
            // this.handleJudgeAddTimeComponent(m)
            break
          case 2:
            this.handleCreateSendVoiceCallRecord('对方已拒绝')
            // this.handleJudgeAddTimeComponent(m)
            break
          case 3:
            this.handleCreateReceiveVoiceCallRecord('对方已取消')
            // this.handleJudgeAddTimeComponent(m)
            break
          case 4:
            this.handleCreateReceiveVoiceCallRecord('已拒绝')
            // this.handleJudgeAddTimeComponent(m)
            break
          case 5:
            this.handleCreateSendVoiceCallRecord('通话时长' + m.postMsg)
            // this.handleJudgeAddTimeComponent(m)
            break
          case 6:
            this.handleCreateReceiveVoiceCallRecord('通话时长' + m.postMsg)
            // this.handleJudgeAddTimeComponent(m)
            break
        }
      }
      // this.scrollWrapHeight = 70 * len + 40 * this.timeCouter
    },
    // 根据获取的聊天数据，计算当前各个组件的数量并统计高度
    handleComputedScrollHeight(dynamicData) {
      const len = dynamicData.length
      this.timeCouter = 0
      for (let i = 0; i < len; i++) {
        if (dynamicData[i].isShow) {
          this.timeCouter++
        }
      }
      this.scrollWrapHeight += 70 * len + 40 * this.timeCouter
      this.handelScrollToBottom()
    },
    // 新增一条发送语音
    handleCreateSendVoice(newItems) {
      if (this.globalLoadDataFlag) {
        this.items.push({ 'component': VueAudio2, 'voiceUrl': newItems.postMsg, 'sequenceId': newItems.sequenceId, 'badgeStatus': newItems.status })
      } else {
        this.items.unshift({ 'component': VueAudio2, 'voiceUrl': newItems.postMsg, 'sequenceId': newItems.sequenceId, 'badgeStatus': newItems.status })
      }
      return true
    },
    // 新增一条接收语音
    handleCreateReceiveVoice(newItems) {
      if (this.globalLoadDataFlag) {
        this.items.push({ 'component': VueAudio, 'voiceUrl': newItems.postMsg, 'sequenceId': newItems.sequenceId, 'badgeStatus': newItems.status })
      } else {
        this.items.unshift({ 'component': VueAudio, 'voiceUrl': newItems.postMsg, 'sequenceId': newItems.sequenceId, 'badgeStatus': newItems.status })
      }
      return true
    },
    // 新增一条发送通话记录
    handleCreateSendVoiceCallRecord(callDuration) {
      if (this.globalLoadDataFlag) {
        this.items.push({ 'component': VoiceCallRecordSend, 'voiceCallTips': callDuration })
      } else {
        this.items.unshift({ 'component': VoiceCallRecordSend, 'voiceCallTips': callDuration })
      }
      return true
    },
    // 新增一条接收通话记录
    handleCreateReceiveVoiceCallRecord(callDuration) {
      if (this.globalLoadDataFlag) {
        this.items.push({ 'component': VoiceCallRecordReceive, 'voiceCallTips': callDuration })
      } else {
        this.items.unshift({ 'component': VoiceCallRecordReceive, 'voiceCallTips': callDuration })
      }
      return true
    },
    // 聊天窗口聊天记录 下拉刷新加载更多
    handleRefreshVoiceData(done) {
      if (this.globalLoadDataFlag) {
        this.$store.dispatch('handleChangeGlobalLoadDataFlag', false)
      }
      this.voiceQuery.startPage++
      // 判断是否为最后一页，若当前为最后一页则不再加载
      if (this.pagination === false || this.voiceQuery.startPage > this.totalpage) {
        setTimeout(() => {
          done(true)
        }, 500)
        return
      }
      this.handleFetchVoiceInfo() // 调用获取聊天记录的方法
      // 将加载到的newList追加到原有的数据源中
      setTimeout(() => {
        this.voiceListData = this.voiceListData.concat(this.newVoiceListData)
        this.newVoiceListData.reverse() // 颠倒数组中元素的顺序
        this.handleCreateLoadComponentToMain(this.newVoiceListData)
        setTimeout(() => {
          done()
        })
      }, 500)
    },
    // 跳转到地图页
    routerToMap() {
      // console.log(this.onlineStatus)
      // 判断员工是否在线,若在线则可以跳转到地图页,否则不能跳转
      if (this.onlineStatus) {
        this.$router.push({
          path: '/monitor/positionMonitoring',
          name: 'PositionMonitoring',
          params: {
            staffId: this.globalCurrentUserId
          }
        })
        this.$store.dispatch('hideVoiceDialog')
      } else {
        this.$message({
          type: 'info',
          message: '终端不在线,请稍后再试'
        })
      }
    },
    // 更新接收语音已读状态
    handleUpdateReceiveVoiceStatus(item) {
      this.seqId = item.sequenceId
      // 当状态为未读时,更新语音状态
      if (!item.badgeStatus) {
        updateVoiceStatusById(this.seqId).then((resp) => {
          for (let i = 0; i < this.items.length; i++) {
            if (this.seqId === this.items[i].sequenceId) {
              this.items[i].badgeStatus = true
            }
          }
          if (resp.data.code === 200) {
            eventVue.$emit('cutUnReadAmount', this.globalCurrentUserId) // 未读数量-1
          }
        })
      }
    },
    // 更新发送语音状态
    handleUpdateSendVoiceStatus(seqId) {
      // this.seqId = seqId
      // // 更新发送语音状态为已读
      // if (this.seqId !== undefined) {
      //   updateVoiceStatusById(this.seqId).then(() => {
      //     for (let i = 0; i < this.items.length; i++) {
      //       if (this.seqId === this.items[i].sequenceId) {
      //         this.items[i].badgeStatus = true
      //       }
      //     }
      //   })
      // }
    },
    // 鼠标移入事件
    handleMouseEnter() { this.mouseScroll() },
    // 滚轮事件
    mouseScroll() {
      const _this = this // 此this指向的是vue
      window.onmousewheel = function(e) {
        if (e.wheelDelta < 0) {
          _this.$refs.scrollBottom3 && (_this.$refs.scrollBottom3.scrollBy(0, 30, false))// 避免ref中不存在scrollBottom
        } else {
          _this.$refs.scrollBottom3 && (_this.$refs.scrollBottom3.scrollBy(0, -30, false))
        }
      }
    },
    // 鼠标移出事件
    handleMouserLeave() {}
  }
}
</script>
