<template>
  <div class="m_areaSelect">
    <el-cascader
      :options="loadPartition"
      :props="optionProps"
      clearable
      placeholder="请选择区域"
      change-on-select
      separator="#"
      @change="setZoneId"
    />
  </div>
</template>
<script>
import { getPartitionInfo } from '@/api/partition'
export default {
  name: 'AreaSelect',
  data() {
    return {
      loadPartition: [],
      optionProps: { value: 'id', label: 'partitionName', children: 'children' },
      partitionInfo: [],
      setZoneVisible: false,
      partitionName: '',
      baseStationForm: {}
    }
  },
  created() {
    this.getAllPartitionInfo() // 获取所有区域
  },
  methods: {
    // 获取所有区域
    getAllPartitionInfo() {
      getPartitionInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.removeEmptyChildren(res.data[0])
            this.loadPartition = res.data
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
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
    },
    // 选择区域
    setZoneId(event) {
      if (event.length > 0) {
        this.wsOrgId = event[event.length - 1]
      } else {
        this.wsOrgId = null
      }
      // console.log(this.wsOrgId)
      this.$emit('returnPartitionId', this.wsOrgId)// 子组件与父组件通信 返回当前选中的区域ID
    }
  }
}
</script>
