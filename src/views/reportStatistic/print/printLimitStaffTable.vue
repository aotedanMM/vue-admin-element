<template>
  <div id="printTable">
    <span class="printTitle">限制区域报警人员</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进区域时刻" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.inTime === undefined "/>
          <span v-else> {{ scope.row.inTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="滞留时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.timeLong }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintLimitStaffTable',
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
