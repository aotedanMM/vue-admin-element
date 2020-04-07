<template>
  <!--弹窗 —— 井下人数-->
  <div class="m_downHoleStaff">
    <!--部门列表 -->
    <div class="downHoleTable">
      <el-table :data="downHoleDeptData" border >
        <el-table-column label="部门ID">
          <template slot-scope="scope">
            <span>{{ scope.row.deptId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门名称">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain @click="handleGetStaff(scope.row.deptId)">查看人员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// import eventVue from '@/api/eventVue'
export default {
  name: 'DownHoleDept',
  props: {
    downHoleDeptData: {
      type: Array,
      required: true
    },
    deptQuery: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    // 根据部门ID获取人员信息
    handleGetStaff(row) {
      this.deptQuery.deptId = row
      this.$emit('showDownHoleStaff', this.deptQuery)
    }
  }
}
</script>
