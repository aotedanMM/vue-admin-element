<template>
  <div>
    <warn-area-history-filter :type-flag="typeFlag"/>
    <!--人员出入警告区域历史 -->
    <div class="m_warnAreaTable">
      <el-table :data="accessHistoryData" border>
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进区域时刻">
          <template slot-scope="scope">
            <span v-if="scope.row.inTime === undefined "/>
            <span v-else> {{ scope.row.inTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出区域时刻">
          <template slot-scope="scope">
            <span v-if="scope.row.outTime === undefined "/>
            <span v-if="scope.row.outTime!=null"> {{ scope.row.outTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="accessHistoryQuery.type === 1" label="工作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="accessHistoryQuery.type === 2" label="滞留时间">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="accessHistoryQuery.total >0" class="pagination-container">
      <el-pagination
        :current-page="accessHistoryQuery.page"
        :page-size="accessHistoryQuery.limit"
        :total= "accessHistoryQuery.total"
        layout="total, prev, pager, next"
        @current-change="handleSizeChangeHistoryData"/>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchAccessStaffHistory, fetchWarningAreaHistory } from '@/api/warningArea'
import WarnAreaHistoryFilter from './WarnAreaHistoryFilter'
export default {
  name: 'WarnAreaHistoryList',
  components: { WarnAreaHistoryFilter },
  data() {
    return {
      accessHistoryData: [],
      typeFlag: 0,
      accessHistoryQuery: { total: 0, limit: 20, page: 1 }
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('warnStaffHistory')
    eventVue.$off('showWarningAreaHistory')
    eventVue.$off('searchAreaHistory')
    eventVue.$off('searchStaffHistory')
  },
  methods: {
    // 重置查询参数
    handleResetSearchPar() {
      this.accessHistoryQuery = {
        page: 1,
        total: 0,
        limit: 20
      }
    },
    // 兄弟组件通信
    handleCommit() {
      // 根据员工ID获取人员出入警告区域历史
      // 员工
      eventVue.$on('warnStaffHistory', (staffId, type) => {
        this.accessHistoryQuery.staffId = staffId
        this.accessHistoryQuery.type = type
        this.typeFlag = 1
        this.handleFetchAccessStaffHistory()
      })
      // 根据区域ID获取人员出入警告区域历史
      // 区域
      eventVue.$on('showWarningAreaHistory', (areaId, type) => {
        this.accessHistoryQuery.areaId = areaId
        this.accessHistoryQuery.type = type
        this.typeFlag = 2
        this.handleFetchAreaAccessHistory()
      })
      // 根据时间查询历史(区域历史)
      eventVue.$on('searchAreaHistory', (startTime, endTime) => {
        this.accessHistoryQuery.startTime = startTime
        this.accessHistoryQuery.endTime = endTime
        this.handleFetchAreaAccessHistory()
      })
      // 根据时间查询历史(人员历史)
      eventVue.$on('searchStaffHistory', (startTime, endTime) => {
        this.accessHistoryQuery.startTime = startTime
        this.accessHistoryQuery.endTime = endTime
        this.handleFetchAccessStaffHistory()
      })
    },
    // 根据员工ID获取人员出入警告区域历史
    handleFetchAccessStaffHistory() {
      // console.log(this.accessHistoryQuery)
      fetchAccessStaffHistory(this.accessHistoryQuery).then(resp => {
        if (resp.data.code === 200) {
          this.accessHistoryData = resp.data.data.list
          this.accessHistoryQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.accessHistoryData = []
          this.accessHistoryQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    },
    // 根据区域ID获取人员出入警告区域历史
    // 查看历史
    handleFetchAreaAccessHistory() {
      // console.log('查看历史')
      // console.log(this.accessHistoryQuery)
      fetchWarningAreaHistory(this.accessHistoryQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.accessHistoryData = resp.data.data.list
          this.accessHistoryQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.accessHistoryData = []
          this.accessHistoryQuery.total = 0
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
    // 改变人员出入历史列表页数
    handleSizeChangeHistoryData(val) {
      this.accessHistoryQuery.page = val
      if (this.typeFlag === 1) {
        this.handleFetchAccessStaffHistory()
      } else {
        this.handleFetchAreaAccessHistory()
      }
    }
  }
}
</script>

