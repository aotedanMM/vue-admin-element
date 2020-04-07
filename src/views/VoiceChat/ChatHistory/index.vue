<template>
  <div v-if="historyRecordVisible">
    <!--聊天记录-->
    <el-dialog
      :visible.sync="visible"
      append-to-body
      title = "聊天记录"
      class="m_historyRecord"
      @close="closeHistoryRecord">
      <div class="m_historyRecordTop">
        <el-date-picker
          v-model="searchTime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          style="width: 80% !important;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="primary" style="float: right" @click="handleSearchHistoryData">查询</el-button>
      </div>
      <div class="scrollWrap3" @mouseenter="handleMouseEnter()">
        <scroller
          ref="scrollBottom4"
          :on-infinite="infinite4"
          no-data-text="暂无更多数据">
          <div class="scrollContent3">
            <ul>
              <li v-for="(item, index) in historyRecordData" :key="index" class="m_historyRecordItem">
                <div class="m_historyRecordItem1">
                  <p v-if="item.postUserId === 0" class="m_historyRecordName">{{ account }}</p>
                  <p v-else class="m_historyRecordName">{{ item.staffName }}</p>
                <p class="m_historyRecordTime">{{ item.postTime | formatDate }}</p></div>
                <div v-if="item.lengthMsg === 0">
                  <div v-if="item.postUserId === 0">
                    <vue-audio2
                      :sequence-id="item.sequenceId"
                      :voice-url="item.postMsg"
                      :badge-status="item.status"/>
                  </div>
                  <div v-else>
                    <vue-audio
                      :sequence-id="item.sequenceId"
                      :voice-url="item.postMsg"
                      :badge-status="item.status"/>
                  </div>
                </div>
                <div v-if="item.lengthMsg === 1"><voice-call-record-send :voice-call-tips ="'已取消'"/></div>
                <div v-if="item.lengthMsg === 2"><voice-call-record-send :voice-call-tips ="'对方已拒绝'"/></div>
                <div v-if="item.lengthMsg === 3"><voice-call-record-receive :voice-call-tips ="'对方已取消'"/></div>
                <div v-if="item.lengthMsg === 4"><voice-call-record-receive :voice-call-tips =" '已拒绝'"/></div>
                <div v-if="item.lengthMsg === 5"><voice-call-record-send :voice-call-tips ="'通话时长'+ item.postMsg"/></div>
                <div v-if="item.lengthMsg === 6"><voice-call-record-receive :voice-call-tips ="'通话时长' + item.postMsg"/></div>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import VueAudio from '@/components/VueAudio/index'
import { fetchStaffHistoryChatInfo } from '@/api/chat'
import VueAudio2 from '@/components/VueAudio2/index'
import VoiceCallRecordSend from '@/components/VoiceCallRecordSend/index'
import VoiceCallRecordReceive from '@/components/VoiceCallRecordReceive/index'
export default {
  name: 'ChatHistory',
  components: { VoiceCallRecordReceive, VoiceCallRecordSend, VueAudio2, VueAudio },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      firstFetchFlag: true,
      searchTime: '',
      historyRecordVisible: false,
      visible: true,
      historyRecordData: [{ lengthMsg: '', postMsg: '' }],
      newHistoryRecordData: [{ lengthMsg: '' }],
      historyRecordQuery: { pageSize: 5, startPage: 1, total: 0, staffId: null }
    }
  },
  computed: {
    account() {
      return localStorage.getItem('account')
    }
  },
  watch: {
    searchTime() {
      if (this.searchTime) {
        this.historyRecordQuery.startTime = this.searchTime[0]
        this.historyRecordQuery.endTime = this.searchTime[1]
      } else {
        this.historyRecordQuery.startTime = ''
        this.historyRecordQuery.endTime = ''
      }
    }
  },
  created() {
    this.handleFetchHistory()
  },
  beforeDestroy() {
    eventVue.$off('fetchHistoryRecord')
  },
  methods: {
    // 查询
    handleSearchHistoryData() {
      this.historyRecordQuery.startPage = 1
      this.historyRecordData = [] // 清空现有数据,防止后边的加载出错(影响判断是第一次获取数据还是加载数据)
      this.newHistoryRecordData = []
      this.items = []
      this.firstFetchFlag = true
      this.handleHistoryRecordData()
    },
    // 打开聊天记录窗口
    handleFetchHistory() {
      eventVue.$on('fetchHistoryRecord', (message) => {
        this.historyRecordQuery.staffId = message // 员工ID
        this.historyRecordVisible = true // 聊天记录窗口可见
        this.historyRecordQuery.startPage = 1
        this.historyRecordData = [] // 清空现有数据,防止后边的加载出错(影响判断是第一次获取数据还是加载数据)
        this.newHistoryRecordData = []
        this.items = []
        this.firstFetchFlag = true
        this.searchTime = ''
        this.handleHistoryRecordData() // 获取历史聊天记录
      })
    },
    // 获取历史聊天记录
    handleHistoryRecordData() {
      fetchStaffHistoryChatInfo(this.historyRecordQuery).then(resp => {
        if (resp.data.code === 200) {
          this.pagination2 = resp.data.data.hasNextPage // 是否有下一页
          this.totalpage2 = resp.data.data.pages // 总页数
          // 第一次获取数据
          if (this.firstFetchFlag) {
            this.historyRecordData = resp.data.data.list
            this.firstFetchFlag = false
          } else {
            // 加载数据
            this.newHistoryRecordData = resp.data.data.list
          }
        } else if (resp.data.code === 111) {
          this.pagination2 = false
          this.totalpage2 = 0
          this.historyRecordData = []
          this.newHistoryRecordData = []
        } else {
          this.pagination2 = false
          this.totalpage2 = 0
          this.historyRecordData = []
          this.newHistoryRecordData = []
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 历史聊天记录  向下滚动   上拉加载更多
    infinite4(done) {
      this.historyRecordQuery.startPage++
      // 判断是否为最后一页，若当前为最后一页则不再加载
      if (this.pagination2 === false || this.historyRecordQuery.startPage > this.totalpage2) {
        setTimeout(() => {
          done(true)
        }, 500)
        return
      }
      this.handleHistoryRecordData() // 获取历史聊天记录
      // 将加载到的newList追加到phoneList中
      setTimeout(() => {
        this.historyRecordData = this.historyRecordData.concat(this.newHistoryRecordData)
        setTimeout(() => {
          done()
        })
      }, 500)
    },
    // 关闭聊天记录窗口
    closeHistoryRecord() {
      this.historyRecordVisible = false
      this.visible = true
    },
    mouseScroll() {
      const _this = this // 此this指向的是vue
      window.onmousewheel = function(e) {
        if (e.wheelDelta < 0) {
          _this.$refs.scrollBottom4 && (_this.$refs.scrollBottom4.scrollBy(0, 30, false))// 避免ref中不存在scrollBottom
        } else {
          _this.$refs.scrollBottom4 && (_this.$refs.scrollBottom4.scrollBy(0, -30, false))
        }
      }
    },
    // 鼠标移入事件
    handleMouseEnter() { this.mouseScroll() },
    // 鼠标移出事件
    handleMouserLeave() {}
  }
}
</script>
