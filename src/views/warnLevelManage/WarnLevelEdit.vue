<template>
  <el-dialog :visible.sync="warnLevelDialogVisible" :title="warnLevelTitleStatus[warnLevelStatus]" class="m_gasLevelDialog" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
    <el-form ref="warnLevelRefs" :rules="warnLevelRules" :model="warnLevelForm" label-position="left" label-width="120px" class="m_form">
      <el-form-item label="警报等级名称" prop="levelName">
        <el-input v-model="warnLevelForm.levelName" maxlength="10" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="warnLevelDialogVisible = false">取消</el-button>
      <el-button v-if=" warnLevelStatus=== 'create'" type="primary" @click="createWarnLevel">确定</el-button>
      <el-button v-else type="primary" @click="updateWarnLevel">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import eventVue from '@/api/eventVue'
import { isvalidateName } from '@/utils/validate'
import { createWarnLevel, updateWarnLevel, deleteWarnLevel } from '@/api/warnlevel'

export default {
  name: 'WarnLevelEdit',
  data() {
    const validateName = (rule, value, callback) => {
      if (value) {
        if (!isvalidateName(value)) {
          callback(new Error('请输入正确的名称(中文英文数字)'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入警报等级名称'))
      }
    }
    return {
      // isCheckPassword: true,
      isCheckPassword: false,
      warnLevelRules: { levelName: [{ required: true, trigger: 'blur', validator: validateName }] },
      warnLevelForm: {},
      warnLevelStatus: '',
      warnLevelEditName: '',
      warnLevelDialogVisible: false,
      warnLevelTitleStatus: {
        create: '新增警报等级信息',
        update: '更新警报等级信息'
      }
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('createWarnLevel')
    eventVue.$off('updateWarnLevel')
    eventVue.$off('deleteWarnLevel')
    eventVue.$off('sendCheckResult')
  },
  methods: {
    handleCommit() {
      // 新增
      eventVue.$on('createWarnLevel', () => {
        this.handleCreateWarnLevel()
      })
      // 编辑
      eventVue.$on('updateWarnLevel', (row) => {
        this.handleUpdateWarnLevel(row)
      })
      // 删除
      eventVue.$on('deleteWarnLevel', (row) => {
        this.handleDeleteWarnLevel(row)
      })
      // 校验结果
      eventVue.$on('sendCheckResult', (isCheckPassword) => {
        this.isCheckPassword = isCheckPassword
      })
    },
    // 新增警报等级信息
    handleCreateWarnLevel() {
      // 判断是否进行了密码校验
      if (this.isCheckPassword === false) {
        eventVue.$emit('checkPassword')
      } else {
        this.restWarnLevelForm() // 清空表单
        this.warnLevelStatus = 'create'
        this.warnLevelDialogVisible = true // 对话框可见
        this.$nextTick(() => {
          this.$refs['warnLevelRefs'].clearValidate()
        })
      }
    },
    // 提交新增警报等级信息
    createWarnLevel() {
      this.$refs['warnLevelRefs'].validate((valid) => {
        if (valid) {
          createWarnLevel(this.warnLevelForm).then(resp => {
            if (resp.data.code === 200) {
              // 添加操作记录
              const str = '新增警报等级:' + this.warnLevelForm.levelName
              this.requestFun.handleAddOperateData(str)
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchWarnLevel')
          }).catch(e => {
            this.$message({
              message: e,
              type: 'error'
            })
          })
          this.warnLevelDialogVisible = false // 对话框不可见
        }
      })
    },
    // 编辑警报等级信息
    handleUpdateWarnLevel(row) {
      if (this.isCheckPassword === false) {
        eventVue.$emit('checkPassword')
      } else {
        this.warnLevelEditName = row.levelName
        this.warnLevelForm = Object.assign({}, row) // copy row 避免操作数据源
        this.warnLevelStatus = 'update'
        this.warnLevelDialogVisible = true
        this.$nextTick(() => {
          this.$refs['warnLevelRefs'].clearValidate()
        })
      }
    },
    // 提交编辑警报等级信息
    updateWarnLevel() {
      this.$refs['warnLevelRefs'].validate((valid) => {
        if (valid) {
          updateWarnLevel(this.warnLevelForm).then(resp => {
            if (resp.data.code === 200) {
              // 添加操作记录
              const str = '修改警报等级:' + this.warnLevelEditName + '为' + this.warnLevelForm.levelName
              this.requestFun.handleAddOperateData(str)
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchWarnLevel')
          }).catch(e => {
            this.$message({
              message: e,
              type: 'error'
            })
          })
          this.warnLevelDialogVisible = false // 对话框不可见
        }
      })
    },
    // 清空表单
    restWarnLevelForm() {
      this.warnLevelForm = {}
    },
    // 删除警报等级信息
    handleDeleteWarnLevel(row) {
      if (this.isCheckPassword === false) {
        eventVue.$emit('checkPassword')
      } else {
        this.$confirm('您将删除该警报等级信息，确认继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = row.id
          deleteWarnLevel(id).then(resp => {
            if (resp.data.code === 200) {
              // 新增操作记录
              const str = '删除警报等级:' + row.levelName
              this.requestFun.handleAddOperateData(str)
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchWarnLevel')
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
}
</script>

