<template>
  <div class="m_floatWindowFilter">
    <el-button v-if="clickStatus" class="filter-item" type="primary" icon="showWifiProbe" @click="showTerminalNum">显示wifi探针</el-button>
    <el-button v-if="!clickStatus" class="filter-item" type="warning" icon="hideWifiProbe" @click="closeTerminalNum">取消wifi探针</el-button>
    <!--部门筛选-->
    <dept-select
      :ws-org-id="wsOrgId"
      @returnDeptId="handleReturnDeptId"
    />
    <!--区域筛选-->
    <area-select
      :ws-zone-id="wsZoneId"
      @returnPartitionId="handleReturnPartitionId"
    />
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterPushCondition">筛选</el-button>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import DeptSelect from '@/components/DeptSelect/index'
import AreaSelect from '@/components/AreaSelect/index'
export default {
  name: 'FloatWindowFilter',
  components: { DeptSelect, AreaSelect },
  data() {
    return {
      clickStatus: true,
      wsZoneId: null,
      wsOrgId: null
    }
  },
  created() {
  },
  methods: {
    // 区域ID
    handleReturnPartitionId(wsZoneId) {
      this.wsZoneId = wsZoneId
    },
    // 部门ID
    handleReturnDeptId(wsOrgId) {
      this.wsOrgId = wsOrgId
    },
    // 取消wifi探针
    closeTerminalNum() {
      this.$emit('closeTerminalNum')
      this.clickStatus = true
    },
    // 调用父组件的方法
    showTerminalNum() {
      this.$emit('showTerminalNum')
      this.clickStatus = false
    },
    // 筛选推送条件
    handleFilterPushCondition() {
      eventVue.$emit('filterPushCondition', this.wsZoneId, this.wsOrgId)
      this.$emit('removePartOfStation')
    }
  }
}
</script>
