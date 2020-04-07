<template>
  <div>
    <el-dialog
      :visible.sync="timeStandardVisible"
      title="绑定考勤标准"
      width="30%"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <el-form ref="standardFormRefs" :rules="standardRules" :model="bindingParams" label-position="left" label-width="100px" class="m_form">
        <el-form-item label="考勤标准" prop="standardId" >
          <el-select v-model="bindingParams.standardId" placeholder="请选择考勤标准">
            <el-option
              v-for="item in timeStandardData"
              :key="item.timeStandardId"
              :label="item.timeStandardName"
              :value="item.timeStandardId">
              <span style="float: left">{{ item.timeStandardName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.timeStandardDesc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeStandardVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBindingStandard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { getTimeStandard } from '@/api/timeStandard'
import { bindingTimeStandard } from '@/api/infor'
export default {
  name: 'BindAttendanceStandard',
  props: {
  },
  data() {
    return {
      standardRules: {
        standardId: [{ required: true, trigger: 'blur', message: '请选择考勤标准' }]
      },
      multipleSelection: [],
      staffIds: [],
      bindingParams: {},
      timeStandardData: [],
      timeStandardVisible: false
    }
  },
  created() {
    this.handleFetchTimeStandard() // 获取考勤标准
    this.handleBindTimeStandard() // 兄弟组件通信
  },
  beforeDestroy() {
    eventVue.$off('bindTimeStandard')
  },
  methods: {
    // 兄弟组件通信
    handleBindTimeStandard() {
      eventVue.$on('bindTimeStandard', multipleSelection => {
        this.multipleSelection = multipleSelection
        this.timeStandardVisible = true
        this.staffIds = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.staffIds.push(this.multipleSelection[i].staffId)
        }
        this.bindingParams.staffIds = this.staffIds
        this.$nextTick(() => {
          this.$refs['standardFormRefs'].clearValidate()
        })
      })
    },
    // 获取考勤标准
    handleFetchTimeStandard() {
      getTimeStandard().then(resp => {
        const result = resp.data
        if (result.code === 200) {
          if (result.data.list.length) {
            this.timeStandardData = result.data.list
          }
        } else if (result.code !== 111) {
          this.$message({
            message: result.code + ':' + result.msg,
            type: 'warning'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 提交绑定考勤标准
    submitBindingStandard() {
      this.$refs['standardFormRefs'].validate((valid) => {
        if (valid) {
          console.log(this.bindingParams)
          bindingTimeStandard(this.bindingParams.staffIds, this.bindingParams.standardId).then(response => {
            const result = response.data
            if (result.code === 200) {
              this.$message({
                message: result.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: result.code + ':' + result.msg,
                type: 'error'
              })
            }
            this.timeStandardVisible = false
            eventVue.$emit('fetchStaffInfo', '') // 兄弟组件通信 获取人员信息
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e
            })
          })
        }
      })
    }
  }
}
</script>
