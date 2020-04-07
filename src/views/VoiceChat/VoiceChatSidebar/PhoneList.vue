<template>
  <!--通讯录-->
  <div class="phoneBookList">
    <div class="m_chatTopInput">
      <el-input v-model="phoneQuery.staffName" clearable placeholder="搜索员工" class="searchInput" @keyup.enter.native="handleSearchPhoneList"/>
      <el-button class="searchBtn" @click="handleSearchPhoneList">查询</el-button>
    </div>
    <div class="scrollWrap2" @mouseenter="handleMouseEnter()" @mouseleave="handleMouserLeave()">
      <scroller
        ref="scrollBottom2"
        :on-infinite="handleLoadPhoneList"
        no-data-text="">
        <div class="scrollContent2">
          <ul>
            <li v-for="item in phoneListData" :key ="item.staffId" class= "phoneListItem" @click="handleChatStaff(item)" >
              <div class="m_phoneListName">
                {{ item.staffName }} - {{ item.deptName }}
              </div>
            </li>
          </ul>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import { fetchPhoneBook } from '@/api/infor'
import eventVue from '@/api/eventVue'
export default {
  name: 'PhoneList',
  data() {
    return {
      firstFetchFlag: true,
      phoneQuery: { limit: 20, total: null, keyWord: null, page: 1 },
      phoneListData: [],
      newPhoneListData: []
    }
  },
  created() {
    this.handleFetchPhoneList()
  },
  methods: {
    // 获取通讯录
    handleFetchPhoneList() {
      fetchPhoneBook(this.phoneQuery).then(resp => {
        if (resp.data.code === 200) {
          this.pagination = resp.data.data.hasNextPage
          this.totalpage = resp.data.data.pages
          // 判断是第一次加载还是获取更多
          if (this.firstFetchFlag) {
            this.phoneListData = resp.data.data.list
            this.firstFetchFlag = false
          } else {
            this.newPhoneListData = resp.data.data.list
          }
        } else if (resp.data.code === 111) {
          this.pagination = false
          this.totalpage = null
          this.phoneListData = []
          this.newPhoneListData = []
        } else {
          this.pagination = false
          this.totalpage = null
          this.phoneListData = []
          this.newPhoneListData = []
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 点击通讯录与员工进行语音聊天
    handleChatStaff(staffInfo) {
      this.staffInfo = staffInfo
      eventVue.$emit('updateChatList', this.staffInfo) // 更新聊天列表
      eventVue.$emit('chatListToWindowHeader', this.staffInfo) // 将数据传到聊天窗口header
      eventVue.$emit('chatListToWindowMain', this.staffInfo)// 将数据传到聊天窗口main
      eventVue.$emit('chatListToWindowFooter', this.staffInfo)// 将数据传到聊天窗口footer
      this.$store.dispatch('handleChangeCurrentUserId', this.staffInfo.staffId) // 更改当前正在语音窗口的员工ID全局变量
      eventVue.$emit('setGasInfoTimeout') // 点击列表开始计时
    },
    // 通讯录搜索员工
    handleSearchPhoneList() {
      this.firstFetchFlag = true
      this.phoneListData = [] // 搜索之前清空数据,防止后面的加载数据出错
      this.handleFetchPhoneList()
    },
    // 加载更多员工列表
    handleLoadPhoneList(done) {
      if (!this.firstFetchFlag) {
        this.phoneQuery.page++
        // 判断是否为最后一页，若当前为最后一页则不再加载
        if (this.pagination === false || this.phoneQuery.page > this.totalpage) {
          setTimeout(() => {
            done(true)
          }, 500)
          return
        }
        this.handleFetchPhoneList() // 获取通讯录列表
        // 将加载到的newList追加到phoneList中
        setTimeout(() => {
          this.phoneListData = this.phoneListData.concat(this.newPhoneListData)
          setTimeout(() => {
            done()
          })
        }, 500)
      }
    },
    mouseScroll() {
      const _this = this // 此this指向的是vue
      window.onmousewheel = function(e) {
        if (e.wheelDelta < 0) {
          _this.$refs.scrollBottom2 && (_this.$refs.scrollBottom2.scrollBy(0, 30, false))// 避免ref中不存在scrollBottom
        } else {
          _this.$refs.scrollBottom2 && (_this.$refs.scrollBottom2.scrollBy(0, -30, false))
        }
      }
    },
    handleMouseEnter() {
      this.mouseScroll()
    },
    // 鼠标移出事件
    handleMouserLeave() {
    }
  }
}
</script>
