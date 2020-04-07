<template>
  <div>
    <el-dialog :visible.sync="dialogTimeStandardVisible" :title="timeStandardTitle[titleStatus]" class="m_timeStandardDialog" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="dataForm" :model="timeStandardForm" :rules="rules" label-position="left" label-width="100px" class="m_form">
        <el-form-item label="标准名称" prop="timeStandardName">
          <el-input v-model="timeStandardForm.timeStandardName" maxlength="20"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-select
            v-model="timeStandardForm.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00'
            }"
            arrow-control
            value-format = "yyyy-MM-dd HH:mm:ss"
            placeholder="任意时间点"/>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-select
            v-model="timeStandardForm.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            value-format = "yyyy-MM-dd HH:mm:ss"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
        <el-form-item label="弹性时间" prop="elasticTime">
          <el-input v-model="timeStandardForm.elasticTime" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="迟到" prop="lateTime">
          <el-input v-model="timeStandardForm.lateTime" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="严重迟到" prop="seriousLateTime">
          <el-input v-model="timeStandardForm.seriousLateTime" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="早退" prop="leaveEarlyTime">
          <el-input v-model="timeStandardForm.leaveEarlyTime" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="严重早退" prop="seriousLeaveEarlyTime">
          <el-input v-model="timeStandardForm.seriousLeaveEarlyTime" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="超时时长" prop="overTime">
          <el-input v-model="timeStandardForm.overTime" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="严重超时时长" prop="seriousTime">
          <el-input v-model="timeStandardForm.seriousTime" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="备注" prop="timeStandardDesc">
          <el-input v-model="timeStandardForm.timeStandardDesc" maxlength="30"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTimeStandardVisible = false">取消</el-button>
        <el-button v-if=" titleStatus=== 'create'" type="primary" @click="createTimeStandardData">确定</el-button>
        <el-button v-else type="primary" @click="updateTimeStandardData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { isvalidateNum, isvalidateName, isvalidateDesc } from '@/utils/validate'
import { updateTimeStandard, insertTimeStandard } from '@/api/timeStandard'

export default {
  name: 'TimeStandardEdit',
  data() {
    // 标准名称校验(中文英文数字)
    const validateName = (rule, value, callback) => {
      if (!isvalidateName(value)) {
        callback(new Error('请输入正确的标准名称(中文英文数字)'))
      } else {
        callback()
      }
    }
    // 时间校验(正整数)
    const validateDecimal = (rule, value, callback) => {
      if (value) {
        if (!isvalidateNum(value)) {
          callback(new Error('请输入正确的时间,时间为正整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateDesc = (rule, value, callback) => {
      if (!isvalidateDesc(value)) {
        callback(new Error('请输入正确的备注(不要输入特殊字符)'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        timeStandardName: [{ required: true, trigger: 'blur', validator: validateName }],
        startTime: [{ required: true, trigger: 'blur', message: '请选择开始时间' }],
        endTime: [{ required: true, trigger: 'blur', message: '请选择结束时间' }],
        elasticTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        lateTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        seriousLateTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        leaveEarlyTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        seriousLeaveEarlyTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        overTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        seriousTime: [{ required: false, trigger: 'blur', validator: validateDecimal }],
        timeStandardDesc: [{ required: false, trigger: 'blur', validator: validateDesc }]
      },
      titleStatus: '',
      dialogTimeStandardVisible: false,
      timeStandardForm: { startTime: null, endTime: null },
      timeStandardTitle: {
        create: '新增时间标准信息',
        update: '更新时间标准信息'
      }
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('createTimeStandard')
    eventVue.$off('updateTimeStandard')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('createTimeStandard', () => {
        this.handleCreateTimeStandard()
      })
      eventVue.$on('updateTimeStandard', (row) => {
        this.timeStandardForm = Object.assign({}, row)
        this.handleUpdateTimeStandard()
      })
    },
    // 新增时间标准
    handleCreateTimeStandard() {
      this.dialogTimeStandardVisible = true
      this.resetTimeStandardForm()
      this.titleStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 提交新增
    createTimeStandardData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertTimeStandard(this.timeStandardForm).then(resp => {
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.date.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchTimeStandard')
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e
            })
          })
          this.dialogTimeStandardVisible = false
        }
      })
    },
    // 编辑时间标准
    handleUpdateTimeStandard() {
      this.titleStatus = 'update'
      this.dialogTimeStandardVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 提交编辑
    updateTimeStandardData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTimeStandard(this.timeStandardForm).then(resp => {
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
            eventVue.$emit('fetchTimeStandard')
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e
            })
          })
          this.dialogTimeStandardVisible = false
        }
      })
    },
    resetTimeStandardForm() {
      this.timeStandardForm = {
      }
    }
  }
}
</script>

