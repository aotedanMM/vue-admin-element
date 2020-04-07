<template>
  <div id="printTable">
    <span class="printTitle">气体警报</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="编号" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.gaspositionid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.staffname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甲烷" width="55px">
        <template slot-scope="scope">
          <span v-if="scope.row.ch4unit === 0" class="normalGas">{{ scope.row.ch4 }}</span>
          <span v-if="scope.row.ch4unit === 1" class="warnGas1">{{ scope.row.ch4 }}</span>
          <span v-if="scope.row.ch4unit === 2" class="warnGas2">{{ scope.row.ch4 }}</span>
          <span v-if="scope.row.ch4unit === 3" class="warnGas3">{{ scope.row.ch4 }}</span>
          <span v-if="scope.row.ch4unit === 4" class="warnGas4">{{ scope.row.ch4 }}</span>
          <span v-if="scope.row.ch4unit === 5" class="warnGas5">{{ scope.row.ch4 }}</span>
        </template>
      </el-table-column >
      <el-table-column label="一氧化碳" width="55px">
        <template slot-scope="scope">
          <span v-if="scope.row.counit === 0" class="normalGas">{{ scope.row.co }}</span>
          <span v-if="scope.row.counit === 1" class="warnGas1">{{ scope.row.co }}</span>
          <span v-if="scope.row.counit === 2" class="warnGas2">{{ scope.row.co }}</span>
          <span v-if="scope.row.counit === 3" class="warnGas3">{{ scope.row.co }}</span>
          <span v-if="scope.row.counit === 4" class="warnGas4">{{ scope.row.co }}</span>
          <span v-if="scope.row.counit === 5" class="warnGas5">{{ scope.row.co }}</span>
        </template>
      </el-table-column>
      <el-table-column label="氧气" width="55px">
        <template slot-scope="scope">
          <span v-if="scope.row.o2unit === 0" class="normalGas">{{ scope.row.o2 }}</span>
          <span v-if="scope.row.o2unit === 1" class="warnGas1">{{ scope.row.o2 }}</span>
          <span v-if="scope.row.o2unit === 2" class="warnGas2">{{ scope.row.o2 }}</span>
          <span v-if="scope.row.o2unit === 3" class="warnGas3">{{ scope.row.o2 }}</span>
          <span v-if="scope.row.o2unit === 4" class="warnGas4">{{ scope.row.o2 }}</span>
          <span v-if="scope.row.o2unit === 5" class="warnGas5">{{ scope.row.o2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="温度" width="55px">
        <template slot-scope="scope">
          <span v-if="scope.row.temperatureunit === 0" class="normalGas">{{ scope.row.temperature }}</span>
          <span v-if="scope.row.temperatureunit === 1" class="warnGas1">{{ scope.row.temperature }}</span>
          <span v-if="scope.row.temperatureunit === 2" class="warnGas2">{{ scope.row.temperature }}</span>
          <span v-if="scope.row.temperatureunit === 3" class="warnGas3">{{ scope.row.temperature }}</span>
          <span v-if="scope.row.temperatureunit === 4" class="warnGas4">{{ scope.row.temperature }}</span>
          <span v-if="scope.row.temperatureunit === 5" class="warnGas5">{{ scope.row.temperature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="湿度" width="55px">
        <template slot-scope="scope">
          <span v-if="scope.row.humidityunit === 0" class="normalGas">{{ scope.row.humidity }}</span>
          <span v-if="scope.row.humidityunit === 1" class="warnGas1">{{ scope.row.humidity }}</span>
          <span v-if="scope.row.humidityunit === 2" class="warnGas2">{{ scope.row.humidity }}</span>
          <span v-if="scope.row.humidityunit === 3" class="warnGas3">{{ scope.row.humidity }}</span>
          <span v-if="scope.row.humidityunit === 4" class="warnGas4">{{ scope.row.humidity }}</span>
          <span v-if="scope.row.humidityunit === 5" class="warnGas5">{{ scope.row.humidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.temppositionname }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'PrintGasTable',
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
