<template>
  <div class="m_downHole ">
    <el-dialog :visible.sync="dialogTableVisible" title="区域人员">
      <div class="downHoleDialogTop">
        <!--员工姓名-->
        <el-input
          v-model="areaStaffQuery.staffName"
          prefix-icon="el-icon-search"
          maxlength="5"
          clearable
          oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
          class="filter-item"
          placeholder="员工姓名"
          style="width: 150px"
          @keyup.enter.native="handleFetchAreaStaffData"/>
        <!--部门选择-->
        <organization-select
          :org-id="areaStaffQuery.orgId"
          @receiveOrgId="handleReceiveOrgId"
        />
        <!--工种查询-->
        <el-select v-model="areaStaffQuery.staffJobId" clearable placeholder="请选择工种" >
          <el-option
            v-for="item in staffJobData"
            :label="item.jobName"
            :key="item.jobId"
            :value="item.jobId"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFetchAreaStaffData">查询</el-button>

      </div>
      <div class="m_downHoleStaff">
        <el-table :data="areaStaffData" border>
          <el-table-column property="staffId" label="ID" width="80"/>
          <el-table-column property="staffName" label="员工姓名"/>
          <el-table-column property="deptName" label="所属部门"/>
          <el-table-column property="jobName" label="工种"/>
        </el-table>
        <div v-show="areaStaffQuery.total>0" class="pagination-container">
          <el-pagination
            :current-page="areaStaffQuery.startPage"
            :page-size="areaStaffQuery.pageSize"
            :total="areaStaffQuery.total"
            :page-sizes="[20,30,50]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrganizationSelect from '@/components/OrganizationSelect/index'
import { getStaffJobs } from '@/api/infor'
import { fetchAreaStaffData } from '@/api/mapArea'
export default {
  name: 'AreaStaffDetail',
  components: { OrganizationSelect },
  data() {
    return {
      areaStaffQuery: { startPage: 1, pageSize: 20, total: null },
      areaStaffData: [],
      dialogTableVisible: false,
      staffJobData: []
    }
  },
  created() {
    this.getAllStaffJobs()
    // this.handleFetchAreaStaffData()
  },
  methods: {
    handleOpenDialog(partitionId) {
      this.dialogTableVisible = true
      this.areaStaffQuery.partitionId = partitionId
      this.handleFetchAreaStaffData()
    },
    // 获取当前区域中人员信息
    handleFetchAreaStaffData() {
      console.log(this.areaStaffQuery)
      fetchAreaStaffData(this.areaStaffQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.areaStaffData = resp.data.data.list
          this.areaStaffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.areaStaffData = []
          this.areaStaffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 改变当前页数
    handleCurrentChange(val) {
      this.areaStaffQuery.startPage = val
      this.handleFetchAreaStaffData()
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      this.areaStaffQuery.pageSize = val
      this.handleFetchAreaStaffData()
    },
    // 接收子组件传递的部门ID
    handleReceiveOrgId(groupId) {
      this.areaStaffQuery.groupId = groupId
    },
    // 获取员工工作
    getAllStaffJobs() {
      getStaffJobs().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.staffJobData = res.data
          } else if (res.code === 111) {
            this.staffJobData = []
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
