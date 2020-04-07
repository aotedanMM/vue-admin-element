<template>
  <div class="staffGas">
    <el-dialog :visible.sync="staffGasInfoVisible" title="气体监测" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <div class="m_staffGasTable">
        <print-gas-monitor-table :list-data="staffGasInfoData"/>
        <el-button v-print="'#printTable'" class="filter-item" icon="el-icon-printer" type="success" style="margin-bottom: 10px;">打印</el-button>
        <el-table
          v-loading="listLoading"
          :data="staffGasInfoData"
          border>
          <el-table-column label="编号" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.sequenceid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="员工姓名" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.staffname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" >
            <template slot-scope="scope">
              <span>{{ scope.row.createtime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="一氧化碳(ppm)" width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.co === undefined" class="normalGas"/>
              <span v-if="scope.row.counit === 0" class="normalGas">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 1" class="warnGas1">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 2" class="warnGas2">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 3" class="warnGas3">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 4" class="warnGas4">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 5" class="warnGas5">{{ scope.row.co }}</span>
              <span v-if="scope.row.counit === 6" class="warnGas5">{{ scope.row.co }}</span>
            </template>
          </el-table-column>
          <el-table-column label="甲烷(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.ch4 === undefined" class="normalGas"/>
              <span v-if="scope.row.ch4unit === 0" class="normalGas">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 1" class="warnGas1">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 2" class="warnGas2">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 3" class="warnGas3">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 4" class="warnGas4">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 5" class="warnGas5">{{ scope.row.ch4 }}</span>
              <span v-if="scope.row.ch4unit === 6" class="warnGas5">{{ scope.row.ch4 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="氧气(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.o2 === undefined" class="normalGas"/>
              <span v-if="scope.row.o2unit === 0" class="normalGas">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 1" class="warnGas1">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 2" class="warnGas2">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 3" class="warnGas3">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 4" class="warnGas4">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 5" class="warnGas5">{{ scope.row.o2 }}</span>
              <span v-if="scope.row.o2unit === 6" class="warnGas5">{{ scope.row.o2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="温度(℃)">
            <template slot-scope="scope">
              <span v-if="scope.row.temperature === undefined" class="normalGas"/>
              <span v-if="scope.row.temperatureunit === 0" class="normalGas">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 1" class="warnGas1">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 2" class="warnGas2">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 3" class="warnGas3">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 4" class="warnGas4">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 5" class="warnGas5">{{ scope.row.temperature }}</span>
              <span v-if="scope.row.temperatureunit === 6" class="warnGas5">{{ scope.row.temperature }}</span>
            </template>
          </el-table-column>
          <el-table-column label="湿度(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.humidity === undefined" class="normalGas"/>
              <span v-if="scope.row.humidityunit === 0" class="normalGas">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 1" class="warnGas1">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 2" class="warnGas2">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 3" class="warnGas3">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 4" class="warnGas4">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 5" class="warnGas5">{{ scope.row.humidity }}</span>
              <span v-if="scope.row.humidityunit === 6" class="warnGas5">{{ scope.row.humidity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地点" width="250px">
            <template slot-scope="scope">
              <span v-if="scope.row.temppositionname === undefined"/>
              <span>{{ scope.row.temppositionname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" plain size="mini" @click="handlePhoneStaff(scope.row)">呼叫</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="staffGasQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="staffGasQuery.page"
          :total="staffGasQuery.total"
          background
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchGasData } from '@/api/gasMonitoring'
import PrintGasMonitorTable from './printGasMonitoeTable'
export default {
  name: 'GasMonitorStaff',
  components: { PrintGasMonitorTable },
  data() {
    return {
      // staffGasQuery: { page: 1, limit: 20, staffName: '', total: null, gasFlag: 0 },
      staffGasQuery: { page: 1, limit: 20, staffName: '', total: null },
      staffGasInfoData: [],
      staffGasInfoVisible: false,
      listLoading: false,
      staffInfo: {}
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('fetchStaffGasInfo')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('fetchStaffGasInfo', (listQuery) => {
        // console.log(listQuery)
        this.staffGasInfoVisible = true
        this.staffGasQuery.staffName = listQuery.staffName
        this.staffGasQuery.startTime = listQuery.startTime
        this.staffGasQuery.endTime = listQuery.endTime
        this.staffGasQuery.page = 1
        this.handleFetchStaffGasInfoData()
      })
    },
    // 改变当前页数
    handleCurrentChange(val) {
      this.staffGasQuery.page = val
      this.handleFetchStaffGasInfoData()
    },
    // 呼叫
    handlePhoneStaff(value) {
      this.staffInfo.staffId = value.staffid
      this.staffInfo.staffName = value.staffname
      this.staffInfo.deptName = value.groupName
      this.$store.dispatch('showVoiceDialog')
      this.$nextTick(() => {
        eventVue.$emit('updateChatList', this.staffInfo) // 更新聊天列表
        eventVue.$emit('phoneListToWindow', this.staffInfo) // 将数据传到聊天窗口
      })
      this.staffGasInfoVisible = false
    },
    // 查询员工气体信息
    handleFetchStaffGasInfoData() {
      // console.log(this.staffGasQuery)
      fetchGasData(this.staffGasQuery).then(response => {
        const code = response.data.code
        if (code === 200) {
          this.staffGasInfoData = response.data.data.list
          this.staffGasQuery.total = response.data.data.total
        } else if (code === 111) {
          this.staffGasInfoData = []
          this.staffGasQuery.total = null
        } else {
          this.$message({
            type: 'error',
            message: response.data.code + response.data.msg
          })
        }
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    }
  }
}
</script>
