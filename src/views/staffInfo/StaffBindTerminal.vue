<template>
  <div class="m_staffBindTerminal">
    <el-dialog
      :visible.sync="staffBindTerminalVisible"
      :title="staffName + ' -   '+'绑定终端' "
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <div class="filter-container2">
        <el-input
          v-model="terminalQuery.terminalId"
          type="text"
          clearable
          placeholder="终端ID"
          oninput ="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchTerminal" />
        <el-button type="primary" icon="el-icon-search" @click="handleSearchTerminal">查询</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="terminalData"
        border
      >
        <el-table-column label="终端编号" >
          <template slot-scope="scope">
            <span>{{ scope.row.terminalId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号版本号" width="95px">
          <template slot-scope="scope">
            <span> {{ scope.row.modelNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="硬件版本号" width="95px">
          <template slot-scope="scope">
            <span> {{ scope.row.hardwareVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="软件版本号" width="95px">
          <template slot-scope="scope">
            <span> {{ scope.row.softwareVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="co描述">
          <template slot-scope="scope">
            <span> {{ scope.row.coDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="o2描述">
          <template slot-scope="scope">
            <span> {{ scope.row.o2Desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ch4描述">
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
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleStaffBindTerminal(scope.row.terminalId)">绑定终端</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="terminalQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="terminalQuery.page"
          :page-sizes="[20,30,50]"
          :page-size="terminalQuery.limit"
          :total= "terminalQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeTerminal"
          @current-change="handleCurrentChangeTerminal"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { unBindTerminal, bindTerminal, fetchTerminal } from '@/api/infor'
export default {
  name: 'StaffBindTerminal',
  data() {
    return {
      staffName: null,
      staffBindTerminalVisible: false,
      terminalData: [],
      terminalQuery: { terminalId: null, page: 1, limit: 20, total: 0 }
    }
  },
  created() {
    this.handleFetchStaffId()
    this.getTerminal()
  },
  beforeDestroy() {
    eventVue.$off('fetchTerminalId')
    eventVue.$off('releaseTerminal')
  },
  methods: {
    // 兄弟组件通信 获取员工ID
    handleFetchStaffId() {
      // 绑定终端
      eventVue.$on('fetchTerminalId', (row) => {
        this.staffId = row.staffId
        this.staffName = row.staffName
        this.staffBindTerminalVisible = true
      })
      // 解绑终端
      eventVue.$on('releaseTerminal', (terminalId) => {
        this.terminalId = terminalId
        this.handleReleaseTerminal()
      })
    },
    // 获取全部终端信息
    getTerminal() {
      fetchTerminal(this.terminalQuery).then(resp => {
        const result = resp.data
        if (result.code === 200) {
          if (result.data.list.length > 0) {
            this.terminalData = result.data.list
            this.terminalQuery.total = result.data.total
          } else if (result.code === 111) {
            this.terminalData = []
            this.terminalQuery.total = 0
          } else {
            this.$message({
              type: 'error',
              message: result.code + ': ' + result.msg
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: result.code + ': ' + result.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 人员绑定终端
    handleStaffBindTerminal(terminalId) {
      this.staffTerminalId = terminalId
      bindTerminal(this.staffId, this.staffTerminalId).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        this.staffBindTerminalVisible = false
        eventVue.$emit('fetchStaffInfo', '')
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 解绑终端
    handleReleaseTerminal() {
      unBindTerminal(this.terminalId).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        eventVue.$emit('fetchStaffInfo', '') // 兄弟组件通信 重新获取人员信息表
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 改变当前显示条数
    handleSizeChangeTerminal(val) {
      this.terminalQuery.limit = val
      this.getTerminal()
    },
    // 改变当前页数
    handleCurrentChangeTerminal(val) {
      this.terminalQuery.page = val
      this.getTerminal()
    },
    // 搜索终端
    handleSearchTerminal() {
      this.getTerminal()
    }
  }
}
</script>

