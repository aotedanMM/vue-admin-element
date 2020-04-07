<template>
  <div>
    <print-staff-info-table :list-data="staffInfoData"/>
    <!--人员信息列表-->
    <div class="m_tableContent">
      <el-table
        ref="multipleTable"
        :data="staffInfoData"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column width="80" label="ID">
          <template slot-scope="scope">
            <span>{{ scope.row.staffId }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.isPerson === 0">职工</span>
            <span v-if="scope.row.isPerson === 1">领导</span>
            <span v-if="scope.row.isPerson === 2">外来人员</span>
            <span v-if="scope.row.isPerson === 3">车辆</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="特种作业人员" >
          <template slot-scope="scope">
            <span v-if="scope.row.remark === 1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="工作地点" >
          <template slot-scope="scope">
            <span>{{ scope.row.partitionName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工种">
          <template slot-scope="scope">
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定终端">
          <template slot-scope="scope">
            <span>{{ scope.row.terminalId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考勤基站" min-width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.baseStationName===null"/>
            <span v-else>{{ scope.row.baseStationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450px" fixed="right" class="no-print">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" @click="handleAddAssign(scope.row)">指派</el-button>
            <el-button type="primary" plain size="mini" @click="handleUpdateStaff(scope.row)">编辑</el-button>
            <el-button type="success" plain size="mini" @click="handleDetailsStaff(scope.row)">详情</el-button>
            <el-button type="danger" plain size="mini" @click="handleDeleteStaff(scope.row.staffId)">删除</el-button>
            <el-button v-if="scope.row.terminalId === undefined" type="success" plain size="mini" @click="handleBindTerminal(scope.row)" >绑定</el-button>
            <el-button v-else type="success" plain size="mini" @click="handleReleaseTerminal(scope.row.terminalId)" >解绑</el-button>
            <el-button type="danger" plain size="mini" @click="handleCallStaff(scope.row)">呼叫</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="staffInfoQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="staffInfoQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="staffInfoQuery.limit"
        :total= "staffInfoQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeStaffInfo"
        @current-change="handleCurrentChangeStaffInfo"/>
    </div>
  </div>
</template>
<script>
import { fetchStaff } from '@/api/infor'
import eventVue from '@/api/eventVue'
import PrintStaffInfoTable from './printStaffInfoTable'
export default {
  name: 'StaffInfoTable',
  components: { PrintStaffInfoTable },
  props: {
  },
  data() {
    return {
      staffIds: [],
      staffInfoQuery: { page: 1, limit: 20, staffName: '', total: null },
      staffInfoData: [],
      multipleSelection: []
    }
  },
  created() {
    this.handleFetchStaffInfo() // 获取全部人员信息
    this.handleFetchStaffInfoData() // 兄弟组件通信 获取员工信息
  },
  beforeDestroy() {
    eventVue.$off('fetchStaffInfo')
    eventVue.$off('deleteStaffs')
  },
  methods: {
    // 兄弟组件通信 获取员工信息
    handleFetchStaffInfoData() {
      eventVue.$on('fetchStaffInfo', staffInfoQuery => {
        if (staffInfoQuery !== '') {
          this.staffInfoQuery = staffInfoQuery
        }
        this.handleFetchStaffInfo()
      })
      eventVue.$on('deleteStaffs', staffIds => {
        this.staffIds = staffIds
        this.handleDeleteStaffData()
      })
    },
    // 获取全部人员信息
    handleFetchStaffInfo() {
      fetchStaff(this.staffInfoQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.staffInfoData = resp.data.data.list
          this.staffInfoQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.staffInfoQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.data
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 改变当前页数
    handleCurrentChangeStaffInfo(val) {
      this.staffInfoQuery.page = val
      this.handleFetchStaffInfo()
    },
    // 每页显示条数
    handleSizeChangeStaffInfo(val) {
      this.staffInfoQuery.limit = val
      this.handleFetchStaffInfo()
    },
    // 选中行
    handleSelectionChange(rows) {
      this.multipleSelection = rows
      eventVue.$emit('multipleSelection', this.multipleSelection)
    },
    // 查看人员详细信息
    handleDetailsStaff(row) {
      eventVue.$emit('showStaffInfoDetails', row)
    },
    // 呼叫人员
    handleCallStaff(value) {
      this.$store.dispatch('showVoiceDialog')
      this.$nextTick(() => {
        eventVue.$emit('updateChatList', value) // 更新聊天列表
        eventVue.$emit('phoneListToWindow', value) // 将数据传到聊天窗口
      })
    },
    // 行内删除人员
    handleDeleteStaff(staffId) {
      this.$confirm('是否删除人员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eventVue.$emit('deleteStaff', staffId)
        this.handleDeleteStaffData() // 删除操作
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 解绑终端
    handleReleaseTerminal(staffBindTerminalId) {
      eventVue.$emit('releaseTerminal', staffBindTerminalId)
    },
    // 绑定终端
    handleBindTerminal(row) {
      eventVue.$emit('fetchTerminalId', row) // 兄弟组件通信 传递staffId到绑定终端组件
    },
    // 编辑员工信息
    handleUpdateStaff(row) {
      eventVue.$emit('updateStaff', row)
    },
    // 指派
    handleAddAssign(row) {
      eventVue.$emit('addAssign', row)
    }
  }
}
</script>
