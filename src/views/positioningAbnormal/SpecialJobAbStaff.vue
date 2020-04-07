<template>
  <div>
    <el-table
      :data="specialJobAbStaffData"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.staff_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span> {{ scope.row.staff_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          <span> {{ scope.row.dept_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工种">
        <template slot-scope="scope">
          <span> {{ scope.row.job_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="连接基站">
        <template slot-scope="scope">
          <span> {{ scope.row.station_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间">
        <template slot-scope="scope">
          <span> {{ scope.row.terminal_real_time | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定位基站1">
        <template slot-scope="scope">
          <span v-if="scope.row.station_id1 === undefined"/>
          <span> {{ scope.row.station_id1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信号强度">
        <template slot-scope="scope">
          <span v-if="scope.row.wifi_strength1 === undefined"/>
          <span> {{ scope.row.wifi_strength1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定位基站2">
        <template slot-scope="scope">
          <span v-if="scope.row.station_id2 === undefined"/>
          <span> {{ scope.row.station_id2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信号强度">
        <template slot-scope="scope">
          <span v-if="scope.row.wifi_strength2 === undefined"/>
          <span> {{ scope.row.wifi_strength2 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="specialJobAbStaffQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="specialJobAbStaffQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="specialJobAbStaffQuery.limit"
        :total= "specialJobAbStaffQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangePositionAb"
        @current-change="handleCurrentChangePositionAb"/>
    </div>
  </div>
</template>

<script>
import { fetchPositionAb } from '@/api/warningException'
export default {
  name: 'SpecialJobAbStaff',
  data() {
    return {
      specialJobAbStaffData: [],
      specialJobAbStaffQuery: { limit: 20, page: 1, total: 0, type: 1 }
    }
  },
  created() {
    this.handleFetchSpecialJobAbData()
  },
  methods: {
    // 获取全部工作异常数据
    handleFetchSpecialJobAbData() {
      fetchPositionAb(this.specialJobAbStaffQuery).then(resp => {
        if (resp.data.code === 200) {
          this.specialJobAbStaffData = resp.data.data.list
          this.specialJobAbStaffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.specialJobAbStaffData = []
          this.specialJobAbStaffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 更改每页显示条数
    handleSizeChangePositionAb(val) {
      this.specialJobAbStaffQuery.limit = val
      this.handleFetchPositionAbData()
    },
    // 更改当前页数
    handleCurrentChangePositionAb(val) {
      this.specialJobAbStaffQuery.page = val
      this.handleFetchPositionAbData()
    }
  }
}
</script>

