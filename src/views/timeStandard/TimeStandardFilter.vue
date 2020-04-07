<template>
  <div>
    <el-row class="m_tableTopRow">
      <el-col :xs="24" :sm="12" :md="18" :lg="18" :xl="18" >
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="paramsForm.timeStandardName"
              clearable
              maxlength="10"
              oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')"
              placeholder="时间标准名称"
              prefix-icon="el-icon-search"/>
          </el-form-item>
          <template>
            <el-time-picker
              v-model="paramsForm.startTime"
              :picker-options="{
                selectableRange: '00:00:01 - 23:59:59'
              }"
              value-format = "HH:mm:ss"
              placeholder="任意时间点"/>
          </template>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearchTimeStandard">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" class="m_tableTopRight">
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleCreateTimeStandard">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteByIds">批量删除</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { deleteTimeStandard } from '@/api/timeStandard'
export default {
  name: 'TimeStandardFilter',
  data() {
    return {
      paramsForm: {},
      multipleSelection: []
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('multipleSelection')
  },
  methods: {
    handleCommit() {
      eventVue.$on('multipleSelection', (multipleSelection) => {
        this.multipleSelection = multipleSelection
      })
    },
    // 查询考勤标准
    handleSearchTimeStandard() {
      eventVue.$emit('searchTimeStandard', this.paramsForm)
    },
    // 新增考勤标准
    handleCreateTimeStandard() {
      eventVue.$emit('createTimeStandard')
    },
    // 批量删除
    handleDeleteByIds() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('您将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].timeStandardId)
          }
          deleteTimeStandard(ids).then(resp => {
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
            // this.getAllTimeStandard()
            eventVue.$emit('fetchTimeStandard')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择您要删除的数据'
        })
      }
    }
  }
}
</script>

