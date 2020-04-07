<template>
  <div class="app-container">
    <el-tabs type="card" class="m_tableContent2">
      <el-tab-pane label="警报等级管理" style="height: 490px !important;">
        <!--警报等级表格-->
        <warn-level-table/>
        <!--新增编辑警报等级-->
        <warn-level-edit/>
        <!--校验管理员密码-->
        <check-admin-psd/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CheckAdminPsd from './CheckAdminPsd'
import WarnLevelTable from './WarnLevelTable'
import WarnLevelEdit from './WarnLevelEdit'
export default {
  name: 'WarnLevelManage',
  components: { WarnLevelEdit, WarnLevelTable, CheckAdminPsd },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
