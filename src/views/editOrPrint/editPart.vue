<template>
  <div>
    <el-table :data="editPartData" border >
      <el-table-column label="ID" width="80px">
        <template slot-scope="scope">
          <span> {{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑名称">
        <template slot-scope="scope">
          <span> {{ scope.row.editName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑描述">
        <template slot-scope="scope">
          <span> {{ scope.row.editDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handleEdit(scope.row.path)"> 编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EditPart',
  data() {
    return {
      editPartData: [
        { ID: '1', editName: '基站信息管理', path: '/equipment/baseStation', editDesc: '基站参数设置' },
        { ID: '2', editName: '终端信息管理', path: '/equipment/terminal', editDesc: '终端参数设置' },
        { ID: '3', editName: '矿下区域管理', path: '/equipment/partition', editDesc: '井下区域、重点区域、限制区域的编辑' },
        { ID: '4', editName: '人员信息管理', path: '/people/staffInfo', editDesc: '人员信息相关数据的编辑' },
        { ID: '5', editName: '组织结构管理', path: '/people/orgInfo', editDesc: '井下员工所属分组结构信息的编辑' },
        { ID: '6', editName: '工种类别管理', path: '/people/staffJob', editDesc: '井下员工工种类别编辑' },
        { ID: '7', editName: '警报等级管理', path: '/system/warnLevelManage', editDesc: '警报等级参数设置' },
        { ID: '8', editName: '警报标准管理', path: '/system/warnStandardManage', editDesc: '警报标准及标准对应的各种气体参数设置' },
        { ID: '9', editName: '系统声音', path: '/system/systemVoice', editDesc: '系统各种警报提示音的设置' }
      ]
    }
  },
  methods: {
    handleEdit(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style scoped>

</style>
