<template>
  <div>
    <div class="m_windowHeader">
      <div class="window_top">{{ staffInfo.staffName }} — {{ staffInfo.deptName }}</div>
      <p class="m_onlineStatus"> {{ onlineStatus }}</p>
    </div>
  </div>
</template>
<script>
import { checkStaffOnline } from '@/api/chat'
import eventVue from '@/api/eventVue'
export default {
  name: 'WindowHeader',
  data() {
    return {
      staffInfo: {},
      onlineStatus: ''
    }
  },
  computed: {
    onlineStaffInfo() {
      return this.$store.state.user.onlineStaffId
    },
    onlineStatusInfo() {
      return this.$store.state.user.onlineStatus
    },
    globalVoiceStatus() {
      return this.$store.state.voice.globalVoiceStatus
    },
    globalStartUserId() {
      return this.$store.state.voice.globalStartUserId
    }
  },
  watch: {
    onlineStaffInfo: function() {
      this.handleChangeOnlineStatus()
    },
    onlineStatusInfo: function() {
      this.handleChangeOnlineStatus()
    }
  },
  created() {
    this.handleFetchStaffInfo()
  },
  beforeDestroy() {
    eventVue.$off('chatListToWindowHeader')
    eventVue.$off('phoneListToWindow')
    eventVue.$off('defaultWindowHeader')
  },
  methods: {
    // 更改在线状态
    handleChangeOnlineStatus() {
      if (this.staffInfo.staffId === this.$store.state.user.onlineStaffId) {
        if (this.$store.state.user.onlineStatus) {
          this.onlineStatus = '在线'
        } else {
          this.onlineStatus = '不在线'
        }
      }
    },
    handleFetchStaffInfo() {
      // 点击聊天列表传数据到聊天窗口
      eventVue.$on('chatListToWindowHeader', (message) => {
        this.staffInfo = message
        this.handleCheckStaffOnline()
      })
      // 点击通讯录传数据到聊天窗口
      eventVue.$on('phoneListToWindow', (message) => {
        this.staffInfo = message
      })
      // 获取默认聊天窗口头部
      eventVue.$on('defaultWindowHeader', (staffInfo) => {
        if (staffInfo !== null) {
          this.staffInfo = staffInfo
          this.handleCheckStaffOnline()
        }
      })
    },
    // 检查终端是否在线
    handleCheckStaffOnline() {
      // !(当前员工ID是正在通话的员工ID && 语音通话状态)
      if (!(this.globalStartUserId === this.staffInfo.staffId && this.globalVoiceStatus)) {
        checkStaffOnline(this.staffInfo.staffId).then(resp => {
          if (resp.data.code === 200) {
            this.onlineStatus = '在线'
            eventVue.$emit('onlineStatus', true)
          } else {
            this.onlineStatus = '不在线'
            eventVue.$emit('onlineStatus', false)
          }
        })
      }
    }
  }
}
</script>

