<template>
  <!--新增编辑员工信息-->
  <div class="m_editStaffInfo">
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="staffInfoEditVisible" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="dataForm" :rules="rules" :model="staffForm" label-position="left" label-width="80px" class="m_form">
        <el-form-item label="姓名" prop="staffName" >
          <el-input v-model="staffForm.staffName" type="text" maxlength="5"/>
        </el-form-item>
        <el-form-item label="性别" prop="staffSex" >
          <el-radio-group v-model="staffForm.staffSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="staffIdCard" >
          <el-input v-model="staffForm.staffIdCard" type="text" oninput ="value=value.replace(/[^\d]/g,'')" maxlength="18" />
        </el-form-item>
        <el-form-item label="出生日期" prop="staffBirthday">
          <el-date-picker
            v-model="staffForm.staffBirthday"
            :picker-options="pickerOptions1"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd "
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="电话" prop="staffPhone">
          <el-input v-model="staffForm.staffPhone" type="text" oninput ="value=value.replace(/[^\d]/g,'')" maxlength="11" />
        </el-form-item>
        <el-form-item label="所属组织" prop="deptName">
          <el-input :value="staffForm.deptName" placeholder="请选择所属组织" @focus="handleOpenSelectOrgInfo"/>
        </el-form-item>
        <el-form-item label="工作地点" prop="partitionId">
          <el-input :value="staffForm.partitionName" placeholder="请选择工作地点" @focus="selectPartition"/>
        </el-form-item>
        <el-form-item label="类型" prop="isPerson" >
          <el-select v-model="staffForm.isPerson" placeholder="请选择人员类型" >
            <el-option
              v-for="item in Person"
              :key="item.isPersonId"
              :label="item.isPersonName"
              :value="item.isPersonId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工种" prop="jobId" >
          <el-select v-model="staffForm.jobId" placeholder="请选择工种">
            <el-option
              v-for="item in staffJobs"
              :key="item.jobId"
              :label="item.jobName"
              :value="item.jobId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="staffInfoEditVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createDataStaff">确认</el-button>
        <el-button v-else type="primary" @click="updateDataStaff">确认</el-button>
      </div>
    </el-dialog>
    <!--人员组织结构选择-->
    <organization-select-dialog
      ref="orgSelectRefs"
      :org-data="orgData"
      @receiveOrg="handleReceiveOrg"
    />
    <area-select-dialog
      ref="parSelectRefs"
      :partition="partition"
      @returnDialogPartition="handleReturnDialogPartition"
    />
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { isvalidateStaffName, isvalidateIdNumber, isvalidatePhoneNumber } from '@/utils/validate'
import { createStaff, updateStaff, getStaffJobs } from '@/api/infor'
import OrganizationSelectDialog from '@/components/OrganizationSelectDialog/index'
import AreaSelectDialog from '@/components/AreaSelectDialog/index'
export default {
  name: 'StaffInfoEdit',
  components: { AreaSelectDialog, OrganizationSelectDialog },
  data() {
    // 用户名校验
    const validateStaffName = (rule, value, callback) => {
      if (!isvalidateStaffName(value)) {
        callback(new Error('姓名为中文，长度为2-5'))
      } else {
        callback()
      }
    }
    // 身份证号校验
    const validateIdNumber = (rule, value, callback) => {
      if (value) {
        if (!isvalidateIdNumber(value)) {
          callback(new Error('请输入正确的身份证号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 手机号校验
    const validatePhoneNumber = (rule, value, callback) => {
      if (value) {
        if (!isvalidatePhoneNumber(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      partition: null,
      orgData: [],
      staffJobs: [],
      dialogStatus: null,
      staffInfoEditVisible: false,
      rules: {
        staffName: [{ required: true, trigger: 'blur', validator: validateStaffName }],
        staffIdCard: [{ required: false, trigger: 'blur', validator: validateIdNumber }],
        staffPhone: [{ required: false, trigger: 'blur', validator: validatePhoneNumber }]
      },
      textMap: { update: '编辑人员', create: '新增人员' },
      Person: [
        { isPersonId: 0, isPersonName: '职工' },
        { isPersonId: 1, isPersonName: '领导' },
        { isPersonId: 2, isPersonName: '外来人员' },
        { isPersonId: 3, isPersonName: '车辆' }],
      staffForm: { },
      pickerOptions1: { disabledDate(time) { return time.getTime() > Date.now() } } // 选择出生日期不能大于当前时间
    }
  },
  created() {
    this.getJobs() // 获取工作内容
    this.handleCommunicateStaff() // 兄弟组件通信
  },
  beforeDestroy() {
    eventVue.$off('createStaff')
    eventVue.$off('updateStaff')
  },
  methods: {
    // 兄弟组件通信
    handleCommunicateStaff() {
      // 新增员工
      eventVue.$on('createStaff', () => {
        this.staffInfoEditVisible = true
        this.handleCreateStaff()
      })
      // 编辑员工
      eventVue.$on('updateStaff', (row) => {
        this.staffInfoEditVisible = true
        this.staffForm = Object.assign({}, row) // copy row 避免操作数据源
        this.handleUpdateStaff()
      })
    },
    // 清空表单
    resetStaffForm() {
      this.staffForm = {
        staffSex: 0 // 设置默认性别
      }
    },
    // 新增人员
    handleCreateStaff() {
      this.resetStaffForm()
      this.dialogStatus = 'create'
      this.staffInfoEditVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 提交新增人员信息
    createDataStaff() {
      // console.log(this.staffForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.staffForm.deptId
          delete this.staffForm.groupName
          createStaff(this.staffForm).then((resp) => {
            if (resp.data.code === 200) {
              this.$message({
                message: '成功',
                type: 'success'
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          eventVue.$emit('fetchStaffInfo', '')
          this.staffInfoEditVisible = false
        }
      })
    },
    // 编辑人员
    handleUpdateStaff() {
      this.dialogStatus = 'update'
      this.staffInfoEditVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 提交编辑人员信息
    updateDataStaff() {
      // console.log(this.staffForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateStaff(this.staffForm).then((resp) => {
            if (resp.data.code === 200) {
              this.$message({
                message: '成功',
                type: 'success'
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.staffInfoEditVisible = false
          eventVue.$emit('fetchStaffInfo', '')
        }
      })
    },
    // 获取人员工作内容
    getJobs() {
      getStaffJobs().then(resp => {
        if (resp.data.code === 200) {
          this.staffJobs = resp.data.data
        } else if (resp.data.code !== 111) {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 选择组织结构
    handleOpenSelectOrgInfo() {
      this.$refs.orgSelectRefs.handleOpenOrgSelect()
    },
    // 工作地点
    selectPartition() {
      this.$refs.parSelectRefs.handleOpenParSelect()
    },
    // 返回选择区域
    handleReturnPartition() {
      eventVue.$on('returnPartition', (selectPartition) => {
        this.staffForm.partitionId = selectPartition.id
        this.staffForm.partitionName = selectPartition.partitionName
      })
    },
    // 父子组件通讯返回选择区域
    handleReturnDialogPartition(partition) {
      // console.log(partition)
      this.partition = partition
      this.staffForm.partitionId = this.partition.id
      this.staffForm.partitionName = this.partition.partitionName
    },
    handleReceiveOrg(orgData) {
      this.orgData = orgData
      this.staffForm.groupId = this.orgData.id
      this.staffForm.deptName = this.orgData.name
    }
  }
}
</script>
