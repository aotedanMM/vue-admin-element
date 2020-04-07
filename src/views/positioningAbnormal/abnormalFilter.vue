<template>
  <div>
    <el-input
      v-model="staffInfoQuery.staffName"
      prefix-icon="el-icon-search"
      maxlength="5"
      clearable
      oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
      class="filter-item"
      placeholder="员工姓名"
      @keyup.enter.native="StaffSearch"/>
    <organization-select
      :org-id="orgId"
      @receiveOrgId="handleReceiveOrgId"
    />
    <el-select v-model="staffInfoQuery.staffJobId" clearable placeholder="请选择工种">
      <el-option
        v-for="item in staffJobData"
        :label="item.jobName"
        :key="item.jobId"
        :value="item.jobId"
      />
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="StaffSearch">查询</el-button>
  </div>
</template>

<script>
export default {
  name: 'AbnormalFilter',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
