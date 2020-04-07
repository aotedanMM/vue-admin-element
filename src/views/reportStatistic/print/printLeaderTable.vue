<template>
  <div id="printTable">
    <span class="printTitle">领导干部每月下井统计</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领导姓名" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入井时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.inore | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出井时间" width="150px">
        <template v-if="scope.row.outOre!=null||scope.row.outOre!==undefined" slot-scope="scope">
          <span>{{ scope.row.outOre | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下井时长" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.timeLong }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当月下井总数" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.inOreSum }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintLeaderTable',
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
