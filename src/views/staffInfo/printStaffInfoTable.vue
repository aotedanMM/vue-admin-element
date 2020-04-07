<template>
  <div id="printTable">
    <span class="printTitle">井下人员信息</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80" >
        <template slot-scope="scope">
          <span v-if="scope.row.isPerson === 0">职工</span>
          <span v-if="scope.row.isPerson === 1">领导</span>
          <span v-if="scope.row.isPerson === 2">外来人员</span>
          <span v-if="scope.row.isPerson === 3">车辆</span>
        </template>
      </el-table-column>
      <el-table-column label="特种作业人员" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.remark === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工种" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作地点" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定终端" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.terminalId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考勤基站" min-width="170px">
        <template slot-scope="scope">
          <span v-if="scope.row.baseStationName===null"/>
          <span v-else>{{ scope.row.baseStationName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintStaffInfoTable',
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>
