<template>
  <!--分配打卡基站-->
  <div class="allocationBaseStation">
    <el-dialog :visible.sync="bindBaseStationVisible" title= "分配考勤基站 " @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <div class="filter-container2">
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
        <el-button type="primary" icon="el-icon-search" @click="handleFetchBaseStationData">查询</el-button>
      </div>
      <el-table
        :data="bindBaseStationData"
        border
        align="center">
        <el-table-column property="baseStationNum" label="基站编号"/>
        <el-table-column property="baseStationName" label="基站名称" width="350px"/>
        <el-table-column property="zoneName" label="所属区域"/>
        <el-table-column label="选择">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="allocationBaseStation(scope.row.baseStationNum)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="bindBaseStationQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="bindBaseStationQuery.page"
          :page-size="bindBaseStationQuery.limit"
          :total="bindBaseStationQuery.total"
          :page-sizes="[20,30,50]"
          background
          layout="total, sizes, prev,pager, next, jumper"
          @current-change="handleCurrentChangeBindAttendance"
          @size-change="handleSizeChangeBindAttendance"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { searchStationByQuery } from '@/api/station'
import { bindingAttendanceStationOfStaffIds } from '@/api/dept'
export default {
  name: 'BindAttendanceBaseStation',
  props: {
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      selectPartition: null,
      selectTime: 0,
      staffIds: [],
      allocationBaseStationList: {},
      multipleSelection: [],
      bindBaseStationVisible: false,
      bindBaseStationData: [],
      bindBseStationStaffData: [],
      bindBaseStationQuery: { total: 0, limit: 10, page: 1 }
    }
  },
  created() {
    this.handleBind() // 兄弟组件通信 绑定打卡基站
    this.handleFetchBaseStationData() // 获取所有基站
  },
  beforeDestroy() {
    eventVue.$off('bindAttendanceBaseStation')
  },
  methods: {
    // 兄弟组件通信 绑定打卡基站
    handleBind() {
      eventVue.$on('bindAttendanceBaseStation', multipleSelection => {
        this.bindBaseStationVisible = true
        this.selectTime = null
        this.bindBaseStationQuery.zoneId = null
        this.multipleSelection = multipleSelection
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.staffIds.push(this.multipleSelection[i].staffId)
        }
        this.allocationBaseStationList.staffIds = this.staffIds
      })
    },
    // 返回区域Id
    handleReturnPartition(selectPartition) {
      this.bindBaseStationQuery.zoneId = selectPartition // 父子组件通信 接收返回的区域ID
    },
    // 获取选择的时间
    handleFetchSelectTime() {
      if (this.selectTime === null) {
        this.bindBaseStationQuery.startTime = null
        this.bindBaseStationQuery.endTime = null
      } else {
        this.bindBaseStationQuery.startTime = this.selectTime[0]
        this.bindBaseStationQuery.endTime = this.selectTime[1]
      }
    },
    // 获取所有基站信息
    handleFetchBaseStationData() {
      searchStationByQuery(this.bindBaseStationQuery).then((resp) => {
        if (resp.data.code === 200) {
          this.bindBaseStationData = resp.data.data.list
          this.bindBaseStationQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.bindBaseStationData = []
          this.bindBaseStationQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 绑定打卡基站
    allocationBaseStation(row) {
      this.allocationBaseStationList.stationId = row
      bindingAttendanceStationOfStaffIds(this.allocationBaseStationList).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        this.bindBaseStationVisible = false
        eventVue.$emit('fetchStaffInfo', '')
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 改变当前页数
    handleCurrentChangeBindAttendance(val) {
      this.bindBaseStationQuery.page = val
      this.handleFetchBaseStationData()
    },
    // 每页显示条数
    handleSizeChangeBindAttendance(val) {
      this.bindBaseStationQuery.limit = val
      this.handleFetchBaseStationData()
    }
  }
}
</script>
