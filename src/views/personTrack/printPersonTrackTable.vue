<template>
  <div id="printTable">
    <span class="printTitle">人员历史轨迹</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="出入井" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.isOre === 0" > 井下</span>
          <span v-if="scope.row.isOre === 1" > 入井</span>
          <span v-if="scope.row.isOre === 2"> 出井 </span>
          <span v-if="scope.row.isOre === 3"> 重点区域</span>
          <span v-if="scope.row.isOre === 4"> 限制区域</span>
          <span v-if="scope.row.isOre === undefined" > 井下</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150px">
        <template slot-scope="scope">
          <span> {{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域" width="200px">
        <template slot-scope="scope">
          <span> {{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定位信息" width="350px">
        <template slot-scope="scope">
          <span> {{ scope.row.tempPositionName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintPersonTrackTable',
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
