<template>
  <div>
    <el-dialog :visible.sync="ruleEditVisible" :title="textMap[editStatus]">
      <el-form ref="ruleRefs" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="ruleForm.ruleName" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="气体类型" prop="gasType">
          <el-radio v-model="ruleForm.gasType" label="1">甲烷</el-radio>
          <el-radio v-model="ruleForm.gasType" label="2">一氧化碳</el-radio>
          <el-radio v-model="ruleForm.gasType" label="3">氧气</el-radio>
          <el-radio v-model="ruleForm.gasType" label="4">温度</el-radio>
          <el-radio v-model="ruleForm.gasType" label="5">湿度</el-radio>
        </el-form-item>

        <el-form-item label="通知类型" prop="checkList">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="1">警报</el-checkbox>
            <el-checkbox label="2">响铃</el-checkbox>
            <el-checkbox label="3">短信通知</el-checkbox>
            <el-checkbox label="4">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="警报等级" prop="number">
          <el-radio v-model="ruleForm.number" label="1">一级</el-radio>
          <el-radio v-model="ruleForm.number" label="2">二级</el-radio>
          <el-radio v-model="ruleForm.number" label="3">三级</el-radio>
          <el-radio v-model="ruleForm.number" label="4">四级</el-radio>
        </el-form-item>

        <el-form-item label="规则数值" prop="ruleNum">
          <el-input v-model="ruleForm.ruleNum" style="width: 200px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleEditVisible = false">取 消</el-button>
        <el-button v-if="editStatus === 'create'" type="primary" @click="handleAddRule()">确 定</el-button>
        <el-button v-else type="primary" @click="handleEditRule()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { addRuleData, editRuleData } from '@/api/rule'

export default {
  name: 'RuleEdit',
  data() {
    return {
      checkList: [],
      rules: {
        ruleName: [{ required: true, trigger: 'blur', message: '请输入规则名称' }],
        gasName: [{ required: true, trigger: 'blur', message: '请选择气体类型' }],
        ruleType: [{ required: true, trigger: 'blur', message: '请选择通知类型' }],
        number: [{ required: true, trigger: 'blur', message: '请选择警报等级' }],
        ruleNum: [{ required: true, trigger: 'blur', message: '请输入具体数值' }]
      },
      textMap: { update: '编辑规则', create: '新增规则' },
      editStatus: '',
      ruleEditVisible: false,
      ruleForm: {
        ruleType: '',
        gasType: 1,
        number: 1
      }

    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('addRuleData')
    eventVue.$off('editRuleData')
  },
  methods: {
    handleCommit() {
      // 新增
      eventVue.$on('addRuleData', () => {
        this.ruleForm = {
          gasType: '1',
          number: '1'
        }
        this.checkList = ['1']
        this.ruleEditVisible = true
        this.editStatus = 'create'
        this.$nextTick(() => {
          this.$refs['ruleRefs'].clearValidate()
        })
      })
      // 编辑
      eventVue.$on('editRuleData', (row) => {
        console.log(row)
        this.ruleEditVisible = true
        this.editStatus = 'update'
        this.ruleForm = Object.assign({}, row) // copy row 避免操作数据源
        this.$nextTick(() => {
          this.$refs['ruleRefs'].clearValidate()
        })
      })
    },
    // 新增规则
    handleAddRule() {
      console.log('新增规则')
      console.log(this.ruleForm)
      this.$refs['ruleRefs'].validate((valid) => {
        if (valid) {
          addRuleData(this.ruleForm).then(resp => {
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
          this.ruleEditVisible = false
        }
      })
    },
    // 编辑规则
    handleEditRule() {
      console.log('编辑规则')
      console.log(this.ruleForm)
      this.$refs['ruleRefs'].validate((valid) => {
        if (valid) {
          editRuleData(this.ruleForm).then(resp => {
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
          this.ruleEditVisible = false
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
