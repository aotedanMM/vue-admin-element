<template>
  <div class="app-container">
    <!--filter-->
    <rule-filter/>
    <!--table-->
    <rule-table/>
    <!--edit-->
    <rule-edit/>
  </div>
</template>

<script>
import RuleFilter from './RuleFilter'
import RuleTable from './RuleTable'
import RuleEdit from './RuleEdit'
export default {
  name: 'RuleManage',
  components: { RuleEdit, RuleTable, RuleFilter },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
