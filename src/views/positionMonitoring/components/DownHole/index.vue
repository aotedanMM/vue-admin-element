<template>
  <!--弹窗 —— 井下人数-->
  <div class="m_downHole">
    <el-dialog :visible.sync="downHoleVisible" :title="textMap[dialogStatus]" :before-close="closeDownHoleDialog" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <!--搜索一-->
      <div v-if="searchVisible" class="downHoleDialogTop">
        <el-page-header v-show="goBackVisible" style="float: left;line-height: 50px !important;" @back="handleOnlyDeptVisible" />
        <!--部门选择-->
        <organization-select
          :org-id="deptQuery.deptId"
          @receiveOrgId="handleReceiveOrgId"
        />
        <el-input v-model="deptQuery.staffName" maxlength="5" oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')" prefix-icon="el-icon-search" clearable class="filter-item" placeholder="请输入员工姓名" @keyup.enter.native="handleSearchDownHoleStaffData"/>
        <!--<el-button v-show="goBackVisible" type="primary" plain class="m_floatRightBtn" icon="el-icon-back" @click="handleOnlyDeptVisible">返回</el-button>-->
        <el-button class="filter-item" icon="el-icon-search" type="primary" @click="handleSearchDownHoleStaffData">查询</el-button>
      </div>
      <!--搜索二-->
      <div v-if="searchVisible2" class="downHoleDialogTop">
        <el-page-header v-show="goBackVisible2" style="float: left;line-height: 50px !important;" @back="handleOnlyStaffVisible" />
        <el-date-picker
          v-model="trackTime"
          :picker-options="pickerOptions"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"/>
        <el-button type="primary" icon="el-icon-search" @click="fetchDownHoleStaffTrackData">查询</el-button>
        <!--<el-button v-show="goBackVisible2" type="primary" plain class="m_floatRightBtn" icon="el-icon-back" @click="handleOnlyStaffVisible">返回</el-button>-->
        <el-button type="danger" plain class="m_floatRightBtn" @click="handleShowHistoryTrack()">查看历史轨迹</el-button>
      </div>
      <!--部门信息-->
      <down-hole-dept
        v-if="downHoleDeptVisible"
        ref="downHoleDeptRefs"
        :down-hole-dept-data="downHoleDeptData"
        :dept-query="deptQuery"
        @showDownHoleStaff="handleFetchDownHoleStaffData"/>
      <!--人员信息-->
      <down-hole-staff
        v-if="downHoleStaffVisible"
        ref="downHoleStaffRefs"
        :down-hole-staff-data="downHoleStaffData"
        :staff-query="staffQuery"
        @showDownHoleTrack="handleFetchDownHoleTrack"
        @sizeChangeDownHoleStaff="handleSizeChangeDownHoleStaff"
      />
      <!--轨迹列表-->
      <down-hole-track
        v-if="downHoleTrackVisible"
        ref="downHoleTrackRefs"
        :down-hole-track-data="downHoleTrackData"
        :track-query="trackQuery"
        :staff-name="staffName"
        @sizeChangeDownHoleTrack = "handleSizeChangeDownHoleTrack"/>
    </el-dialog>
  </div>
