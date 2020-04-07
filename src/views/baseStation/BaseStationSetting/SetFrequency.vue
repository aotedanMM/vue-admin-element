<template>
  <div>
    <!--上传频率-->
    <el-dialog
      :visible.sync="setFrequencyVisible"
      :before-close="handleCloseSetFrequency"
      title="设定上传频率"
      @open="common.toggleBody(1)"
      @close="common.toggleBody(0)">
      <el-form label-width="100px" >
        <el-form-item label="上传频率">
          <el-input-number v-model="frequency" :min="5" :max="30" label="描述文字"/>
          <span>秒/s</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSetFrequency">取 消</el-button>
        <el-button type="primary" @click="submitSettingFrequency">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { modifyFrequency } from '@/api/station'
export default {
  name: 'SetFrequency',
  props: {
    setFrequencyVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      frequencyForm: {},
      frequency: null, // 频率上传具体数据，单位秒（s）
      ids: []
    }
  },
  created() {
    this.handlePassValueToFrequency() // 接收选中行的返回值
  },
  methods: {
    // 关闭弹窗
    handleCloseSetFrequency() {
      this.$emit('closeSetFrequency')
    },
    // 接收选中行的返回值
    handlePassValueToFrequency() {
      eventVue.$on('passValueToFrequency', (multipleSelection) => {
        this.multipleSelection = multipleSelection
        this.frequency = null // 重置上传频率秒数
        this.handleMultipleSelection() // 处理选中行的ID组
      })
    },
    // 处理选中行的ID组
    handleMultipleSelection() {
      this.ids = []
      for (const m of this.multipleSelection) {
        this.ids.push(m.baseStationNum)
      }
      this.frequencyForm.stationIds = this.ids
    },
    // 上传设定的上传频率
    submitSettingFrequency() {
      this.frequencyForm.frequency = this.frequency
      let ids = ''
      const len = this.frequencyForm.stationIds.length
      for (let i = 0; i < len; i++) {
        ids += this.frequencyForm.stationIds[i]
        if (i < len - 1) {
          ids += ','
        }
      }
      this.frequencyForm.stationIds = ids
      modifyFrequency(this.frequencyForm).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            message: resp.data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: resp.data.code + ':' + resp.data.msg,
            type: 'error'
          })
        }
        eventVue.$emit('fetchBaseStationData', '')
        this.frequency = null // 重置上传频率秒数
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
      this.$emit('closeSetFrequency')
    }
  }
}
</script>
