<template>
  <div id="printTable">
    <span class="printTitle">基站信息</span>
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="基站编号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.baseStationNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基站名称" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.baseStationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Wifi名称" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.ssid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基站IP" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.baseStationIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.zoneName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" width="80" >
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? '已使用':'未使用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="气体标准" min-width="80" >
        <template slot-scope="scope">
          <span>{{ scope.row.standardName === null ? '暂未绑定': scope.row.standardName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDateDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">普通基站</span>
          <span v-if="scope.row.type === 1" class="m_wellheadStation" >井口基站</span>
          <span v-if="scope.row.type === 2" class="m_attendanceStation" >考勤基站</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintBaseStationTable',
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