</template>
<script>
import DownHoleDept from './DownHoleDept'
import DownHoleStaff from './DownHoleStaff'
import DownHoleTrack from './DownHoleTrack'
import eventVue from '@/api/eventVue'
import { getOrgInfo } from '@/api/organization'
import { fetchTotalData, fetchTimeOutData, fetchSevereTimeOutData, fetchAbsenceData } from '@/api/downHole'
import { fetchDownHoleStaffData, fetchTimeOutStaffData, fetchSevereTimeOutStaffData, fetchAbsenceStaffData } from '@/api/downHole'
import { fectchDownHoleStaffTrack } from '@/api/downHole'
import OrganizationSelect from '@/components/OrganizationSelect/index'
export default {
  name: 'DownHole',
  components: {
    OrganizationSelect,
    DownHoleDept,
    DownHoleStaff,
    DownHoleTrack
  },
  props: {
    downHoleVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      deptId: null,
      trackTime: null,
      goBackVisible: false,
      goBackVisible2: false,
      staffId: null,
      searchVisible: true,
      searchVisible2: false,
      trackQuery: { staffId: null, trackStartTime: '', trackEndTime: '', limit: 11, total: 0, page: 1 },
      staffQuery: { total: 0, limit: 10, page: 1 },
      deptQuery: { total: 0, limit: 10, page: 1 },
      downHoleDeptData: [],
      downHoleStaffData: [],
      downHoleTrackData: [],
      dialogStatus: '',
      textMap: {
        total: '井下总人员',
        timeOut: '超时未上井人员',
        severeTimeOut: '严重超时人员',
        absence: '缺勤人员'
      },
      downHoleDeptVisible: true,
      downHoleStaffVisible: false,
      downHoleTrackVisible: false,
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      loadStaffOrganization: []
    }
  },
  watch: {
    // 时间查询
    trackTime: function() {
      if (this.trackTime === null) {
        this.trackQuery.trackStartTime = null
        this.trackQuery.trackEndTime = null
      } else {
        this.trackQuery.trackStartTime = this.trackTime[0]
        this.trackQuery.trackEndTime = this.trackTime[1]
      }
    },
    // 监听部门页面的显示
    downHoleDeptVisible: function() {
      if (this.downHoleDeptVisible === true) {
        this.searchVisible = true
        this.searchVisible2 = false
        this.goBackVisible = false
        this.goBackVisible2 = false
        this.trackTime = null
      }
    },
    // 监听人员页面的显示
    downHoleStaffVisible: function() {
      if (this.downHoleStaffVisible === true) {
        this.searchVisible = true
        this.searchVisible2 = false
        this.goBackVisible = true
        this.goBackVisible2 = false
        this.trackTime = null
      }
    },
    // 监听历史轨迹页面的显示
    downHoleTrackVisible: function() {
      if (this.downHoleTrackVisible === true) {
        this.searchVisible = false
        this.searchVisible2 = true
        this.goBackVisible = false
        this.goBackVisible2 = true
      }
    }
  },
  created() {
    this.getStaffOrganization() // 获取组织结构
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('handleFetchDownHoleInfo')
  },
  methods: {
    handleCommit() {
      eventVue.$on('handleFetchDownHoleInfo', (value) => {
        this.downHoleDeptData = [] // 清空部门列表
        this.deptQuery = {} // 清空查询条件
        this.trackTime = null // 清空时间查询条件
        this.handleOnlyDeptVisible() // 仅部门可见
        this.handleFetchDownHoleInfoData(value)
      })
    },
    // 关闭弹窗
    closeDownHoleDialog() {
      this.$emit('closeDownHoleDialog')
    },
    // 仅部门信息可见
    handleOnlyDeptVisible() {
      this.downHoleDeptVisible = true
      this.downHoleStaffVisible = false
      this.downHoleTrackVisible = false
    },
    // 仅人员信息可见
    handleOnlyStaffVisible() {
      this.downHoleStaffVisible = true
      this.downHoleDeptVisible = false
      this.downHoleTrackVisible = false
    },
    // 仅历史轨迹可见
    handleOnlyTrackVisible() {
      this.downHoleTrackVisible = true
      this.downHoleDeptVisible = false
      this.downHoleStaffVisible = false
    },
    // ------------------ 部门信息 ------------------ //
    // 获取井下人数信息
    handleFetchDownHoleInfoData(value) {
      switch (value) {
        case 1:
          this.downHoleType = 1
          this.dialogStatus = 'total'
          this.handleFetchTotalDeptData() // 井下总人员-部门信息
          break
        case 2:
          this.dialogStatus = 'timeOut'
          this.downHoleType = 2
          this.handleFetchTimeOutDeptData() // 超时未上井-部门信息
          break
        case 3:
          this.dialogStatus = 'severeTimeOut'
          this.downHoleType = 3
          this.handleFetchSevereTimeOutDeptData() // 严重超时未上井-部门信息
          break
        case 4:
          this.dialogStatus = 'absence'
          this.downHoleType = 4
          this.handleFetchAbsenceDeptData() // 缺勤-部门信息
          break
      }
    },
    // 井下总人员-部门信息
    handleFetchTotalDeptData() {
      fetchTotalData().then(resp => {
        if (resp.data.code === 200) {
          this.downHoleDeptData = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleDeptData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 超时未上井-部门信息
    handleFetchTimeOutDeptData() {
      fetchTimeOutData().then(resp => {
        if (resp.data.code === 200) {
          this.downHoleDeptData = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleDeptData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 严重超时未上井-部门信息
    handleFetchSevereTimeOutDeptData() {
      fetchSevereTimeOutData().then(resp => {
        if (resp.data.code === 200) {
          this.downHoleDeptData = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleDeptData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 缺勤-部门信息
    handleFetchAbsenceDeptData() {
      fetchAbsenceData().then(resp => {
        if (resp.data.code === 200) {
          this.downHoleDeptData = resp.data.data
        } else if (resp.data.code === 111) {
          this.downHoleDeptData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // ------------------ 人员信息 ------------------ //
    // 根据部门ID获取井下人员信息
    // 获取全部人员信息 & 多条件查询人员信息
    handleFetchDownHoleStaffData(deptQuery) {
      this.deptQuery = deptQuery
      this.deptId = deptQuery.deptId
      this.handleOnlyStaffVisible() // 仅员工信息可见
      switch (this.downHoleType) {
        case 1:
          this.handleFetchTotalStaffData()
          break
        case 2:
          this.handleFetchTimeOutStaffData()
          break
        case 3:
          this.handleFetchSevereTimeOutStaffData()
          break
        case 4:
          this.handleFetchAbsenceStaffData()
          break
      }
    },
    handleSearchDownHoleStaffData() {
      this.handleOnlyStaffVisible() // 仅员工信息可见
      switch (this.downHoleType) {
        case 1:
          this.handleFetchTotalStaffData()
          break
        case 2:
          this.handleFetchTimeOutStaffData()
          break
        case 3:
          this.handleFetchSevereTimeOutStaffData()
          break
        case 4:
          this.handleFetchAbsenceStaffData()
          break
      }
    },
    // 获取井下总人数-员工信息
    handleFetchTotalStaffData() {
      console.log(this.deptQuery)
      fetchDownHoleStaffData(this.deptQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.downHoleStaffData = resp.data.data.list
          this.staffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取超时未上井人数-员工信息
    handleFetchTimeOutStaffData() {
      fetchTimeOutStaffData(this.deptQuery).then(resp => {
        if (resp.data.code === 200) {
          this.downHoleStaffData = resp.data.data.list
          this.staffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取严重超时人数-员工信息
    handleFetchSevereTimeOutStaffData() {
      fetchSevereTimeOutStaffData(this.deptQuery).then(resp => {
        if (resp.data.code === 200) {
          this.downHoleStaffData = resp.data.data.list
          this.staffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取缺勤人数-员工信息
    handleFetchAbsenceStaffData() {
      fetchAbsenceStaffData(this.deptQuery).then(resp => {
        if (resp.data.code === 200) {
          this.downHoleStaffData = resp.data.data.list
          this.staffQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
          this.downHoleStaffData = []
          this.staffQuery.total = 0
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // ------------------ 轨迹信息 ------------------ //
    // 查看员工井下轨迹
    handleFetchDownHoleTrack(staffData) {
      this.trackQuery.staffId = staffData.staffId
      this.staffName = staffData.staffName
      this.handleOnlyTrackVisible() // 仅历史轨迹可见
      this.fetchDownHoleStaffTrackData()
    },
    // 获取员工井下轨迹
    fetchDownHoleStaffTrackData() {
      console.log('获取员工井下轨迹')
      console.log(this.trackQuery)
      fectchDownHoleStaffTrack(this.trackQuery).then(resp => {
        console.log(resp.data.data)
        if (resp.data.code === 200) {
          this.downHoleTrackData = resp.data.data.list
          this.trackQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.downHoleTrackData = []
          this.trackQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
          this.downHoleTrackData = []
        }
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 路由跳转
    handleShowHistoryTrack() {
      this.common.toggleBody(0)
      this.$router.push({
        path: 'history/personTrack',
        name: 'PersonTrack',
        params: {
          staffId: this.trackQuery.staffId,
          staffName: this.staffName
        }
      })
    },
    // 井下人员列表页面 改变当前页数
    handleSizeChangeDownHoleStaff(staffQuery) {
      this.staffQuery = staffQuery
      this.staffQuery.deptId = this.deptId
      this.deptQuery = this.staffQuery
      this.handleSearchDownHoleStaffData()
    },
    // 员工轨迹页面 改变当前页数
    handleSizeChangeDownHoleTrack(trackQuery) {
      this.trackQuery = trackQuery
      this.fetchDownHoleStaffTrackData()
    },
    // ------------------ 部门信息 ------------------ //

    //  搜索处获取部门信息
    handleReceiveOrgId(orgId) {
      this.deptQuery.deptId = orgId
      console.log(this.deptQuery.deptId)
    },

    // 搜索处获取部门信息
    setOrgId(event) {
      console.log(event)
      this.deptQuery.deptId = event[event.length - 1]
      console.log(this.deptQuery.deptId)
    },
    getStaffOrganization() {
      getOrgInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.removeEmptyChildren(res.data[0])
            this.loadStaffOrganization = res.data
          } else {
            this.loadStaffOrganization = null
          }
        }
      )
    },
    removeEmptyChildren(loadPartition) {
      const children = loadPartition.children
      if (children != null && children.length > 0) {
        for (const i in children) {
          this.removeEmptyChildren(children[i])
        }
      } else {
        delete loadPartition.children
      }
      return loadPartition
    }
  }
}
</script>
