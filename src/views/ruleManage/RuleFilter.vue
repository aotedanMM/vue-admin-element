<template>
  <div class="m_tableTopRow " style="margin-top: 40px">
    <el-input v-model="ruleName" maxlength="10" clearable class="filter-item" placeholder="请输入规则名称" @keyup.enter.native="handleSearchRule"/>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchRule()">查询</el-button>
    <el-button class="filter-item" type="success" icon="el-icon-search" @click="handleAddRule()">新增</el-button>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'RuleFilter',
  data() {
    return {
      ruleName: ''
    }
  },
  methods: {
    // 搜索
    handleSearchRule() {
      eventVue.$emit('searchRuleData', this.ruleName)
    },
    // 新增
    handleAddRule() {
      eventVue.$emit('addRuleData')
    }
  }
}
</script>

<style scoped>

</style>
