<template>
  <div>
    <el-dialog :visible.sync="standardVisible" :title="textMapStandard[standardStatus]" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="standardFromRef" :rules="standardRules" :model="standardForm" label-position="left" label-width="130px" class="m_form">
        <el-form-item label="标准名称" prop="standardName">
          <el-input v-model="standardForm.standardName" type="text" maxlength="10" oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"/>
        </el-form-item>
        <el-form-item label="甲烷标准值" prop="ch4Standard">
          <el-input v-model="standardForm.ch4Standard" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          <span class="m_inputUnit">%</span>
        </el-form-item>
        <el-form-item label="一氧化碳标准值" prop="coStandard">
          <el-input v-model="standardForm.coStandard" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span class="m_inputUnit">PPM</span>
        </el-form-item>
        <el-form-item label="氧气标准值" prop="o2Standard">
          <el-input v-model="standardForm.o2Standard" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          <span class="m_inputUnit">%</span>
        </el-form-item>
        <el-form-item label="温度标准值" prop="tStandard">
          <el-input v-model="standardForm.tStandard" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          <span class="m_inputUnit">℃</span>
        </el-form-item>
        <el-form-item label="湿度标准值" prop="hStandard">
          <el-input v-model="standardForm.hStandard" type="text" maxlength="5" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          <span class="m_inputUnit">%</span>
        </el-form-item>
        <el-form-item label="标准描述" prop="standardDesc">
          <el-input v-model="standardForm.standardDesc" type="text" maxlength="20"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="standardVisible = false">取消</el-button>
        <el-button v-if ="standardStatus === 'create'" type="primary" @click="createStandardInfo">确认</el-button>
        <el-button v-else type="primary" @click="updateStandardInfo">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { createStandardData, updateStandardData } from '@/api/warnlevel'
import { isvalidateDecimal, isvalidateDesc, isvalidateName } from '@/utils/validate'

export default {
  name: 'StandardEdit',
  props: {

  },
  data() {
    // 标准名称校验(中文、英文、数字)
    const validateName = (rule, value, callback) => {
      if (value) {
        if (isvalidateName(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的标准名称(中文英文数字)'))
        }
      } else {
        callback(new Error('请输入标准名称'))
      }
    }
    // 标准值校验(两位小数校验)
    const validateDecimal = (rule, value, callback) => {
      if (!isvalidateDecimal(value)) {
        callback(new Error('请输入正确的标准值,小数点后最多保留2位数字'))
      } else {
        callback()
      }
    }
    // 标准描述(中英文常见字符)
    const validateDesc = (rule, value, callback) => {
      if (!isvalidateDesc(value)) {
        callback(new Error('请输入正确的描述(不要输入特殊字符)'))
      } else {
        callback()
      }
    }
    return {
      // isCheckPassword: true,
      isCheckPassword: false,
      standardStatus: '',
      standardRules: {
        standardName: [{ required: true, trigger: 'blur', validator: validateName }],
        ch4Standard: [{ required: true, trigger: 'blur', validator: validateDecimal }],
        coStandard: [{ required: true, trigger: 'blur', validator: validateDecimal }],
        o2Standard: [{ required: true, trigger: 'blur', validator: validateDecimal }],
        tStandard: [{ required: true, trigger: 'blur', validator: validateDecimal }],
        hStandard: [{ required: true, trigger: 'blur', validator: validateDecimal }],
        standardDesc: [{ required: false, trigger: 'blur', validator: validateDesc }]
      },
      textMapStandard: {
        update: '编辑警报标准',
        create: '新增警报标准'
      },
      standardData: [{ standardId: null, standardName: '', createTime: null, standardDesc: '' }],
      standardForm: {},
      standardVisible: false // 新增标准弹窗
    }
  },
  created() {
    this.handleCreateOrEditStandard() // 兄弟组件通信  新增&编辑&密码校验
  },
  beforeDestroy() {
    eventVue.$off('createStandard')
    eventVue.$off('updateStandard')
    eventVue.$off('checkPassWordResult')
  },
  methods: {
    // 兄弟组件通信
    handleCreateOrEditStandard() {
      // 新增标准
      eventVue.$on('createStandard', () => {
        // 判断是否进行了密码校验
        if (this.isCheckPassword === false) {
          eventVue.$emit('checkPassWordData') // 兄弟组件通信 密码校验
        } else {
          this.handleCreateStandard()
        }
      })
      // 编辑标准
      eventVue.$on('updateStandard', (row) => {
        // 判断是否进行了密码校验
        if (this.isCheckPassword === false) {
          eventVue.$emit('checkPassWordData') // 兄弟组件通信 密码校验
        } else {
          this.standardForm = Object.assign({}, row) // copy row 避免操作数据源
          this.handleUpdateStandard()
        }
      })
      // 接收校验结果
      eventVue.$on('checkPassWordResult', (isCheckPassword) => {
        this.isCheckPassword = isCheckPassword
      })
    },
    // 新增标准
    handleCreateStandard() {
      this.resetStandardData() // 清空表单数据
      this.standardStatus = 'create'
      this.standardVisible = true // 新增标准弹窗可见
      this.$nextTick(() => {
        this.$refs['standardFromRef'].clearValidate()
      })
    },
    // 提交新增标准信息
    createStandardInfo() {
      this.$refs['standardFromRef'].validate((valid) => {
        if (valid) {
          this.standardForm.createTime = new Date().getTime() // 获取当前时间戳为创建时间
          createStandardData(this.standardForm).then(resp => {
            if (resp.data.code === 200) {
              // 添加操作记录
              const str = '新增警报标准:' + this.standardForm.standardName
              console.log(str)
              this.requestFun.handleAddOperateData(str)
              console.log(str)
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchStandardInfo') // 获取标准信息
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.standardVisible = false
        }
      })
    },
    // 编辑标准
    handleUpdateStandard() {
      this.standardStatus = 'update'
      this.standardVisible = true // 弹窗可见
      this.$nextTick(() => {
        this.$refs['standardFromRef'].clearValidate()
      })
    },
    // 提交编辑标准信息
    updateStandardInfo() {
      this.$refs['standardFromRef'].validate((valid) => {
        // 解决后台报错 this.standardForm.createTime="undefined"
        this.standardForm.createTime = null
        if (valid) {
          updateStandardData(this.standardForm).then(resp => {
            if (resp.data.code === 200) {
              // 添加操作记录
              const str = '编辑警报标准:' + this.standardForm.standardName
              this.requestFun.handleAddOperateData(str)
              console.log(str)
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
            eventVue.$emit('fetchStandardInfo') // 获取标准信息
          }).catch(e => { this.$message({ type: 'error', message: e }) })
          this.standardVisible = false
        }
      })
    },
    // 重置标准表单信息
    resetStandardData() {
      this.standardForm = {}
    }
  }
}
</script>

