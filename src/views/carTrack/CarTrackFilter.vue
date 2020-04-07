<template>
  <el-row class="m_tableTopRow m_tableTopRow6" style="top:0 !important;margin-bottom: 10px">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
      <!--区域筛选-->
      <dept-select
        :org-id="orgId"
        @returnDeptId="handleReturnDeptId"
      />
      <el-input v-model="staffName" maxlength="5" clearable class="filter-item" placeholder="请输入车辆名称" @keyup.enter.native="handleSearchStaffList"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchStaffList">查询</el-button>
    </el-col>
  </el-row>
</template>
<script>
import eventVue from '@/api/eventVue'
import DeptSelect from '@/components/DeptSelect/index'
export default {
  name: 'CarTrackFilter',
  components: { DeptSelect },
  data() {
    return {
      staffName: '',
      orgId: null
    }
  },
  created() {
  },
  methods: {
    // 部门ID
    handleReturnDeptId(orgId) {
      this.orgId = orgId
    },
    // 查询人员信息
    handleSearchStaffList() {
      eventVue.$emit('searchStaffList', this.staffName, this.orgId)
    }
  }
}
</script>

