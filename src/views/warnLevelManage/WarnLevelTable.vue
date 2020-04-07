<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleCreateWarnLevel">新增</el-button>
    </div>
    <el-table
      :data="warnLevelData"
      border>
      <el-table-column label="ID" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="警报等级名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleUpdateWarnLevel(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleDeleteWarnLevel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchWarnLevel } from '@/api/warnlevel'
export default {
  name: 'WarnLevelTable',
  data() {
    return {
      warnLevelData: [],
      isCheckPassword: false
    }
  },
  created() {
    this.handleFetchWarnLevel() // 获取所有警报等级信息
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('fetchWarnLevel')
  },
  methods: {
    handleCommit() {
      eventVue.$on('fetchWarnLevel', () => {
        this.handleFetchWarnLevel()
      })
    },
    // 新增
    handleCreateWarnLevel() {
      eventVue.$emit('createWarnLevel')
    },
    // 编辑
    handleUpdateWarnLevel(row) {
      eventVue.$emit('updateWarnLevel', row)
    },
    // 获取所有警报等级信息
    handleFetchWarnLevel() {
      fetchWarnLevel().then(resp => {
        if (resp.data.code === 200) {
          this.warnLevelData = resp.data.data
        } else if (resp.data.code === 111) {
          this.warnLevelData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    handleDeleteWarnLevel(row) {
      eventVue.$emit('deleteWarnLevel', row)
    }
  }
}
</script>
