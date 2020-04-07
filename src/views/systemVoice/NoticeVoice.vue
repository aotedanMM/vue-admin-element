<template>
  <div class="voicePart1">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <i class="el-icon-mobile-phone"/>
        <p>通知提示音设置</p>
        <el-button class="m_uploadBtn" type="text" @click="handleCreateSystemVoiceData(noticeType)">上传</el-button>
      </div>
      <!--通知提示音设置-->
      <div class="m_cardBodyContent">
        <el-radio-group v-model="noticeList" @change="handleFetchVoicePlayList1">
          <el-radio v-for="item in noticeListData" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
        <el-button v-show="deleteVisible1" type="danger" size="mini" class="m_deleteVoiceBtn" @click="handleDeleteVoiceData(noticeList)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'NoticeVoice',
  props: {
    noticeListData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      noticeList: null,
      noticeType: 1, // 单条语音type
      deleteVisible1: false,
      noticeListSrc: ''
    }
  },
  watch: {
    // 监听 获取单选按钮组绑定的值
    noticeListData: function() {
      if (this.noticeListData !== undefined) {
        for (const m of this.noticeListData) {
          if (m.status === 1) {
            this.noticeList = m.id
          }
        }
        eventVue.$emit('saveNoticeSetting', this.noticeList) // 保存当前设置的铃声
      }
    },
    // notice改变时获取对应的铃声url,以及判断当前铃声是否能被删除
    noticeList: function() {
      this.deleteVisible1 = this.noticeList > 4 // 判断当前铃声是否能被删除
      for (const i of this.noticeListData) {
        if (this.noticeList === i.id) {
          this.noticeListSrc = i.url
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
        this.deleteVisible1 = false
      })
    },
    // 改变当前通知铃声绑定的值
    handleFetchVoicePlayList1() {
      eventVue.$emit('playSystemVoice', this.noticeListSrc) // 播放对应铃声
      eventVue.$emit('saveNoticeSetting', this.noticeList) // 保存当前设置的铃声
    },
    // 上传铃声
    handleCreateSystemVoiceData() {
      eventVue.$emit('createSystemVoice', this.noticeType)
    },
    // 删除铃声
    handleDeleteVoiceData() {
      eventVue.$emit('deleteSystemVoice', this.noticeList, '通知提示音')
    }
  }
}
</script>

