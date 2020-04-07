<template>
  <div class="app-container">
    <print-attendance-table :list-data="attendanceData"/>
    <!--考勤信息-->
    <el-row class="m_tableTopRow2">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-input
          v-model="attendanceList.staffName"
          prefix-icon="el-icon-search"
          class="filter-item"
          placeholder="请输入姓名"
          clearable
          oninput="value=value.replace(/[^\u4e00-\u9fa5]/g,'')"
          @keyup.enter.native="getAttendanceData"/>
        <!--部门筛选-->
        <dept-select
          :org-id="orgId"
          @returnDeptId="handleReturnDeptId"
        />
        <el-select v-model="attendanceList.jobType" clearable placeholder="请选择工种">
          <el-option
            v-for="item in jobs"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"/>
        </el-select>
        <el-select v-model="attendanceList.timeStandardId" clearable placeholder="请选择排班">
          <el-option
            v-for="item in timeStandards"
            :key="item.timeStandardId"
            :label="item.timeStandardName"
            :value="item.timeStandardId"/>
        </el-select>
        <div class="m_timeFilter">
          <div class="m_radioGroup">
            <el-radio v-model="dateRadio" label="1">按当天查询</el-radio>
            <el-radio v-model="dateRadio" label="2">按范围查询</el-radio>
          </div>
          <el-date-picker
            v-show="!dateIsVisible"
            v-model="attendanceList.currentDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <el-date-picker
            v-show="dateIsVisible"
            v-model="selectTime"
            :unlink-panels="true"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </div>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getAttendanceData">查询</el-button>
        <el-button v-print="'#printTable'" class="filter-item" icon="el-icon-printer" type="success">打印</el-button>
      </el-col>
    </el-row>
    <!--考勤列表-->
    <div class="m_tableContent">
      <el-table
        :data="attendanceData"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!--<el-table-column label="ID" width="50">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.attendanceid }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="员工编号">
          <template slot-scope="scope">
            <span>{{ scope.row.staffid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staffname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            <span>{{ scope.row.deptname }} </span>
          </template>
        </el-table-column>
        <el-table-column label="工种" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.jobname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排班">
          <template slot-scope="scope">
            <span>{{ scope.row.timestandardname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考勤基站名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.stationname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上班时间">
          <template slot-scope="scope">
            <span v-if="scope.row.starttime!=null">{{ scope.row.starttime| formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下班时间">
          <template slot-scope="scope">
            <span v-if="scope.row.endtime!=null">{{ scope.row.endtime| formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入井时间">
          <template slot-scope="scope">
            <span v-if="scope.row.inore!=null" >{{ scope.row.inore| formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出井时间">
          <template slot-scope="scope">
            <span v-if="scope.row.outore!=null">{{ scope.row.outore| formatDate }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="考勤情况" >-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.backUp1 }} # {{ scope.row.backUp2 }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <!--分页-->
    <div v-show="attendanceList.total>0" class="pagination-container">
      <el-pagination
        :current-page="attendanceList.page"
        :page-sizes="[20,30,50]"
        :page-size="attendanceList.limit"
        :total="attendanceList.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeAttendance"
        @current-change="handleCurrentChangeAttendance"/>
    </div>
  </div>
</template>
<script>
import { findAllByParams } from '@/api/attendance'
import { getStaffJobs } from '@/api/infor'
import { getTimeStandard } from '@/api/timeStandard'
import DeptSelect from '@/components/DeptSelect/index'
import PrintAttendanceTable from './printAttendanceTable'
export default {
  components: { PrintAttendanceTable, DeptSelect },
  data: function() {
    return {
      orgId: null,
      dateRadio: '1',
      dateIsVisible: false,
      radio: '1',
      timeStandards: [],
      jobs: [],
      activeName: 'first',
      attendanceData: [],
      selectTime: null,
      attendanceList: { page: 1, limit: 20, total: null }
    }
  },
  watch: {
    dateRadio(val, oldVal) {
      if (val !== oldVal) {
        this.startTime = 0
        this.endTime = 0
        this.currentDate = 0
        this.dateIsVisible = !this.dateIsVisible
      }
    },
    selectTime: function() {
      if (this.selectTime === null) {
        this.attendanceList.startTime = null
        this.attendanceList.endTime = null
      } else {
        this.attendanceList.startTime = this.selectTime[0]
        this.attendanceList.endTime = this.selectTime[1]
      }
    },
    dateIsVisible: function() {
      if (this.dateIsVisible) {
        this.attendanceList.currentDate = null
      } else {
        this.selectTime = null
      }
    }
  },
  created() {
    this.getAttendanceData() // 获取考勤信息
    this.getTimeStandard() // 获取考勤时间
    this.getAllStaffJobs() // 获取员工工作
  },
  methods: {
    // 获取考勤信息
    getAttendanceData() {
      findAllByParams(this.attendanceList).then(response => {
        const result = response.data
        const code = result.code
        if (code === 200) {
          this.attendanceData = result.data.list
          this.attendanceList.total = result.data.total
        } else if (code === 111) {
          this.attendanceData = []
          this.attendanceList.total = 0
        } else {
          this.$message({
            type: 'error',
            message: result.code + ':' + result.msg
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取考勤时间
    getTimeStandard() {
      getTimeStandard().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.timeStandards = res.data.list
          } else if (res.code === 111) {
            this.timeStandards = []
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    },
    // 获取员工工作
    getAllStaffJobs() {
      getStaffJobs().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.jobs = res.data
          } else if (res.code === 111) {
            this.jobs = []
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    },
    // 改变页数
    handleCurrentChangeAttendance(val) {
      this.attendanceList.page = val
      this.getAttendanceData()
    },
    // 每页显示条数
    handleSizeChangeAttendance(val) {
      this.attendanceList.limit = val
      this.getAttendanceData()
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 部门ID
    handleReturnDeptId(orgId) {
      this.attendanceList.orgId = orgId
    }
  }
}
</script>

