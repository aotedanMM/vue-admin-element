<template>
  <div id="printTable">
    <span class="printTitle">井下总人员</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入井时间" width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.inOreTime === undefined "/>
          <span v-else> {{ scope.row.inOreTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近定位时间" width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.finalTime === undefined "/>
          <span v-else> {{ scope.row.finalTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="井下时长" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.timeLong }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintStaffTable',
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
