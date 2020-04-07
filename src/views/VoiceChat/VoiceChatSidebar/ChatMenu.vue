<template>
  <div class="voiceDialogLeft">
    <img src="static/img/admin.png" class="m_voiceMenu">
    <img :src="chatListUrl" class="m_voiceMenu1" @click="openChatList">
    <img :src="phoneListUrl" class="m_voiceMenu1" @click="openPhoneList">
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'ChatMenu',
  data() {
    return {
      chatListUrl: 'static/img/head_2_1.png', // 聊天列表图片
      phoneListUrl: 'static/img/head_3.png' // 通讯录图片
    }
  },
  created() {
    this.changeMenu()
  },
  beforeDestroy() {
    eventVue.$off('changeMenu1')
    eventVue.$off('changeMenu2')
  },
  methods: {
    // 切换菜单
    changeMenu() {
      eventVue.$on('changeMenu1', () => {
        this.openChatList()
      })
      eventVue.$on('changeMenu2', () => {
        this.openPhoneList()
      })
    },
    // 打开通讯录
    openPhoneList() {
      this.chatListUrl = 'static/img/head_2.png'
      this.phoneListUrl = 'static/img/head_3_1.png'
      this.$emit('openPhoneList')
    },
    // 打开聊天列表
    openChatList() {
      this.chatListUrl = 'static/img/head_2_1.png'
      this.phoneListUrl = 'static/img/head_3.png'
      this.$emit('openChatList')
    }
  }
}
</script>
