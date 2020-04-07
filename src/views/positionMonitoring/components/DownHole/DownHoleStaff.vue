<template>
  <div>
    <!--井下人员列表 -->
    <div class="m_downHoleStaff">
      <el-table :data="downHoleStaffData" border class="downHoleTable">
        <el-table-column label="ID" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="200px">
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
        <el-table-column label="最近定位时间">
          <template slot-scope="scope">
            <span v-if="scope.row.finalTime === undefined "/>
            <span v-if="scope.row.finalTime!=null"> {{ scope.row.finalTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="井下时长">
          <template slot-scope="scope">
            <span>{{ scope.row.timeLong }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleFetchTrack(scope.row)">查看轨迹</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div v-show="staffQuery.total>0" class="pagination-container">
      <el-pagination
        :current-page="staffQuery.page"
        :page-size="staffQuery.limit"
        :total= "staffQuery.total"
        layout="total, prev, pager, next"
        @current-change="handleSizeChangeDownHoleStaffData"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownHoleStaff',
  props: {
    downHoleStaffData: {
      type: Array,
      required: true
    },
    staffQuery: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 根据员工ID获取员工轨迹
    handleFetchTrack(row) {
      this.$emit('showDownHoleTrack', row)
    },
    // 改变页数
    handleSizeChangeDownHoleStaffData(val) {
      this.staffQuery.page = val
      this.$emit('sizeChangeDownHoleStaff', this.staffQuery)
    }
  }
}
</script>
