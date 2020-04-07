<template>
  <div class="downHoleDialogTop">
    <el-page-header style="float: left;line-height: 50px !important;" @back="goBack"/>
    <el-input v-model="staffName" maxlength="5" oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')" prefix-icon="el-icon-search" clearable class="filter-item" placeholder="请输入员工姓名" @keyup.enter.native="handleFetchWarnAreaStaff"/>
    <el-button icon="el-icon-search" type="primary" @click="handleFetchWarnAreaStaff">查询</el-button>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'WarnAreaStaffFilter',
  data() {
    return {
      staffName: ''
    }
  },
  created() {

  },
  methods: {
    handleFetchWarnAreaStaff() {
      eventVue.$emit('showStaffList')
      eventVue.$emit('searchWarnAreaStaff', this.staffName)
    },
    goBack() {
      // 返回区域列表
      eventVue.$emit('showAreaList')
    }
  }
}
</script>
