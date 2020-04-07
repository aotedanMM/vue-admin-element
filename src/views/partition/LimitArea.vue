<template>
  <div>
    <div class="m_topFilter">
      <el-input
        v-model="limitQuery.name"
        clearable
        oninput="value=value.replace(/[^A-Za-z0-9_\-\u4e00-\u9fa5\.]+/g,'')"
        maxlength="15"
        placeholder="限制区域名称"
        @keyup.enter.native="handleFetchLimitArea"/>
      <el-button type="primary" icon="el-icon-search" @click="handleFetchLimitArea">查询</el-button>
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleCreateLimitArea">新增</el-button>
    </div>
    <el-table :data="limitAreaData" border>
      <el-table-column label="ID" width="100">
        <template slot-scope="scope">
          <span> {{ scope.row.warningAreaId }} </span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称">
        <template slot-scope="scope">
          <span> {{ scope.row.warningAreaName }} </span>
        </template>
      </el-table-column>
      <el-table-column label="滞留时间(分钟)">
        <template slot-scope="scope">
          <span> {{ scope.row.residenceTime }} </span>
        </template>
      </el-table-column>
      <el-table-column label="容纳人数">
        <template slot-scope="scope">
          <span> {{ scope.row.containNumber }} </span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.counter === true">已设置</span>
          <span v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span> {{ scope.row.warningAreaDesc }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px;">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdateLimitArea(scope.row)">编辑</el-button>
          <el-button type="warning" plain size="mini" @click="handleSetLimitArea(scope.row.warningAreaId)">设置</el-button>
          <el-button type="danger" plain size="mini" @click="handleDeleteLimitArea(scope.row.warningAreaId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="limitQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="limitQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="limitQuery.limit"
        :total= "limitQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeLimitArea"
        @current-change="handleCurrentChangeLimitArea"/>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchWarningAreaData, deleteWarningAreaData } from '@/api/warningArea'
export default {
  name: 'LimitArea',
  data() {
    return {
      limitAreaData: [],
      limitQuery: { name: '', limit: 20, total: null, page: 1, type: 2 }
    }
  },
  created() {
    this.handleFetchLimitAreaData()
  },
  beforeDestroy() {
    eventVue.$off('fetchLimitArea')
  },
  methods: {
    // 兄弟组件通信，获取重点区域信息
    handleFetchLimitAreaData() {
      eventVue.$on('fetchLimitArea', () => {
        this.handleFetchLimitArea()
      })
    },
    // 新增限制区域
    handleCreateLimitArea() {
      eventVue.$emit('createLimitArea')
      this.$emit('openWarnAreaEdit')
    },
    // 编辑限制区域
    handleUpdateLimitArea(row) {
      eventVue.$emit('EditLimitArea', row)
      this.$emit('openWarnAreaEdit')
    },
    // 获取限制区域
    handleFetchLimitArea() {
      fetchWarningAreaData(this.limitQuery).then(resp => {
        if (resp.data.code === 200) {
          this.limitAreaData = resp.data.data.list
          this.limitQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.limitAreaData = []
          this.limitQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    },
    // 设置限制区域（地图打点）
    handleSetLimitArea(warningAreaId) {
      this.$router.push({
        path: '/partition/map/index',
        name: 'MapArea',
        params: {
          areaId: warningAreaId
        }
      })
    },
    // 删除限制区域
    handleDeleteLimitArea(warningAreaId) {
      this.$confirm('您将永久删除该区域，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWarningAreaData(warningAreaId).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              type: 'success',
              message: resp.data.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: resp.data.code + ':' + resp.data.msg
            })
          }
          this.handleFetchLimitArea()
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    // 改变当前页数
    handleCurrentChangeLimitArea(val) {
      this.limitQuery.page = val
      this.handleFetchLimitArea()
    },
    // 每页显示条数
    handleSizeChangeLimitArea(val) {
      this.limitQuery.limit = val
      this.handleFetchLimitArea()
    }
  }
}
</script>
