<template>
  <!--搜索-->
  <div>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="m_filterBtnGroup">
          <!--选择区域-->
          <area-select :select-partition="selectPartition" @returnPartitionId="handleReturnPartition"/>
          <!--选择时间-->
          <el-date-picker
            v-model="selectTime"
            :picker-options="pickerOptions"
            :unlink-panels="true"
            value-format="yyyy-MM-dd"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFetchSelectTime"/>
          <el-select v-model="baseStationQuery.type" placeholder="请选择基站类型" clearable class="m_selectStation">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-input v-model="baseStationQuery.stationName" placeholder="请输入基站名称" clearable/>
          <el-button type="primary" icon="el-icon-search" @click="handleSearchBaseStation">查询</el-button>
          <el-button v-print="'#printTable'" icon="el-icon-printer" type="success">打印</el-button>
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleUpdateBaseStation">新增</el-button>
          <el-button type="warning" icon="addWellheadIcon" @click="setBaseStation(1)">设定井口基站</el-button>
          <el-button type="success" icon="addAttendanceIcon" @click="setBaseStation(2)" >设定考勤基站</el-button>
          <el-button type="success" icon="addFrequencyIcon" @click="handleSetFrequency" >设定上传频率</el-button>
          <el-button type="warning" icon="addStandardIcon" @click="handleBindGasWarnLevel">绑定气体标准</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleSelectDeleteStation">批量删除</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { updateStationTypeByStationNum, deleteStations } from '@/api/station'
export default {
  name: 'BaseStationFilter',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      ids: [],
      multipleSelection: [],
      setBaseStationType: null,
      selectPartition: null,
      selectTime: 0,
      baseStationQuery: { type: '', startTime: null, endTime: null, zoneId: '', total: null, limit: 20, page: 1, stationName: '' },
      options: [{ value: '0', label: '普通基站' }, { value: '1', label: '井口基站' }, { value: '2', label: '考勤基站' }]
    }
  },
  created() {
    this.handleFetchMultipleSelection() // 兄弟组件通信 获取选中行的信息
  },
  beforeDestroy() {
    eventVue.$off('multipleSelection')
  },
  methods: {
    // 兄弟组件通信 获取选中行的信息
    handleFetchMultipleSelection() {
      eventVue.$on('multipleSelection', (multipleSelection) => {
        this.multipleSelection = multipleSelection
      })
    },
    // 设定井口基站
    setBaseStation(type) {
      this.type = type
      switch (this.multipleSelection.length) {
        case 0:
          this.$message({ message: '请选择您要设定的基站', type: 'info' })
          break
        case 1:
          if (this.type === 1) {
            this.handleSetWellheadBaseStation()
          } else {
            this.handleSetAttendanceBaseStation()
          }
          break
        default:
          this.$message({ message: '只能设定唯一的基站', type: 'warning' })
          break
      }
    },
    // 判断是否可以设定为井口基站
    handleSetWellheadBaseStation() {
      switch (this.multipleSelection[0].type) {
        case 1:
          this.$message({ type: 'warning', message: '请勿重复设置井口基站' })
          break
        case 2:
          this.$message({ type: 'warning', message: '考勤基站和井口基站不能为同一基站' })
          break
        default:
          this.setBaseStationId = this.multipleSelection[0].baseStationNum
          this.handleSetBaseStation()
          break
      }
    },
    // 判断是否可以设定为考勤基站
    handleSetAttendanceBaseStation() {
      switch (this.multipleSelection[0].type) {
        case 1:
          this.$message({ type: 'warning', message: '考勤基站和井口基站不能为同一基站' })
          break
        case 2:
          this.$message({ type: 'warning', message: '请勿重复设置考勤基站' })
          break
        default:
          this.setBaseStationId = this.multipleSelection[0].baseStationNum
          this.handleSetBaseStation()
          break
      }
    },
    // 上传设定井口基站&考勤基站
    handleSetBaseStation() {
      this.$confirm('确认设定基站信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStationTypeByStationNum(this.setBaseStationId, this.type).then(
          resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message({ message: res.code + ':' + res.msg, type: 'error' })
            }
            eventVue.$emit('fetchBaseStationData', '')
          }
        ).catch(e => {
          this.$message({
            type: 'error', message: e
          })
        })
      }).catch(() => {
        this.message({
          type: 'warning',
          message: '取消设置操作'
        })
      })
    },
    // 获取选择的时间
    handleFetchSelectTime() {
      if (this.selectTime === null) {
        this.baseStationQuery.startTime = null
        this.baseStationQuery.endTime = null
      } else {
        this.baseStationQuery.startTime = this.selectTime[0]
        this.baseStationQuery.endTime = this.selectTime[1]
      }
    },
    // 返回区域Id
    handleReturnPartition(selectPartition) {
      this.baseStationQuery.zoneId = selectPartition // 父子组件通信 接收返回的区域ID
    },
    // 查询
    handleSearchBaseStation() {
      eventVue.$emit('searchBaseStationData', this.baseStationQuery)
    },
    // 新增
    handleUpdateBaseStation() {
      eventVue.$emit('createBaseStation')
    },
    // 设定上传频率
    handleSetFrequency() {
      if (this.multipleSelection.length > 0) {
        this.$emit('openSetFrequency')
        eventVue.$emit('passValueToFrequency', this.multipleSelection)
      } else {
        this.$message({
          message: '请选择您要设定的基站',
          type: 'info'
        })
      }
    },
    // 绑定气体标准
    handleBindGasWarnLevel() {
      if (this.multipleSelection.length > 0) {
        this.$emit('openBindWarnStandard')
        eventVue.$emit('passValueToFrequency', this.multipleSelection)
      } else {
        this.$message({
          message: '请选择您要绑定的基站',
          type: 'info'
        })
      }
    },
    // 批量删除基站信息
    handleSelectDeleteStation() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('您将永久删除所选基站, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.ids.push(this.multipleSelection[i].baseStationNum)
          }
          deleteStations(this.ids).then(response => {
            if (response.code === 200) {
              this.$message({
                type: 'success',
                message: response.data.msg
              })
            } else {
              this.$message({
                message: response.data.code + ':' + response.data.msg,
                type: 'error'
              })
            }
            eventVue.$emit('clearSelection')
            eventVue.$emit('fetchBaseStationData', '')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请选择您要删除的基站',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>

