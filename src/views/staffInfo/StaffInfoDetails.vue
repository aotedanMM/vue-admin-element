<template>
  <!--查看详细信息-->
  <div id="staffDetails">
    <el-dialog :visible.sync="staffInfoDetailsVisible" title="员工详细信息" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-table
        ref="multipleTable"
        :data="staffInfoDetailsData"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.staffSex === 0 ? '男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" width="170px">
          <template slot-scope="scope">
            <span>{{ scope.row.staffIdCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期">
          <template slot-scope="scope">
            <span v-if="scope.row.staffBirthday === undefined"/>
            <span v-else>{{ scope.row.staffBirthday | formatDateDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <span v-if="scope.row.age === undefined"/>
            <span v-else>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            <span>{{ scope.row.staffPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终端">
          <template slot-scope="scope">
            <span>{{ scope.row.terminalId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.isPerson }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工种">
          <template slot-scope="scope">
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'StaffInfoDetails',
  data() {
    return {
      staffInfoDetailsVisible: false,
      staffInfoDetailsData: [{}]
    }
  },
  created() {
    this.handleFetchStaffInfoDetails()
  },
  beforeDestroy() {
    eventVue.$off('showStaffInfoDetails')
  },
  methods: {
    handleFetchStaffInfoDetails() {
      eventVue.$on('showStaffInfoDetails', (row) => {
        // console.log(row)
        this.staffInfoDetailsVisible = true
        for (const i in row) {
          this.$set(this.staffInfoDetailsData[0], i, row[i])
        }
        this.staffInfoDetailsData[0].isPerson = this.common.handlePersonType(this.staffInfoDetailsData[0].isPerson)
      })
    }
  }
}
</script>
