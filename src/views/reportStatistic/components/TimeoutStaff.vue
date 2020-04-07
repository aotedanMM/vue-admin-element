<template>
  <div class="m_tableContent">
    <print-timeout-table :list-data="staffInfoData"/>
    <div class="m_downHoleTotalPrint">
      <p class="m_areaNum">超时报警人员 : {{ pageQuery.total }} 人</p>
      <el-table :data="staffInfoData" border>
        <el-table-column label="ID">
          <template slot-scope="scope">
            <span>{{ scope.row.staffId }}</span>
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
        <el-table-column label="入井时间">
          <template slot-scope="scope">
            <span v-if="scope.row.inOreTime === undefined "/>
            <span v-else> {{ scope.row.inOreTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="超时开始时间">
          <template slot-scope="scope">
            <span v-if="scope.row.startOverTime === undefined "/>
            <span v-else> {{ scope.row.startOverTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出井时间">
          <template slot-scope="scope">
            <span v-if="scope.row.finalTime === undefined "/>
            <span v-else> {{ scope.row.finalTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="井下时长">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
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
import PrintTimeoutTable from '../print/printTimeoutTable'
export default {
  name: 'TimeoutStaff',
  components: { PrintTimeoutTable },
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
    }
  }
}
</script>
