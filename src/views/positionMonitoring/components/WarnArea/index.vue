<template>
  <!--警告区域弹窗-->
  <div class="m_downHole">
    <el-dialog :visible.sync="warnAreaVisible" :title="textMap[warnAreaDialogStatus]" :before-close="closeWarnAreaDialog" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <!--区域列表-->
      <warn-area-list
        v-show="areaVisible"
        ref="warnAreaListRefs"
        @showWarnAreaStaff="handleShowStaffList"
        @showWarnAreaHistory="handleShowTrackList"
      />
      <!--人员列表-->
      <warn-area-staff-list
        v-show="staffVisible"
        ref="warnAreaStaffListRefs"
        @showWarnAreaHistory="handleShowTrackList"
      />
      <!--历史列表-->
      <warn-area-history-list
        v-show="trackVisible"
        ref="warnAreaHistoryListRefs"
      />
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import WarnAreaFilter from './WarnAreaFilter'
import WarnAreaStaffFilter from './WarnAreaStaffFilter'
import WarnAreaList from './WarnAreaList'
import WarnAreaHistoryList from './WarnAreaHistoryList'
import WarnAreaStaffList from './WarnAreaStaffList'
export default {
  name: 'WarnArea',
  components: { WarnAreaStaffList, WarnAreaHistoryList, WarnAreaList, WarnAreaStaffFilter, WarnAreaFilter },
  props: {
    warnAreaVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      areaVisible: true,
      staffVisible: false,
      trackVisible: false,
      warnAreaDialogStatus: '',
      textMap: {
        important: '重点区域人员',
        limit: '限制区域人员'
      },
      staffFlag: false
    }
  },
  created() {
    this.handleCommit() // 兄弟组件通信 获取限制区域信息
  },
  beforeDestroy() {
    eventVue.$off('handleFetchWarnAreaInfo')
    eventVue.$off('showAreaList')
    eventVue.$off('showStaffList')
    eventVue.$off('showTrackList')
  },
  methods: {
    // 兄弟组件通信 获取限制区域信息
    handleCommit() {
      eventVue.$on('handleFetchWarnAreaInfo', (value) => {
        this.handleShowAreaList()
        switch (value) {
          case 5:
            this.warnAreaDialogStatus = 'important'
            this.$nextTick(() => {
              this.$refs.warnAreaListRefs.handleDistinguishArea(1)// 重点区域
            })
            break
          case 6:
            this.warnAreaDialogStatus = 'limit'
            this.$nextTick(() => {
              this.$refs.warnAreaListRefs.handleDistinguishArea(2)// 限制区域
            })
            break
        }
      })
      eventVue.$on('showAreaList', () => {
        this.handleShowAreaList()
      })
      eventVue.$on('showStaffList', () => {
        this.handleShowStaffList()
      })
      eventVue.$on('showTrackList', () => {
        this.handleShowTrackList()
      })
    },
    // 显示区域列表
    handleShowAreaList() {
      this.areaVisible = true
      this.staffVisible = false
      this.trackVisible = false
    },
    // 显示人员列表
    handleShowStaffList() {
      this.areaVisible = false
      this.staffVisible = true
      this.trackVisible = false
    },
    // 显示轨迹列表
    handleShowTrackList() {
      this.areaVisible = false
      this.staffVisible = false
      this.trackVisible = true
    },
    // 关闭警告区域弹窗
    closeWarnAreaDialog() {
      this.$emit('closeWarnAreaDialog')
      this.$refs.warnAreaListRefs.handleResetSearchPar()
      this.$refs.warnAreaStaffListRefs.handleResetSearchPar()
      this.$refs.warnAreaHistoryListRefs.handleResetSearchPar()
    }
  }
}
</script>

