<template>
  <div class="terminalDialog">
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="terEditVisible" @open="common.toggleBody(1)" @close="common.toggleBody(0)" >
      <el-form ref="terminalFormTable" :rules="rules" :model="terminalForm" label-position="left" label-width="100px" class="m_form">
        <el-form-item label="终端编号" prop="terminalId">
          <el-input :disabled="idInput" v-model="terminalForm.terminalId" type="text" maxlength="8" oninput ="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>
        <el-form-item label="型号版本编号" prop="modelNumber">
          <el-input v-model="terminalForm.modelNumber" type="text" maxlength="12" oninput ="value=value.replace(/^[^A-Za-z0-9]/g,'')"/>
        </el-form-item>
        <!--<el-form-item label="硬件版本号" prop="hardwareVersion">-->
        <!--<el-input v-model="terminalForm.hardwareVersion" type="text" maxlength="10" oninput ="value=value.replace(/[^0-9.]/g,'')"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="软件版本号" prop="softwareVersion">-->
        <!--<el-input v-model="terminalForm.softwareVersion" type="text" maxlength="10" oninput ="value=value.replace(/[^0-9.]/g,'')"/>-->
        <!--</el-form-item>-->
        <el-form-item label="mac地址" prop="macAddress">
          <el-input v-model="terminalForm.macAddress" type="text" maxlength="40" />
        </el-form-item>
        <el-form-item label="一氧化碳描述" prop="coDesc">
          <el-input v-model="terminalForm.coDesc" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="氧气描述" prop="o2Desc">
          <el-input v-model="terminalForm.o2Desc" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="甲烷描述" prop="ch4Desc">
          <el-input v-model="terminalForm.ch4Desc" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="声音描述" prop="voiceDesc">
          <el-input v-model="terminalForm.voiceDesc" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="wifi描述" prop="wifiDesc">
          <el-input v-model="terminalForm.wifiDesc" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="电源描述" prop="batteryDesc">
          <el-input v-model="terminalForm.batteryDesc" type="text" maxlength="20"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createTerminal">确认</el-button>
        <el-button v-else type="primary" @click="updateTerminal">确认</el-button>
        <el-button @click="terEditVisible= false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { isvalidateVersion, isvalidateModelVersion, isvalidateDesc, isvalidateMac } from '@/utils/validate'
import { createDateTerminal, updateDateTerminal, checkExist } from '@/api/terminal'
export default {
  name: 'TerminalEdit',
  data() {
    // 终端编号校验
    const validateTerminalId = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        if (value) {
          checkExist(this.terminalForm.terminalId).then(resp => {
            if (resp.data.code === 145 && this.dialogStatus === 'create') {
              callback(new Error('终端ID已存在'))
            } else {
              callback()
            }
          })
        } else {
          callback(new Error('请填写终端编号'))
        }
      } else {
        callback()
      }
    }
    // mac地址校验
    const validateMac = (rule, value, callback) => {
      if (value) {
        if (!isvalidateMac(value)) {
          callback(new Error('请输入正确的mac地址,格式如:0F-01-0B-01-0E-02'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 版本号校验(软件&硬件)
    const validateVersion = (rule, value, callback) => {
      if (value) {
        if (!isvalidateVersion(value)) {
          callback(new Error('请输入正确的版本号,格式如:1.0.0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 型号版本号校验
    const validateModelVersion = (rule, value, callback) => {
      if (value) {
        if (isvalidateModelVersion(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的型号版本号,数字字母组合'))
        }
      } else {
        callback()
      }
    }
    // 描述校验(中英文数字和常用字符，禁止输入特殊字符)
    const validateDesc = (rule, value, callback) => {
      if (!isvalidateDesc(value)) {
        callback(new Error('请输入正确的描述(不要输入特殊字符)'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        terminalId: [{ required: true, trigger: 'blur', validator: validateTerminalId }],
        modelNumber: [{ required: false, trigger: 'blur', validator: validateModelVersion }],
        softwareVersion: [{ required: false, trigger: 'blur', validator: validateVersion }],
        hardwareVersion: [{ required: false, trigger: 'blur', validator: validateVersion }],
        macAddress: [{ required: false, trigger: 'blur', validator: validateMac }],
        coDesc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        o2Desc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        ch4Desc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        voiceDesc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        wifiDesc: [{ required: false, trigger: 'blur', validator: validateDesc }],
        batteryDesc: [{ required: false, trigger: 'blur', validator: validateDesc }]
      },
      terEditVisible: false,
      textMap: {
        update: '编辑终端',
        create: '新增终端'
      },
      terminalForm: {},
      dialogStatus: '',
      idInput: false,
      checkTerminalId: null
    }
  },
  created() {
    this.handleCommit()
  },
  // 注销eventVue事件
  beforeDestroy() {
    eventVue.$off('createTerminal')
    eventVue.$off('updateTerminal')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('createTerminal', () => {
        this.handleCreateTerminal()
      })
      eventVue.$on('updateTerminal', (terminalForm) => {
        this.terminalForm = Object.assign({}, terminalForm) // copy row 避免操作数据源
        this.handleUpdateTerminal()
      })
    },
    // 清空表单
    restTerminalForm() {
      this.terminalForm = {}
    },
    // 新增终端
    handleCreateTerminal() {
      this.restTerminalForm() // 清空表单
      this.idInput = false
      this.dialogStatus = 'create'
      this.terEditVisible = true
      this.$nextTick(() => {
        this.$refs['terminalFormTable'].clearValidate()
      })
    },
    // 上传新增终端信息
    createTerminal() {
      this.$refs['terminalFormTable'].validate((valid) => {
        if (valid) {
          this.checkGasDesc() // 检验描述
          if (!this.terminalIdIsExist) {
            createDateTerminal(this.terminalForm).then(resp => {
              if (resp.data.code === 200) {
                this.$message({
                  message: resp.data.msg,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: resp.data.code + ':' + resp.data.msg,
                  type: 'error'
                })
              }
              eventVue.$emit('fetchTerminal')
            })
            this.terEditVisible = false
          }
        }
      })
    },
    // 检验描述
    checkGasDesc() {
      this.terminalForm.co = this.terminalForm.coDesc === '' ? 0 : 1
      this.terminalForm.ch4 = this.terminalForm.ch4Desc === '' ? 0 : 1
      this.terminalForm.o2 = this.terminalForm.o2Desc === '' ? 0 : 1
      this.terminalForm.wifi = this.terminalForm.wifiDesc === '' ? 0 : 1
      this.terminalForm.voice = this.terminalForm.voiceDesc === '' ? 0 : 1
      this.terminalForm.battery = this.terminalForm.batteryDesc === '' ? 0 : 1
    },
    // 编辑终端信息
    handleUpdateTerminal() {
      this.checkTerminalId = this.terminalForm.terminalId
      this.idInput = true
      this.dialogStatus = 'update'
      this.terEditVisible = true
      this.$nextTick(() => {
        this.$refs['terminalFormTable'].clearValidate()
      })
    },
    // 上传编辑终端信息
    updateTerminal() {
      this.$refs['terminalFormTable'].validate((valid) => {
        if (valid) {
          const terData = Object.assign({}, this.terminalForm)
          updateDateTerminal(terData).then(resp => {
            // console.log(resp.data)
            if (resp.data.code === 200) {
              this.$message({
                message: resp.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: resp.data.code + ':' + resp.data.msg,
                type: 'error'
              })
            }
            eventVue.$emit('fetchTerminal')
          })
          this.terEditVisible = false
        }
      })
    }

  }
}
</script>

