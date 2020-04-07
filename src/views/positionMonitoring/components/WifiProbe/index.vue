<template>
  <div class="m_probe">
    <el-dialog
      :visible.sync="wifiProbeVisible"
      :before-close="handleClose"
      title="终端详情"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <div class="m_probeTable">
        <el-table :data="personDetail" border>
          <el-table-column label="员工ID" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.staffId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.staffName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工种" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.jobName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.groupName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="终端编号" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.terminalId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份证" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.staffIdCard }}</span>
            </template>
          </el-table-column>
          <el-table-column label="终端" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.macAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" fixed>
            <template slot-scope="scope">
              <span v-if="scope.row.isPerson === 0">职工</span>
              <span v-if="scope.row.isPerson === 1">领导</span>
              <span v-if="scope.row.isPerson === 2">外来人</span>
              <span v-if="scope.row.isPerson === 3">车辆</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="probeQuery.total>0" class="pagination-container">
        <el-pagination
          :current-page="probeQuery.startPage"
          :page-sizes="[10,20,30]"
          :page-size="probeQuery.pageSize"
          :total="probeQuery.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WifiProbe',
  props: {
    personDetail: {
      required: true,
      type: Array
    },
    probeQuery: {
      required: true,
      type: Object
    },
    wifiProbeVisible: {
      required: true,
      type: Boolean
    }

  },
  data() {
    return {
    }
  },
  methods: {
    // 关闭聊天窗口
    handleClose() {
      this.$emit('closeWifiProbe')
    },
    // 改变当前页数显示条数
    handleSizeChange(val) {
      this.probeQuery.pageSize = val
      this.$emit('sizeChange', this.probeQuery)
    },
    // 改变当前页数
    handleCurrentChange(val) {
      this.probeQuery.startPage = val
      this.$emit('currentChange', this.probeQuery)
    }
  }
}
</script>
