<template>
  <div class="importTerminal">
    <el-dialog :visible.sync="terImportVisible" title="批量导入终端信息" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-button type="success" class="m_floatLeftBtn" @click="downloadTerminalTemplate" >下载模板</el-button>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-table :data="tableData" highlight-current-row style="width: 100%;margin-top:50px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMethod">取消</el-button>
        <el-button type="primary" @click="uploadTerminalFiles">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { uploadTerminals } from '@/api/terminal'
import eventVue from '@/api/eventVue'
export default {
  name: 'TerminalImport',
  components: { UploadExcelComponent },
  data() {
    return {
      terImportVisible: false,
      tableHeader: [],
      tableData: [],
      terminalData: []
    }
  },
  created() {
    this.handleCommit()
  },
  beforeDestroy() {
    eventVue.$off('importTerminal')
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      eventVue.$on('importTerminal', () => {
        this.terImportVisible = true
        this.tableData = []
        this.tableHeader = []
      })
    },
    // 取消函数
    cancelMethod() {
      this.terImportVisible = false
      this.tableData = []
      this.tableHeader = []
    },
    // 批量上传终端信息
    uploadTerminalFiles() {
      if (this.tableData.length > 0) {
        if (this.tableData[0].终端ID) {
          uploadTerminals(this.tableData).then(resp => {
            const result = resp.data
            if (result.code === 200) {
              this.$message({
                type: 'success',
                message: '导入数据成功'
              })
            } else {
              this.$message({
                type: 'warning',
                message: result.code + ':' + result.msg
              })
            }
            eventVue.$emit('fetchTerminal')
            this.cancelMethod()
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '终端ID不能为空'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '批量导入的表格不能为空'
        })
      }
    },
    // 清空表单
    resetTerminalData() {
      this.terminalData = []
    },
    // 下载终端信息模板
    downloadTerminalTemplate() {
        import('@/vendor/Export2Excel').then(excel => {
          this.resetTerminalData()
          const tHeader = ['终端ID', '型号版本编号', '硬件版本号', '软件版本号', 'mac地址', '一氧化碳描述', '氧气描述', '甲烷描述', '声音描述', 'wifi描述', '电池描述']
          const filterVal = ['terminalId', 'modelNumber', 'hardwareVersion', 'softwareVersion', 'macAddress', 'coDesc', 'o2Desc', 'ch4Desc', 'voiceDesc', 'wifiDesc', 'batteryDesc']
          const list = this.terminalData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '终端信息模板'
          })
          this.$message({
            message: '下载模板成功',
            type: 'success'
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 上传excel文件前的校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '请上传小于10M的文件',
        type: 'warning'
      })
      return false
    },
    // 上传成功
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
