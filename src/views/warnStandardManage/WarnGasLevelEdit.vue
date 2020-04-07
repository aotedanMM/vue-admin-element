<template>
  <div>
    <el-dialog :visible.sync="dialogVisibleGasLevel" :title="textMapGasLevel[gasLevelDialogStatus]" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="gasForm" :rules="levelRules" :model="gasLevelForm" label-position="left" label-width="120px" class="m_form">
        <el-form-item label="等级名称" prop="warnLevelId">
          <el-select v-model="gasLevelForm.warnLevelId" placeholder="请选择" >
            <el-option
              v-for="item in gasLevelList"
              :key="item.id"
              :label="item.levelName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="超标倍数" prop="multiple">
          <el-input v-model="gasLevelForm.multiple" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="上限持续时间" prop="upperContinuedTime">
          <el-input v-model="gasLevelForm.upperContinuedTime" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9]/g,'')" />
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="下限持续时间" prop="lowerContinuedTime">
          <el-input v-model="gasLevelForm.lowerContinuedTime" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9]/g,'')" />
          <span>分钟</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleGasLevel = false">取消</el-button>
        <el-button v-if="gasLevelDialogStatus === 'create'" type="primary" @click="createGasLevelInfo">确认</el-button>
        <el-button v-else type="primary" @click="updateGasLevelInfo">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchWarnLevel } from '@/api/warnlevel'
