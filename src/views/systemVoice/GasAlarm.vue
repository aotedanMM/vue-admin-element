<template>
  <div class="voicePart3">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <i class="el-icon-bell"/>
        <p>气体警报设置</p>
        <!--当select值改变时,获取相对应气体语音列表的数据-->
        <el-select v-model="warnLevelId" placeholder="请选择" @change="handleSelectChange">
          <el-option
            v-for="item in gasLevelVoiceData"
            :key="item.id"
            :label="item.levelName"
            :value="item.id"/>
        </el-select>
        <el-button class="m_uploadBtn" type="text" @click="handleCreateSystemVoiceData(warnGasType)">上传</el-button>
      </div>
      <!--气体警报设置-->
      <div class="m_cardBodyContent">
        <el-radio-group v-model="warnGasList" @change="handleFetchVoicePlayList3">
          <el-radio v-for="item in warnGasListData" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
        <el-button v-show="deleteVisible3" type="danger" size="mini" class="m_deleteVoiceBtn" @click="handleDeleteVoiceData(warnGasList)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'GasAlarm',
  props: {
    // 单选按钮组的值
    warnGasListData: {
      required: true,
      type: Array
    },
    // 气体等级以及相关对应的铃声
    gasLevelVoiceData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      warnGasList: null,
      warnLevelId: null,
      gasLevelSetting: [],
      warnGasType: 3, // 气体警告type
      deleteVisible3: false,
      warnGasListSrc: ''
    }
  },
  watch: {
    // radio组的值(改变时获取相应的铃声信息，以及是否可以删除)
    warnGasList: function() {
      // 获取相应的铃声信息
      for (const m of this.warnGasListData) {
        if (m.id === this.warnGasList) {
          this.warnGasListSrc = m.url
        }
      }
      // 判断是否可以删除
      this.deleteVisible3 = this.warnGasList > 12 // 判断当前铃声是否能被删除
    },
    // 警告气体及对应铃声的数组
    gasLevelVoiceData: function() {
      // 获取默认绑定radio组的值
      if (this.gasLevelVoiceData !== undefined) {
        this.warnLevelId = this.gasLevelVoiceData[0].id
        this.warnGasList = this.gasLevelVoiceData[0].rangSettingId
      }
      // 获取保存当前设置的数组
      for (const m of this.gasLevelVoiceData) {
        this.gasLevelSetting.push({ levelId: m.id, setId: m.rangSettingId })
      }
      eventVue.$emit('saveWarnGasSetting', this.gasLevelSetting) // 保存当前设置的铃声
    }
  },
  created() {
    this.handleDeleteResult() // 兄弟组件通信 隐藏删除按钮
  },
  beforeDestroy() {
    eventVue.$off('deleteResult')
  },
  methods: {
    // 监听气体警报绑定的ID 更改后将当前修改的等级和声音ID保存到要上传的数组中
    // 按钮组的值改变 保存当前设置
    handleRadioChange() {
      for (let m = 0; m < this.gasLevelSetting.length; m++) {
        if (this.gasLevelSetting[m].levelId === this.warnLevelId) {
          this.$set(this.gasLevelSetting, m, { levelId: this.warnLevelId, setId: this.warnGasList })
        }
      }
      eventVue.$emit('playSystemVoice', this.warnGasListSrc) // 播放对应铃声
    },
    // 改变当前警告气体等级获取对应的铃声
    handleSelectChange() {
      for (const m of this.gasLevelSetting) {
        if (m.levelId === this.warnLevelId) {
          this.warnGasList = m.setId
        }
      }
      eventVue.$emit('playSystemVoice', this.warnGasListSrc) // 播放对应铃声
    },
    // 兄弟组件通信 隐藏删除按钮
    handleDeleteResult() {
      eventVue.$on('deleteResult', () => {
        this.deleteVisible3 = false
      })
    },
    // 上传铃声
    handleCreateSystemVoiceData() {
      eventVue.$emit('createSystemVoice', this.warnGasType)
    },
    // 删除铃声
    handleDeleteVoiceData() {
      eventVue.$emit('deleteSystemVoice', this.warnGasList, '气体警报提示音')
    },
    // 改变当前警报气体绑定的值
    handleFetchVoicePlayList3() {
      this.handleRadioChange() // 按钮组的值改变 保存当前设置
      eventVue.$emit('saveWarnGasSetting', this.gasLevelSetting) // 保存当前设置的铃声
    }
  }
}
</script>
