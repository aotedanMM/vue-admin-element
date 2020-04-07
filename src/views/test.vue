<template>
  <div style="margin: 20px;">
    <el-input v-model="inputVal" class="search-bar-input" type="text" style="width: 200px" @keyup="search"/>
    <el-button type="primary" @click="search()">发送指令</el-button>
    <div class="m_receive">
      {{ receiveCommand }}
    </div>

    <div class="m_radioGroup2"><el-radio v-model="command" label="1">一氧化碳超标</el-radio></div>
    <div class="m_radioGroup2"><el-radio v-model="command" label="2">甲烷超标</el-radio></div>
    <div class="m_radioGroup2"><el-radio v-model="command" label="3">氧气过低</el-radio></div>
    <div class="m_radioGroup2"><el-radio v-model="command" label="4">温度过高</el-radio></div>
    <div class="m_radioGroup2"><el-radio v-model="command" label="5">湿度过低</el-radio></div>
  </div>
</template>

<script>
import { sendCommand } from '@/api/area'
export default {
  name: 'Test',
  data() {
    return {
      command: null,
      inputVal: '',
      receiveCommand: null,
      timer2: null,
      switchFlag: true
    }
  },
  watch: {
    command() {
      this.handleRadioChange()
    }
  },
  methods: {
    handleRadioChange() {
      // console.log('handleRadioChange')
      sendCommand(this.command).then(resp => {
        console.log(resp.data.data)
        if (resp.data.code === 200) {
          this.$message({
            type: 'info',
            message: resp.data.data
          })
        }
      })
    },
    search() {
      sendCommand(this.inputVal).then(resp => {
        console.log(resp.data.data)
        if (resp.data.code === 200) {
          this.receiveCommand = resp.data.data
        }
      })
    }

  }
}
</script>
<style scoped>
  .m_radioGroup2{line-height: 2.5}
  .m_receive{width: 500px;height: 200px;border: 1px solid #eee;border-radius: 10px;margin: 20px 0;padding: 20px;  }
</style>
