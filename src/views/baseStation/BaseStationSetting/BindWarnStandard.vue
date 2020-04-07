<template>
  <div class="m_BindWarnStandard">
    <!--气体警报标准绑定-->
    <el-dialog
      :visible.sync="bindWarnStandardVisible"
      :before-close="handleCloseBindWarnStandard"
      title="气体警报标准绑定"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <el-form ref="bindWarnStandardRefs" :model="bindWarnStandardForm" :rules="BindWarnStandardRules" class="m_form" label-width="130px">
        <el-form-item label="气体警报标准" prop="standardId">
          <el-select v-model="bindWarnStandardForm.standardId" placeholder="请选择基站相关的警报等级" size="medium">
            <el-option
              v-for="item in WarnStandardData"
              :key="item.standardId"
              :label="item.standardName + ' ('+item.standardDesc+')'"
              :value="item.standardId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBindWarnStandard">取 消</el-button>
        <el-button type="primary" @click="submitBindingLevelData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { getGasLevelStandard, bindingStandard } from '@/api/levelData'
export default {
  name: 'BindWarnStandard',
  props: {
    bindWarnStandardVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      BindWarnStandardRules: { standardId: [{ required: true, message: '请选择要绑定的气体标准', trigger: 'blur' }] },
      bindWarnStandardForm: {},
      WarnStandardData: [],
      ids: []
    }
  },
  created() {
    this.handleFetchWarnStandard() // 获取所有气体标准
    this.handlePassValueToFrequency() // 接收选中行的返回值
  },
  methods: {
    // 关闭绑定气体标准弹窗
    handleCloseBindWarnStandard() {
      this.$emit('closeBindWarnStandard')
    },
    // 接收选中行的返回值
    handlePassValueToFrequency() {
      eventVue.$on('passValueToFrequency', (multipleSelection) => {
        this.multipleSelection = multipleSelection
        this.bindWarnStandardForm = {}
        this.handleMultipleSelection()
      })
    },
    // 获取所有气体标准
    handleFetchWarnStandard() {
      getGasLevelStandard().then((resp) => {
        const res = resp.data
        if (res.code === 200) {
          this.WarnStandardData = res.data
        } else if (res.code === 111) {
          this.WarnStandardData = []
        } else {
          this.$message({
            message: res.code + ':' + res.msg,
            type: 'error'
          })
        }
      }).catch((e) => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 处理选中行的ID组
    handleMultipleSelection() {
      this.ids = []
      for (const m of this.multipleSelection) {
        this.ids.push(m.baseStationNum)
      }
      this.bindWarnStandardForm.baseStationIds = this.ids
    },
    // 上传绑定的气体标准
    submitBindingLevelData() {
      this.bindWarnStandardForm.baseStationIds = this.ids
      let ids = ''
      const len = this.bindWarnStandardForm.baseStationIds.length
      for (let i = 0; i < len; i++) {
        ids += this.bindWarnStandardForm.baseStationIds[i]
        if (i < len - 1) {
          ids += ','
        }
      }
      this.bindWarnStandardForm.baseStationIds = ids
      this.$refs['bindWarnStandardRefs'].validate((valid) => {
        if (valid) {
          bindingStandard(this.bindWarnStandardForm).then((resp) => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.code + ':' + res.msg,
                type: 'error'
              })
            }
            eventVue.$emit('fetchBaseStationData', '')
          }).catch((e) => {
            this.$message({
              message: e,
              type: 'error',
              duration: 2000
            })
          })
          this.$emit('closeBindWarnStandard')
        }
      })
    }
  }
}
</script>

