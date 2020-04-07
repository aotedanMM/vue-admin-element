<template>
  <div class="app-container" style="margin-top: 40px">
    <el-tabs v-model="activeName" type="card">
      <!--编辑-->
      <el-tab-pane label="编辑" name="edit">
        <edit-part/>
      </el-tab-pane>
      <!--打印-->
      <el-tab-pane label="打印" name="print">
        <print-part/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EditPart from './editPart'
import PrintPart from './printPart'
export default {
  name: 'EditOrPrint',
  components: { PrintPart, EditPart },
  data() {
    return {
      activeName: 'print'
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
