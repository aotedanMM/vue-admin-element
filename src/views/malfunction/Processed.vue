<template>
  <!--已处理故障-->
  <div>
    <print-un-malfunction-table :list-data="disposalData"/>
    <el-row class="m_tableTopRow4">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" >
        <div class="filter-container">
          <el-form ref="validateTerminalId1" :model="disposalQuery" :rules="filterRules">
            <el-form-item prop="terminalId" >
              <el-input v-model="disposalQuery.terminalId" oninput ="value=value.replace(/[^\d]/g,'')" clearable maxlength="10" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" placeholder="终端编号" @keyup.enter.native="findDisposalByTerminalId"/>
              <el-button type="primary" icon="el-icon-search" @click="findDisposalByTerminalId">查询</el-button>
              <el-button v-print="'#printTable2'" class="filter-item" icon="el-icon-printer" type="success" >打印</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="danger" icon="el-icon-delete" @click="deleteDisposals">批量删除</el-button>
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
      :data="disposalData"
      class="m_malfunctionTable"
      border
      fit
      highlight-current-row
      width="100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
      />
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
          <el-button type="danger" size="mini" plain @click="deleteDisposal(scope.row.selfCheckId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="disposalQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="disposalQuery.page"
        :page-sizes="[20, 30, 50]"
        :page-size="disposalQuery.limit"
        :total="disposalQuery.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeDisposal"
        @current-change="handleCurrentChangeDisposal"/>
    </div>
  </div>
</template>
<script>
import { fetchMalfunctionByStatusIsRead, fetchListByTerminalId, deleteMalfunctions } from '@/api/malfunction'
import PrintMalfunctionTable from './printMalfunctionTable'
import PrintUnMalfunctionTable from './printUnMalfunctionTable'
export default {
  name: 'Processed',
  components: { PrintUnMalfunctionTable, PrintMalfunctionTable },
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
      ids: [],
      malfunctionData: [],
      disposalData: [],
      disposalQuery: { total: null, page: 1, limit: 20, status: 1, terminalId: null },
      multipleSelection: []
    }
  },
  created() {
    this.getDisposalList()
  },
  methods: {
    // 获取全部已处置故障信息
    getDisposalList() {
      fetchMalfunctionByStatusIsRead(this.disposalQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            this.disposalData = response.data.data.list
            this.disposalQuery.total = response.data.data.total
          } else {
            this.disposalData = []
            this.disposalQuery.total = response.data.data.total
          }
        } else if (response.data.code === 111) {
          this.disposalData = []
          this.disposalQuery.total = 0
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
    },
    // 改变当前页数(已处理)
    handleCurrentChangeDisposal(val) {
      this.disposalQuery.page = val
      this.getDisposalList()
    },
    // 改变每页显示条数(已处理)
    handleSizeChangeDisposal(val) {
      this.disposalQuery.limit = val
      this.getDisposalList()
    },
    // 通过终端编号查找终端故障
    findDisposalByTerminalId() {
      this.$refs['validateTerminalId1'].validate((valid) => {
        if (valid) {
          fetchListByTerminalId(this.disposalQuery).then(response => {
            if (response.data.code === 200) {
              this.disposalData = response.data.data.list
              this.disposalQuery.total = response.data.data.total
            } else if (response.data.code === 111) {
              this.disposalData = []
              this.disposalQuery.total = 0
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
    // 删除单个终端故障信息
    deleteDisposal(row) {
      this.$confirm('您将永久删除该故障信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMalfunctions(row).then(response => {
          if (response.data.code === 200) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data.code + ':' + response.data.msg
            })
          }
          this.getDisposalList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除终端故障信息
    deleteDisposals() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('您将永久删除所选故障信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ids = []
          for (const m of this.multipleSelection) {
            this.ids.push(m.selfCheckId)
          }
          deleteMalfunctions(this.ids).then(response => {
            if (response.data.code === 200) {
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: response.data.code + ':' + response.data.msg,
                type: 'warning'
              })
            }
            this.getDisposalList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请选择您要删除的故障信息',
          type: 'warning'
        })
      }
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    }

  }
}
</script>

