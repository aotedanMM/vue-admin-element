<template>
  <div class="app-container">
    <!--查询条件-->
    <assign-filter/>
    <!--指派列表-->
    <assign-table/>
    <!--编辑指派-->
    <assign-edit/>
  </div>
</template>
<script>
import AssignFilter from './assignFilter'
import AssignTable from './assignTable'
import AssignEdit from './assignEdit'
export default {
  name: 'AssignRecord',
  components: { AssignEdit, AssignTable, AssignFilter },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
