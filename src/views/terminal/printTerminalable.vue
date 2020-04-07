<template>
  <div id="printTable">
    <span class="printTitle">终端信息</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="终端编号" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.terminalId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号版本号" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.modelNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="硬件版本号" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.hardwareVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件版本号" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.softwareVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甲烷描述">
        <template slot-scope="scope">
          <span> {{ scope.row.ch4Desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一氧化碳描述">
        <template slot-scope="scope">
          <span> {{ scope.row.coDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="氧气描述">
        <template slot-scope="scope">
          <span> {{ scope.row.o2Desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="声音描述">
        <template slot-scope="scope">
          <span> {{ scope.row.voiceDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="wifi描述">
        <template slot-scope="scope">
          <span> {{ scope.row.wifiDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintTerminalTable',
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
