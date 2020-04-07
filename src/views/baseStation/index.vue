<template>
  <div class="app-container">
    <!--搜索-->
    <base-station-filter
      @openSetFrequency="handleOpenSetFrequency"
      @openBindWarnStandard="handleOpenBindWarnStandard"
    />
    <!--基站信息表-->
    <base-station-table/>
    <!--基站详情-->
    <base-station-details/>
    <!--新增编辑-->
    <base-station-edit
      :base-station-edit-visible="baseStationEditVisible"
      @openBaseStationEdit="handleOpenBaseStationEdit"
      @closeBaseStationEdit="handleCloseBaseStationEdit"/>
    <!--设定上传频率-->
    <set-frequency
      :set-frequency-visible="setFrequencyVisible"
      @closeSetFrequency="handleCloseSetFrequency"
    />
    <!--绑定气体标注-->
    <bind-warn-standard
      :bind-warn-standard-visible="bindWarnStandardVisible"
      @closeBindWarnStandard="handleCloseBindWarnStandard"
    />
  </div>
</template>
<script>
import BaseStationFilter from './BaseStationFilter'
import BaseStationTable from './BaseStationTable'
import BaseStationDetails from './BaseStationDetails'
import BaseStationEdit from './BaseStationEdit'
import BindWarnStandard from './BaseStationSetting/BindWarnStandard'
import SetFrequency from './BaseStationSetting/SetFrequency'
export default {
  components: { SetFrequency, BindWarnStandard, BaseStationEdit, BaseStationDetails, BaseStationTable, BaseStationFilter },
  data() {
    return {
      setFrequencyVisible: false, // 设定上传频率
      baseStationEditVisible: false, // 设定井口&考勤基站
      bindWarnStandardVisible: false // 绑定气体标准
    }
  },
  methods: {
    // 打开绑定气体标准窗口
    handleOpenBindWarnStandard() {
      this.bindWarnStandardVisible = true
    },
    // 关闭绑定气体标准窗口
    handleCloseBindWarnStandard() {
      this.bindWarnStandardVisible = false
    },
    // 打开设定上传频率窗口
    handleOpenSetFrequency() {
      this.setFrequencyVisible = true
    },
    // 关闭设定上传频率窗口
    handleCloseSetFrequency() {
      this.setFrequencyVisible = false
    },
    // 打开新增编辑弹窗
    handleOpenBaseStationEdit() {
      this.baseStationEditVisible = true
    },
    // 关闭新增编辑弹窗
    handleCloseBaseStationEdit() {
      this.baseStationEditVisible = false
    }
  }
}
</script>
