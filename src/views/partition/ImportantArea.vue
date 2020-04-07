<template>
  <div>
    <div class="m_topFilter">
      <el-input
        v-model="importantQuery.name"
        clearable
        maxlength="15"
        placeholder="重点区域名称"
        oninput="value=value.replace(/[^A-Za-z0-9_\-\u4e00-\u9fa5\.]+/g,'')"
        @keyup.enter.native="handleFetchImportantArea"/>
      <el-button type="primary" icon="el-icon-search" @click="handleFetchImportantArea">查询</el-button>
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleCreateImportantArea">新增</el-button>
    </div>
    <el-table :data="importantAreaData" border>
      <el-table-column label="ID" width="100">
        <template slot-scope="scope">
          <span> {{ scope.row.warningAreaId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称">
        <template slot-scope="scope">
          <span> {{ scope.row.warningAreaName }}</span>
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
          <span> {{ scope.row.warningAreaDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px;">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdateImportantArea(scope.row)">编辑</el-button>
          <el-button type="warning" plain size="mini" @click="handleSetImportantArea(scope.row.warningAreaId)">设置</el-button>
          <el-button type="danger" plain size="mini" @click="handleDeleteImportantArea(scope.row.warningAreaId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="importantQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="importantQuery.page"
        :page-sizes="[20,30,50]"
        :page-size="importantQuery.limit"
        :total= "importantQuery.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeImpArea"
        @current-change="handleCurrentChangeImpArea"/>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchWarningAreaData, deleteWarningAreaData } from '@/api/warningArea'
export default {
  name: 'ImportantArea',
  data() {
    return {
      importantQuery: { name: '', limit: 20, total: null, page: 1, type: 1 },
      importantAreaData: []
    }
  },
  created() {
    this.handleFetchImportantAreaData() // 兄弟组件通信，获取重点区域信息
  },
  beforeDestroy() {
    eventVue.$off('fetchImportantArea')
  },
  methods: {
    // 兄弟组件通信，获取重点区域信息
    handleFetchImportantAreaData() {
      eventVue.$on('fetchImportantArea', () => {
        this.handleFetchImportantArea()
      })
    },
    // 获取重点区域
    handleFetchImportantArea() {
      fetchWarningAreaData(this.importantQuery).then(resp => {
        if (resp.data.code === 200) {
          this.importantAreaData = resp.data.data.list
          this.importantQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.importantAreaData = []
          this.importantQuery.total = 0
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
    // 新增重点区域
    handleCreateImportantArea() {
      eventVue.$emit('createImportantArea')
      this.$emit('openWarnAreaEdit')
    },
    // 编辑重点区域
    handleUpdateImportantArea(row) {
      eventVue.$emit('EditImportantArea', row)
      this.$emit('openWarnAreaEdit')
    },
    // 设置重点区域
    handleSetImportantArea(warningAreaId) {
      this.$router.push({
        path: '/partition/map/index',
        name: 'MapArea',
        params: {
          areaId: warningAreaId
        }
      })
    },
    // 删除重点区域
    handleDeleteImportantArea(warningAreaId) {
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
          this.handleFetchImportantArea()
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    // 改变当前页数
    handleCurrentChangeImpArea(val) {
      this.importantQuery.page = val
      this.handleFetchImportantArea()
    },
    // 每页显示条数
    handleSizeChangeImpArea(val) {
      this.importantQuery.limit = val
      this.handleFetchImportantArea()
    }

  }
}
</script>
