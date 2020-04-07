<template>
  <div>
    <!--组织结构-->
    <el-dialog :visible.sync="setZoneVisible" title="组织结构" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <div class="custom-tree-container">
        <el-tree
          :data="partitionInfo"
          :expand-on-click-node="false"
          :indent="20"
          node-key="id"
          default-expand-all>
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span><span class="org_icon"/>{{ node.label }}</span>
            <span><el-button
              type="text"
              size="mini"
              @click="handleSelectPartition(node, data)">
              选择
            </el-button></span>
          </span>
        </el-tree>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
import { getPartitionInfo } from '@/api/partition'
export default {
  name: 'SetZone',
  data() {
    return {
      setZoneVisible: false,
      partitionInfo: null,
      partitionName: '',
      baseStationForm: {}
    }
  },
  created() {
    this.handleFetchZone() // 兄弟组件通讯选择区域
    this.handleOpenSelectPartitionInfo() // 获取所有区域
  },
  methods: {
    // 兄弟组件通讯选择区域
    handleFetchZone() {
      eventVue.$on('selectPartitionInfo', () => {
        this.handleOpenSelectPartitionInfo()
        this.setZoneVisible = true
      })
    },
    // 打开选择区域弹窗,获取所有区域信息
    handleOpenSelectPartitionInfo() {
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
    },
    // 选中区域
    handleSelectPartition(node, data) {
      this.setZoneVisible = false
      this.selectPartition = data
      this.partitionName = data.partitionName
      eventVue.$emit('returnPartition', this.selectPartition)
    },
    // 移除当前选中的区域
    removeEmptyChildren(loadPartition) {
      const children = loadPartition.children
      if (children != null && children.length > 0) {
        for (const i in children) {
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
