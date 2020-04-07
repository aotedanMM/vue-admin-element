<template>
  <div class="app-container">
    <div class="m_dataBackup">
      <el-button type="primary" @click="handleBackupToLocal">备份到本地</el-button>
      <el-button type="success" @click="handleBackupToServer">备份到服务器</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataBackup',
  data() {
    return {

    }
  },
  methods: {
    // 备份到本地
    handleBackupToLocal() {

    },
    // 备份到服务器
    handleBackupToServer() {

    }

  }
}
</script>
