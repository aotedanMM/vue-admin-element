<template>
  <div class="m_tableContent">
    <el-table :data="assignData" border>
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.staffAssignId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工种">
        <template slot-scope="scope">
          <span>{{ scope.row.staffJobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派区域">
        <template slot-scope="scope">
          <span>{{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派时间">
        <template slot-scope="scope">
          <span>{{ scope.row.assignTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派内容">
        <template slot-scope="scope">
          <span>{{ scope.row.assignDetail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成">
        <template slot-scope="scope">
          <span v-if="scope.row.remark1 == 0">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column label="工作状态">
        <template slot-scope="scope">
          <span v-if="scope.row.userId === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-else><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.remark1 == 1" type="primary" size="mini" plain @click="handleEditAssign(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDeleteAssign(scope.row.staffAssignId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="assignQuery.total>0" class="pagination-container">
      <el-pagination
        :page="assignQuery.startPage"
        :page-sizes="[20,30,50]"
        :limit="assignQuery.pageSize"
        :total="assignQuery.total"
        background
        layout="total,sizes,prev,pager,next,jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchAssignData, deleteAssignData } from '@/api/assign'
import eventVue from '../../api/eventVue'

export default {
  name: 'AssignTable',
  data() {
    return {
      assignData: [],
      assignQuery: { startPage: 1, pageSize: 20, total: null }
    }
  },
  created() {
    this.handleFetchAssign()
    this.handleCommit()
  },
  // 注销eventVue事件
  beforeDestroy() {
    eventVue.$off('searchAssign')
    eventVue.$off('fetchAssign')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      // 查询
      eventVue.$on('searchAssign', (assignQuery) => {
        this.assignQuery = assignQuery
        this.handleFetchAssign()
      })
      // 获取
      eventVue.$on('fetchAssign', () => {
        this.handleFetchAssign()
      })
    },
    // 获取指派列表
    handleFetchAssign() {
      fetchAssignData(this.assignQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.assignData = resp.data.data.list
          this.assignQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.assignData = []
          this.assignQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 编辑指派
    handleEditAssign(row) {
      eventVue.$emit('editAssign', row)
    },
    // 删除指派
    handleDeleteAssign(staffAssignId) {
      this.$confirm('是否删除指派?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStaffId = staffAssignId
        this.handleDeleteAssignData() // 删除操作
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除指派
    handleDeleteAssignData() {
      deleteAssignData(this.deleteStaffId).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
          this.handleFetchAssign()
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 改变页数
    handleCurrentChange(val) {
      this.assignQuery.startPage = val
      this.handleFetchAssign()
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      this.assignQuery.pageSize = val
      this.handleFetchAssign()
    }
  }
}
</script>

<style scoped>

</style>
