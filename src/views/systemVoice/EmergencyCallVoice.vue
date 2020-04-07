<template>
  <div class="voicePart4">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <i class="el-icon-service"/>
        <p>紧急呼叫设置</p>
        <el-button class="m_uploadBtn" type="text" @click="handleCreateSystemVoiceData(emergencyCallType)">上传</el-button>
      </div>
      <!--紧急呼叫设置-->
      <div class="m_cardBodyContent">
        <el-radio-group v-model="emergencyCallList" @change="handleFetchVoicePlayList4">
          <el-radio v-for="item in emergencyCallListData" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
        <el-button v-show="deleteVisible4" type="danger" size="mini" class="m_deleteVoiceBtn" @click="handleDeleteVoiceData(emergencyCallList)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'EmergencyCallVoice',
  props: {
    emergencyCallListData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      emergencyCallList: null,
      emergencyCallType: 4, // 紧急呼叫type
      deleteVisible4: false,
      emergencyCallListSrc: ''
    }
  },
  watch: {
    emergencyCallListData: function() {
      if (this.emergencyCallListData !== undefined) {
        for (const m of this.emergencyCallListData) {
          if (m.status === 1) {
            this.emergencyCallList = m.id
          }
        }
      }
      eventVue.$emit('saveEmergencySetting', this.emergencyCallList) // 保存当前设置的铃声
    },
    // emergencyCallList改变时获取对应的铃声url,以及判断当前铃声是否能被删除
    emergencyCallList: function() {
      this.deleteVisible4 = this.emergencyCallList > 16 // 若选中的ID大于16则为新添铃声,显示删除按钮（警告气体铃声为13-16）
      for (const i of this.emergencyCallListData) {
        if (this.emergencyCallList === i.id) {
          this.emergencyCallListSrc = i.url
        }
      }
    }
  },
  created() {
    this.handleDeleteResult() // 兄弟组件通信 隐藏删除按钮
  },
  beforeDestroy() {
    eventVue.$off('deleteResult')
  },
  methods: {
    // 兄弟组件通信 隐藏删除按钮
    handleDeleteResult() {
      eventVue.$on('deleteResult', () => {
        this.deleteVisible4 = false
      })
    },
    // 上传铃声
    handleCreateSystemVoiceData() {
      eventVue.$emit('createSystemVoice', this.emergencyCallType)
    },
    // 删除铃声
    handleDeleteVoiceData() {
      eventVue.$emit('deleteSystemVoice', this.emergencyCallList, '紧急呼叫提示音')
    },
    // 根据紧急呼叫单选组按钮获取到相应的语音路径
    handleFetchVoicePlayList4() {
      eventVue.$emit('playSystemVoice', this.emergencyCallListSrc) // 播放对应铃声
      eventVue.$emit('saveEmergencySetting', this.emergencyCallList) // 保存当前设置的铃声
    }

  }
}
</script>
