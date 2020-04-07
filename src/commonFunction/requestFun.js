import { addOperate } from '@/api/operate'
export default {
  handleAddOperateData(str) {
    const addOperateQuery = {}
    addOperateQuery.userName = localStorage.getItem('account')
    addOperateQuery.remark1 = str
    console.log(addOperateQuery)
    addOperate(addOperateQuery).then(resp => {
      if (resp.data.code === 200) {
        console.log(resp)
      } else {
        this.$message({
          type: 'error',
          message: resp.data.code + ':' + resp.data.msg
        })
      }
    })
  }
}
