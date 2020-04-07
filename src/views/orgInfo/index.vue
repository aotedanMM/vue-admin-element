<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card" class="m_tableContent2">
      <el-tab-pane label="组织结构管理" name="first" style="min-height: 80% !important;">
        <div class="custom-tree-container" style="width: 60%">
          <el-tree :data="orgInfo" :expand-on-click-node="false" :indent="20" default-expand-all>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="success" plain size="mini" @click="open(node, data)">添加</el-button>
                <el-button type="warning" plain size="mini" @click="open1(node, data)">修改</el-button>
                <el-button type="danger" plain size="mini" @click="handleDelOrg(node, data)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { insertOrgInfo, delOrgInfoById, updateOrgInfo, getOrgInfo } from '@/api/organization'
export default {
  data() {
    return {
      activeName: 'first',
      disableStatus: false,
      orgInfo: null,
      orgData: {
        name: null,
        id: null,
        children: null,
        parentId: null,
        label: null
      },
      titles: {
        update: '更新组织结构名称',
        create: '新增组织结构名称'
      },
      dialogType: null,
      rules: {
        name: [{ required: true, message: '请填写组织结构名称', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getAllOrgInfo()
  },
  methods: {
    open(node, data) {
      this.resetOrgData()
      this.orgData.parentId = data.id
      this.$prompt('请填写结构名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空'
      }).then(({ value }) => {
        this.orgData.name = value
        insertOrgInfo(this.orgData).then(resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '更新组织结构成功',
              type: 'success'
            })
            this.disableStatus = false
            // 重新渲染组织结构数据
            this.getAllOrgInfo()
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
      this.resetOrgData()
      this.orgData.id = data.id
      const parent = node.parent
      this.orgData.parentId = parent.data.id
      this.orgData.name = data.name
      this.$prompt('请填写结构名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空',
        inputValue: this.orgData.name
      }).then(({ value }) => {
        this.orgData.name = value
        updateOrgInfo(this.orgData).then(resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '修改组织结构成功',
              type: 'success'
            })
            this.disableStatus = false
            // 重新渲染组织结构数据
            this.getAllOrgInfo()
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
          message: '取消添加'
        })
      })
    },
    resetOrgData() {
      this.orgData = {
        name: null,
        id: null,
        children: null,
        label: null
      }
    },
    handleAddOrg(node, data) {
      this.resetOrgData()
      this.orgData.parentId = data.id
      this.dialogType = 'create'
      this.disableStatus = true
      this.$nextTick(() => {
        this.$refs['orgForm'].clearValidate()
      })
    },
    // 添加组织结构
    addOrgInfo() {
      this.$refs['orgForm'].validate((valid) => {
        if (valid) {
          insertOrgInfo(this.orgData).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: '更新组织结构成功',
                type: 'success'
              })
              this.disableStatus = false
              // 重新渲染组织结构数据
              this.getAllOrgInfo()
            } else {
              this.$message({
                message: res.code + ':' + res.msg,
                type: 'warn'
              })
            }
          }).catch(
            this.$message({
              message: '添加组织结构失败',
              type: 'error'
            })
          )
        }
      })
    },
    handleModifyOrg(node, data) {
      this.resetOrgData()
      this.orgData.id = data.id
      const parent = node.parent
      this.orgData.parentId = parent.data.id
      this.orgData.name = data.name
      this.dialogType = 'update'
      this.disableStatus = true
      this.$nextTick(() => {
        this.$refs['orgForm'].clearValidate()
      })
    },
    handleDelOrg(node, data) {
      this.resetOrgData()
      this.orgData.id = data.id
      this.$confirm('确认删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOrgInfo(this.orgData)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取所有的组织结构
    getAllOrgInfo() {
      getOrgInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.orgInfo = res.data
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
      //   .catch(
      //   this.$message({
      //     message: '获取组织结构失败',
      //     type: 'error'
      //   })
      // )
    },
    // 修改组织结构
    modifyOrgInfo() {
      this.$refs['orgForm'].validate((valid) => {
        if (valid) {
          updateOrgInfo(this.orgData).then(resp => {
            const res = resp.data
            if (res.code === 200) {
              this.$message({
                message: '修改组织结构成功',
                type: 'success'
              })
              this.disableStatus = false
              // 重新渲染组织结构数据
              this.getAllOrgInfo()
            } else {
              this.$message({
                message: res.code + ':' + res.msg,
                type: 'error'
              })
            }
          }).catch(
            this.$message({
              message: '更新组织结构失败',
              type: 'error'
            })
          )
        }
      })
    },
    // 删除组织结构
    delOrgInfo(orgData) {
      delOrgInfoById(orgData).then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.$message({
              message: '删除组织结构操作成功',
              type: 'success'
            })
            // 重新渲染组织结构数据
            this.getAllOrgInfo()
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      ).catch(
        this.$message({
          message: '删除组织结构失败',
          type: 'error'
        })
      )
    }
  }
}
</script>
