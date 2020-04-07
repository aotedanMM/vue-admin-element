<template>
  <div>
    <warn-area-filter/>
    <!--区域列表 -->
    <div class="m_warnAreaTable">
      <el-table :data="warningAreaData" border>
        <el-table-column label="区域ID">
          <template slot-scope="scope">
            <span> {{ scope.row.warningAreaId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区域名称">
          <template slot-scope="scope">
            <span> {{ scope.row.warningAreaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数">
          <template slot-scope="scope">
            <span> {{ scope.row.staffNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain @click="handleFetchWarningAreaStaff(scope.row.warningAreaId)">查看人员</el-button>
            <el-button type="danger" size="mini" plain @click="handleFetchWarningAreaHistory(scope.row.warningAreaId)">查看历史</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="warningAreaQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="warningAreaQuery.page"
        :page-size="warningAreaQuery.limit"
        :total= "warningAreaQuery.total"
        layout="total, prev, pager, next"
        @current-change="handleSizeChangeAreaData"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchWarningAreaData } from '@/api/warningArea'
import WarnAreaFilter from './WarnAreaFilter'

export default {
  name: 'WarnAreaList',
  components: { WarnAreaFilter },
  data() {
    return {
      warningAreaData: [],
      warningAreaQuery: { page: 1, total: 0, limit: 20 }
    }
  },
  created() {
    this.handleCommit()
    this.handleResetSearchPar()
  },
  beforeDestroy() {
    eventVue.$off('fetchWarnArea')
  },
  methods: {
    // 重置查询参数
    handleResetSearchPar() {
      this.warningAreaQuery = {
        page: 1,
        total: 0,
        limit: 20
      }
    },
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('fetchWarnArea', (areaId) => {
        this.warningAreaQuery.areaId = areaId
        this.handleFetchWarnAreaInfo()
      })
    },
    // 根据传入type的值不同,区分重点区域限制区域
    handleDistinguishArea(type) {
      this.handleResetSearchPar()
      this.type = type
      this.warningAreaQuery.type = type
      this.handleFetchWarnAreaInfo()
    },
    // 获取警告区域的区域列表
    handleFetchWarnAreaInfo() {
      fetchWarningAreaData(this.warningAreaQuery).then(resp => {
        if (resp.data.code === 200) {
          this.warningAreaData = resp.data.data.list
          this.warningAreaQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.warningAreaData = []
          this.warningAreaQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        eventVue.$emit('sendWarnAreaData', this.warningAreaData)
      }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 分页
    handleSizeChangeAreaData(val) {
      this.warningAreaQuery.page = val
      this.handleFetchWarnAreaInfo()
    },
    // 根据部门ID查看人员
    handleFetchWarningAreaStaff(areaId) {
      this.$emit('showWarnAreaStaff')
      eventVue.$emit('warnAreaStaff', areaId, this.type)
    },
    // 根据部门ID查看历史
    handleFetchWarningAreaHistory(areaId) {
      this.$emit('showWarnAreaHistory')
      eventVue.$emit('showWarningAreaHistory', areaId, this.type)
    }
  }
}
</script>
