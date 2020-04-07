<template>
  <div class="custom-tree-container" style="width: 60% !important;">
    <div>
      <el-tree
        :data="partitionInfo"
        :expand-on-click-node="false"
        :indent="20"
        node-key="id"
        default-expand-all>
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="success" plain size="mini" @click="open(node, data)">添加</el-button>
            <el-button type="warning" plain size="mini" @click="open1(node, data)">修改</el-button>
            <el-button type="danger" plain size="mini" @click="handleDelPartition(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { insertPartitionInfo, delPartitionInfoById, updatePartitionInfo, getPartitionInfo } from '@/api/partition'
export default {
  name: 'AreaManagement',
  props: {

  },
  data() {
    return {
      partitionInfo: null,
      partitionData: { partitionName: null, partitionDesc: null, id: null, children: null, parentId: null, label: null },
      titles: {
        update: '更新结构名称',
        create: '新增结构名称'
      }
    }
  },
  created() {
    this.getAllPartitionInfo()
  },
  methods: {
    // 添加节点
    handleAddPartition(node, data) {
      this.resetPartitionData()
      this.partitionData.parentId = data.id
      this.dialogType = 'create'
      this.disableStatus = true
      this.$nextTick(() => {
        this.$refs['partitionForm'].clearValidate()
      })
    },
    open(node, data) {
      this.resetPartitionData()
      this.partitionData.parentId = data.id
      this.$prompt('请填写结构名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空'
      }).then(({ value }) => {
        this.partitionData.partitionName = value
        insertPartitionInfo(this.partitionData).then(resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '更新结构成功',
              type: 'success'
            })
            this.disableStatus = false
            // 重新渲染结构数据
            this.getAllPartitionInfo()
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'warn'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    },
    open1(node, data) {
      this.resetPartitionData()
      this.partitionData.id = data.id
      const parent = node.parent
      this.partitionData.parentId = parent.data.id
      this.partitionData.partitionName = data.partitionName
      this.$prompt('请填写结构名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空',
        inputValue: this.partitionData.partitionName
      }).then(({ value }) => {
        this.partitionData.partitionName = value
        updatePartitionInfo(this.partitionData).then(resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '修改结构成功',
              type: 'success'
            })
            this.disableStatus = false
            // 重新渲染结构数据
            this.getAllPartitionInfo()
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 添加结构
    addPartitionInfo() {
      this.$refs['partitionForm'].validate((valid) => {
        if (valid) {
          insertPartitionInfo(this.partitionData).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: '更新结构成功',
                type: 'success'
              })
              this.disableStatus = false
              // 重新渲染结构数据
              this.getAllPartitionInfo()
            } else {
              this.$message({
                message: res.code + ':' + res.msg,
                type: 'warn'
              })
            }
          }).catch(
            this.$message({
              message: '添加结构失败',
              type: 'error'
            })
          )
        }
      })
    },
    // 修改节点
    handleModifyPartition(node, data) {
      this.resetPartitionData()
      this.partitionData.id = data.id
      const parent = node.parent
      this.partitionData.parentId = parent.data.id
      this.partitionData.partitionName = data.partitionName
      this.dialogType = 'update'
      this.disableStatus = true
      this.$nextTick(() => {
        this.$refs['partitionForm'].clearValidate()
      })
    },
    // 删除节点
    handleDelPartition(node, data) {
      this.resetPartitionData()
      this.partitionData.id = data.id
      this.$confirm('确认删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delPartitionInfo(this.partitionData)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取所有的结构
    getAllPartitionInfo() {
      getPartitionInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.partitionInfo = res.data
          } else if (res.code !== 111) {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
      //   .catch(
      //   this.$message({
      //     message: '获取结构失败',
      //     type: 'error'
      //   })
      // )
    },
    // 修改结构
    modifyPartitionInfo() {
      this.$refs['partitionForm'].validate((valid) => {
        if (valid) {
          updatePartitionInfo(this.partitionData).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: '修改结构成功',
                type: 'success'
              })
              this.disableStatus = false
              // 重新渲染结构数据
              this.getAllPartitionInfo()
            } else {
              this.$message({
                message: res.code + ':' + res.msg,
                type: 'error'
              })
            }
          }).catch(
            this.$message({
              message: '更新结构失败',
              type: 'error'
            })
          )
        }
      })
    },
    // 删除结构
    delPartitionInfo(partitionData) {
      delPartitionInfoById(partitionData).then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '删除结构操作成功',
              type: 'success'
            })
            // 重新渲染结构数据
            this.getAllPartitionInfo()
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      ).catch(
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      )
    },
    resetPartitionData() {
      this.partitionData = {
        partitionName: null,
        partitionDesc: null,
        id: null,
        children: null,
        label: null
      }
    }
  }
}
</script>
