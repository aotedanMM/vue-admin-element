<template>
  <div class="app-container">
    <el-button type="primary" @click="handleTest()">测试</el-button>
  </div>
</template>

<script>
import { sendTest } from '@/api/test'
export default {
  name: 'Test',
  data() {
    return {

    }
  },
  methods: {
    handleTest() {
      sendTest().then(resp => {
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
