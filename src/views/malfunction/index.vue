<template>
  <div class="app-container" >
    <el-tabs v-model="activeName" type="card" class="m_tableContent2" @tab-click="handleClick">
      <!--未处理-->
      <el-tab-pane label="未处理" name="first">
        <unprocessed v-show="unprocessedVisible" ref="unProcessedRefs"/>
      </el-tab-pane>
      <!--已处理-->
      <el-tab-pane label="已处理" name="second">
        <processed v-show="processedVisible" ref="processedRefs"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Unprocessed from './Unprocessed'
import Processed from './Processed'
export default {
  components: { Processed, Unprocessed },
  data: function() {
    return {
      unprocessedVisible: true,
      processedVisible: false,
      activeName: 'first'
    }
  },
  methods: {
    // tab切换
    handleClick() {
      if (this.activeName === 'first') {
        this.unprocessedVisible = true
        this.$refs.unProcessedRefs.handleGetMalfunctionData()
      } else {
        this.processedVisible = true
        this.$refs.processedRefs.getDisposalList()
      }
    }
  }
}
</script>
