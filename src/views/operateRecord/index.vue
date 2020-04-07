<template>
  <div class="app-container">
    <div class="operateFilter">
      <el-date-picker
        v-model="selectTime"
        :picker-options="pickerOptions"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button type="primary" @click="handleFetchOperateData">查询</el-button>
    </div>
    <el-table :data="operateData" border>
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.operationLogId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作记录" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark1 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="operateQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="operateQuery.startPage"
        :page-size="operateQuery.pageSize"
        :total="operateQuery.total"
        :page-sizes="[20,30,50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchOperateData } from '@/api/operate'
export default {
  name: 'OperateRecord',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      selectTime: '',
      operateData: [],
      operateQuery: { startPage: 1, pageSize: 20, total: null }
    }
  },
  watch: {
    selectTime() {
      if (!this.selectTime) {
        this.operateQuery.startTime = null
        this.operateQuery.endTime = null
      } else {
        this.operateQuery.startTime = this.selectTime[0]
        this.operateQuery.endTime = this.selectTime[1]
      }
    }
  },
  created() {
    this.handleFetchOperateData()
  },
  methods: {

    // 获取操作记录
    handleFetchOperateData() {
      console.log(this.operateQuery)
      fetchOperateData(this.operateQuery).then(resp => {
        console.log(resp.data)
        if (resp.data.code === 200) {
          this.operateData = resp.data.data.list
          this.operateQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.operateData = []
          this.operateQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.operateQuery.startPage = val
      this.handleFetchOperateData()
    }
  }
}
</script>

<style scoped>

</style>
