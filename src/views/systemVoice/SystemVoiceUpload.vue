<template>
  <div>
    <el-dialog :visible.sync="uploadVoiceVisible" title="上传声音" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form ref="uploadVoiceRefs" :rules="uploadRules" :model="uploadVoiceForm" abel-position="left" label-width="120px" style="width: 350px;">
        <el-form-item label="声音名称" prop="name">
          <el-input v-model="uploadVoiceForm.name" maxlength="10" />
        </el-form-item>
        <el-form-item label="选择声音" prop="fileName">
          <el-upload
            ref="uploadRefs"
            :limit= "uploadLimit"
            :model="uploadVoiceForm.fileName"
            :data="uploadVoiceForm"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
            :on-exceed = "overLimit"
            :action="getUploadUrl()"
            :auto-upload="false"
            :on-success="handleAvatarSuccess"
            accept="audio/mp3,audio/wav,audio/ogg"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <transition name="fade">
            <span v-show="uploadVisible" class="m_validateSpan">请上传铃声</span>
          </transition>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="createSystemVoiceData">确认</el-button>
        <el-button @click="uploadVoiceVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { isvalidateName } from '@/utils/validate'
import { createVoiceData } from '@/api/voiceSetting'
export default {
  name: 'SystemVoiceUpload',
  props: {

  },
  data() {
    // 声音名称校验
    const validateName = (rule, value, callback) => {
      if (value) {
        if (isvalidateName(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的声音名称(中文英文数字)'))
        }
      } else {
        callback(new Error('请输入声音名称'))
      }
    }
    return {
      uploadRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }]
      },
      uploadVisible: false,
      uploadValidate: false,
      voiceFileName: '', // 上传文件名
      fileList: [],
      uploadLimit: 1, // 限制每次只能上传一条声音
      uploadVoiceVisible: false, // 上传声音窗口可见性
      uploadVoiceForm: { name: '', url: '', userId: null, type: null, fileName: null } // 上传声音表单数据
    }
  },
  created() {
    this.handleOpenUploadDialog() // 兄弟组件通信 上传声音
  },
  beforeDestroy() {
    eventVue.$off('createSystemVoice')
  },
  methods: {
    // 兄弟组件通信 上传声音
    handleOpenUploadDialog() {
      eventVue.$on('createSystemVoice', (type) => {
        this.uploadVoiceVisible = true
        this.handleCreateSystemVoiceData(type)
      })
    },
    // 上传文件改变时
    handleChange(file) {
      this.uploadVoiceForm.fileName = file.name
      this.voiceFileName = file.name
    },
    // 上传的音频文件不能超过2M
    beforeAvatarUpload(file) {
      this.voiceFileName = file.name
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传的声音文件大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 提交声音成功后执行的函数
    handleAvatarSuccess(res) {
      // res就是后端返回的值 若code=200，提示上传成功
      if (res.code === 200) {
        this.$message.success(res.msg)
      }
      this.$refs.uploadRefs.clearFiles() // 上传完成后清空上传的文件
      this.$refs['uploadVoiceRefs'].resetFields()
    },
    // 校验是否上传铃声
    handleCheckIsUploadVoice() {
      if (this.uploadVoiceForm.fileName !== undefined) {
        this.uploadVisible = false
        return true
      } else {
        this.uploadVisible = true
        return false
      }
    },
    // 提交新增声音信息
    createSystemVoiceData() {
      console.log(this.uploadVoiceForm)
      this.$refs['uploadVoiceRefs'].validate((valid) => {
        if (valid) {
          const m = this.handleCheckIsUploadVoice()
          if (m) {
            this.uploadVoiceForm.url += this.voiceFileName
            this.$refs.uploadRefs.submit() // 手动提交声音文件(声音，以及其他附加信息)
            // 拼接路径,在不同类型对应的路径后接文件名
            createVoiceData(this.uploadVoiceForm).then(resp => {
              if (resp.data.code === 200) {
                // 新增操作记录
                const str = '新增' + this.uploadVoiceForm.typeName + ':' + this.uploadVoiceForm.name
                this.requestFun.handleAddOperateData(str)
              } else {
                this.$message({
                  type: 'error',
                  message: resp.data.code + ':' + resp.data.msg
                })
              }
              this.$emit('fetchVoiceDataByType') // 通过声音类型获取声音信息(单条,普通,紧急)
              this.$emit('fetchVoiceDataByGasLevel') // 通过气体等级获取声音信息(气体警告)
            }).catch(e => { this.$message({ type: 'error', message: e }) })
            this.uploadVoiceVisible = false // 上传对话框不可见
          }
        }
      })
    },
    // 设置上传数量
    overLimit() {
      this.$message({
        type: 'error',
        message: '超过最大上传数量'
      })
    },
    getUploadUrl() {
      return process.env.BASE_API + '/rangSetting/upload'
    },
    // 新增声音
    handleCreateSystemVoiceData(type) {
      this.uploadVoiceForm = {}
      this.uploadVisible = false
      this.uploadVoiceVisible = true // 上传声音窗口可见
      // 表单中的userId为当前登录的管理员id
      this.uploadVoiceForm.userId = localStorage.getItem('userId')
      // 根据type判断上传的声音类型，从而确定form中url的值
      // 解决this.uploadVoiceForm.type未定义
      this.uploadVoiceForm.type = type
      switch (this.uploadVoiceForm.type) {
        case 1:
          this.uploadVoiceForm.url = 'static/audio/voiceList/'
          this.uploadVoiceForm.typeName = '通知提示音'
          break
        case 2:
          this.uploadVoiceForm.url = 'static/audio/phoneList/'
          this.uploadVoiceForm.typeName = '普通呼叫提示音'
          break
        case 3:
          this.uploadVoiceForm.url = 'static/audio/warnList/'
          this.uploadVoiceForm.typeName = '气体警报提示音'
          break
        case 4:
          this.uploadVoiceForm.url = 'static/audio/emergencyList/'
          this.uploadVoiceForm.typeName = '紧急呼叫提示音'
      }
      this.$nextTick(() => {
        this.$refs['uploadVoiceRefs'].clearValidate()
      })
    }
  }
}
</script>

