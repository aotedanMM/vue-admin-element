<template>
  <div class="app-container">
    <!--搜索-->
    <staff-info-filter/>
    <!--员工信息列表-->
    <staff-info-table/>
    <!--员工信息详情-->
    <staff-info-details/>
    <!--员工绑定解绑终端-->
    <staff-bind-terminal/>
    <!--新增&编辑员工-->
    <staff-info-edit/>
    <!--批量导入导出-->
    <batch-handle/>
    <!--绑定考勤标准-->
    <bind-attendance-standard/>
    <!--绑定考勤基站-->
    <bind-attendance-base-station/>
    <!--指派-->
    <assign-edit/>
  </div>
</template>
<script>
import StaffInfoFilter from './StaffInfoFilter'
import StaffInfoTable from './StaffInfoTable'
import StaffInfoDetails from './StaffInfoDetails'
import StaffInfoEdit from './StaffInfoEdit'
import BatchHandle from './BatchHandle'
import BindAttendanceStandard from './BindAttendanceStandard'
import BindAttendanceBaseStation from './BindAttendanceBaseStation'
import StaffBindTerminal from './StaffBindTerminal'
import AssignEdit from '../assignRecord/assignEdit'
export default {
  components: {
    AssignEdit,
    StaffBindTerminal,
    BindAttendanceBaseStation,
    BindAttendanceStandard,
    BatchHandle,
    StaffInfoEdit,
    StaffInfoDetails,
    StaffInfoTable,
    StaffInfoFilter },
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
