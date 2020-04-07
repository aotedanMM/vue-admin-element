<template>
  <div class="m_tableContent">
    <el-table
      :data="timeStandardData"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
      />
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timeStandardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timeStandardName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope" >
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="弹性时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.elasticTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="迟到时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="严重迟到时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriousLateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="早退时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaveEarlyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="严重早退时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriousLeaveEarlyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超时时长" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.overTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="严重超时时长" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriousTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdateTimeStandard(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleDeleteTimeStandard(scope.row.timeStandardId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="timeStandardQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="timeStandardQuery.page"
        :page-sizes="[20, 30, 50]"
        :page-size="timeStandardQuery.limit"
        :total="timeStandardQuery.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeStandard"
        @current-change="handleCurrentChangeStandard"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { getTimeStandard, deleteTimeStandard } from '@/api/timeStandard'
export default {
  name: 'TimeStandardTable',
  data() {
    return {
      timeStandardQuery: { limit: 20, page: 1, total: null, timeStandardName: '', startTime: null },
      paramsForm: {},
      multipleSelection: [],
      timeStandardData: []
    }
  },
  created() {
    this.handleFetchTimeStandard() // 获取考勤标准管理信息
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('fetchTimeStandard')
    eventVue.$off('searchTimeStandard')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      // 获取考勤标准
      eventVue.$on('fetchTimeStandard', () => {
        this.handleFetchTimeStandard()
      })
      // 查找考勤标准
      eventVue.$on('searchTimeStandard', (paramsForm) => {
        this.timeStandardQuery.timeStandardName = paramsForm.timeStandardName
        this.timeStandardQuery.startTime = paramsForm.startTime
        this.handleFetchTimeStandard()
      })
    },
    // 获取考勤标准
    handleFetchTimeStandard() {
      getTimeStandard(this.timeStandardQuery).then(resp => {
        if (resp.data.code === 200) {
          this.timeStandardData = resp.data.data.list
          this.timeStandardQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.timeStandardData = []
          this.timeStandardQuery.total = null
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 改变当前页数
    handleCurrentChangeStandard(val) {
      this.timeStandardQuery.page = val
      this.handleFetchTimeStandard()
    },
    // 改变每页显示条数
    handleSizeChangeStandard(val) {
      this.timeStandardQuery.limit = val
      this.handleFetchTimeStandard()
    },
    // 选中行
    handleSelectionChange(val) {
      eventVue.$emit('multipleSelection', val)
    },
    // 编辑考勤标准
    handleUpdateTimeStandard(row) {
      eventVue.$emit('updateTimeStandard', row)
    },
    // 行内删除考勤标准
    handleDeleteTimeStandard(timeStandardId) {
      this.$confirm('您将删除该数据，确认继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTimeStandard(timeStandardId).then(resp => {
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
          this.handleFetchTimeStandard()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

