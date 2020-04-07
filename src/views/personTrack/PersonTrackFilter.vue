<template>
  <el-row class="m_tableTopRow m_tableTopRow6" style="top:0 !important;margin-bottom: 10px">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
      <!--特种作业人员-->
      <el-select v-model="staffQuery.remark" placeholder="特种作业人员" clearable>
        <el-option
          v-for="item in specialData"
          :value="item.remark"
          :label="item.name"
          :key="item.remark"
        />
      </el-select>
      <!--区域筛选-->
      <dept-select
        :org-id="staffQuery.orgId"
        @returnDeptId="handleReturnDeptId"
      />
      <el-input v-model="staffQuery.staffName" maxlength="5" clearable class="filter-item" placeholder="请输入员工姓名" @keyup.enter.native="handleSearchStaffList"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchStaffList">查询</el-button>
    </el-col>
  </el-row>
</template>
<script>
import eventVue from '@/api/eventVue'
import DeptSelect from '@/components/DeptSelect/index'
export default {
  name: 'PersonTrackFilter',
  components: { DeptSelect },
  data() {
    return {
      staffQuery: { staffName: '', orgId: null, remark: null, page: 1, limit: 20 },
      specialData: [
        { remark: 0, name: '非特种作业人员' },
        { remark: 1, name: '特种作业人员' }
      ]
    }
  },
  created() {
  },
  methods: {
    // 部门ID
    handleReturnDeptId(orgId) {
      this.staffQuery.orgId = orgId
    },
    // 查询人员信息
    handleSearchStaffList() {
      eventVue.$emit('searchStaffList', this.staffQuery)
    }
  }
}
</script>

