<template>
  <div class="m_tableContent">
    <print-special-job-table :list-data="staffInfoData"/>
    <p class="m_areaNum">工作异常人员 : {{ total }} 人</p>
    <div class="m_timeSelect">
      <!--特种作业人员-->
      <el-select v-model="pageQuery.isFlag" placeholder="特种作业人员" clearable>
        <el-option
          v-for="item in specialData"
          :value="item.isFlag"
          :label="item.name"
          :key="item.isFlag"
        />
      </el-select>
      <el-button type="primary" @click="fetchAbStaff">查询</el-button>
    </div>
    <div class="m_downHoleTotalPrint">
      <el-table :data="staffInfoData" border>
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
      </el-table>
      <!--分页-->
      <div v-show="pageQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="pageQuery.startPage"
          :page-sizes="[20,30,50]"
          :page-size="pageQuery.pageSize"
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
import PrintSpecialJobTable from '../print/printSpecialJobTable'
import { fetchWorkAbnormalNum } from '@/api/workAbnormal'
export default {
  name: 'SpecialJobStaff',
  components: { PrintSpecialJobTable },
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
      total: 0,
      specialData: [
        { isFlag: 0, name: '特种作业人员' },
        { isFlag: 1, name: '非特种作业人员' }
      ]
    }
  },
  created() {
    this.handleFetchWorkAbNum()
  },
  methods: {
    // 获取人数
    handleFetchWorkAbNum() {
      fetchWorkAbnormalNum().then(resp => {
        if (resp.data.code === 200) {
          this.total = resp.data.data.count
        } else {
          this.total = this.pageQuery.total
        }
      })
    },
    // 更改页数
    handleCurrentChange(val) {
      this.pageQuery.startPage = val
      this.$emit('currentChange', this.pageQuery)
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      this.$emit('sizeChange', this.pageQuery)
    },
    fetchAbStaff() {
      this.$emit('fetchAbStaff', this.pageQuery)
    }
  }
}
</script>
