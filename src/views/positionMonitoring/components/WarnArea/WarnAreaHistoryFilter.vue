<template>
  <div class="downHoleDialogTop">
    <el-page-header style="float: left;line-height: 50px !important;" @back="goBack"/>
    <el-date-picker
      v-model="filterTime"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"/>
    <el-button icon="el-icon-search" type="primary" @click="handleFetchHistory">查询</el-button>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'

export default {
  name: 'WarnAreaHistoryFilter',
  props: {
    typeFlag: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      filterTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {
    filterTime() {
      if (this.filterTime) {
        this.startTime = this.filterTime[0]
        this.endTime = this.filterTime[1]
      } else {
        this.startTime = null
        this.endTime = null
      }
    }
  },
  methods: {
    // 返回
    goBack() {
      // 返回员工列表
      if (this.typeFlag === 1) {
        eventVue.$emit('showStaffList')
      } else {
        // 返回区域列表
        eventVue.$emit('showAreaList')
      }
    },
    // 按时间查询历史轨迹
    handleFetchHistory() {
      if (this.typeFlag === 1) {
        // 员工历史
        eventVue.$emit('searchStaffHistory', this.startTime, this.endTime)
      } else {
        // 区域历史
        eventVue.$emit('searchAreaHistory', this.startTime, this.endTime)
      }
    }
  }
}
</script>

<style scoped>

</style>
