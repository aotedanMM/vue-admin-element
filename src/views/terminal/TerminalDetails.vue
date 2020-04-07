<template>
  <div class="terminalDetails">
    <el-dialog :visible.sync="terDetailsVisible" title="终端详细信息" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-table
        :data="terDetailsData">
        <el-table-column label="终端编号">
          <template slot-scope="scope">
            <span> {{ scope.row.terminalId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号版本编号">
          <template slot-scope="scope">
            <span> {{ scope.row.modelNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="硬件版本号">
          <template slot-scope="scope">
            <span> {{ scope.row.hardwareVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="软件版本号">
          <template slot-scope="scope">
            <span> {{ scope.row.softwareVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="mac地址">
          <template slot-scope="scope">
            <span> {{ scope.row.macAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="一氧化碳描述">
          <template slot-scope="scope">
            <span> {{ scope.row.coDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="甲烷描述">
          <template slot-scope="scope">
            <span> {{ scope.row.ch4Desc }}</span>
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
        <el-table-column label="电池描述">
          <template slot-scope="scope">
            <span> {{ scope.row.batteryDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电池电量">
          <template slot-scope="scope">
            <el-button v-if="battery === null" :disabled="ElectricityBtnAble" type="primary" plain size="mini" @click="handleFetchElectricity">查询电量</el-button>
            <span v-else> {{ battery }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { checkStaffOnlineByTerminal, getBattery, sendGetBatteryCmd } from '@/api/terminal'
export default {
  name: 'TerminalDetails',
  data() {
    return {
      terDetailsData: [{}],
      terDetailsVisible: false,
      battery: null,
      ElectricityBtnAble: false,
      terminalIdIsExist: false,
      checkTerminalId: null
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('terminalDetails')
  },
  methods: {
    // 兄弟组件通讯
    handleCommit() {
      eventVue.$on('terminalDetails', (row) => {
        for (const i in row) {
          this.$set(this.terDetailsData[0], i, row[i])
        }
        this.terminalId = this.terDetailsData[0].terminalId
        this.handleCheckStaffOnline() // 检查终端是否在线
        this.terDetailsVisible = true
      })
    },
    // 检查终端是否在线
    handleCheckStaffOnline() {
      checkStaffOnlineByTerminal(this.terminalId).then(resp => {
        if (resp.data.code === 200) {
          this.handleSendCommandElectricity()
        } else {
          this.ElectricityBtnAble = true
          this.$message({
            type: 'info',
            message: '终端不在线'
          })
        }
      })
    },
    // 发送获取电池电量指令
    handleSendCommandElectricity() {
      sendGetBatteryCmd(this.terminalId).then(resp => {
        if (resp.data.code === 200) {
          this.ElectricityBtnAble = false
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    },
    // 获取电池电量
    handleFetchElectricity() {
      getBattery(this.terminalId).then(resp => {
        if (resp.data.code === 200) {
          this.battery = resp.data.data
        } else {
          this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    }

  }
}
</script>

