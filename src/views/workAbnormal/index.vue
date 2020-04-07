<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" class="m_tableContent2" @tab-click="handleClick">
      <el-tab-pane label="特种作业人员工作异常" name="first">
        <work-abnormal-filter :filter-type="1" style="margin-top: -30px"/>
        <special-work-abnormal/>
      </el-tab-pane>
      <el-tab-pane label="非特种作业人员工作异常" name="second">
        <work-abnormal-filter :filter-type="2" style="margin-top: -30px"/>
        <ordinary-work-abnormal/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SpecialWorkAbnormal from './SpecialWorkAbnormal'
import OrdinaryWorkAbnormal from './OrdinaryWorkAbnormal'
import AssignFilter from '../assignRecord/assignFilter'
import WorkAbnormalFilter from './WorkAbnormalFilter'
import PrintSpecialWorkAb from './PrintSpecialWorkAb'
export default {
  name: 'WorkAbnormal',
  components: { PrintSpecialWorkAb, WorkAbnormalFilter, AssignFilter, OrdinaryWorkAbnormal, SpecialWorkAbnormal },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {

  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<style scoped>

</style>
