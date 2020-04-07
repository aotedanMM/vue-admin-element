<template>
  <div class="voicePart2">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <i class="el-icon-phone-outline"/>
        <p>普通呼叫设置</p>
        <el-button class="m_uploadBtn" type="text" @click="handleCreateSystemVoiceData(ordinaryCallType)">上传</el-button>
      </div>
      <!--通知提示音设置-->
      <div class="m_cardBodyContent">
        <el-radio-group v-model="ordinaryCallList" @change="handleFetchVoicePlayList2">
          <el-radio v-for="item in ordinaryCallListData" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
        <el-button v-show="deleteVisible2" type="danger" size="mini" class="m_deleteVoiceBtn" @click="handleDeleteVoiceData(ordinaryCallList)">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'OrdinaryCall',
  props: {
    ordinaryCallListData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      ordinaryCallList: null,
      ordinaryCallType: 2, // 普通呼叫type
      deleteVisible2: false,
      ordinaryCallListSrc: ''
    }
  },
  watch: {
    ordinaryCallListData: function() {
      if (this.ordinaryCallListData !== undefined) {
        // 获取普通呼叫语音绑定的数组的值
        for (const m of this.ordinaryCallListData) {
          if (m.status === 1) {
            this.ordinaryCallList = m.id
          }
        }
      }
      eventVue.$emit('saveOrdinarySetting', this.ordinaryCallList) // 保存当前设置的铃声
    },
    // emergencyCallList改变时获取对应的铃声url,以及判断当前铃声是否能被删除
    ordinaryCallList: function() {
      this.deleteVisible2 = this.ordinaryCallList > 8 // 若选中的ID大于8则为新添铃声,显示删除按钮（单条语音铃声为5-8）
      for (const i of this.ordinaryCallListData) {
        if (this.ordinaryCallList === i.id) {
          this.ordinaryCallListSrc = i.url
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
        this.deleteVisible2 = false
      })
    },
    // 根据普通呼叫单选组按钮获取到相应的语音路径
    handleFetchVoicePlayList2() {
      eventVue.$emit('playSystemVoice', this.ordinaryCallListSrc) // 播放对应铃声
      eventVue.$emit('saveOrdinarySetting', this.ordinaryCallList) // 保存当前设置的铃声
    },
    // 上传铃声
    handleCreateSystemVoiceData() {
      eventVue.$emit('createSystemVoice', this.ordinaryCallType)
    },
    // 删除铃声
    handleDeleteVoiceData() {
      eventVue.$emit('deleteSystemVoice', this.ordinaryCallList, '普通呼叫提示音')
    }
  }
}
</script>
