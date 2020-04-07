<template>
  <div class="app-container">
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <el-input v-model="listQuery.jobName" clearable class="filter-item" placeholder="请输入工种名称" @keyup.enter.native="getStaffJobByParams"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getStaffJobByParams">查询</el-button>
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAddStaffJob">新增</el-button>
      </el-col>
    </el-row>
    <div class="m_tableContent">
      <el-table
        :data="listOfData"
        border>
        <el-table-column label="ID" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.jobId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope" >
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope" >
            <span>{{ scope.row.jobDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是/否为特种作业" align="center">
          <template slot-scope="scope" >
            <span>{{ scope.row.remark === '1' ? '是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" plain @click="handleModifyInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="delInfo(scope.row.jobId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="listQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[20,30,50]"
          :page-size="listQuery.limit"
          :total= "listQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="editVisible" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="dataForm" :rules="rules" :model="staffJobForm" label-position="left" label-width="80px" class="m_form">
        <!--<el-form-item label="ID" prop="jobId" >-->
        <!--<el-input v-model="staffJobForm.jobId" :disabled="true" type="text"/>-->
        <!--</el-form-item>-->
        <el-form-item label="工种" prop="jobName" >
          <el-input v-model="staffJobForm.jobName" type="text"/>
        </el-form-item>
        <el-form-item label="标记" prop="remark" >
          <el-radio-group v-model="staffJobForm.remark">
            <el-radio :label="0">非特种作业人员</el-radio>
            <el-radio :label="1">特种作业人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="jobDesc" >
          <el-input v-model="staffJobForm.jobDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="addStaffJob">确认</el-button>
        <el-button v-else type="primary" @click="modifyInfo">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { findAllByParams } from '@/api/attendance'
import { addStaffJob, delStaffJob, modifyStaffJob, getStaffJobByParams } from '@/api/staffJob'
export default {
  data() {
    return {
      staffJobForm: {},
      staffId: null,
      listOfData: [],
      listQuery: { page: 1, limit: 20, jobName: '', total: null },
      editVisible: false,
      dialogStatus: null,
      dialogTitle: { update: '编辑', create: '新增' },
      rules: {
        jobName: [{ required: true, trigger: 'blur', message: '请输入工种名称' }]
      }
    }
  },
  created() {
    this.getStaffJobByParams()
  },
  methods: {
    resetStaffJobForm() {
      this.staffJobForm = {
        remark: 0
      }
    },
    handleAddStaffJob() {
      this.editVisible = true
      this.resetStaffJobForm()
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    addStaffJob() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addStaffJob(this.staffJobForm).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.editVisible = false
              this.resetStaffJobForm()
              this.getStaffJobByParams()
            } else {
              this.$message({
                type: 'warning',
                message: res.code + ':' + res.msg
              })
            }
          })
        }
      })
    },
    delInfo(jobId) {
      this.$confirm('是否删除信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStaffJob(jobId).then(resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getStaffJobByParams()
          } else {
            this.$message({
              type: 'warning',
              message: res.code + ':' + res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleModifyInfo(row) {
      // row.remark = parseInt(row.remark)
      this.staffJobForm = Object.assign({}, row)
      this.staffJobForm.remark = parseInt(this.staffJobForm.remark)
      this.editVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    modifyInfo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          modifyStaffJob(this.staffJobForm).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.editVisible = false
              this.resetStaffJobForm()
              this.getStaffJobByParams()
            } else {
              this.$message({
                type: 'warning',
                message: res.code + ':' + res.msg
              })
            }
          })
        }
      })
    },
    // 更改每页显示条数
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getStaffJobByParams()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getStaffJobByParams()
    },
    getStaffJobByParams() {
      getStaffJobByParams(this.listQuery).then(resp => {
        const res = resp.data
        if (res.code === 200) {
          this.listOfData = res.data.list
          this.listQuery.total = res.data.total
        } else if (res.code === 111) {
          this.listOfData = []
          this.listQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: res.code + ':' + res.msg
          })
        }
      })
    }
  }
}
</script>
