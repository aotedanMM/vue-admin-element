<template>
  <!--聊天列表部分-->
  <div class="phoneBookList" >
    <div class="m_chatTopInput">
      <el-input v-model="chatQuery.keyWord" placeholder="搜索员工" clearable class="searchInput" @keyup.enter.native="handleSearchChatList"/>
      <el-button class="searchBtn" @click="handleSearchChatList">查询</el-button>
    </div>
    <!--右键删除聊天列表-->
    <context-menu
      :target="this.$refs.contextRefs"
      :show="contextMenuVisible"
      class="right-menu"
      @update:show="(show) => contextMenuVisible = show">
      <a @click="handleDeleteChatListData">删除</a>
    </context-menu>
    <!--聊天列表-->
    <div class="scrollWrap2" @mouseenter="handleMouseEnter()" @mouseleave="handleMouserLeave()">
      <scroller
        ref="scrollBottom5"
        :on-infinite="handleLoadChatList"
        no-data-text="">
        <div class="scrollContent2">
          <ul ref="contextRefs">
            <li v-for="item in chatListData" :key ="item.staffId" @click="handleChatListToWindow(item)" @contextmenu.prevent="handleDeleteChatList(item.staffId)">
              <div class="m_phoneListName">
                <el-badge v-if="item.count === 0" :value="item.count" :hidden="badgeVisible" class="item3">{{ item.staffName }}</el-badge>
                <el-badge v-else :value="item.count" class="item3" >{{ item.staffName }}</el-badge>
                <p class="m_phoneListTime">{{ item.postTime | timeAgo }}</p>
              </div>
            </li>
          </ul>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import { fetchChatList, deleteChatListByStaffId, updateChatList, fetchUnReadAmount } from '@/api/chat'
