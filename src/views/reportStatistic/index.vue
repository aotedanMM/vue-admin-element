<template>
  <div class="app-container">
    <!--top-->
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <el-select v-model="tableType">
          <el-option
            v-for="item in tableTypeData"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"/>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handlePrintTable(tableType)">查询</el-button>
        <el-button v-print="'#printTable'" icon="el-icon-printer" type="success">打印</el-button>
      </el-col>
    </el-row>
    <!--content-->
    <div>
      <!--井下总人员-->
      <total-staff
        v-if="totalStaffVisible"
        :staff-info-data="staffInfoData"
        :page-query="pageQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
      />
      <!--超时报警人员-->
      <timeout-staff
        v-if="timeoutStaffVisible"
        :staff-info-data="staffInfoData"
        :page-query="pageQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
      />
      <!--超员报警人员-->
      <overcrowding-staff
        v-if="overcrowdingStaffVisible"
        :staff-info-data="staffInfoData"
        :over-query="overQuery"
        @fetchOverArea="handleFetchOverArea"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
      />
      <!--重点区域人员-->
      <important-staff
        v-if="importantStaffVisible"
        :staff-info-data="staffInfoData"
        :page-query="pageQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
      />
      <!--限制区域报警人员-->
      <limit-staff
        v-if="limitStaffVisible"
        :staff-info-data="staffInfoData"
        :page-query="pageQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
      />
      <!--特种作业异常报警人员-->
      <special-job-staff
        v-if="specialStaffVisible"
        :staff-info-data="staffInfoData"
        :page-query="workAbQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
        @fetchAbStaff="handleFetchSpecialJobData"
      />
      <!--领导干部-->
      <leader
        v-if="leaderVisible"
        :staff-info-data="staffInfoData"
        :page-query="pageQuery"
        :leader-query="leaderQuery"
        @currentChange="handleCurrentChangePage"
        @sizeChange="handleSizeChangePage"
        @fetchLeader="handleFetchLeaderData"
      />
    </div>
  </div>
