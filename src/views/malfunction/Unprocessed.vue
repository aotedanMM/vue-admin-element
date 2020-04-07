<template>
  <!--未处理故障-->
  <div>
    <print-malfunction-table :list-data="malfunctionData"/>
    <el-row class="m_tableTopRow4">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" >
        <div class="filter-container">
          <el-form ref="validateTerminalId" :model="malfunctionQuery" :rules="filterRules" >
            <el-form-item prop="terminalId">
              <el-input
                v-model="malfunctionQuery.terminalId"
                prefix-icon="el-icon-search"
                maxlength="10"
                clearable
                class="filter-item"
                oninput ="value=value.replace(/[^\d]/g,'')"
                placeholder="终端编号"
                @keyup.enter.native="findByTerminalId"/>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="findByTerminalId">查询</el-button>
              <el-button v-print="'#printTable'" class="filter-item" icon="el-icon-printer" type="success">打印</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="m_tableTopRowRight">
        <!--图例标注-->
        <div class="m_malfunctionLegend">
          <i class="el-icon-error m_malfunction">故障</i>
          <i class="el-icon-success m_intact">正常</i>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="malfunctionData"
      border
      fit
      highlight-current-row
      class="m_malfunctionTable"
      width="100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="终端编号">
        <template slot-scope="scope">
          <span>{{ scope.row.terminalId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="wifi故障">
        <template slot-scope="scope">
          <span v-if="scope.row.wifiError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.wifiError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="声音故障">
        <template slot-scope="scope">
          <span v-if="scope.row.voiceError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.voiceError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="一氧化碳故障">
        <template slot-scope="scope">
          <span v-if="scope.row.coError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.coError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="二氧化碳故障">
        <template slot-scope="scope">
          <span v-if="scope.row.co2Error === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.co2Error === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="甲烷故障">
        <template slot-scope="scope">
          <span v-if="scope.row.ch4Error === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.ch4Error === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="氧气故障">
        <template slot-scope="scope">
          <span v-if="scope.row.o2Error === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.o2Error === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="温度故障">
        <template slot-scope="scope">
          <span v-if="scope.row.tError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.tError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="湿度故障">
        <template slot-scope="scope">
          <span v-if="scope.row.hError === 1"><i class="el-icon-error m_malfunction"/></span>
          <span v-if="scope.row.hError === 0"><i class="el-icon-success m_intact"/></span>
        </template>
      </el-table-column>
      <el-table-column label="自检时间">
        <template slot-scope="scope">
          <span>{{ scope.row.selfCheckTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="updateMalfunctionStatus(scope.row.selfCheckId)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="malfunctionQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="malfunctionQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="malfunctionQuery.limit"
        :total= "malfunctionQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeMalfunction"
        @current-change="handleCurrentChangeMalfunction"/>
    </div>
  </div>
</template>
<script>
import { getMalfunctionCount, fetchMalfunction, fetchListByTerminalId, updateStatus } from '@/api/malfunction'
import PrintMalfunctionTable from './printMalfunctionTable'
export default {
  name: 'Unprocessed',
  components: { PrintMalfunctionTable },
  data() {
    return {
      filterRules: {
        terminalId: [
          {
            trigger: 'blur', // 何事件触发
            pattern: /^\d{1,5}$/, // 正则
            message: '只允许插入长度不大于5的数字'
          }
        ]
      },
      malfunctionData: [],
      malfunctionQuery: { page: 1, limit: 20, total: null, status: 0, terminalId: null },
      multipleSelection: []
    }
  },
  created() {
    this.handleGetMalfunctionData()
  },
  methods: {
    // 获取故障数量
    getMalfunctionCounts() {
      getMalfunctionCount().then(resp => {
        const result = resp.data
        if (result.code === 200) {
          if (result.data === 0) {
            this.$store.state.malfunctionValue = null
          } else {
            this.$store.state.malfunctionValue = result.data
          }
        } else if (result.code !== 111) {
          this.$message({
            message: result.code + ':' + result.msg,
            type: 'warning'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 获取全部故障信息
    handleGetMalfunctionData() {
      fetchMalfunction(this.malfunctionQuery).then(response => {
        console.log(response)
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            this.malfunctionData = response.data.data.list
            this.malfunctionQuery.total = response.data.data.total
            // 未加属性问题
          } else {
            this.malfunctionData = response.data.data.list
            this.malfunctionQuery.total = response.data.data.total
            this.malfunctionData = []
          }
        } else if (response.data.code === 111) {
          this.malfunctionData = []
          this.malfunctionQuery.total = null
        } else {
          this.$message({
            message: response.data.code + ':' + response.data.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
      this.getMalfunctionCounts()
    },
    // 通过终端编号查找终端故障
    findByTerminalId() {
      this.$refs['validateTerminalId'].validate((valid) => {
        if (valid) {
          fetchListByTerminalId(this.malfunctionQuery).then(response => {
            if (response.data.code === 200) {
              this.malfunctionData = response.data.data.list
              this.malfunctionQuery.total = response.data.data.total
            } else if (response.data.code === 111) {
              this.malfunctionData = []
              this.malfunctionQuery.total = 0
            } else {
              this.$message({
                message: response.data.code + ':' + response.data.msg,
                type: 'error'
              })
            }
          }).catch(e => {
            this.$message({
              message: e,
              type: 'error'
            })
          })
        }
      })
    },
    // 点击处理更改终端故障状态
    updateMalfunctionStatus(selfCheckId) {
      updateStatus(selfCheckId).then(resp => {
        const result = resp.data
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
        this.handleGetMalfunctionData()
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 翻页(未处理)
    handleCurrentChangeMalfunction(val) {
      this.malfunctionQuery.page = val
      this.handleGetMalfunctionData()
    },
    // 改变每页显示条数(未处理)
    handleSizeChangeMalfunction(val) {
      this.malfunctionQuery.limit = val
      this.handleGetMalfunctionData()
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
