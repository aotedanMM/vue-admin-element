<template>
  <el-row class="m_tableTopRow">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <!--筛选-->
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
      <!--搜索-->
      <el-input
        v-model="listQuery.staffName"
        maxlength="5"
        clearable
        class="m_filterInput"
        oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
        prefix-icon="el-icon-search"
        placeholder="员工姓名"
        @keyup.enter.native="handleFetchStaffGasInfo"/>
      <el-date-picker
        v-model="filterTime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFetchStaffGasInfo" >查询</el-button>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="position:relative;top:20px;">
      <!--图例-->
      <div class="m_legend2 m_tableTopRowRight">
        <ul>
          <li><p class="m_warnGas1"/>一级警报</li>
          <li><p class="m_warnGas2"/>二级警报</li>
          <li><p class="m_warnGas3"/>三级警报</li>
          <li><p class="m_warnGas4"/>四级警报</li>
          <li><p class="m_warnGas5"/>五级警报</li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import DeptSelect from '@/components/DeptSelect/index'
import AreaSelect from '@/components/AreaSelect/index'
const dataOfJson = {}
function createJsonData(key, val) {
  // 如果 val 被忽略
  if (typeof val === 'undefined') {
    // 删除属性
    delete dataOfJson[key]
  } else {
    // 添加 或 修改
    dataOfJson[key] = val
  }
}
import { sendFilter } from '@/api/gasMonitoring'
import eventVue from '@/api/eventVue'
export default {
  name: 'GasMonitorFilter',
  components: { DeptSelect, AreaSelect },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      filterTime: '',
      wsOrgId: null,
      wsZoneId: null,
      listQuery: {},
      staffName: ''
    }
  },
  watch: {
    filterTime: function() {
      if (this.filterTime) {
        this.listQuery.startTime = this.filterTime[0]
        this.listQuery.endTime = this.filterTime[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
    }
  },
  created() {
    this.sendFilter()
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
    // 筛选推送条件
    handleFilterPushCondition() {
      createJsonData('zoneId', this.wsZoneId)
      createJsonData('orgId', this.wsOrgId)
      this.$emit('sendJson', dataOfJson)
    },
    sendFilter() {
      sendFilter()
    },
    // 根据员工姓名查询员工气体信息
    handleFetchStaffGasInfo() {
      eventVue.$emit('fetchStaffGasInfo', this.listQuery)
    }
  }
}
</script>
<style>
</style>
