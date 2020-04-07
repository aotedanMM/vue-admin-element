<template>
  <el-dialog :visible.sync="checkDialogVisible" title="当前操作需要验证管理员密码" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
    <el-form>
      <el-form-item label="账号密码">
        <el-input v-model="password" type="password" style="width: 200px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="checkDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="checkPassword">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import eventVue from '@/api/eventVue'
import { checkPasswordData } from '@/api/login'
export default {
  name: 'CheckAdminPsd',
  data() {
    return {
      checkDialogVisible: false,
      isCheckPassword: false,
      password: null,
      username: ''
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('checkPassword')
  },
  methods: {
    handleCommit() {
      eventVue.$on('checkPassword', () => {
        this.handleCheckPassword()
      })
    },
    // 校验当前用户和密码
    handleCheckPassword() {
      // 校验密码弹窗可见
      this.checkDialogVisible = true
      this.username = localStorage.getItem('account')
    },
    checkPassword() {
      checkPasswordData(this.username, this.password).then(resp => {
        if (resp.data.code === 200) {
          this.isCheckPassword = true // 是否校验密码的标志，true
          eventVue.$emit('sendCheckResult', this.isCheckPassword)
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
          this.checkDialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: resp.data.msg
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    }
  }
}
</script>
