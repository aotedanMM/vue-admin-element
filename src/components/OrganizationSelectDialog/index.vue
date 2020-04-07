<template>
  <div>
    <el-dialog :visible.sync="orgSelectVisible" title="组织结构" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <div class="custom-tree-container">
        <el-tree
          :data="orgInfo"
          :expand-on-click-node="false"
          :indent="20"
          node-key="id"
          default-expand-all>
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span><span class="org_icon"/>{{ node.label }}</span>
            <span><el-button
              type="text"
              size="mini"
              @click="handleOkOrg(node, data)">
              选择
            </el-button></span>
          </span>
        </el-tree>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrgInfo } from '@/api/organization'
export default {
  name: 'OrganizationSelect',
  props: {

  },
  data() {
    return {
      orgSelectVisible: false,
      orgInfo: []
    }
  },
  created() {
    this.handleFetchOrgData() // 获取人员组织结构
  },
  methods: {
    // 获取人员组织结构
    handleFetchOrgData() {
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
        }).catch(e => {
        this.$message({
          type: 'error',
          message: e
        })
      })
    },
    // 显示人员选择对话窗
    handleOpenOrgSelect() {
      this.orgSelectVisible = true
    },
    // 选择组织结构
    handleOkOrg(node, data) {
      this.$emit('receiveOrg', data)
      this.orgSelectVisible = false
    },
    // 移除一项
    removeEmptyChildren(loadPartition) {
      const children = loadPartition.children
      if (children != null && children.length > 0) {
        for (var i in children) {
          this.removeEmptyChildren(children[i])
        }
      } else {
        delete loadPartition.children
      }
      return loadPartition
    }

  }
}
</script>
