<template>
  <div class="m_tableContent">
    <div class="m_historyLegend">
      <el-page-header style="float: left;line-height: 60px !important;" @back="trackListGoBack"/>
      <el-select v-model="searchType" placeholder="选择出入井类型" clearable>
        <el-option
          v-for="item in typeArr"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
      <el-time-picker
        v-model="timeRange"
        :picker-options="pickerOptions"
        is-range
        value-format="HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"/>
      <el-button type="primary" @click="handleFetchTimeList()">查询</el-button>
      <ul>
        <li><p class="m_history5"/>限制区域</li>
        <li><p class="m_history4"/>重点区域</li>
        <li><p class="m_history3"/>出井</li>
        <li><p class="m_history2"/>井下</li>
        <li><p class="m_history1"/>入井</li>
      </ul>
      <p class="m_historyLegendTitle">{{ staffName }} - 历史轨迹</p>
    </div>
    <el-table
      :data="historyListData"
      border
      fit
      highlight-current-row>
      <el-table-column label="出入井" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.isOre === 0" > 井下</span>
          <span v-if="scope.row.isOre === 1" style="color: #409EFF;"> 入井</span>
          <span v-if="scope.row.isOre === 2" style="color: #67C23A;"> 出井 </span>
          <span v-if="scope.row.isOre === 3" style="color: #E6A23C;"> 重点区域</span>
          <span v-if="scope.row.isOre === 4" style="color: #F56C6C;"> 限制区域</span>
          <span v-if="scope.row.isOre === undefined" > 井下</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="300px">
        <template slot-scope="scope">
          <span> {{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定位信息">
        <template slot-scope="scope">
          <span> {{ scope.row.tempPositionName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="historyTrackQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="historyTrackQuery.startPage"
        :page-sizes="[20,30,50]"
        :page-size="historyTrackQuery.pageSize"
        :total= "historyTrackQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeHistoryList"
        @current-change="handleCurrentChangeHistoryList"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchHistoryListData } from '@/api/history'
export default {
  name: 'CarTrackHistoryList',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      searchType: null,
      typeArr: [
        { id: 0, value: '井下' },
        { id: 1, value: '入井' },
        { id: 2, value: '出井' },
        { id: 3, value: '重点区域' },
        { id: 4, value: '限制区域' }
      ],
      staffName: '',
      timeRange: '',
      historyListData: [{ isOre: null, tempPositionName: '', createTime: '' }],
      historyTrackQuery: { total: null, pageSize: 30, currentTime: '', staffId: null, startPage: 1 }
    }
  },
  watch: {
    timeRange() {
      if (this.timeRange) {
        this.historyTrackQuery.startTime = this.timeRange[0]
        this.historyTrackQuery.endTime = this.timeRange[1]
      } else {
        this.historyTrackQuery.startTime = ''
        this.historyTrackQuery.endTime = ''
      }
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('fetchHistoryList')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('fetchHistoryList', (currentTime, staffId, staffName) => {
        this.historyTrackQuery.currentTime = currentTime
        this.historyTrackQuery.staffId = staffId
        this.staffName = staffName
        this.handleFetchHistoryTimeListData()
      })
    },
    // 返回
    trackListGoBack() {
      this.$emit('trackListGoBack')
    },
    // 查询
    handleFetchTimeList() {
      this.historyTrackQuery.isOre = this.searchType
      console.log(this.historyTrackQuery)
      this.handleFetchHistoryTimeListData()
    },
    // 获取历史轨迹时间列表
    handleFetchHistoryTimeListData() {
      console.log(this.historyTrackQuery)
      fetchHistoryListData(this.historyTrackQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.historyListData = resp.data.data
        } else if (resp.data.code === 111) {
          this.historyListData = []
        } else {
          this.historyListData = []
          this.$message({
            type: 'error',
            message: resp.data.msg
          })
        }
      })
    },
    // 改变每页显示条数
    handleSizeChangeHistoryList(val) {
      this.historyTrackQuery.pageSize = val
      this.handleFetchHistoryTimeListData()
    },
    // 改变页数
    handleCurrentChangeHistoryList(val) {
      this.historyTrackQuery.startPage = val
      this.handleFetchHistoryTimeListData()
    }
  }
}
</script>