import { updateWarnGasLevelData, createWarnGasLevelData, deleteWarnGasLevelInfoById } from '@/api/warnlevel'
import { isvalidateDecimal, isvalidateNum } from '@/utils/validate'
export default {
  name: 'WarnGasLevelEdit',
  data() {
    // 超标倍数校验(两位小数校验)
    const validateDecimal2 = (rule, value, callback) => {
      if (this.gasLevelForm.gasType === 5) {
        if (!isvalidateDecimal(value)) {
          callback(new Error('请输入正确的超标倍数,小数点后最多保留2位数字'))
        } else {
          if (value < 1) {
            callback()
          } else {
            callback(new Error('超标倍数小于1'))
          }
        }
      } else {
        if (!isvalidateDecimal(value)) {
          callback(new Error('请输入正确的超标倍数,小数点后最多保留2位数字'))
        } else {
          callback()
        }
      }
    }
    // 持续时间校验(正整数校验)
    const validateDecimal3 = (rule, value, callback) => {
      if (value) {
        if (!isvalidateNum(value)) {
          callback(new Error('请输入正确的持续时间,时间为正整数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入持续时间'))
      }
    }
    return {
      changeType: '',
      typeName: '',
      // isCheckPassword: true,
      isCheckPassword: false,
      textMapGasLevel: {
        update: '更新气体警报等级',
        create: '新增气体警报等级'
      },
      dialogVisibleGasLevel: false, // 新增&编辑对话框显示
      gasLevelList: [{ id: null, name: '' }],
      gasLevelDialogStatus: '',
      gasLevelForm: { warnLevelId: '', multiple: '', upperContinuedTime: '', lowerContinuedTime: '' },
      gasWarnSettingId: null,
      levelRules: {
        warnLevelId: [{ required: true, message: '请选择等级名称', trigger: 'change' }],
        multiple: [{ required: true, trigger: 'blur', validator: validateDecimal2 }],
        upperContinuedTime: [{ required: true, trigger: 'blur', validator: validateDecimal3 }],
        lowerContinuedTime: [{ required: true, trigger: 'blur', validator: validateDecimal3 }]
      },
      gasLevelInfo: []
    }
  },
  created() {
    this.handleCreateOrEditWarnLevel() // 兄弟组件通信 新增&编辑&校验密码
    this.getGasLevelList() // 获取气体等级信息
  },
  beforeDestroy() {
    eventVue.$off('createGasLevel')
    eventVue.$off('updateGasLevel')
    eventVue.$off('deleteGasLevel')
    eventVue.$off('checkPassWordResult')
  },
  methods: {
    // 兄弟组件通信  新增&编辑
    handleCreateOrEditWarnLevel() {
      // 新增
      eventVue.$on('createGasLevel', (gasType, standardId) => {
        this.resetGasLevelData() // 清空表单数据
        this.gasLevelForm.gasType = gasType
        this.gasLevelForm.standardId = standardId
        // 判断是否进行了密码校验
        if (this.isCheckPassword === false) {
          eventVue.$emit('checkPassWordData') // 兄弟组件通信 密码校验
        } else {
          this.handleCreateGasLevelInfo()
        }
      })
      // 编辑
      eventVue.$on('updateGasLevel', (row) => {
        // 判断是否进行了密码校验
        if (this.isCheckPassword === false) {
          eventVue.$emit('checkPassWordData') // 兄弟组件通信 密码校验
        } else {
          this.gasLevelForm = Object.assign({}, row)// copy row 避免操作数据源
          this.handleUpdateGasLevelInfo()
        }
      })
      // 删除
      eventVue.$on('deleteGasLevel', (row) => {
        if (this.isCheckPassword === false) {
          eventVue.$emit('checkPassWordData')
        } else {
          this.gasWarnSettingId = row.gasWarnSettingId
          this.handleDeleteGasLevelInfo()
        }
      })
      // 接收校验结果
      eventVue.$on('checkPassWordResult', (isCheckPassword) => {
        this.isCheckPassword = isCheckPassword
      })
    },
    // 获取气体等级数据
    getGasLevelList() {
      fetchWarnLevel().then(resp => {
        if (resp.data.code === 200) {
          this.gasLevelList = resp.data.data
        } else if (resp.data.code === 111) {
          this.gasLevelList = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 新增气体等级信息
    handleCreateGasLevelInfo() {
      this.gasLevelDialogStatus = 'create' // 新增
      this.dialogVisibleGasLevel = true // 对话框可见
      this.$nextTick(() => {
        this.$refs['gasForm'].clearValidate()// 清除校验信息提示
      })
    },
    // 提交新增信息
    createGasLevelInfo() {
      this.$refs['gasForm'].validate((valid) => {
        if (valid) {
          createWarnGasLevelData(this.gasLevelForm).then(resp => {
            if (resp.data.code === 200) {
              // 新增操作记录
              this.changeType = 1
              this.handleAddOperate()
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            this.$emit('fetchWarnGasLevel') // 获取气体等级信息
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.dialogVisibleGasLevel = false // 新增弹窗不可见
        }
      })
    },
    // 编辑气体等级信息
    handleUpdateGasLevelInfo() {
      // 判断是否进行了密码校验
      if (this.isCheckPassword === false) {
        this.handleCheckPassword()
      } else {
        this.gasLevelDialogStatus = 'update'
        this.dialogVisibleGasLevel = true
        this.$nextTick(() => {
          this.$refs['gasForm'].clearValidate()// 清除校验信息提示
        })
      }
    },
    // 提交编辑气体等级信息
    updateGasLevelInfo() {
      this.$refs['gasForm'].validate((valid) => {
        if (valid) {
          updateWarnGasLevelData(this.gasLevelForm).then(resp => {
            if (resp.data.code === 200) {
              this.changeType = 2
              this.handleAddOperate()
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + resp.data.msg
              })
            }
            this.$emit('fetchWarnGasLevel') // 获取气体等级信息
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.dialogVisibleGasLevel = false // 新增弹窗不可见
        }
      })
    },
    // 删除气体等级信息
    handleDeleteGasLevelInfo() {
      this.$confirm('此操作将永久删除该气体警报等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWarnGasLevelInfoById(this.gasWarnSettingId).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              type: 'success',
              message: resp.data.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: resp.data.code + resp.data.msg
            })
          }
          this.$emit('fetchWarnGasLevel') // 再次获取气体等级信息
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 重置气体等级信息
    resetGasLevelData() {
      this.gasLevelForm = {}
    },
    // 新增操作记录
    handleAddOperate() {
      switch (this.gasLevelForm.gasType) {
        case 1:
          this.typeName = '一氧化碳'
          break
        case 2:
          this.typeName = '甲烷'
          break
        case 3:
          this.typeName = '温度'
          break
        case 4:
          this.typeName = '湿度'
          break
        case 5:
          this.typeName = '氧气'
          break
      }
      console.log(this.gasLevelForm)
      // 添加操作记录
      if (this.changeType === 1) {
        const str = '新增' + this.typeName + '警报等级'
        this.requestFun.handleAddOperateData(str)
      } else {
        const str = '编辑' + this.typeName + '警报等级'
        this.requestFun.handleAddOperateData(str)
      }
    }
  }
}
</script>

