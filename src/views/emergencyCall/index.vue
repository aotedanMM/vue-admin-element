<template>
  <div class="app-container">
    <div class="m_tableContent">
      <el-table
        :data="emCallData"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span> {{ scope.row.staff_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staff_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            <span>{{ scope.row.dept_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="甲烷(%)">
          <template slot-scope="scope">
            <span>{{ scope.row.ch4 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="一氧化碳(ppm)">
          <template slot-scope="scope">
            <span>{{ scope.row.co }}</span>
          </template>
        </el-table-column>
        <el-table-column label="氧气(%)">
          <template slot-scope="scope">
            <span>{{ scope.row.o2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="温度(℃)">
          <template slot-scope="scope">
            <span>{{ scope.row.temperature }}</span>
          </template>
        </el-table-column>
        <el-table-column label="湿度(%)">
          <template slot-scope="scope">
            <span>{{ scope.row.humidity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="呼叫时间">
          <template slot-scope="scope">
            <span>{{ scope.row.terminal_real_time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCallStaff(scope.row)">呼叫</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="emCallQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="emCallQuery.page"
          :page-size="emCallQuery.limit"
          :page-sizes="[20,30,50]"
          :total="emCallQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @sizeChange="handleSizeChangeEmCall"
          @currentChange="handleCurrentChangeEmCall"
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchEmCall } from '@/api/warningException'
export default {
  name: 'EmergencyCall',
  data() {
    return {
      staffInfo: {},
      emCallData: [],
      emCallQuery: { page: 1, limit: 20, total: null }
    }
  },
  created() {
    this.handleFetchEmCallData()
    this.$store.dispatch('handleSetEmCallValueTo0')
    localStorage.setItem('emCallValue', 0)
  },
  methods: {
    // 呼叫员工
    handleCallStaff(row) {
      this.staffInfo.staffId = row.staff_id
      this.staffInfo.staffName = row.staff_name
      this.staffInfo.deptName = row.dept_name
      this.$store.dispatch('showVoiceDialog')
      this.$nextTick(() => {
        eventVue.$emit('updateChatList', this.staffInfo) // 更新聊天列表
        eventVue.$emit('phoneListToWindow', this.staffInfo) // 将数据传到聊天窗口
      })
    },
    // 获取所有紧急呼叫数据
    handleFetchEmCallData() {
      fetchEmCall(this.emCallQuery).then(resp => {
        if (resp.data.code === 200) {
          this.emCallData = resp.data.data.list
          this.emCallQuery.total = resp.data.data.total
        } else if (resp.data.code === 111) {
          this.emCallData = []
          this.emCallQuery.total = 0
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 改变每页显示条数
    handleSizeChangeEmCall(val) {
      this.emCallQuery.limit = val
      this.handleFetchEmCallData()
    },
    // 改变当前页数
    handleCurrentChangeEmCall(val) {
      this.emCallQuery.page = val
      this.handleFetchEmCallData()
    }

  }
}
</script>
