<template>
  <div class="saveButton">
    <el-button type="danger" @click="handleResetDefaultSetting" >恢复默认</el-button>
    <el-button type="primary" @click="handleSaveSetting" >保存设置</el-button>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { deleteVoiceData, saveVoiceSetting, saveGasLevelSetting, resetDefaultSetting } from '@/api/voiceSetting'

export default {
  name: 'SystemVoiceSetting',
  props: {

  },
  data() {
    return {
      deleteID: null,
      noticeList: null,
      emergencyCallList: null,
      ordinaryCallList: null,
      warnGasList: null,
      deleteTypeName: ''
    }
  },
  created() {
    this.handleVoiceSetting() // 兄弟组件通信
  },
  beforeDestroy() {
    eventVue.$off('deleteSystemVoice')
    eventVue.$off('saveNoticeSetting')
    eventVue.$off('saveEmergencySetting')
    eventVue.$off('saveOrdinarySetting')
    eventVue.$off('saveWarnGasSetting')
  },
  methods: {
    // 兄弟组件通信
    handleVoiceSetting() {
      // 删除铃声
      eventVue.$on('deleteSystemVoice', (deleteID, deleteTypeName) => {
        this.deleteID = deleteID
        this.deleteTypeName = deleteTypeName
        this.handleDeleteVoiceData()
      })
      // 保存通知铃声
      eventVue.$on('saveNoticeSetting', (noticeList) => { this.noticeList = noticeList })
      // 保存紧急呼叫铃声
      eventVue.$on('saveEmergencySetting', (emergencyCallList) => { this.emergencyCallList = emergencyCallList })
      // 保存普通呼叫铃声
      eventVue.$on('saveOrdinarySetting', (ordinaryCallList) => { this.ordinaryCallList = ordinaryCallList })
      // 保存警报气体铃声
      eventVue.$on('saveWarnGasSetting', (gasLevelSetting) => { this.gasLevelSetting = gasLevelSetting })
    },
    // 删除声音
    handleDeleteVoiceData() {
      this.$confirm('是否继续删除该铃声？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVoiceData(this.deleteID).then(resp => {
          if (resp.data.code === 200) {
            // 新增操作记录
            const str = '删除' + this.deleteTypeName
            this.requestFun.handleAddOperateData(str)
          } else {
            this.$message({
              type: 'error',
              message: resp.data.code + ':' + resp.data.msg
            })
          }
          this.$emit('fetchVoiceDataByType') // 通过声音类型获取声音信息(单条,普通,紧急)
          this.$emit('fetchVoiceDataByGasLevel') // 通过气体等级获取声音信息(气体警告)
          eventVue.$emit('deleteResult') // 删除后隐藏删除按钮
        }).catch(e => { this.$message({ type: 'error', message: e }) })
      })
    },
    // 保存设置(气体警报&单条,普通,紧急)
    handleSaveSetting() {
      // 单条语音,普通呼叫,紧急呼叫保存
      this.handleSaveVoiceSetting()
      // 气体警告保存
      this.handleSaveGasLevelSetting()
      // 新增操作记录
      const str = '修改系统声音设置'
      this.requestFun.handleAddOperateData(str)
    },
    // 单条语音,普通呼叫，紧急呼叫保存
    handleSaveVoiceSetting() {
      // 每次保存设置时先清空存放id的数组
      this.settingIds = []
      // 数组中存放三种声音类型对应的id
      this.settingIds.push(this.noticeList)
      this.settingIds.push(this.ordinaryCallList)
      this.settingIds.push(this.emergencyCallList)
      saveVoiceSetting(this.settingIds).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: '保存设置成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    },
    // 气体警告保存
    handleSaveGasLevelSetting() {
      // 每次上传气体警告之前先将数据转成json
      this.gasLevelSettingJson = JSON.stringify(this.gasLevelSetting)
      saveGasLevelSetting(this.gasLevelSettingJson).then(resp => {
        if (resp.data.code !== 200) {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    },
    // 恢复默认设置
    handleResetDefaultSetting() {
      resetDefaultSetting().then(resp => {
        if (resp.data.code === 200) {
          // 新增操作记录
          const str = '系统声音恢复默认设置'
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
    }
  }
}
</script>
