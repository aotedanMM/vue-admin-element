<template>
  <div class="downHoleDialogTop">
    <!--区域选择-->
    <el-select v-model="areaId" clearable placeholder="请选择区域">
      <el-option
        v-for="item in warningAreaData"
        :key="item.warningAreaId"
        :label="item.warningAreaName"
        :value="item.warningAreaId"
      />
    </el-select>
    <el-button icon="el-icon-search" type="primary" @click="handleFetchWarnAreaRegion">查询</el-button>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'WarnAreaFilter',
  data() {
    return {
      areaId: null,
      warningAreaData: []
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('sendWarnAreaData')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('sendWarnAreaData', (warningAreaData) => {
        this.warningAreaData = warningAreaData
      })
    },
    // 根据警告区域名称查找区域
    handleFetchWarnAreaRegion() {
      eventVue.$emit('fetchWarnArea', this.areaId)
    }
  }
}
</script>

