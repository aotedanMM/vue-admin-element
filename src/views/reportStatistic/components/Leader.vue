<template>
  <div class="m_tableContent">
    <print-leader-table :list-data="staffInfoData"/>
    <div class="m_downHoleTotalPrint">
      <p class="m_areaNum">领导干部 : {{ pageQuery.total }} 人</p>
      <div class="m_timeSelect">
        <el-input v-model="leaderQuery.leaderName" maxlength="5" clearable oninput="value=value.replace(/[^A-Za-z0-9_\u4e00-\u9fa5]+/g,'')" placeholder="领导姓名" @keyup.enter.native="handleFetchLeader"/>
        <el-date-picker
          v-model="leaderQuery.currentMonth"
          :picker-options="pickerOptions"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
        />
        <el-button type="primary" @click="handleFetchLeader">查询</el-button>
      </div>
      <el-table :data="staffInfoData" border >
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领导姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staffname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入井时间">
          <template slot-scope="scope">
            <span v-if="!scope.row.inore"/>
            <span v-else>{{ scope.row.inore | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出井时间">
          <template slot-scope="scope">
            <span v-if="!scope.row.outore"/>
            <span v-else>{{ scope.row.outore | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下井时长">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当月下井总数">
          <template slot-scope="scope">
            <span>{{ scope.row.leaderSum }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="pageQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="pageQuery.page"
          :page-sizes="[20,30,50]"
          :page-size="pageQuery.limit"
          :total= "pageQuery.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import PrintLeaderTable from '../print/printLeaderTable'
export default {
  name: 'Leader',
  components: { PrintLeaderTable },
  props: {
    staffInfoData: {
      required: true,
      type: Array
    },
    pageQuery: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      leaderQuery: { currentMonth: null, leaderName: '' }
    }
  },
  methods: {
    // 更改页数
    handleCurrentChange(val) {
      this.pageQuery.page = val
      this.$emit('currentChange', this.pageQuery)
    },
    // 更改每页显示条数
    handleSizeChange(val) {
      this.pageQuery.limit = val
      this.$emit('sizeChange', this.pageQuery)
    },
    // 按月查找领导下井总数和时长
    handleFetchLeader() {
      this.$emit('fetchLeader', this.leaderQuery)
    }
  }
}
</script>

