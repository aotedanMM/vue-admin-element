<template>
  <div>
    <print-base-station-table :list-data="baseStationData"/>
    <div class="m_tableContent">
      <el-table
        ref="multipleTable"
        :data="baseStationData"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column label="基站编号" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.baseStationNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="基站名称" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.baseStationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Wifi名称" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.ssid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="基站IP" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.baseStationIp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属区域" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.zoneName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" width="80" >
          <template slot-scope="scope">
            <span>{{ scope.row.status === 1 ? '已使用':'未使用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="气体标准" min-width="80" >
          <template slot-scope="scope">
            <span>{{ scope.row.standardName === null ? '暂未绑定': scope.row.standardName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDateDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="50px">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">普通基站</span>
            <span v-if="scope.row.type === 1" class="m_wellheadStation" >井口基站</span>
            <span v-if="scope.row.type === 2" class="m_attendanceStation" >考勤基站</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleUpdateBaseStation(scope.row)">编辑</el-button>
            <el-button type="warning" plain size="mini" @click="handleDeployBaseStation(scope.row.baseStationId)">部署</el-button>
            <el-button type="danger" plain size="mini" @click="handleDeleteBaseStation(scope.row.baseStationId)">删除</el-button>
            <el-button type="success" plain size="mini" @click="handleDetailsBaseStation(scope.row)" >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="baseStationQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="baseStationQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="baseStationQuery.limit"
        :total= "baseStationQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeBaseStation"
        @current-change="handleCurrentChangeBaseStation"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { searchStationByQuery, deleteStation } from '@/api/station'
import PrintBaseStationTable from './printBaseStationTable'
export default {
  name: 'BaseStationTable',
  components: { PrintBaseStationTable },
  props: {},
  data() {
    return {
      getRowKeys(row) { return row.staffId },
      multipleSelection: [],
      baseStationData: [],
      baseStationQuery: { startTime: null, endTime: null, zoneId: '', areaId: '', total: null, limit: 20, page: 1 }
    }
  },
  created() {
    this.handleFetchBaseStationData() // 获取基站信息
    this.handelFetchBaseStation()// 兄弟组件通信获取基站信息
  },
  beforeDestroy() {
    eventVue.$off('fetchBaseStationData')
    eventVue.$off('searchBaseStationData')
    eventVue.$off('clearSelection')
  },
  methods: {
    // 兄弟组件通信获取基站信息
    handelFetchBaseStation() {
      // 获取基站信息
      eventVue.$on('fetchBaseStationData', () => {
        this.handleFetchBaseStationData()
      })
      // 查询基站信息
      eventVue.$on('searchBaseStationData', (baseStationQuery) => {
        this.baseStationQuery = baseStationQuery
        this.handleFetchBaseStationData()
      })
      // 清空选择行
      eventVue.$on('clearSelection', () => {
        this.$refs.multipleTable.clearSelection()
      })
    },
    // 获取基站信息
    handleFetchBaseStationData() {
      searchStationByQuery(this.baseStationQuery).then(resp => {
        console.log('获取基站信息')
        console.log(resp.data.data.list)
        if (resp.data.code === 200) {
          this.baseStationData = resp.data.data.list
          this.baseStationQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.baseStationData = []
          this.baseStationQuery.total = 0
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
    // 改变每页显示条数
    handleSizeChangeBaseStation(val) {
      this.baseStationQuery.limit = val
      this.handleFetchBaseStationData()
    },
    // 改变当前页数
    handleCurrentChangeBaseStation(val) {
      this.baseStationQuery.page = val
      this.handleFetchBaseStationData()
    },
    // 部署基站，跳转路由传参
    handleDeployBaseStation(baseStationId) {
      this.$router.push({
        path: '/monitor/map',
        name: 'Map',
        params: {
          baseStationId: baseStationId
        }
      })
    },
    // 编辑
    handleUpdateBaseStation(stationInfo) {
      eventVue.$emit('updateBaseStation', stationInfo)
    },
    // 删除
    handleDeleteBaseStation(row) {
      this.$confirm('您将永久删除该基站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStation(row).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: resp.data.code + ':' + resp.data.msg,
              type: 'error'
            })
          }
          this.handleFetchBaseStationData() // 获取基站信息
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 详情
    handleDetailsBaseStation(row) {
      eventVue.$emit('detailsBaseStation', row)
    },
    // 选择基站
    handleSelectionChange(val) {
      this.multipleSelection = val
      eventVue.$emit('multipleSelection', this.multipleSelection)
    }
  }
}
</script>

