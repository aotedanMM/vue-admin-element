<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card" class="m_tableContent2" @tab-click="handleClick">
      <!--矿下区域管理-->
      <el-tab-pane label="矿下区域管理" name="first">
        <keep-alive> <area-management v-show="areaManagementVisible" ref="areaManagementRefs"/></keep-alive>
      </el-tab-pane>
      <!--重点区域管理-->
      <el-tab-pane label="重点区域管理" name="second">
        <keep-alive>
          <important-area
            v-show="importantAreaVisible"
            ref="importantAreaRefs"
            @openWarnAreaEdit="handleOpenWarnAreaEdit"
          />
        </keep-alive>
      </el-tab-pane>
      <!--限制区域管理-->
      <el-tab-pane label="限制区域管理" name="third">
        <keep-alive>
          <limit-area
            v-show="limitAreaVisible"
            ref="limitAreaRefs"
            @openWarnAreaEdit="handleOpenWarnAreaEdit"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!--编辑&修改-->
    <warn-area-edit
      :warn-area-edit-visible="warnAreaEditVisible"
      @closeWarnAreaEdit="handleCloseWarnAreaEdit"
    />
  </div>
</template>
<script>
import ImportantArea from './ImportantArea'
import LimitArea from './LimitArea'
import WarnAreaEdit from './WarnAreaEdit'
import AreaManagement from './AreaManagement'
export default {
  components: { AreaManagement, WarnAreaEdit, LimitArea, ImportantArea },
  data() {
    return {
      areaManagementVisible: true,
      importantAreaVisible: false,
      limitAreaVisible: false,
      warnAreaEditVisible: false,
      activeName: 'first',
      disableStatus: false,
      dialogType: null
    }
  },
  created() {

  },
  methods: {
    // 打开新增&编辑弹窗
    handleOpenWarnAreaEdit() {
      this.warnAreaEditVisible = true
    },
    // 关闭新增&编辑弹窗
    handleCloseWarnAreaEdit() {
      this.warnAreaEditVisible = false
    },
    handleClick() {
      switch (this.activeName) {
        case 'first':
          this.areaManagementVisible = true
          this.$refs.areaManagementRefs.getAllPartitionInfo()
          break
        case 'second':
          this.importantAreaVisible = true
          this.$refs.importantAreaRefs.handleFetchImportantArea() // 获取重点区域信息
          break
        case 'third':
          this.limitAreaVisible = true
          this.$refs.limitAreaRefs.handleFetchLimitArea() // 获取限制区域信息
          break
      }
    }
  }
}
</script>
