<template>
  <div class="m_tableContent2">
    <el-table :data="ruleData" border fit >
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则名称">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="气体名称">
        <template slot-scope="scope">
          <span>{{ scope.row.gasName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知类型">
        <template slot-scope="scope">
          <span>{{ scope.row.manageType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则数值">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="警报等级">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handleEditRule(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDeleteRule(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { fetchRuleData, deleteRuleData } from '@/api/rule'

export default {
  name: 'RuleTable',
  data() {
    return {
      ruleData: [
        { ruleId: 1, ruleNum: '1%', ruleName: '规则一', gasName: '甲烷', gasType: '1', ruleType: '1', manageType: '警报', number: '二级', checkList: ['1'] }
      ]
    }
  },
  created() {
    this.handleFetchRuleData()
  },
  methods: {
    // 获取规则数据
    handleFetchRuleData() {
      fetchRuleData().then(resp => {
        if (resp.data.code === 200) {
          this.ruleData = resp.data.data.list
        } else if (resp.data.code === 111) {
          this.ruleData = []
        } else {
          this.$message({
            type: 'error',
            message: resp.data.msg
          })
        }
      })
    },
    // 编辑规则
    handleEditRule(row) {
      // this.handleEditRuleData(row)
      eventVue.$emit('editRuleData', row)
    },
    // 删除规则
    handleDeleteRule(row) {
      // console.log(row)
      deleteRuleData(row.ruleId).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
