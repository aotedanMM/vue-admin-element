<template>
  <div class="app-container">
    <print-battery-table :list-data="batteryAlarmListData"/>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <el-input v-model="batteryAlarmQuery.terminalId" clearable placeholder="终端ID" oninput ="value=value.replace(/[^\d]/g,'')" maxlength="15"/>
        <el-input v-model="batteryAlarmQuery.staffName" clearable maxlength="5" placeholder="员工姓名" oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')" />
        <el-button type="primary" icon="el-icon-search" @click="getLackElectricInfo">查询</el-button>
        <el-button v-print="'#printTable'" class="filter-item" icon="el-icon-printer" type="success" >打印</el-button>
      </el-col>
    </el-row>
    <div class="m_tableContent">
      <el-table
        :data="batteryAlarmListData"
        border>
        <el-table-column label="终端ID">
          <template slot-scope="scope">
            <span> {{ scope.row.terminalId }} </span>
          </template>
        </el-table-column>
        <el-table-column label="关联员工姓名">
          <template slot-scope="scope">
            <span> {{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联员工ID">
          <template slot-scope="scope">
            <span> {{ scope.row.staffId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="scope">
            <span v-if="scope.row.uploadTime=== 'undefined'"/>
            <span v-else> {{ scope.row.uploadTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余电量(%)">
          <template slot-scope="scope">
            <span> {{ scope.row.electricValue }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="batteryAlarmQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="batteryAlarmQuery.page"
        :page-sizes="[20, 30, 50]"
        :page-size="batteryAlarmQuery.limit"
        :total="batteryAlarmQuery.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getLackElectricInfo } from '@/api/lackElectricInfo'
import PrintBatteryTable from './printBatteryTable'
export default {
  components: { PrintBatteryTable },
  data: function() {
    return {
      batteryAlarmQuery: { terminalId: null, staffName: '', typeId: 1, limit: 20, page: 1, total: null },
      batteryAlarmListData: []
    }
  },
  created() {
    this.getLackElectricInfo()
  },
  methods: {
    // 每页显示条数
    handleSizeChange(val) {
      this.batteryAlarmQuery.limit = val
      this.getLackElectricInfo()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.batteryAlarmQuery.page = val
      this.getLackElectricInfo()
    },
    // 获取电量警报
    getLackElectricInfo() {
      getLackElectricInfo(this.batteryAlarmQuery).then(resp => {
        const res = resp.data
        if (res.code === 200) {
          this.batteryAlarmListData = res.data.list // 查询渲染的具体数据
          this.batteryAlarmQuery.total = res.data.total // 总共数据
        } else if (res.code === 111) {
          this.batteryAlarmListData = []
          this.batteryAlarmQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: res.code + ':' + res.msg

          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    }
  }
}
</script>
