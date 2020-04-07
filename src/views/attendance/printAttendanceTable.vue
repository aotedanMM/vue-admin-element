<template>
  <div id="printTable">
    <el-table
      id="printTest"
      :data="listData"
      fit
      highlight-current-row
    >
      <el-table-column label="员工编号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.staffid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.staffname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.deptname }} </span>
        </template>
      </el-table-column>
      <el-table-column label="工种" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.jobname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排班" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.timestandardname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考勤基站名称" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.stationname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上班时间" width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.starttime!=null">{{ scope.row.starttime| formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下班时间" width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.s!=null">{{ scope.row.endtime| formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入井时间" width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.inore!=null" >{{ scope.row.inore| formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出井时间" width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.outore!=null">{{ scope.row.outore| formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintAttendanceTable',
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>
