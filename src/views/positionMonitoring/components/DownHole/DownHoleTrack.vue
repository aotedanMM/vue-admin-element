<template>
  <!--轨迹-->
  <div class="m_track">
    <div class="m_trackTableTop">
      <p class="trackTitle">{{ staffName }} - 井下轨迹</p>
      <div class="m_historyLegend">
        <ul>
          <li><p class="m_history5"/>限制区域</li>
          <li><p class="m_history4"/>重点区域</li>
          <li><p class="m_history3"/>出井</li>
          <li><p class="m_history2"/>井下</li>
          <li><p class="m_history1"/>入井</li>
        </ul>
      </div>
    </div>
    <div class="m_trackTableContent">
      <ul class="m_historyList2">
        <li v-for="(item,index) in downHoleTrackData" :key="item.index" :name="index">
          <img v-if="item.isore === 0" src="static/img/circle.png" >
          <img v-if="item.isore === 1" src="static/img/circle1.png" >
          <img v-if="item.isore === 2" src="static/img/circle2.png">
          <img v-if="item.isore === 3" src="static/img/circle3.png" >
          <img v-if="item.isore === 4" src="static/img/circle4.png">
          <img v-if="item.isore === undefined" src="static/img/circle.png">
          <p class="timeLeft">{{ item.createtime | formatDate }}</p>
          <p class="introRight">{{ item.temppositionname }}</p>
        </li>
      </ul>
    </div>
    <!--分页-->
    <div v-show="trackQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="trackQuery.page"
        :page-size="trackQuery.limit"
        :total= "trackQuery.total"
        layout="total, prev, pager, next"
        @current-change="sizeChangeDownHoleTrack"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownHoleTrack',
  props: {
    downHoleTrackData: {
      type: Array,
      required: true
    },
    staffName: {
      type: String,
      required: true
    },
    trackQuery: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 员工轨迹改变当前页数
    sizeChangeDownHoleTrack(val) {
      this.trackQuery.page = val
      this.$emit('sizeChangeDownHoleTrack', this.trackQuery)
    }
  }
}
</script>
