<template>
  <!--搜索-->
  <div>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="m_filterBtnGroup">
          <!--员工姓名查询-->
          <el-input
            v-model="staffInfoQuery.staffName"
            prefix-icon="el-icon-search"
            maxlength="5"
            clearable
            oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
            class="filter-item"
            placeholder="员工姓名"
            style="width: 150px"
            @keyup.enter.native="StaffSearch"/>
          <!--部门选择-->
          <organization-select
            :org-id="orgId"
            @receiveOrgId="handleReceiveOrgId"
          />
          <!--人员分类查询-->
          <el-select v-model="staffInfoQuery.isPerson" clearable placeholder="请选择人员分类" >
            <el-option
              v-for="item in isPersonData"
              :value="item.id"
              :label="item.name"
              :key="item.id"/>
          </el-select>
          <!--工种查询-->
          <el-select v-model="staffInfoQuery.staffJobId" clearable placeholder="请选择工种">
            <el-option
              v-for="item in staffJobData"
              :label="item.jobName"
              :key="item.jobId"
              :value="item.jobId"
            />
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="StaffSearch">查询</el-button>
          <el-button v-print="'#printTable'" icon="el-icon-printer" type="success" >打印</el-button>
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="staffCreate">新增</el-button>
          <el-button type="warning" icon="addStandardIcon" @click="bindingStandard">关联考勤标准</el-button>
          <el-button type="success" icon="addAttendanceIcon" @click="handleAllocationBaseStationStaffs">分配考勤基站</el-button>
          <el-button type="primary" icon="el-icon-download" @click="handleUpload">批量导入</el-button>
          <el-button type="primary" icon="el-icon-upload2" @click="handleDownload">批量导出</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="DeleteStaffs">批量删除</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import OrganizationSelect from '@/components/OrganizationSelect/index'
import { deleteStaff } from '@/api/infor'
import { getStaffJobs } from '@/api/infor'

export default {
  name: 'StaffInfoFilter',
  components: { OrganizationSelect },
  props: {

  },
  data() {
    return {
      staffJobData: [],
      isPersonData: [
        { id: 0, name: '职工' },
        { id: 1, name: '领导' },
        { id: 2, name: '外来人员' },
        { id: 3, name: '车辆' }
      ],
      orgId: null,
      staffIds: [],
      staffInfoQuery: { page: 1, limit: 20, staffName: '', total: null, staffJobId: null, isPerson: null },
      multipleSelection: []
    }
  },
  created() {
    this.handleFetchData() // 兄弟组件通信 获取数据
    this.getAllStaffJobs() // 获取员工工种
  },
  beforeDestroy() {
    eventVue.$off('multipleSelection')
    eventVue.$off('deleteStaff')
  },
  methods: {
    // 兄弟组件通信 获取数据
    handleFetchData() {
      // 选中行数据传递
      eventVue.$on('multipleSelection', (multipleSelection) => {
        this.multipleSelection = multipleSelection
      })
      // 删除人员
      eventVue.$on('deleteStaff', staffId => {
        this.staffIds = staffId
        this.handleDeleteStaffData()
      })
    },
    // 根据姓名查找人员
    StaffSearch() {
      eventVue.$emit('fetchStaffInfo', this.staffInfoQuery)
    },
    // 接收子组件传递的部门ID
    handleReceiveOrgId(orgId) {
      this.staffInfoQuery.orgId = orgId
    },
    // 批量导入
    handleUpload() {
      eventVue.$emit('batchImport')
    },
    // 批量导出
    handleDownload() {
      if (this.multipleSelection.length > 0) {
        eventVue.$emit('batchExport', this.multipleSelection)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择您要导出的员工'
        })
      }
    },
    // 分配打卡基站
    handleAllocationBaseStationStaffs() {
      if (this.multipleSelection.length > 0) {
        eventVue.$emit('bindAttendanceBaseStation', this.multipleSelection)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择您要分配考勤基站的员工'
        })
      }
    },
    // 关联考勤标准
    bindingStandard() {
      if (this.multipleSelection.length > 0) {
        eventVue.$emit('bindTimeStandard', this.multipleSelection)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择您要关联考勤标准的员工'
        })
      }
    },
    // 新增人员
    staffCreate() {
      eventVue.$emit('createStaff')
    },
    // 获取员工工作
    getAllStaffJobs() {
      getStaffJobs().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.staffJobData = res.data
          } else if (res.code === 111) {
            this.staffJobData = []
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    },
    // 批量删除人员
    DeleteStaffs() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('您将永久删除所选人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.staffIds = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.staffIds.push(this.multipleSelection[i].staffId)
          }
          this.handleDeleteStaffData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请选择您要删除的人员',
          type: 'warning'
        })
      }
    },
    // 删除人员操作
    handleDeleteStaffData() {
      deleteStaff(this.staffIds).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'warning'
          })
        }
        eventVue.$emit('fetchStaffInfo', '')
      })
    }
  }
}
</script>
