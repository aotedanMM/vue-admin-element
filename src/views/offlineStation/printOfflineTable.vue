<template>
  <div id="printTable">
    <span class="printTitle">基站掉线</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="编号" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.baseStationId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基站名称" width="350px">
        <template slot-scope="scope">
          <span> {{ scope.row.baseStationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在区域" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="掉线时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.offlineTime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintOfflineTable',
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
