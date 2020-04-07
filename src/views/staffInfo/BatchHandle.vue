<template>
  <div class="m_batchHandle">
    <!--批量导入-->
    <el-dialog :visible.sync="batchHandleVisible" title="批量导入人员信息" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-button type="success" class="m_floatLeftBtn" @click="downloadStaffTemplate" >下载模板</el-button>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="float: left;margin-right: 15px;"/>
      <el-table :data="tableData">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMethod">取消</el-button>
        <el-button type="primary" @click="uploadStaffFiles">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { uploadStaff } from '@/api/infor'
export default {
  name: 'BatchHandle',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      batchHandleVisible: false,
      tableHeader: [],
      tableData: [],
      staffExportInfo: [],
      beforeUploadCheck: true
    }
  },
  created() {
    this.batchHandleData() // 兄弟组件通信 批量导入导出触发函数
  },
  beforeDestroy() {
    eventVue.$off('batchImport')
    eventVue.$off('batchExport')
  },
  methods: {
    // 兄弟组件通信 批量导入导出触发函数
    batchHandleData() {
      // 批量导入
      eventVue.$on('batchImport', () => {
        this.tableData = []
        this.tableHeader = []
        this.batchHandleVisible = true
      })
      // 批量导出
      eventVue.$on('batchExport', (multipleSelection) => {
        this.multipleSelection = multipleSelection
        this.handleDownload()
      })
    },
    // 取消
    cancelMethod() {
      this.batchHandleVisible = false
      this.tableData = []
      this.tableHeader = []
    },
    // 下载人员信息模板
    downloadStaffTemplate() {
      this.multipleSelection = []
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '性别', '身份证号', '出生日期', '电话', '部门', '绑定终端', '类型', '工种', '工作地点']
        const filterVal = ['staffName', 'staffSex', 'staffIdCard', 'staffBirthday', 'staffPhone', 'deptName', 'terminalId', 'isPerson', 'jobId', 'partitionId']
        const data = this.formatJson(filterVal, this.multipleSelection)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '人员信息模板'
        })
        this.$message({
          message: '下载模板成功',
          type: 'success'
        })
      })
    },
    // 上传excel文件前的校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 10

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请上传小于1M的文件',
        type: 'warning'
      })
      return false
    },
    // 上传成功后的回调
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    // 批量上传人员信息数据
    uploadStaffFiles() {
      if (this.tableData.length > 0) {
        console.log(this.tableData)
        if (this.tableData[0].姓名) {
          this.batchHandleVisible = false
          uploadStaff(this.tableData).then(resp => {
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: '批量导入成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ': ' + resp.data.msg
              })
            }
            eventVue.$emit('fetchStaffInfo', '')
          })
        } else {
          this.$message({
            type: 'error',
            message: '姓名不能为空'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '批量导入的表格不能为空'
        })
      }
    },
    // 批量导出人员信息
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '姓名', '性别', '身份证号', '出生日期', '电话', '部门', '绑定终端', '类型', '工种', '工作地点']
          const filterVal = ['staffId', 'staffName', 'staffSex', 'staffIdCard', 'staffBirthday', 'staffPhone', 'deptName', 'terminalId', 'isPerson', 'jobName', 'partitionName']
          const data = this.formatJson(filterVal, this.multipleSelection)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '人员信息'
          })
          eventVue.$emit('fetchStaffInfo', '')
          this.$message({
            message: '批量导出人员成功',
            type: 'success'
          })
        })
    },
    // 格式化导出的人员信息格式
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'staffSex') {
          return this.common.handleStaffSex(v[j])
        }
        if (j === 'staffBirthday') {
          return this.common.formatDateDay(v[j])
        }
        if (j === 'isPerson') {
          return this.common.handlePersonType(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

