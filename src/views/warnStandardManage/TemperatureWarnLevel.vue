<template>
  <div>
    <div class="gasLevelPart4">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix gasLevelPart4Header">
          <el-tabs v-model="activeName" type="border-card" class="gasLevelPart4Top" @tab-click = "changeGasTypeTabs">
            <el-tab-pane label="温度警报等级设置" name="first" class="m_TabsPane1"/>
            <el-tab-pane label="湿度警报等级设置" name="second" class="m_TabsPane1"/>
          </el-tabs>
          <el-button class="m_boxCardBtn2" type="text" @click="handleCreateGasLevelInfo()">新增</el-button>
        </div>
        <div>
          <el-table :data="variableGasLevelInfo" fit style="width: 100%">
            <el-table-column label="ID" align="center" width="40" >
              <template slot-scope="scope">
                <span>{{ scope.row.levelDataId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="警报等级" align="center" min-width="70" >
              <template slot-scope="scope">
                <span>{{ scope.row.levelName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报警倍数" align="center" min-width="70" >
              <template slot-scope="scope">
                <span>{{ scope.row.multiple }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上限持续时间" align="center" min-width="70" >
              <template slot-scope="scope">
                <span>{{ scope.row.upperContinuedTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column label="下限持续时间" align="center" min-width="70" >
              <template slot-scope="scope">
                <span>{{ scope.row.lowerContinuedTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="handleUpdateGasLevelInfo(scope.row)">修改</el-button>
                <el-button type="danger" plain size="mini" @click="handleDeleteGasLevelInfo(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'

export default {
  name: 'TemperatureWarnLevel',
  props: {
    temperatureGasLevelInfo: {
      required: true,
      type: Array
    },
    humidityGasLevelInfo: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      tabStatus: null,
      variableGasLevelInfo: [],
      activeName: 'first',
      gasLevelInfo: null,
      tGasType: 3,
      hGasType: 4
    }
  },
  watch: {
    activeName: function() {
      if (this.activeName === 'first') {
        this.tabStatus = 1
        this.variableGasLevelInfo = this.temperatureGasLevelInfo
      } else {
        this.tabStatus = 2
        this.variableGasLevelInfo = this.humidityGasLevelInfo
      }
    },
    temperatureGasLevelInfo: function() {
      if (this.activeName === 'first') {
        // 显示温度警告等级
        this.tabStatus = 1
        this.variableGasLevelInfo = this.temperatureGasLevelInfo
      }
      if (this.temperatureGasLevelInfo.length !== 0) {
        this.tGasType = this.temperatureGasLevelInfo[0].gasType
      }
    },
    humidityGasLevelInfo: function() {
      if (this.activeName === 'second') {
        // 显示温度警告等级
        this.tabStatus = 1
        this.variableGasLevelInfo = this.humidityGasLevelInfo
      }
      if (this.humidityGasLevelInfo.length !== 0) {
        this.hGasType = this.humidityGasLevelInfo[0].gasType
      }
    }
  },
  created() {
    // this.changeGasTypeTabs()
    this.handleFetchStandardId() // 兄弟组件通信 获取当前警报标准ID
  },
  beforeDestroy() {
    eventVue.$off('fetchStandardId')
  },
  methods: {
    // 兄弟组件通信 获取当前警报标准ID
    handleFetchStandardId() {
      eventVue.$on('fetchStandardId', (standardId) => {
        this.standardId = standardId
      })
    },
    // 切换温湿度tabs
    changeGasTypeTabs() {
      console.log(this.activeName)
      if (this.activeName === 'first') {
        // 显示温度警告等级
        this.tabStatus = 1
        this.variableGasLevelInfo = this.temperatureGasLevelInfo
      } else {
        // 显示湿度警告等级
        this.tabStatus = 2
        this.variableGasLevelInfo = this.humidityGasLevelInfo
      }
    },
    // 新增气体警报等级
    handleCreateGasLevelInfo() {
      if (this.activeName === 'first') {
        eventVue.$emit('createGasLevel', this.tGasType, this.standardId)
      } else {
        eventVue.$emit('createGasLevel', this.hGasType, this.standardId)
      }
    },
    // 编辑气体警报等级
    handleUpdateGasLevelInfo(row) {
      eventVue.$emit('updateGasLevel', row)
    },
    // 删除气体警报等级
    handleDeleteGasLevelInfo(row) {
      eventVue.$emit('deleteGasLevel', row)
      if (this.activeName === 'first') {
        // 添加操作记录
        const str = '删除温度警报等级：' + row.levelName
        this.requestFun.handleAddOperateData(str)
      } else {
        // 添加操作记录
        const str = '删除湿度警报等级：' + row.levelName
        this.requestFun.handleAddOperateData(str)
      }
    }
  }
}
</script>

