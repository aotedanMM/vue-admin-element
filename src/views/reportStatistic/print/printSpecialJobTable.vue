<template>
  <div id="printTable">
    <span class="printTitle">工作异常</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.staffAssignId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工种" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.staffJobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派区域" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.assignTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派内容" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.assignDetail }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintSpecialJobTable',
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
