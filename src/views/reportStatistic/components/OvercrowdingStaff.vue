<template>
  <div class="m_tableContent">
    <print-over-staff-table :list-data="staffInfoData"/>
    <!--区域列表-->
    <div v-show="areaVisible">
      <div style="margin: 20px auto;">
        <p class="m_areaNum">超员报警人员 : {{ overQuery.total }} 人</p>
        <el-input v-model="areaQuery.areaName" clearable placeholder="请输入区域名称" style="width: 200px;margin-right: 10px"/>
        <el-date-picker
          v-model="selectTime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="primary" icon="el-icon-search" @click="handleSearchOverArea">查询</el-button>
      </div>
      <el-table :data="staffInfoData" border>
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.overmanAreaId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区域名称">
          <template slot-scope="scope">
            <span>{{ scope.row.warningAreaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可容纳人数">
          <template slot-scope="scope">
            <span>{{ scope.row.containNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大超员人数">
          <template slot-scope="scope">
            <span>{{ scope.row.maxOverman }}</span>
          </template>
        </el-table-column>
        <el-table-column label="超员开始时间">
          <template slot-scope="scope">
            <span v-if="scope.row.startOvertime === undefined "/>
            <span v-else> {{ scope.row.startOvertime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="超员结束时间">
          <template slot-scope="scope">
            <span v-if="scope.row.endOvertime === undefined "/>
            <span v-else> {{ scope.row.endOvertime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleFetchOverStaff(scope.row.overmanAreaId)">查看人员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="overQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="overQuery.startPage"
          :page-sizes="[20,30,50]"
          :page-size="overQuery.pageSize"
          :total= "overQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <!--人员列表-->
    <div v-show="staffVisible">
      <el-page-header style="margin-bottom: 20px" @back="goBack"/>
      <el-table :data="overStaffData" border>
        <el-table-column label="员工姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工类型">
          <template slot-scope="scope">
            <span v-if="scope.row.isPerson === 0">职工</span>
            <span v-if="scope.row.isPerson === 1">领导</span>
            <span v-if="scope.row.isPerson === 2">外来员工</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="overStaffQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="overStaffQuery.startPage"
          :page-sizes="[20,30,50]"
          :page-size="overStaffQuery.pageSize"
          :total= "overStaffQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeStaff"
          @current-change="handleCurrentChangeStaff"/>
      </div>
    </div>
  </div>
</template>
<script>
import PrintOverStaffTable from '../print/printOverStaffTable'
import { fetchOverAreaStaff } from '@/api/warningArea'
export default {
  name: 'OvercrowdingStaff',
  components: { PrintOverStaffTable },
  props: {
    staffInfoData: {
      required: true,
      type: Array
    },
    overQuery: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      overStaffQuery: { startPage: 1, pageSize: 20, overmanAreaId: null },
      areaVisible: true,
      staffVisible: false,
      areaQuery: {},
      selectTime: '',
      startOverTime: '',
      endOverTime: '',
      overStaffData: []
    }
  },
  watch: {
    selectTime() {
      if (!this.selectTime) {
        this.areaQuery.startOverTime = null
        this.areaQuery.endOverTime = null
      } else {
        this.areaQuery.startOverTime = this.selectTime[0]
        this.areaQuery.endOverTime = this.selectTime[1]
      }
    }
  },
  methods: {
    // 搜索
    handleSearchOverArea() {
      this.$emit('fetchOverArea', this.areaQuery)
    },
    // 查看人员
    handleFetchOverStaff(overmanAreaId) {
      this.areaVisible = false
      this.staffVisible = true
      this.overStaffQuery.overmanAreaId = overmanAreaId
      this.handleFetchOverAreaStaff()
    },
    // 更改页数
    handleCurrentChange(val) {
      this.pageQuery.startPage = val
      this.$emit('currentChange', this.pageQuery)
    },
    // 更改每页显示条数
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      this.$emit('sizeChange', this.pageQuery)
    },
    // 更改页数
    handleCurrentChangeStaff(val) {
      this.overStaffQuery.startPage = val
      this.handleFetchOverAreaStaff()
    },
    // 更改每页显示条数
    handleSizeChangeStaff(val) {
      this.overStaffQuery.pageSize = val
      this.handleFetchOverAreaStaff()
    },
    // 查看区域内人员信息
    handleFetchOverAreaStaff() {
      console.log(this.overStaffQuery)
      fetchOverAreaStaff(this.overStaffQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.overStaffData = resp.data.data.list
          this.overStaffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.overStaffData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 返回
    goBack() {
      this.staffVisible = false
      this.areaVisible = true
    }
  }
}
</script>
