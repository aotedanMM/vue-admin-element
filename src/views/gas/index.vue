<template>
  <div class="app-container">
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <div class="filter-container">
          <el-input
            v-model="listQuery.staffName"
            maxlength="5"
            clearable
            oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
            prefix-icon="el-icon-search"
            placeholder="员工姓名"
            @keyup.enter.native="handleFilter"/>
          <el-date-picker
            v-model="filterTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >查询</el-button>
          <el-button v-print="'#printTable'" class="filter-item" icon="el-icon-printer" type="success" >打印</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
        <!--图例-->
        <div class="m_legend2">
          <ul>
            <li><p class="m_warnGas1"/>一级警报</li>
            <li><p class="m_warnGas2"/>二级警报</li>
            <li><p class="m_warnGas3"/>三级警报</li>
            <li><p class="m_warnGas4"/>四级警报</li>
            <li><p class="m_warnGas5"/>五级警报</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <!--打印表格-->
    <div class="m_tableContent">
      <print-gas-table :list-data="listData"/>
      <el-table
        :data="listData"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="编号" >
          <template slot-scope="scope">
            <span>{{ scope.row.gaspositionid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名">
          <template slot-scope="scope">
            <span> {{ scope.row.staffname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="甲烷" >
          <template slot-scope="scope">
            <span v-if="scope.row.ch4unit === 0" class="normalGas">{{ scope.row.ch4 }}</span>
            <span v-if="scope.row.ch4unit === 1" class="warnGas1">{{ scope.row.ch4 }}</span>
            <span v-if="scope.row.ch4unit === 2" class="warnGas2">{{ scope.row.ch4 }}</span>
            <span v-if="scope.row.ch4unit === 3" class="warnGas3">{{ scope.row.ch4 }}</span>
            <span v-if="scope.row.ch4unit === 4" class="warnGas4">{{ scope.row.ch4 }}</span>
            <span v-if="scope.row.ch4unit === 5" class="warnGas5">{{ scope.row.ch4 }}</span>
          </template>
        </el-table-column >
        <el-table-column label="一氧化碳" >
          <template slot-scope="scope">
            <span v-if="scope.row.counit === 0" class="normalGas">{{ scope.row.co }}</span>
            <span v-if="scope.row.counit === 1" class="warnGas1">{{ scope.row.co }}</span>
            <span v-if="scope.row.counit === 2" class="warnGas2">{{ scope.row.co }}</span>
            <span v-if="scope.row.counit === 3" class="warnGas3">{{ scope.row.co }}</span>
            <span v-if="scope.row.counit === 4" class="warnGas4">{{ scope.row.co }}</span>
            <span v-if="scope.row.counit === 5" class="warnGas5">{{ scope.row.co }}</span>
          </template>
        </el-table-column>
        <el-table-column label="氧气" >
          <template slot-scope="scope">
            <span v-if="scope.row.o2unit === 0" class="normalGas">{{ scope.row.o2 }}</span>
            <span v-if="scope.row.o2unit === 1" class="warnGas1">{{ scope.row.o2 }}</span>
            <span v-if="scope.row.o2unit === 2" class="warnGas2">{{ scope.row.o2 }}</span>
            <span v-if="scope.row.o2unit === 3" class="warnGas3">{{ scope.row.o2 }}</span>
            <span v-if="scope.row.o2unit === 4" class="warnGas4">{{ scope.row.o2 }}</span>
            <span v-if="scope.row.o2unit === 5" class="warnGas5">{{ scope.row.o2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="温度" >
          <template slot-scope="scope">
            <span v-if="scope.row.temperatureunit === 0" class="normalGas">{{ scope.row.temperature }}</span>
            <span v-if="scope.row.temperatureunit === 1" class="warnGas1">{{ scope.row.temperature }}</span>
            <span v-if="scope.row.temperatureunit === 2" class="warnGas2">{{ scope.row.temperature }}</span>
            <span v-if="scope.row.temperatureunit === 3" class="warnGas3">{{ scope.row.temperature }}</span>
            <span v-if="scope.row.temperatureunit === 4" class="warnGas4">{{ scope.row.temperature }}</span>
            <span v-if="scope.row.temperatureunit === 5" class="warnGas5">{{ scope.row.temperature }}</span>
          </template>
        </el-table-column>
        <el-table-column label="湿度" >
          <template slot-scope="scope">
            <span v-if="scope.row.humidityunit === 0" class="normalGas">{{ scope.row.humidity }}</span>
            <span v-if="scope.row.humidityunit === 1" class="warnGas1">{{ scope.row.humidity }}</span>
            <span v-if="scope.row.humidityunit === 2" class="warnGas2">{{ scope.row.humidity }}</span>
            <span v-if="scope.row.humidityunit === 3" class="warnGas3">{{ scope.row.humidity }}</span>
            <span v-if="scope.row.humidityunit === 4" class="warnGas4">{{ scope.row.humidity }}</span>
            <span v-if="scope.row.humidityunit === 5" class="warnGas5">{{ scope.row.humidity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地点" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.temppositionname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain size="small" @click="handleCallStaff(scope.row)">呼叫</el-button>
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
        @size-change="handleSizeChangeGas"
        @current-change="handleCurrentChangeGas"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchGasData } from '@/api/gasMonitoring'
import PrintGasTable from './printGasTable'
export default {
  components: { PrintGasTable },
  data: function() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      filterTime: '',
      staffInfo: {},
      total: 0,
      listQuery: { gasFlag: 1, page: 1, limit: 20, total: null, staffName: '', startTime: '', endTime: '' },
      listData: []
    }
  },
  watch: {
    filterTime: function() {
      if (this.filterTime) {
        this.listQuery.startTime = this.filterTime[0]
        this.listQuery.endTime = this.filterTime[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
    }
  },
  created() {
    this.getList()
    this.$store.dispatch('handleSetWarnGasValueTo0')
    localStorage.setItem('warnGasValue', 0)
  },
  methods: {
    // 呼叫员工
    handleCallStaff(value) {
      this.staffInfo.staffId = value.staffid
      this.staffInfo.staffName = value.staffname
      this.staffInfo.deptName = value.groupName
      this.$store.dispatch('showVoiceDialog')
      this.$nextTick(() => {
        eventVue.$emit('updateChatList', this.staffInfo) // 更新聊天列表
        eventVue.$emit('phoneListToWindow', this.staffInfo) // 将数据传到聊天窗口
      })
    },
    // 获取气体数据
    getList() {
      console.log(this.listQuery)
      fetchGasData(this.listQuery).then(response => {
        const result = response.data
        const code = result.code
        console.log(result)
        if (code === 200) {
          if (result.data.list.length > 0) {
            this.listData = result.data.list
            this.listQuery.total = result.data.total
          } else {
            this.listData = []
            this.listQuery.total = result.data.total
          }
        } else if (code === 111) {
          this.listData = []
          this.listQuery.total = 0
        } else {
          this.listData = []
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
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 改变当前页面显示条数
    handleSizeChangeGas(val) {
      this.listQuery.limit = val
      this.getList()
    },
    // 改变当前页数
    handleCurrentChangeGas(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
