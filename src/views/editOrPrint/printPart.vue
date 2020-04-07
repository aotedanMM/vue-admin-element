<template>
  <div>
    <el-table :data="printPartData" border>
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印名称">
        <template slot-scope="scope">
          <span> {{ scope.row.printName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印描述">
        <template slot-scope="scope">
          <span> {{ scope.row.printDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handlePrint(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PrintPart',
  data() {
    return {
      printPartData: [
        { ID: '1', printName: '气体警报', path: '/warn/gas', printDesc: '气体警报历史记录打印' },
        { ID: '2', printName: '设备故障', path: '/warn/malfunction', printDesc: '终端设备故障已处理、未处理历史记录打印' },
        { ID: '3', printName: '电量警报', path: '/warn/batteryAlarm', printDesc: '终端设备电量低历史记录打印' },
        { ID: '4', printName: '基站掉线', path: '/warn/offlineStation', printDesc: '基站掉线相关时间和区域历史记录打印' },
        { ID: '5', printName: '工作异常', path: '/warn/workAbnormal', printDesc: '特种作业、非特种作业人员工作异常信息打印' },
        { ID: '6', printName: '基站信息', path: '/equipment/baseStation', printDesc: '井下基站相关信息打印' },
        { ID: '7', printName: '终端信息', path: '/equipment/terminal', printDesc: '井下终端设备相关信息打印' },
        { ID: '8', printName: '人员信息', path: '/people/staffInfo', printDesc: '井下人员相关信息打印' },
        { ID: '9', printName: '人员历史轨迹', path: '/history/personTrack', printDesc: '井下人员入井及活动路线历史轨迹打印' },
        { ID: '10', printName: '车辆历史轨迹', path: '/history/carTrack', printDesc: '井下车辆历史轨迹打印' },
        { ID: '11', printName: '井下总人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 1, printDesc: '当前正在井下工作的总人员的信息打印' },
        { ID: '12', printName: '超时报警人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 2, printDesc: '井下工作人员未按规定时间出井人员信息打印' },
        { ID: '13', printName: '超员报警人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 3, printDesc: '井下区域超过可容纳人数的人员信息打印' },
        { ID: '14', printName: '重点区域人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 4, printDesc: '在重点区域工作的人员信息打印' },
        { ID: '15', printName: '限制区域报警人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 5, printDesc: '在限制区域工作的人员信息打印' },
        { ID: '16', printName: '工作异常人员', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 6, printDesc: '特种作业、非特种作业人员工作异常信息打印' },
        { ID: '17', printName: '领导干部', path: '/system/reportStatistic', name: 'ReportStatistic', tableType: 7, printDesc: '领导干部每月下井总数及时间等信息打印' }
      ]
    }
  },
  methods: {
    handlePrint(row) {
      if (row.ID > 10) {
        this.$router.push({
          path: row.path,
          name: row.name,
          params: {
            tableType: row.tableType
          }
        })
      } else {
        this.$router.push({
          path: row.path
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
