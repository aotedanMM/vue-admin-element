<template>
  <!--悬浮显示井下人数-->
  <div class="m_tableTop3">
    <el-row>
      <ul>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue ">
            <el-button @click="handleFetchDownHole(1)"> 井下总人数:<p> {{ downHoleData.total }} </p></el-button>
          </li>
        </el-col>

        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue">
            <el-button @click="handleFetchDownHole(2)"> 超时人数:<p> {{ downHoleData.timeOut }} </p></el-button>
          </li>
        </el-col>

        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue">
            <el-button @click="handleFetchDownHole(3)"> 严重超时人数:<p>{{ downHoleData.severeTimeOut }} </p></el-button>
          </li>
        </el-col>

        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue">
            <el-button @click="handleFetchDownHole(4)"> 缺勤人数:<p>{{ downHoleData.absence }} </p></el-button>
          </li>
        </el-col>

        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue">
            <el-button @click="handleFetchDownHole(5)"> 重点区域:<p>{{ downHoleData.important }} </p></el-button>
          </li>
        </el-col>

        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
          <li class="downHoleValue">
            <el-button @click="handleFetchDownHole(6)"> 限制区域:<p>{{ downHoleData.limit }} </p></el-button>
          </li>
        </el-col>
      </ul>

    </el-row>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchDownHoleStaffData, fetchTimeOutStaffData, fetchSevereTimeOutStaffData, fetchAbsenceStaffData } from '@/api/downHole'
import { fetchStaffNumByType } from '@/api/warningArea'
export default {
  name: 'FloatWindow',
  data() {
    return {
      downHoleData: { total: 0, timeOut: 0, severeTimeOut: 0, absence: 0, important: 0, limit: 0 },
      type: null
    }
  },
  created() {
    this.handleFetchAllStaffNum() // 获取各种井下人数
    this.handleCommit() // 兄弟组件通信
  },
  beforeDestroy() {
    eventVue.$off('changeTotalNum')
    eventVue.$off('changeTimeoutNum')
    eventVue.$off('changeSevereTimeOutNum')
    eventVue.$off('changeAbsenceNum')
    eventVue.$off('changeImportantNum')
    eventVue.$off('changeLimitNum')
  },
  methods: {
    handleCommit() {
      // 总人数
      eventVue.$on('changeTotalNum', (total) => {
        // console.log('改变总人数')
        // console.log(this.downHoleData.total)
        this.downHoleData.total = total
      })
      // 超时人数
      eventVue.$on('changeTimeoutNum', (timeOut) => {
        this.downHoleData.timeOut += timeOut
      })
      // 严重超时人数
      eventVue.$on('changeSevereTimeOutNum', (severeTimeOut) => {
        this.downHoleData.severeTimeOut += severeTimeOut
      })
      // 缺勤人数
      eventVue.$on('changeAbsenceNum', (absence) => {
        this.downHoleData.absence = absence
      })
      // 重点区域人数
      eventVue.$on('changeImportantNum', (important) => {
        this.downHoleData.important += important
      })
      // 限制区域人数
      eventVue.$on('changeLimitNum', (limit) => {
        this.downHoleData.limit += limit
      })
    },
    // 点击悬浮人数之后显示弹窗
    handleFetchDownHole(value) {
      if (value === 5 || value === 6) {
        eventVue.$emit('handleFetchWarnAreaInfo', value)
        this.$emit('openWarnAreaDialog')
      } else {
        eventVue.$emit('handleFetchDownHoleInfo', value)
        this.$emit('openDownHoleDialog')
      }
    },
    // 获取各种井下人数
    handleFetchAllStaffNum() {
      this.handleFetchTotalStaffNum() // 总人数
      // 暂时注释，不获取超时人数、严重超时人数、缺勤人数
      this.handleFetchTimeOutStaffNum() // 超时人数
      this.handleFetchSevereTimeOutStaffNum() // 严重超时人数
      this.handleFetchAbsenceStaffNum() // 缺勤人数
      this.handleFetchImportantAreaStaffNum() // 重点区域人数
      this.handleFetchLimitAreaStaffNum() // 限制区域人数
    },
    // 获取井下总人数
    handleFetchTotalStaffNum() {
      fetchDownHoleStaffData().then(resp => {
        // console.log('获取井下总人数')
        // console.log(resp.data.data.total)
        if (resp.data.code === 200) {
          this.downHoleData.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleData.total = 0
        } else {
          this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取超时人数
    handleFetchTimeOutStaffNum() {
      fetchTimeOutStaffData().then(resp => {
        // console.log('获取超时人数')
        // console.log(resp.data.data.total)
        if (resp.data.code === 200) {
          this.downHoleData.timeOut = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleData.timeOut = 0
        } else {
          this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取严重超时人数
    handleFetchSevereTimeOutStaffNum() {
      fetchSevereTimeOutStaffData().then(resp => {
        // console.log('获取严重超时人数')
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.downHoleData.severeTimeOut = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleData.severeTimeOut = 0
        } else {
          this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取缺勤人数
    handleFetchAbsenceStaffNum() {
      fetchAbsenceStaffData().then(resp => {
        // console.log('获取缺勤人数')
        // console.log(resp.data.data.total)
        if (resp.data.code === 200) {
          this.downHoleData.absence = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleData.absence = 0
        } else {
          this.$message({ type: 'error', message: resp.data.code + ':' + resp.data.msg })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取重点区域人数
    handleFetchImportantAreaStaffNum() {
      this.type = 1
      fetchStaffNumByType(this.type).then(resp => {
        // console.log('获取重点区域人数')
        // console.log(resp.data.data)
        if (resp.data.code === 200) {
          this.downHoleData.important = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleData.important = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 获取限制区域人数
    handleFetchLimitAreaStaffNum() {
      this.type = 2
      fetchStaffNumByType(this.type).then(resp => {
        // console.log('获取限制区域人数')
        // console.log(resp.data.data)
        if (resp.data.code === 200) {
          this.downHoleData.limit = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleData.limit = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    }
  }
}
</script>

