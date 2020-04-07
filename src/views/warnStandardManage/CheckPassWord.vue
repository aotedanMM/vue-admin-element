<template>
  <div>
    <el-dialog :visible.sync="checkDialogVisible" title="当前操作需要验证管理员密码" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-form label-position="left" label-width="100px" class="m_form">
        <el-form-item label="管理员密码">
          <el-input v-model="password" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCheckPasswordData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'

import { checkPasswordData } from '@/api/login'
export default {
  name: 'CheckPassWord',
  data() {
    return {
      username: '',
      password: null,
      checkDialogVisible: false,
      isCheckPassword: false
      // isCheckPassword: true
    }
  },
  created() {
    this.checkPassWordData() // 兄弟组件通信,校验密码
  },
  beforeDestroy() {
    eventVue.$off('checkPassWordData')
  },
  methods: {
    // 兄弟组件通信,校验密码
    checkPassWordData() {
      eventVue.$on('checkPassWordData', () => {
        this.handleOpenCheck()
      })
    },
    // 校验密码弹窗可见
    handleOpenCheck() {
      this.checkDialogVisible = true
      this.password = null
      this.username = localStorage.getItem('account')
    },
    // 校验当前用户和密码
    handleCheckPasswordData() {
      checkPasswordData(this.username, this.password).then(resp => {
        if (resp.data.code === 200) {
          this.isCheckPassword = true // 是否校验密码的标志，true
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        this.checkDialogVisible = false
        eventVue.$emit('checkPassWordResult', this.isCheckPassword) // 兄弟组件通信 传递校验结果
      })
    }
  }
}
</script>

