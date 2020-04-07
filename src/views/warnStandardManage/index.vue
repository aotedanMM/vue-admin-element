<template>
  <div class="app-container">
    <!--标准选项卡-->
    <standard-tabs
      :standard-id="standardId"
      :standard-info="standardInfo"
      @fetchWarnGasLevelByParams="handleFetchWarnGasLevelDataByParams"
    />
    <!--甲烷警告等级设置-->
    <ch4-warn-level
      :ch4-gas-level-info="ch4GasLevelInfo"
    />
    <!--一氧化碳警告等级设置-->
    <co-warn-level
      :co-gas-level-info="coGasLevelInfo"
    />
    <!--氧气警告等级设置-->
    <o2-warn-level
      :o2-gas-level-info="o2GasLevelInfo"
    />
    <!--温湿度警告等级设置-->
    <temperature-warn-level
      ref="temperatureWarnLevelRefs"
      :temperature-gas-level-info="temperatureGasLevelInfo"
      :humidity-gas-level-info="humidityGasLevelInfo"
    />
    <!--新增&编辑气体警告等级-->
    <warn-gas-level-edit
      @fetchWarnGasLevel="handleFetchWarnGasLevelInfo"
    />
    <!--新增&编辑标准-->
    <standard-edit/>
    <!--校验密码-->
    <check-pass-word/>
  </div>
</template>
<script>
import StandardTabs from './StandardTabs'
import Ch4WarnLevel from './Ch4WarnLevel'
import CoWarnLevel from './CoWarnLevel'
import O2WarnLevel from './O2WarnLevel'
import TemperatureWarnLevel from './TemperatureWarnLevel'
import WarnGasLevelEdit from './WarnGasLevelEdit'
import StandardEdit from './StandardEdit'
import CheckPassWord from './CheckPassWord'
import { fetchWarnGasLevelInfo } from '@/api/warnlevel'
export default {
  name: 'WarnStandardManage',
  components: { CheckPassWord, StandardEdit, WarnGasLevelEdit, TemperatureWarnLevel, O2WarnLevel, CoWarnLevel, Ch4WarnLevel, StandardTabs },
  data() {
    return {
      ch4GasLevelInfo: [],
      o2GasLevelInfo: [],
      coGasLevelInfo: [],
      temperatureGasLevelInfo: [],
      humidityGasLevelInfo: [],
      standardInfo: {},
      standardId: null
    }
  },
  created() {
  },
  methods: {
    // 父子组件通信，获取警报标准信息 传参
    handleFetchWarnGasLevelDataByParams(standardId) {
      this.standardId = standardId
      this.ch4GasLevelInfo = []
      this.coGasLevelInfo = []
      this.o2GasLevelInfo = []
      this.temperatureGasLevelInfo = []
      this.humidityGasLevelInfo = []
      this.handleFetchWarnGasLevelInfo()
    },
    // 获取所有的气体警告等级& 通过标准ID获取气体警告等级信息
    handleFetchWarnGasLevelInfo() {
      fetchWarnGasLevelInfo(this.standardId).then(resp => {
        if (resp.data.code === 200) {
          this.ch4GasLevelInfo = resp.data.data.ch4WarnSettingDto // 甲烷
          this.coGasLevelInfo = resp.data.data.coWarnSettingDto // CO
          this.o2GasLevelInfo = resp.data.data.o2WarnSettingDto // o2
          this.temperatureGasLevelInfo = resp.data.data.tWarnSettingDto // 温度
          this.humidityGasLevelInfo = resp.data.data.hWarnSettingDto // 湿度
          this.standardInfo = resp.data.data.gasStandard // 警报标准
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    }
  }
}
</script>
