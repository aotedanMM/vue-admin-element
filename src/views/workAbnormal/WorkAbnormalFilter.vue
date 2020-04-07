<template>
  <!--搜索-->
  <div>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="m_filterBtnGroup">
          <!--员工姓名查询-->
          <el-input
            v-model="assignQuery.staffName"
            prefix-icon="el-icon-search"
            maxlength="5"
            clearable
            oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
            class="filter-item"
            placeholder="员工姓名"
            style="width: 150px"
            @keyup.enter.native="StaffSearch"/>
          <!--时间选择-->
          <el-date-picker
            v-model="selectTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
          <!--区域选择-->
          <area-select :select-partition="selectPartition" @returnPartitionId="handleReturnPartition"/>
          <!--部门选择-->
          <organization-select
            :org-id="orgId"
            @receiveOrgId="handleReceiveOrgId"
          />
          <!--工种查询-->
          <el-select v-model="assignQuery.staffJobId" clearable placeholder="请选择工种">
            <el-option
              v-for="item in staffJobData"
              :label="item.jobName"
              :key="item.jobId"
              :value="item.jobId"
            />
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearchAssign">查询</el-button>
          <el-button v-print="'#printTable1'" v-if="filterType === 1" type="success" icon="el-icon-printer">打印</el-button>
          <el-button v-print="'#printTable2'" v-if="filterType === 2" type="success" icon="el-icon-printer">打印</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrganizationSelect from '@/components/OrganizationSelect/index'
import { getStaffJobs } from '@/api/infor'
import eventVue from '../../api/eventVue'
export default {
  name: 'WorkAbnormalFilter',
  components: { OrganizationSelect },
  props: {
    filterType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      selectTime: '',
      selectPartition: null,
      staffJobData: [],
      orgId: null,
      assignQuery: { startPage: 1, pageSize: 20, total: null }
    }
  },
  watch: {
    selectTime() {
      if (!this.selectTime) {
        this.assignQuery.startAssignTime = null
        this.assignQuery.endAssignTime = null
      } else {
        this.assignQuery.startAssignTime = this.selectTime[0]
        this.assignQuery.endAssignTime = this.selectTime[1]
      }
    }
  },
  created() {
    this.getAllStaffJobs() // 获取员工工种
  },
  methods: {
    // 返回区域Id
    handleReturnPartition(selectPartition) {
      this.assignQuery.partitionId = selectPartition // 父子组件通信 接收返回的区域ID
    },
    // 查找指派
    handleSearchAssign() {
      console.log(this.assignQuery)
      switch (this.filterType) {
        case 1:
          eventVue.$emit('searchWorkAbnormal', this.assignQuery) // 特种作业人员工作异常页面的查询功能
          break
        case 2:
          eventVue.$emit('searchOrdWorkAbnormal', this.assignQuery) // 非特种作业人员工作异常页面的查询功能
          break
      }
    },
    // 接收子组件传递的部门ID
    handleReceiveOrgId(orgId) {
      this.assignQuery.groupId = orgId
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
