<template>
  <div class="app-container">
    <!--人员列表-->
    <car-track-car-list v-show="staffListVisible" ref="staffListRefs" @showTimeList="handleShowTimeList()"/>
    <!--时间列表-->
    <car-track-time-list v-show="timeListVisible" ref="timeListRefs" @timeListGoBack="handleShowStaffList()" @showTrackList="handleShowTrackList"/>
    <!--历史轨迹-->
    <car-track-history-list v-show="trackVisible" ref="trackListRefs" @trackListGoBack="handleShowTimeList()"/>
  </div>
</template>
<script>
import CarTrackCarList from './CarTrackCarList'
import CarTrackTimeList from './CarTrackTimeList'
import CarTrackHistoryList from './CarTrackHistoryList'
export default {
  components: { CarTrackHistoryList, CarTrackTimeList, CarTrackCarList },
  data() {
    return {
      trackVisible: false,
      timeListVisible: false,
      staffListVisible: true
    }
  },
  created() {
  },
  methods: {
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
