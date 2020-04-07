<template>
  <div class="app-container">
    <print-offline-table :list-data="listData"/>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <el-input v-model="listQuery.stationId" oninput ="value=value.replace(/[^\d]/g,'')" clearable maxlength="15" prefix-icon="el-icon-search" placeholder="基站编号" @keyup.enter.native="handleFilter"/>
        <el-date-picker
          v-model="offlineTime"
          :picker-options="pickerOptions"
          type="daterange"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          align="center"/>
        <!--区域筛选-->
        <area-select
          :partition-id="partitionId"
          @returnPartitionId="handleReturnPartitionId"
        />
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button v-print="'#printTable'" icon="el-icon-printer" class="filter-item" type="success" >打印</el-button>
      </el-col>
    </el-row>
    <div class="m_tableContent">
      <el-table
        :data="listData"
        border
      >
        <el-table-column label="编号" fixed>
          <template slot-scope="scope">
            <span>{{ scope.row.baseStationId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="基站名称" fixed width="350px">
          <template slot-scope="scope">
            <span> {{ scope.row.baseStationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在区域" >
          <template slot-scope="scope">
            <span>{{ scope.row.partitionName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="掉线时间">
          <template slot-scope="scope">
            <span>{{ scope.row.offlineTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="removeOfflineStation(scope.row.baseStationId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="listQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="listQuery.limit"
        :total= "listQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>
<script>
import { getOfflineStation, removeOfflineStations } from '@/api/station'
import PrintOfflineTable from './printOfflineTable'
export default {
  name: 'OfflineStation',
  components: { PrintOfflineTable },
  data: function() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      formParams: { stationId: null },
      offlineTime: null,
      partitionId: null,
      listQuery: { total: null, page: 1, limit: 20, offlineTimeStart: null, offlineTimeEnd: null, stationId: null, partitionId: null },
      listData: []
    }
  },
  watch: {
    offlineTime: function() {
      if (this.offlineTime === null) {
        this.listQuery.offlineTimeStart = null
        this.listQuery.offlineTimeEnd = null
      } else {
        this.listQuery.offlineTimeStart = this.offlineTime[0]
        this.listQuery.offlineTimeEnd = this.offlineTime[1]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 区域ID
    handleReturnPartitionId(partitionId) {
      this.listQuery.partitionId = partitionId
    },
    // 删除基站掉线
    removeOfflineStation(stationId) {
      this.formParams.stationId = stationId
      removeOfflineStations(this.formParams).then(
        response => {
          const result = response.data
          if (result.code === 200) {
            this.$message({
              message: result.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: result.code + ':' + result.msg,
              type: 'warning'
            })
          }
          this.getList()
        }
      ).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取基站掉线
    getList() {
      getOfflineStation(this.listQuery).then(response => {
        const result = response.data
        const code = result.code
        if (code === 200) {
          this.listData = result.data.list
          this.listQuery.total = result.data.total
        } else if (code === 111) {
          this.listData = []
          this.listQuery.total = null
        } else {
          this.$message({
            message: result.code + ':' + result.msg,
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

