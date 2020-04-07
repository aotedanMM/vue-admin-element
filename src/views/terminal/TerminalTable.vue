<template>
  <div class="m_tableContent">
    <print-terminal-table :list-data="terminalData"/>
    <el-table
      ref="multipleTable"
      :data="terminalData"
      fit
      highlight-current-row
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"/>
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
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdateTerminal(scope.row)">编辑</el-button>
          <el-button type="success" plain size="mini" @click="handleTerminalDetails(scope.row)">详情</el-button>
          <el-button type="danger" plain size="mini" @click="handleDeleteTerminal(scope.row.terminalId)">删除</el-button>
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
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchTerminal, deleteTerminals } from '@/api/terminal'
import PrintTerminalTable from './printTerminalable'
export default {
  name: 'TerminalTable',
  components: { PrintTerminalTable },
  data() {
    return {
      multipleSelection: [],
      tableData: [{}],
      tableHeader: [],
      terminalQuery: { terminalId: null, page: 1, limit: 20, total: null },
      terminalData: []
    }
  },
  created() {
    this.handleCommit()
    this.handleFetchTerminalData()
  },
  beforeDestroy() {
    eventVue.$off('fetchTerminal')
    eventVue.$off('searchTerminal')
    eventVue.$off('clearSelection')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      // 获取
      eventVue.$on('fetchTerminal', () => {
        this.handleFetchTerminalData()
      })
      // 查询
      eventVue.$on('searchTerminal', (terminalId) => {
        this.terminalQuery.terminalId = terminalId
        this.handleFetchTerminalData()
      })
      // 清空选中行
      eventVue.$on('clearSelection', () => {
        this.$refs.multipleTable.clearSelection()
      })
    },
    // 获取全部终端信息
    handleFetchTerminalData() {
      fetchTerminal(this.terminalQuery).then(resp => {
        const result = resp.data
        if (result.code === 200) {
          this.terminalData = result.data.list
          this.terminalQuery.total = result.data.total
          this.multipleSelection = []
        } else if (result.code === 111) {
          this.terminalData = []
          this.terminalQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: result.code + ':' + result.msg
          })
        }
        this.multipleSelection = []
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 编辑
    handleUpdateTerminal(row) {
      eventVue.$emit('updateTerminal', row)
    },
    // 查看详情
    handleTerminalDetails(row) {
      eventVue.$emit('terminalDetails', row)
    },
    // 行内删除终端信息
    handleDeleteTerminal(terminalId) {
      this.$confirm('您将永久删除终端，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTerminals(terminalId).then(resp => {
          const result = resp.data
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              message: result.code + ':' + result.msg,
              type: 'error'
            })
          }
          this.handleFetchTerminalData()
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
      eventVue.$emit('transferSelection', this.multipleSelection)
    },
    // 改变页数
    handleCurrentChangeTerminal(val) {
      this.terminalQuery.page = val
      this.handleFetchTerminalData()
    },
    // 改变每页显示条数
    handleSizeChangeTerminal(val) {
      this.terminalQuery.limit = val
      this.handleFetchTerminalData()
    }
  }
}
</script>

