<template>
  <div class="app-container">
    <div class="m_tableContent2 systemVoiceContainer">
      <!--通知提示音设置-->
      <notice-voice
        :notice-list-data="noticeListData"
      />
      <!--普通呼叫设置-->
      <ordinary-call
        :ordinary-call-list-data="ordinaryCallListData"
      />
      <!--气体警报设置-->
      <gas-alarm
        :gas-level-voice-data="gasLevelVoiceData"
        :warn-gas-list-data="warnGasListData"
      />
      <!--紧急呼叫设置-->
      <emergency-call-voice
        :emergency-call-list-data="emergencyCallListData"
      />
      <!--声音上传-->
      <system-voice-upload
        @fetchVoiceDataByType="handleFetchVoiceDataByType"
        @fetchVoiceDataByGasLevel="handleFetchVoiceDataByGasLevel"
      />
      <!--声音播放-->
      <system-voice-play/>
      <!--声音设置-->
      <system-voice-setting
        @fetchVoiceDataByType="handleFetchVoiceDataByType"
        @fetchVoiceDataByGasLevel="handleFetchVoiceDataByGasLevel"
      />
    </div>
  </div>
</template>
<script>
import { fetchVoiceDataByType } from '@/api/voiceSetting'
import { fetchVoiceDataByGasLevel } from '@/api/voiceSetting'
import NoticeVoice from './NoticeVoice'
import OrdinaryCall from './OrdinaryCall'
import GasAlarm from './GasAlarm'
import EmergencyCallVoice from './EmergencyCallVoice'
import SystemVoiceUpload from './SystemVoiceUpload'
import SystemVoicePlay from './SystemVoicePlay'
import SystemVoiceSetting from './SystemVoiceSetting'
export default {
  components: { SystemVoiceSetting, SystemVoicePlay, SystemVoiceUpload, EmergencyCallVoice, GasAlarm, OrdinaryCall, NoticeVoice },
  data: function() {
    return {
      levelId: '',
      noticeListData: [],
      ordinaryCallListData: [],
      warnGasListData: [],
      emergencyCallListData: [],
      checkExist: false,
      isExist: false,
      changeWarnGasList: [],
      temporarilyWarnGasList: [],
      deleteID: null,
      visible2: false,
      gasLevelSetting: [],
      settingIds: [],
      gasLevelVoiceData: [] // 气体警告等级声音数据
    }
  },
  created() {
    this.handleFetchVoiceDataByType() // 通过声音类型获取声音信息(单条,普通,紧急)
    this.handleFetchVoiceDataByGasLevel() // 通过气体等级获取声音信息(气体警告)
  },
  methods: {
    // 通过声音类型获取声音信息(单条,普通,紧急)
    handleFetchVoiceDataByType() {
      fetchVoiceDataByType().then(resp => {
        if (resp.data.code === 200) {
          // 每次获取数据之前清空原有数据
          this.phoneList = []
          this.noticeListData = []
          this.ordinaryCallListData = []
          this.warnGasListData = []
          this.emergencyCallListData = []
          this.phoneList = resp.data.data
          for (const m of this.phoneList) {
            // 根据type的值区分不同的语音列表数据
            switch (m.type) {
              case 1:
                this.noticeListData.push(m) // 单条语音
                break
              case 2:
                this.ordinaryCallListData.push(m) // 普通呼叫
                break
              case 3:
                this.warnGasListData.push(m) // 气体警告
                break
              case 4:
                this.emergencyCallListData.push(m) // 紧急呼叫
            }
          }
        } else if (resp.data.code === 111) {
          // 每次获取数据之前清空原有数据
          this.phoneList = []
          this.noticeListData = []
          this.ordinaryCallListData = []
          this.warnGasListData = []
          this.emergencyCallListData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 通过气体等级获取声音信息(气体警告)
    handleFetchVoiceDataByGasLevel() {
      // 默认获取全部警告气体等级信息,传空
      fetchVoiceDataByGasLevel(this.levelId).then(resp => {
        if (resp.data.code === 200) {
          this.gasLevelVoiceData = resp.data.data // 存储气体等级以及其对应的铃声
        } else if (resp.data.code === 111) {
          this.gasLevelVoiceData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    }
  }

}
</script>

