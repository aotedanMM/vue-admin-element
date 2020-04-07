<template>
  <div id="printTable">
    <span class="printTitle">未处理设备故障</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="编号" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.terminalId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="wifi故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.wifiError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.wifiError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="声音故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.voiceError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.voiceError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="一氧化碳故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.coError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.coError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="甲烷故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.ch4Error === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.ch4Error === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="氧气故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.o2Error === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.o2Error === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="温度故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.tError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.tError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="湿度故障" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.hError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.hError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="自检时间" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCheckTime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintMalfunctionTable',
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
