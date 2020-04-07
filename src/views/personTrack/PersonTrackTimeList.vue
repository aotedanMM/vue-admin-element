<template>
  <div>
    <!--图例-->
    <div class="m_historyLegend" style="border-bottom: 1px solid #eee">
      <el-page-header style="float: left;line-height: 60px !important;" @back="timeListGoBack"/>
      <el-date-picker
        v-model="currentMonth"
        :picker-options="pickerOptions"
        :placeholder="placeVal"
        value-format="yyyy-MM"
        type="month"/>
      <el-button type="primary" style="margin-left: 20px" @click="handleFetchTimeList()">查询</el-button>
      <p style="float: right">当月下井次数: <span>{{ historyTrackQuery.total }}</span></p>
    </div>
    <div class="m_personTrackTimeList">
      <div v-if="timeListData.length === 0" class="m_noData">暂无数据</div>
      <div v-else>
        <ul v-for="(item,index) in timeListData" :key="index">
          <li @click="handleFetchHistoryList(item)"> {{ item }}<i class="el-icon-arrow-right" style="margin-left: 10px;" /></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchHistoryTimeList } from '@/api/history'
export default {
  name: 'PersonTrackTimeList',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      placeVal: '',
      currentMonth: '',
      timeListData: [],
      staffId: null,
      staffName: '',
      historyTrackQuery: { total: 0 }
    }
  },
  created() {
    this.handleCommit()
    this.handleFetchMonth()
  },
  beforeDestroy() {
    eventVue.$off('fetchHistoryTimeList')
  },
  methods: {
    handleFetchMonth() {
      const date = new Date()
      const Y = date.getFullYear()
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      this.placeVal = Y + '-' + M
    },
    // 返回
    timeListGoBack() {
      this.$emit('timeListGoBack')
    },
    // 兄弟组件通信 获取历史轨迹时间列表
    handleCommit() {
      eventVue.$on('fetchHistoryTimeList', (historyTrackQuery) => {
        this.staffId = historyTrackQuery.staffId
        this.staffName = historyTrackQuery.staffName
        this.historyTrackQuery.staffId = historyTrackQuery.staffId
        this.handleFetchHistoryTimeListData()
      })
    },
    // 获取历史轨迹时间列表
    handleFetchHistoryTimeListData() {
      console.log('获取历史轨迹时间列表')
      fetchHistoryTimeList(this.historyTrackQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.timeListData = resp.data.data
          this.historyTrackQuery.total = this.timeListData.length
        } else if (resp.data.code === 111) {
          this.timeListData = []
          this.historyTrackQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.message
          })
        }
      })
    },
    handleFetchHistoryList(item) {
      eventVue.$emit('fetchHistoryList', item, this.staffId, this.staffName)
      this.$emit('showTrackList')
    },
    // 按月查询
    handleFetchTimeList() {
      console.log(this.currentMonth)
      this.historyTrackQuery.currentMonth = this.currentMonth
      this.handleFetchHistoryTimeListData()
    }
  }
}
</script>
