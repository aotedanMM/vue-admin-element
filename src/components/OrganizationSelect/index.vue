<template>
  <div class="m_organizationSelect">
    <el-cascader
      :options="loadStaffOrganization"
      :props="optionProps"
      clearable
      placeholder="请选择部门"
      change-on-select
      separator="#"
      @change="setOrgId"/>
  </div>
</template>

<script>
import { getOrgInfo } from '@/api/organization'
export default {
  name: 'OrganizationSelectDialog',
  props: {

  },
  data() {
    return {
      loadStaffOrganization: [],
      optionProps: { value: 'id', label: 'name', children: 'children' }
    }
  },
  created() {
    this.getStaffOrganization() // 获取人员组织结构
  },
  methods: {
    // 选择部门
    setOrgId(event) {
      this.orgId = event[event.length - 1]
      this.$emit('receiveOrgId', this.orgId)
    },
    // 移除
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
    },
    // 获取人员组织结构
    getStaffOrganization() {
      getOrgInfo().then(
        resp => {
          const res = resp.data
          if (res.code === 200) {
            this.removeEmptyChildren(res.data[0])
            this.loadStaffOrganization = res.data
          } else {
            this.$message({
              message: res.code + ':' + res.msg,
              type: 'error'
            })
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