import eventVue from '@/api/eventVue'
export default {
  name: 'ChatList',
  data() {
    return {
      chatMsg: {},
      contextMenuVisible: false,
      badgeVisible: true,
      chatQuery: { pageSize: 20, startPage: 1, total: null, keyWord: null },
      chatListData: [],
      newChatListData: [],
      staffInfo: {},
      fetchListStatus: false
    }
  },
  computed: {
    globalCurrentUserId() {
      return this.$store.state.voice.globalCurrentUserId
    }
  },
  watch: {
    chatListData: {
      handler(val) {
        // 当聊天列表数据不为空时，获取列表第一位的未读数量
        if (val.length) {
          this.handleFetchUnReadAmount(val[0].staffId)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.handleFetchChatList()
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('fetchChatList')
    eventVue.$off('addUnReadAmount')
    eventVue.$off('cutUnReadAmount')
    eventVue.$off('updateChatList')
    eventVue.$off('updateChatListNotFetchMoreData')
  },
  methods: {
    handleCommit() {
      // 获取聊天列表
      eventVue.$on('fetchChatList', () => {
        this.handleFetchChatList()
      })
      // 未读数量+1
      eventVue.$on('addUnReadAmount', (staffId) => {
        this.handleFetchUnReadAmount(staffId)
      })
      // 未读数量-1
      eventVue.$on('cutUnReadAmount', (staffId) => {
        this.handleFetchUnReadAmount(staffId)
      })
      // 更新聊天列表
      eventVue.$on('updateChatList', (staffInfo) => { // 与phoneBook组件通信
        this.staffInfo = staffInfo
        this.fetchListStatus = false
        this.handleUpdateNewChatList()
      })
      // 更新聊天列表(呼叫、发送单条语音) 不获取聊天列表、获取聊天记录
      eventVue.$on('updateChatListNotFetchMoreData', (staffInfo) => {
        this.staffInfo = staffInfo
        this.fetchListStatus = true
        this.handleUpdateNewChatList()
      })
    },
    // 更新聊天列表
    async handleUpdateNewChatList() {
      if (!this.fetchListStatus) {
        await this.handleFetchChatList()
      }
      await this.updateChatListEvent()
      await this.handleUpdateChatList(this.staffInfo)
      if (!this.fetchListStatus) {
        eventVue.$emit('chatListToWindowMain', this.staffInfo)// 将数据传到聊天窗口main
      }
      eventVue.$emit('chatListToWindowHeader', this.staffInfo) // 将数据传到聊天窗口header
      eventVue.$emit('chatListToWindowFooter', this.staffInfo)// 将数据传到聊天窗口footer
      this.$store.dispatch('handleChangeGlobalVoiceWindowNull', true)
    },
    // 执行更新聊天列表操作后,视图不会更新,手动调整数组更新
    handleUpdateChatList(staffInfo) {
      this.handleDeleteStaff(staffInfo.staffId) // 删除当前数组中的一条员工记录
      // 新增
      const currentTime = new Date().getTime()
      if (staffInfo.count) {
        this.chatListData.splice(0, 0, { count: staffInfo.count, staffId: staffInfo.staffId, deptName: staffInfo.deptName, staffName: staffInfo.staffName, postTime: currentTime })
      } else {
        this.chatListData.splice(0, 0, { count: 0, staffId: staffInfo.staffId, deptName: staffInfo.deptName, staffName: staffInfo.staffName, postTime: currentTime })
      }
    },
    // 删除当前数组中的一条员工记录
    handleDeleteStaff(staffId) {
      if (this.chatListData) {
        for (let i = 0; i < this.chatListData.length; i++) {
          if (this.chatListData[i].staffId === staffId) {
            this.chatListData.splice(i, 1)
          }
        }
      }
    },
    // 点击聊天列表与员工进行语音聊天
    handleChatListToWindow(staffInfo) {
      // console.log(staffInfo)
      // console.log(staffInfo.staffId)
      this.staffInfo = staffInfo
      this.$store.dispatch('handleChangeGlobalVoiceWindowNull', true)
      eventVue.$emit('chatListToWindowHeader', this.staffInfo) // 将数据传到聊天窗口header
      eventVue.$emit('chatListToWindowMain', this.staffInfo)// 将数据传到聊天窗口main
      eventVue.$emit('chatListToWindowFooter', this.staffInfo)// 将数据传到聊天窗口footer
      eventVue.$emit('resetScrollWrapHeight') // 清空右侧窗口的滚动条高度
      this.$store.dispatch('handleChangeCurrentUserId', this.staffInfo.staffId) // 更改当前正在语音窗口的员工ID全局变量
      this.$store.dispatch('handleChangeGlobalLoadDataFlag', true)
      this.handleFetchUnReadAmount(this.staffInfo.staffId) // 根据员工ID获取当前未读数量
      eventVue.$emit('setGasInfoTimeout') // 点击列表开始计时
    },
    // 根据员工ID获取当前未读数量
    handleFetchUnReadAmount(staffId) {
      fetchUnReadAmount(staffId).then(resp => {
        // console.log('获取单条数量')
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.unReadCount = resp.data.data
          this.handleChangeUnReadAmount()
        }
      })
    },
    // 改变未读数量
    handleChangeUnReadAmount() {
      for (let i = 0; i < this.chatListData.length; i++) {
        if (this.chatListData[i].staffId === this.globalCurrentUserId) {
          this.chatListData[i].count = this.unReadCount
        }
      }
    },
    // 更新聊天列表
    async updateChatListEvent() {
      this.$store.dispatch('handleChangeCurrentUserId', this.staffInfo.staffId) // 更改当前正在语音窗口的员工ID全局变量
      this.chatMsg.postUserId = this.staffInfo.staffId // 员工Id
      this.chatMsg.postTime = new Date().getTime() // 获取当前时间戳
      await updateChatList(this.chatMsg).then(resp => {
        // console.log('更新聊天列表')
        // console.log(resp.data)
        if (resp.data.code === 200) {
          // this.handleFetchChatList() // 重新获取聊天列表
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 获取聊天列表
    async handleFetchChatList() {
      await fetchChatList(this.chatQuery).then(resp => {
        // console.log('获取聊天列表')
        if (resp.data.code === 200) {
          // console.log(resp.data)
          // 判断聊天列表是否为空
          this.pagination = resp.data.data.hasNextPage
          this.totalpage = resp.data.data.pages
          // this.$store.dispatch('handleChangeGlobalVoiceWindowNull', true)
          // 如果chatListData的长度为0,则为第一次获取数据
          if (this.chatListData.length === 0) {
            this.chatListData = resp.data.data.list
            this.$store.dispatch('handleChangeGlobalVoiceWindowNull', false)
            // eventVue.$emit('defaultWindowHeader', this.chatListData[0]) // 获取默认聊天窗口 header
            // eventVue.$emit('chatListToWindowMain', this.chatListData[0]) // 获取默认聊天窗口 main
            // eventVue.$emit('chatListToWindowFooter', this.chatListData[0]) // 获取默认聊天窗口 footer
            this.$store.dispatch('handleChangeCurrentUserId', this.chatListData[0].staffId) // 更改当前正在语音窗口的员工ID全局变量
            eventVue.$emit('setGasInfoTimeout') // 开始计时
          } else {
            // 否则为加载数据
            this.newChatListData = resp.data.data.list
          }
        } else if (resp.data.code === 111) {
          this.pagination = false
          this.totalpage = null
          this.chatListData = []
          this.newChatListData = []
          this.$store.dispatch('handleChangeGlobalVoiceWindowNull', false)
        } else {
          this.pagination = false
          this.totalpage = null
          this.chatListData = []
          this.newChatListData = []
          this.$store.dispatch('handleChangeGlobalVoiceWindowNull', false)
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        eventVue.$emit('changeMenu1') // 显示聊天列表,隐藏通讯录
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    },
    // 搜索聊天列表
    handleSearchChatList() {
      this.chatListData = [] // 搜索之前清空数据,防止后面的加载数据出错
      this.handleFetchChatList()
      // this.$store.dispatch('handleChangeGlobalVoiceWindowNull', true)
    },
    // 右键点击聊天列表,获取staffId
    handleDeleteChatList(item) {
      this.staffId = item
    },
    // 删除聊天列表中的一项
    handleDeleteChatListData() {
      this.handleDeleteStaff(this.staffId)
      deleteChatListByStaffId(this.staffId).then(resp => {
        if (resp.data.code === 200) {
          // 删除后重新获取对话列表
          // this.handleFetchChatList() // 重新获取一遍聊天列表
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
      this.contextMenuVisible = false
      this.$store.dispatch('handleChangeGlobalVoiceWindowNull', false)
    },
    // 加载更多聊天列表
    handleLoadChatList(done) {
      this.chatQuery.startPage++
      // 判断是否为最后一页，若当前为最后一页则不再加载
      if (this.pagination === false || this.chatQuery.startPage > this.totalpage) {
        setTimeout(() => {
          done(true)
        }, 500)
        return
      }
      this.handleFetchChatList() // 获取通讯录列表
      // 将加载到的newList追加到phoneList中
      setTimeout(() => {
        this.chatListData = this.chatListData.concat(this.newChatListData)
        setTimeout(() => {
          done()
        })
      }, 500)
    },
    mouseScroll() {
      const _this = this // 此this指向的是vue
      window.onmousewheel = function(e) {
        if (e.wheelDelta < 0) {
          _this.$refs.scrollBottom5 && (_this.$refs.scrollBottom5.scrollBy(0, 30, false))// 避免ref中不存在scrollBottom
        } else {
          _this.$refs.scrollBottom5 && (_this.$refs.scrollBottom5.scrollBy(0, -30, false))
        }
      }
    },
    // 鼠标移入事件
    handleMouseEnter() { this.mouseScroll() },
    // 鼠标移出事件
    handleMouserLeave() {}
  }
}
</script>
