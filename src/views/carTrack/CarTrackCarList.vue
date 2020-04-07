<template>
  <div class="m_tableContent">
    <person-track-filter/>
    <el-table
      :data="staffListData"
      fit
      highlight-current-row
      border>
      <el-table-column label="ID" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆名称" align="center">
        <template slot-scope="scope" >
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope" >
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" >
          <el-button type="primary" size="mini" plain @click="handleHistoryListData(scope.row)">查看历史轨迹</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="staffListQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="staffListQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="staffListQuery.limit"
        :total= "staffListQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeStaffList"
        @current-change="handleCurrentChangeStaffList"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchStaff } from '@/api/infor'
import PersonTrackFilter from './CarTrackFilter'
export default {
  name: 'CarTrackCarList',
  components: { PersonTrackFilter },
  data() {
    return {
      staffListData: [],
      staffName: '',
      staffInfo: {},
      staffListQuery: { page: 1, limit: 20, staffName: '', orgId: null, total: null, staffId: null, isPerson: 3 }
    }
  },
  created() {
    this.handleCommit()
    this.handleFetchStaffListData()
  },
  beforeDestroy() {
    eventVue.$off('searchStaffList')
  },
  methods: {
    // 兄弟组件通信,获取全部人员信息
    handleCommit() {
      eventVue.$on('searchStaffList', (staffName, orgId) => {
        this.staffListQuery.staffName = staffName
        this.staffListQuery.orgId = orgId
        this.handleFetchStaffListData()
      })
    },
    // 获取全部人员信息
    handleFetchStaffListData() {
      fetchStaff(this.staffListQuery).then(resp => {
        console.log(this.staffListQuery)
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.staffListData = resp.data.data.list
          this.staffListQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.staffListData = []
          this.staffListQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 查看历史轨迹时间列表
    handleHistoryListData(row) {
      eventVue.$emit('fetchHistoryTimeList', row)
      this.$emit('showTimeList')
    },
    // 更改每页显示条数
    handleSizeChangeStaffList(val) {
      this.staffListQuery.limit = val
      this.handleFetchStaffListData()
    },
    // 改变当前页数
    handleCurrentChangeStaffList(val) {
      this.staffListQuery.page = val
      this.handleFetchStaffListData()
    }
  }
}
</script>

