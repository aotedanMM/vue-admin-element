<template>
  <div class="m_tableContent">
    <print-limit-staff-table :list-data="staffInfoData"/>
    <div class="m_downHoleTotalPrint">
      <p class="m_areaNum">限制区域报警人员 : {{ pageQuery.total }} 人</p>
      <el-table :data="staffInfoData" border>
        <el-table-column label="ID" width="80px">
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
        <el-table-column label="进区域时刻">
          <template slot-scope="scope">
            <span v-if="scope.row.inTime === undefined "/>
            <span v-else> {{ scope.row.inTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="滞留时间">
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
import PrintLimitStaffTable from '../print/printLimitStaffTable'
export default {
  name: 'LimitStaff',
  components: { PrintLimitStaffTable },
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
