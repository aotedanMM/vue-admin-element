<template>
  <div class="app-container">
    <!--考勤标准筛选-->
    <time-standard-filter/>
    <!--考勤标准列表-->
    <time-standard-table/>
    <!--考勤标准新增编辑-->
    <time-standard-edit/>
  </div>
</template>
<script>
import TimeStandardFilter from './TimeStandardFilter'
import TimeStandardTable from './TimeStandardTable'
import TimeStandardEdit from './TimeStandardEdit'
export default {
  components: { TimeStandardEdit, TimeStandardTable, TimeStandardFilter },
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
