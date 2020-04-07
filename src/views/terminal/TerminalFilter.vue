<template>
  <el-row class="m_tableTopRow">
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="filter-container">
        <el-input v-model="terminalId" type="text" placeholder="终端ID" maxlength="8" clearable oninput ="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchTerminal" />
        <el-button type="primary" icon="el-icon-search" @click="handleSearchTerminal">查询</el-button>
        <el-button v-print="'#printTable'" type="success" icon="el-icon-printer">打印</el-button>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="m_tableTopRight">
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleCreateTerminal">新增</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleImportTerminal" >批量导入</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteTerminals">批量删除</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import eventVue from '@/api/eventVue'
import { selectDeleteTerminals } from '@/api/terminal'
export default {
  name: 'TerminalFilter',
  data() {
    return {
      terminalId: null,
      multipleSelection: []
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('transferSelection')
  },
  methods: {
    // 兄弟组件通信 批量删除终端
    handleCommit() {
      eventVue.$on('transferSelection', (multipleSelection) => {
        this.multipleSelection = multipleSelection
      })
    },
    // 按终端ID查找终端
    handleSearchTerminal() {
      eventVue.$emit('searchTerminal', this.terminalId)
    },
    // 新增终端
    handleCreateTerminal() {
      eventVue.$emit('createTerminal')
    },
    // 批量导入终端
    handleImportTerminal() {
      eventVue.$emit('importTerminal')
    },
    // 批量删除终端
    handleDeleteTerminals() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('您将永久删除终端, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.ids.push(this.multipleSelection[i].terminalId)
          }
          selectDeleteTerminals(this.ids).then(resp => {
            const result = resp.data
            if (result.code === 200) {
              this.$message({
                message: result.msg,
                type: 'success'
              })
            } else {
              this.$message({
                type: 'error',
                message: result.code + ': ' + result.msg
              })
            }
            eventVue.$emit('clearSelection') // 清空select所选项
            eventVue.$emit('fetchTerminal')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请先选择您要删除的终端',
          type: 'warning'
        })
      }
    }
  }
}
</script>

