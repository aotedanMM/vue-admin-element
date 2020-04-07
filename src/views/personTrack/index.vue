<template>
  <div class="app-container">
    <!--条件筛选-->
    <el-tabs v-model="activeName" type="card" style="margin-top: 40px" @tab-click="handleClick">
      <el-tab-pane label="员工" name="first"/>
      <el-tab-pane label="领导" name="second"/>
      <el-tab-pane label="外来人员" name="third"/>
    </el-tabs>
    <!--人员列表-->
    <person-track-staff-list v-show="staffListVisible" ref="staffListRefs" @showTimeList="handleShowTimeList()"/>
    <!--时间列表-->
    <person-track-time-list v-show="timeListVisible" ref="timeListRefs" @timeListGoBack="handleShowStaffList()" @showTrackList="handleShowTrackList"/>
    <!--历史轨迹-->
    <person-track-history-list v-show="trackVisible" ref="trackListRefs" @trackListGoBack="handleShowTimeList()"/>
  </div>
</template>
<script>
import PersonTrackFilter from './PersonTrackFilter'
import PersonTrackStaffList from './PersonTrackStaffList'
import PersonTrackHistoryList from './PersonTrackHistoryList'
import PersonTrackTimeList from './PersonTrackTimeList'
export default {
  components: { PersonTrackTimeList, PersonTrackHistoryList, PersonTrackStaffList, PersonTrackFilter },
  data() {
    return {
      trackVisible: false,
      timeListVisible: false,
      staffListVisible: true,
      staffInfo: {},
      activeName: 'first'
    }
  },
  created() {
    this.getStaffHistoryTrack() // 路由跳转查看人员历史轨迹
  },
  methods: {
    // 顶部tabs事件
    handleClick() {
      switch (this.activeName) {
        case 'first':
          this.$refs.staffListRefs.handleJudgePersonType(0)
          this.handleShowStaffList()
          break
        case 'second':
          this.$refs.staffListRefs.handleJudgePersonType(1)
          this.handleShowStaffList()
          break
        case 'third':
          this.$refs.staffListRefs.handleJudgePersonType(2)
          this.handleShowStaffList()
          break
      }
    },
    // 路由跳转 —— 查看人员历史轨迹
    getStaffHistoryTrack() {
      // 路由传参数，根据员工ID获取员工的历史轨迹
      if (this.staffInfo.staffId !== undefined) {
        this.staffInfo.staffId = this.$route.params.staffId
        this.staffInfo.staffName = this.$route.params.staffName
        this.trackVisible = true // 历史轨迹可见
        this.staffListVisible = false // 员工列表不可见
        this.timeListVisible = false
        this.$nextTick(() => {
          this.$refs.trackListRefs.handleShowHistory(this.staffInfo)
        })
      }
    },
    // 显示人员列表
    handleShowStaffList() {
      this.staffListVisible = true
      this.timeListVisible = false
      this.trackVisible = false
    },
    // 显示时间列表
    handleShowTimeList() {
      this.timeListVisible = true
      this.staffListVisible = false
      this.trackVisible = false
    },
    // 显示轨迹列表
    handleShowTrackList() {
      this.trackVisible = true
      this.staffListVisible = false
      this.timeListVisible = false
    }
  }
}
</script>
