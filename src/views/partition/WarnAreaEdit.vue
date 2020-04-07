<template>
  <div>
    <el-dialog
      :title="textMap[warnAreaStatus]"
      :visible.sync="warnAreaEditVisible"
      :before-close="closeWarnAreaEdit"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <el-form ref="warnAreaRefs" :rules="areaRules" :model="warnAreaForm" label-position="left" label-width="80px" class="m_form">
        <el-form-item label="区域名称" prop="warningAreaName">
          <el-input v-model="warnAreaForm.warningAreaName" maxlength="20"/>
        </el-form-item>
        <el-form-item v-if="warnAreaForm.warningAreaType === 1" label="工作时间">
          <span>  <el-input-number v-model="residenceTime" :precision="2" :step="0.1" :min="1" :max="100" /></span>
          <span style="margin-left: 5px;color: #999">分钟</span>
        </el-form-item>
        <el-form-item v-if="warnAreaForm.warningAreaType === 2" label="滞留时间">
          <span>  <el-input-number v-model="residenceTime" :precision="2" :step="0.1" :min="1" :max="100" /></span>
          <span style="margin-left: 5px;color: #999">分钟</span>
        </el-form-item>
        <el-form-item label="容纳人数" prop="containNumber">
          <el-input v-model="warnAreaForm.containNumber" maxlength="5" oninput ="value=value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="区域描述" prop="warningAreaDesc">
          <el-input v-model="warnAreaForm.warningAreaDesc" maxlength="20"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWarnAreaEdit">取消</el-button>
        <!--限制区域-->
        <el-button v-if="warnAreaStatus === 'createLimit'" type="primary" @click="createWarnArea"> 确认</el-button>
        <el-button v-if="warnAreaStatus === 'updateLimit'" type="primary" @click="updateWarnArea"> 确认</el-button>
        <!--重点区域-->
        <el-button v-if="warnAreaStatus === 'createImportant'" type="primary" @click="createWarnArea"> 确认</el-button>
        <el-button v-if="warnAreaStatus === 'updateImportant'" type="primary" @click="updateWarnArea"> 确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { isvalidateDesc, isvalidateName } from '@/utils/validate'
import { createWarningAreaData, updateWarningAreaData } from '@/api/warningArea'
export default {
  name: 'WarnAreaEdit',
  props: {
    warnAreaEditVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    // 区域名称校验(中文、英文、数字)
    const validateName = (rule, value, callback) => {
      if (value) {
        if (isvalidateName(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的区域名称(中文英文数字)'))
        }
      } else {
        callback(new Error('请输入区域名称'))
      }
    }
    // 区域描述校验
    const validateDesc = (rule, value, callback) => {
      if (!isvalidateDesc(value)) {
        callback(new Error('请输入正确的描述(不要输入特殊字符)'))
      } else {
        callback()
      }
    }
    return {
      residenceTime: 1,
      warnAreaStatus: '',
      areaDialogVisible: false,
      warnAreaForm: {},
      textMap: {
        createLimit: '新增限制区域',
        updateLimit: '编辑限制区域',
        createImportant: '新增重点区域',
        updateImportant: '编辑重点区域'
      },
      areaRules: {
        warningAreaName: [{ required: true, trigger: 'blur', validator: validateName }],
        warningAreaDesc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        containNumber: [{ required: true, trigger: 'blur', message: '请填写容纳人数' }]
      }
    }
  },
  created() {
    this.handleCreateOrEditWarnArea() // 兄弟组件通信， 新增&编辑警告区域
  },
  beforeDestroy() {
    eventVue.$off('createImportantArea')
    eventVue.$off('EditImportantArea')
    eventVue.$off('createLimitArea')
    eventVue.$off('EditLimitArea')
  },
  methods: {
    handleCreateOrEditWarnArea() {
      // 新增重点区域
      eventVue.$on('createImportantArea', () => {
        this.resetAreaForm() // 清空表单
        this.warnAreaStatus = 'createImportant'
        this.warnAreaForm.warningAreaType = 1
        this.handleCreateWarnArea()
      })
      // 编辑重点区域
      eventVue.$on('EditImportantArea', (row) => {
        this.warnAreaForm = Object.assign({}, row) // copy row 避免操作数据源
        this.warnAreaStatus = 'updateImportant'
        this.warnAreaForm.warningAreaType = 1
        this.handleUpdateWarnArea()
      })
      // 新增限制区域
      eventVue.$on('createLimitArea', () => {
        this.resetAreaForm() // 清空表单
        this.warnAreaStatus = 'createLimit'
        this.warnAreaForm.warningAreaType = 2
        this.handleCreateWarnArea()
      })
      // 编辑限制区域
      eventVue.$on('EditLimitArea', (row) => {
        this.warnAreaForm = Object.assign({}, row) // copy row 避免操作数据源
        this.warnAreaStatus = 'updateLimit'
        this.warnAreaForm.warningAreaType = 2
        this.handleUpdateWarnArea()
      })
    },
    // 关闭弹窗
    closeWarnAreaEdit() {
      this.$emit('closeWarnAreaEdit')
    },
    // 清空表单
    resetAreaForm() {
      this.warnAreaForm = {}
      this.residenceTime = null // 设置一个初始工作时间(滞留时间)为1分钟
    },
    // --------------- 重点区域 ---------------//
    // 新增警告区域
    handleCreateWarnArea() {
      this.$nextTick(() => {
        this.$refs['warnAreaRefs'].clearValidate()
      })
    },
    // 提交新增警告区域
    createWarnArea() {
      this.warnAreaForm.residenceTime = this.residenceTime
      this.$refs['warnAreaRefs'].validate((valid) => {
        if (valid) {
          createWarningAreaData(this.warnAreaForm).then(resp => {
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
            if (this.warnAreaForm.warningAreaType === 1) {
              eventVue.$emit('fetchImportantArea')
            } else {
              eventVue.$emit('fetchLimitArea')
            }
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.$emit('closeWarnAreaEdit')
        }
      })
    },
    // 编辑警告区域
    handleUpdateWarnArea() {
      this.residenceTime = this.warnAreaForm.residenceTime
      this.$nextTick(() => {
        this.$refs['warnAreaRefs'].clearValidate()
      })
    },
    // 提交编辑警告区域
    updateWarnArea() {
      this.warnAreaForm.residenceTime = this.residenceTime
      this.$refs['warnAreaRefs'].validate((valid) => {
        if (valid) {
          updateWarningAreaData(this.warnAreaForm).then(resp => {
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
            } else {
              this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
            }
            if (this.warnAreaForm.warningAreaType === 1) {
              eventVue.$emit('fetchImportantArea')
            } else {
              eventVue.$emit('fetchLimitArea')
            }
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.$emit('closeWarnAreaEdit')
        }
      })
    }
  }
}
</script>

