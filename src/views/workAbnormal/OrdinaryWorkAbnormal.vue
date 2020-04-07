<template>
  <div class="m_tableContent">
    <print-normal-work-ab :list-data="specialData"/>
    <el-table :data="specialData" border>
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.staffAssignId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工种">
        <template slot-scope="scope">
          <span>{{ scope.row.staffJobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派区域">
        <template slot-scope="scope">
          <span>{{ scope.row.partitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派时间">
        <template slot-scope="scope">
          <span>{{ scope.row.assignTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派内容">
        <template slot-scope="scope">
          <span>{{ scope.row.assignDetail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" plain @click="handleDeleteAssign(scope.row.staffAssignId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="specialQuery.total>0" class="pagination-container">
      <el-pagination
        :page="specialQuery.startPage"
        :page-sizes="[20,30,50]"
        :limit="specialQuery.pageSize"
        :total="specialQuery.total"
        background
        layout="total,sizes,prev,pager,next,jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchWorkAbnormal } from '@/api/workAbnormal'
import eventVue from '../../api/eventVue'
import PrintNormalWorkAb from './PrintNormalWorkAb'
export default {
  name: 'OrdinaryWorkAbnormal',
  components: { PrintNormalWorkAb },
  props: {
  },
  data() {
    return {
      specialData: [],
      specialQuery: { startPage: 1, pageSize: 20, isFlag: 1 }
    }
  },
  created() {
    this.handleFetchOrdWorkAbnormal()
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('searchOrdWorkAbnormal')
  },
  methods: {
    handleCommit() {
      eventVue.$on('searchOrdWorkAbnormal', (query) => {
        this.specialQuery = query
        this.specialQuery.isFlag = 1
        this.handleFetchOrdWorkAbnormal()
      })
    },
    // 获取工作异常数据
    handleFetchOrdWorkAbnormal() {
      // console.log(this.specialQuery)
      fetchWorkAbnormal(this.specialQuery).then(resp => {
        // console.log(resp.data)
        if (resp.data.code === 200) {
          this.specialData = resp.data.data.list
          this.specialQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.specialData = []
          this.specialQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 改变页数
    handleCurrentChange(val) {
      this.specialQuery.startPage = val
      this.handleFetchOrdWorkAbnormal()
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      this.specialQuery.pageSize = val
      this.handleFetchOrdWorkAbnormal()
    }
  }
}
</script>

<style scoped>

</style>
