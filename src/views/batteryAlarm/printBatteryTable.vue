<template>
  <div id="printTable">
    <span class="printTitle">电量警报</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="终端ID" width="100px">
        <template slot-scope="scope">
          <span> {{ scope.row.terminalId }} </span>
        </template>
      </el-table-column>
      <el-table-column label="关联员工姓名" width="150px">
        <template slot-scope="scope">
          <span> {{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联员工ID" width="100px">
        <template slot-scope="scope">
          <span> {{ scope.row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.uploadTime=== 'undefined'"/>
          <span v-else> {{ scope.row.uploadTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余电量(%)" width="150px">
        <template slot-scope="scope">
          <span> {{ scope.row.electricValue }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintBatteryTable',
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