</template>
<script>
import { fetchDownHoleStaffData, fetchTimeOutStaffData } from '@/api/downHole'
import { fetchWarningAreaStaffNum, fetchOverCrowData, fetchLeaderData } from '@/api/warningArea'
import { fetchWorkAbnormal } from '@/api/workAbnormal'
import ImportantStaff from './components/ImportantStaff'
import Leader from './components/Leader'
import LimitStaff from './components/LimitStaff'
import OvercrowdingStaff from './components/OvercrowdingStaff'
import SpecialJobStaff from './components/SpecialJobStaff'
import TotalStaff from './components/TotalStaff'
import TimeoutStaff from './components/TimeoutStaff'
export default {
  name: 'ReportStatistic',
  components: { TimeoutStaff, ImportantStaff, Leader, LimitStaff, OvercrowdingStaff, SpecialJobStaff, TotalStaff },
  data: function() {
    return {
      leaderQuery: {},
      totalStaffVisible: true,
      timeoutStaffVisible: false,
      overcrowdingStaffVisible: false,
      importantStaffVisible: false,
      limitStaffVisible: false,
      specialStaffVisible: false,
      leaderVisible: false,
      staffInfoData: [],
      overQuery: { startPage: 1, pageSize: 20 },
      pageQuery: { page: 1, limit: 20, total: 0 },
      workAbQuery: { startPage: 1, pageSize: 20 },
      tableType: 1,
      tableTypeData: [
        { typeId: 1, typeName: '井下总人员' },
        { typeId: 2, typeName: '超时报警人员' },
        { typeId: 3, typeName: '超员报警人员' },
        { typeId: 4, typeName: '重点区域人员' },
        { typeId: 5, typeName: '限制区域报警人员' },
        { typeId: 6, typeName: '工作异常人员' },
        { typeId: 7, typeName: '领导干部' }
      ]
    }
  },
  watch: {
    totalStaffVisible: function() {
      if (this.totalStaffVisible === true) {
        this.handleOnlyTotalStaff()
      }
    },
    timeoutStaffVisible: function() {
      if (this.timeoutStaffVisible === true) {
        this.handleOnlyTimeoutStaff()
      }
    },
    overcrowdingStaffVisible: function() {
      if (this.overcrowdingStaffVisible === true) {
        this.handleOnlyOvercrowdingStaff()
      }
    },
    importantStaffVisible: function() {
      if (this.importantStaffVisible === true) {
        this.handleOnlyImportantStaff()
      }
    },
    limitStaffVisible: function() {
      if (this.limitStaffVisible === true) {
        this.handleOnlyLimitStaff()
      }
    },
    specialStaffVisible: function() {
      if (this.specialStaffVisible === true) {
        this.handleOnlySpecialJobStaff()
      }
    },
    leaderVisible: function() {
      if (this.leaderVisible === true) {
        this.handleOnlyLeader()
      }
    }
  },
  created() {
    this.handleResolve()
    this.handleFetchDownHoleData() // 获取井下总人数
  },
  methods: {
    handleResolve() {
      if (this.$route.params.tableType) {
        this.tableType = this.$route.params.tableType
      }
    },
    // 仅井下总人员可见
    handleOnlyTotalStaff() {
      this.totalStaffVisible = true
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = false
      this.limitStaffVisible = false
      this.specialStaffVisible = false
      this.leaderVisible = false
    },
    // 仅超时报警人员可见
    handleOnlyTimeoutStaff() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = true
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = false
      this.limitStaffVisible = false
      this.specialStaffVisible = false
      this.leaderVisible = false
    },
    // 仅超员报警人员可见
    handleOnlyOvercrowdingStaff() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = true
      this.importantStaffVisible = false
      this.limitStaffVisible = false
      this.specialStaffVisible = false
      this.leaderVisible = false
    },
    // 仅重点区域人员可见
    handleOnlyImportantStaff() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = true
      this.limitStaffVisible = false
      this.specialStaffVisible = false
      this.leaderVisible = false
    },
    // 仅限制区域人员可见
    handleOnlyLimitStaff() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = false
      this.limitStaffVisible = true
      this.specialStaffVisible = false
      this.leaderVisible = false
    },
    // 仅特种作业人员可见
    handleOnlySpecialJobStaff() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = false
      this.limitStaffVisible = false
      this.specialStaffVisible = true
      this.leaderVisible = false
    },
    // 仅领导人员可见
    handleOnlyLeader() {
      this.totalStaffVisible = false
      this.timeoutStaffVisible = false
      this.overcrowdingStaffVisible = false
      this.importantStaffVisible = false
      this.limitStaffVisible = false
      this.specialStaffVisible = false
      this.leaderVisible = true
    },
    // 根据类型获取不同类型的人数
    handlePrintTable(tableType) {
      switch (tableType) {
        case 1:
          this.totalStaffVisible = true
          this.handleFetchDownHoleData() // 获取井下总人数
          break
        case 2:
          this.timeoutStaffVisible = true
          this.handleFetchTimeOutData() // 获取超时报警人数
          break
        case 3:
          this.overcrowdingStaffVisible = true
          this.handleFetchOverCrowData() // 获取超员报警人数
          break
        case 4:
          this.importantStaffVisible = true
          this.handleFetchImportantArea() // 获取重点区域人数
          break
        case 5:
          this.limitStaffVisible = true
          this.handleFetchLimitArea() // 获取限制区域报警人数
          break
        case 6:
          this.specialStaffVisible = true
          this.handleFetchSpecialJobData() // 获取特种作业人员工作异常报警人数
          break
        case 7:
          this.leaderVisible = true
          this.handleFetchLeaderData() // 获取领导干部每月下井总数及时间
          break
      }
    },
    // 获取井下总人数
    handleFetchDownHoleData() {
      fetchDownHoleStaffData(this.pageQuery).then(resp => {
        if (resp.data.code === 200) {
          // console.log('井下总人数')
          // console.log(resp.data.data)
          this.pageQuery.total = resp.data.data.total
          this.staffInfoData = resp.data.data.list
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.pageQuery.total = 0
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取超时报警人数
    handleFetchTimeOutData() {
      // console.log(this.pageQuery)
      fetchTimeOutStaffData(this.pageQuery).then(resp => {
        if (resp.data.code === 200) {
          // console.log('超时报警人数')
          // console.log(resp.data.data)
          this.pageQuery.total = resp.data.data.total
          this.staffInfoData = resp.data.data.list
        } else if (resp.data.code === 111) {
          this.pageQuery.total = 0
          this.staffInfoData = []
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    handleFetchOverArea(query) {
      this.overQuery.startOverTime = query.startOverTime
      this.overQuery.endOverTime = query.endOverTime
      this.overQuery.areaName = query.areaName
      this.handleFetchOverCrowData()
    },
    // 获取超员报警人数
    handleFetchOverCrowData() {
      // console.log(this.overQuery)
      fetchOverCrowData(this.overQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.overQuery.total = resp.data.data.total
          this.staffInfoData = resp.data.data.list
          // console.log(this.overQuery)
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.pageQuery.total = 0
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取重点区域信息
    handleFetchImportantArea() {
      this.pageQuery.type = 1
      fetchWarningAreaStaffNum(this.pageQuery).then(resp => {
        if (resp.data.code === 200) {
          console.log(this.pageQuery)
          console.log('重点区域人员')
          console.log(resp.data.data)
          this.pageQuery.total = resp.data.data.total
          this.staffInfoData = resp.data.data.list
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.pageQuery.total = 0
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取限制区域信息
    handleFetchLimitArea() {
      this.pageQuery.type = 2
      fetchWarningAreaStaffNum(this.pageQuery).then(resp => {
        if (resp.data.code === 200) {
          console.log(this.pageQuery)
          console.log('限制区域人员')
          console.log(resp.data.data)
          this.pageQuery.total = resp.data.data.total
          this.staffInfoData = resp.data.data.list
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.pageQuery.total = 0
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取领导干部每月下井总数及时间
    handleFetchLeaderData(leaderQuery) {
      // console.log('获取领导干部')
      if (leaderQuery !== undefined) {
        this.pageQuery.staffName = leaderQuery.leaderName
        this.pageQuery.inore = leaderQuery.currentMonth
      }
      this.pageQuery.staffType = 1
      // console.log(this.pageQuery)
      fetchLeaderData(this.pageQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.staffInfoData = resp.data.data.list
          this.pageQuery.total = resp.data.data.total
          this.pageQuery.leaderSum = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.pageQuery.page = 1
          this.pageQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 获取特种作业人员信息
    handleFetchSpecialJobData() {
      // 获取全部定位异常数据
      fetchWorkAbnormal(this.workAbQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.staffInfoData = resp.data.data.list
          this.workAbQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.staffInfoData = []
          this.workAbQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 每页显示条数
    handleSizeChangePage(pageQuery) {
      this.pageQuery.limit = pageQuery.limit
      this.handlePrintTable(this.tableType)
    },
    // 更改页数
    handleCurrentChangePage(pageQuery) {
      this.pageQuery.page = pageQuery.page
      this.handlePrintTable(this.tableType)
    }
  }
}
</script>
