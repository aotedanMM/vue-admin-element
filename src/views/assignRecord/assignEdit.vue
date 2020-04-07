<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="dataForm" :model="assignQuery" :rules="rules" class="m_form">
        <el-form-item label="指派区域" prop="partitionName">
          <el-input v-model="assignQuery.partitionName" placeholder="请选择工作地点" @focus="selectPartition"/>
        </el-form-item>
        <el-form-item label="指派时间" prop="assignTime">
          <el-date-picker
            v-model="assignQuery.assignTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            default-time="12:00:00"
          />
        </el-form-item>
        <el-form-item label="指派内容" prop="assignDetail">
          <el-input v-model="assignQuery.assignDetail" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="handleAddAssignData">确 定</el-button>
        <el-button v-else type="primary" @click="handleEditAssignData">确 定</el-button>
      </div>
    </el-dialog>
    <area-select-dialog
      ref="parSelectRefs"
      :partition="partition"
      @returnDialogPartition="handleReturnDialogPartition"
    />
  </div>
</template>

<script>
import { addAssignData, editAssignData } from '@/api/assign'
import eventVue from '@/api/eventVue'
import AreaSelectDialog from '../../components/AreaSelectDialog/index'
export default {
  name: 'AssignEdit',
  components: { AreaSelectDialog },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      dialogStatus: '',
      textMap: { edit: '修改指派', create: '指派人员' },
      rules: {
        partitionName: [{ required: true, trigger: 'changed', message: '请选择指派区域' }],
        assignTime: [{ required: true, trigger: 'blur', message: '请选择指派时间' }],
        assignDetail: [{ required: true, trigger: 'blur', message: '请填写指派内容' }]
      },
      assignQuery: { assignTime: '', assignDetail: '' },
      dialogFormVisible: false,
      partition: ''
    }
  },
  created() {
    this.handleCommit()
  },
  // 注销eventVue事件
  beforeDestroy() {
    eventVue.$off('addAssign')
    eventVue.$off('editAssign')
  },
  methods: {
    handleCommit() {
      // 新增指派
      eventVue.$on('addAssign', (row) => {
        console.log(row)
        this.dialogFormVisible = true
        this.dialogStatus = 'create'
        this.assignQuery = {}
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
        this.assignQuery.staffId = row.staffId
      })
      // 编辑指派
      eventVue.$on('editAssign', (row) => {
        console.log(row)
        this.assignQuery = Object.assign({}, row)
        this.assignQuery.assignTime = this.common.formatDate(row.assignTime)
        this.dialogFormVisible = true
        this.dialogStatus = 'edit'
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      })
    },
    // 新增指派
    handleAddAssignData() {
      console.log(this.assignQuery)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAssignData(this.assignQuery).then(resp => {
            console.log(resp.data)
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: '指派成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 编辑指派
    handleEditAssignData() {
      console.log(this.assignQuery)
      editAssignData(this.assignQuery).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: '指派成功'
          })
          eventVue.$emit('fetchAssign')
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
      this.dialogFormVisible = false
    },
    // 工作地点
    selectPartition() {
      this.$refs.parSelectRefs.handleOpenParSelect()
    },
    // 父子组件通讯返回选择区域
    handleReturnDialogPartition(partition) {
      this.partition = partition
      this.assignQuery.partitionId = this.partition.id
      this.assignQuery.partitionName = this.partition.partitionName
    }
  }
}
</script>

<style scoped>

</style>
