<template>
  <el-cascader
    :options="loadStaffOrganization"
    :props="optionProps"
    clearable
    placeholder="请选择部门"
    change-on-select
    separator="\"
    @change="setOrgId"
  />
</template>

<script>
import { getOrgInfo } from '@/api/organization'
export default {
  name: 'DeptSelect',
  data() {
    return {
      loadStaffOrganization: [],
      wsOrgId: null,
      optionProps: { value: 'id', label: 'name', children: 'children' }
    }
  },
  created() {
    this.getStaffOrganization() // 获取部门信息
  },
  methods: {
    // 获取部门信息
    getStaffOrganization() {
      getOrgInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.removeEmptyChildren(res.data[0])
            this.loadStaffOrganization = res.data
          } else if (res.code !== 111) {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    },
    // 选择部门
    setOrgId(event) {
      this.wsOrgId = event[event.length - 1]
      this.$emit('returnDeptId', this.wsOrgId)// 子组件与父组件通信 返回当前选中的部门ID
    },
    // 移除子项
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

