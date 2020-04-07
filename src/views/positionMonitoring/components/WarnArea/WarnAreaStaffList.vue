<template>
  <div>
    <warn-area-staff-filter/>
    <!--人员列表 -->
    <div class="m_warnAreaTable">
      <el-table :data="warningAreaStaffData" border>
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffId }}</span>
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
        <el-table-column v-if="warningAreaStaffQuery.type === 1" label="工作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="warningAreaStaffQuery.type === 2" label="滞留时间">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleFetchAccessStaffHistory(scope.row.staffId)">查看历史</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="warningAreaStaffQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="warningAreaStaffQuery.page"
        :page-size="warningAreaStaffQuery.limit"
        :total= "warningAreaStaffQuery.total"
        layout="total, prev, pager, next"
        @current-change="handleSizeChangeAreaStaffData"/>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchWarningAreaStaffNum } from '@/api/warningArea'
import WarnAreaStaffFilter from './WarnAreaStaffFilter'
export default {
  name: 'WarnAreaStaffList',
  components: { WarnAreaStaffFilter },
  data() {
    return {
      warningAreaStaffData: [],
      warningAreaStaffQuery: { page: 1, total: 0, limit: 20 }
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('warnAreaStaff')
    eventVue.$off('searchWarnAreaStaff')
  },
  methods: {
    // 重置查询参数
    handleResetSearchPar() {
      this.warningAreaStaffQuery = {
        page: 1,
        total: 0,
        limit: 20
      }
    },
    // 兄弟组件通信
    handleCommit() {
      // 获取员工信息
      eventVue.$on('warnAreaStaff', (areaId, type) => {
        this.type = type
        this.warningAreaStaffQuery.areaId = areaId
        this.warningAreaStaffQuery.type = type
        this.handleFetchWarningAreaStaff()
      })
      // 根据员工姓名查询
      eventVue.$on('searchWarnAreaStaff', (staffName) => {
        this.warningAreaStaffQuery.staffName = staffName
        this.handleFetchWarningAreaStaff()
      })
    },
    // 获取警告区域内员工的信息
    // 查看人员
    handleFetchWarningAreaStaff() {
      // console.log(this.warningAreaStaffQuery)
      fetchWarningAreaStaffNum(this.warningAreaStaffQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.warningAreaStaffData = resp.data.data.list
          this.warningAreaStaffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.warningAreaStaffData = []
          this.warningAreaStaffQuery.total = 0
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
    // 获取人员历史
    handleFetchAccessStaffHistory(staffId) {
      this.$emit('showWarnAreaHistory')
      eventVue.$emit('warnStaffHistory', staffId, this.type)
    },
    // 人员列表分页
    handleSizeChangeAreaStaffData(val) {
      this.warningAreaStaffQuery.page = val
      this.handleFetchWarningAreaStaff()
    }
  }
}
</script>
