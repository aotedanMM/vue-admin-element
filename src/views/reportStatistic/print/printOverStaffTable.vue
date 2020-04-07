<template>
  <div id="printTable">
    <span class="printTitle">超员报警人员</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.overmanAreaId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.warningAreaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可容纳人数" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.containNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大超员人数" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.maxOverman }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超员开始时间" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.startOvertime === undefined "/>
          <span v-else> {{ scope.row.startOvertime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超员结束时间" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.endOvertime === undefined "/>
          <span v-else> {{ scope.row.endOvertime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintOverStaffTable',
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
