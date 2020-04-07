<template>
  <div>
    <div class="gasLevelPart2">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span style="color: #fff">一氧化碳警报等级设置</span>
          <el-button class="m_boxCardBtn" type="text" @click="handleCreateGasLevelInfo()">新增</el-button>
        </div>
        <div >
          <el-table :data="coGasLevelInfo" fit style="width: 100%">
            <el-table-column label="ID" align="center" width="40">
              <template slot-scope="scope">
                <span>{{ scope.row.levelDataId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="警报等级" align="center" min-width="70" >
              <template slot-scope="scope">
                <span>{{ scope.row.levelName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报警倍数" align="center" min-width="70">
              <template slot-scope="scope">
                <span>{{ scope.row.multiple }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上限持续时间" align="center" min-width="70">
              <template slot-scope="scope">
                <span>{{ scope.row.upperContinuedTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column label="下限持续时间" align="center" min-width="70">
              <template slot-scope="scope">
                <span>{{ scope.row.lowerContinuedTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="handleUpdateGasLevelInfo(scope.row)">修改</el-button>
                <el-button type="danger" plain size="mini" @click="handleDeleteGasLevelInfo(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'CoWarnLevel',
  props: {
    coGasLevelInfo: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      coGasType: 1
    }
  },
  watch: {
    coGasLevelInfo: function() {
      if (this.coGasLevelInfo.length !== 0) {
        this.coGasType = this.coGasLevelInfo[0].gasType
      }
    }
  },
  created() {
    this.handleFetchStandardId() // 兄弟组件通信 获取当前警报标准ID
  },
  beforeDestroy() {
    eventVue.$off('fetchStandardId')
  },
  methods: {
    // 兄弟组件通信 获取当前警报标准ID
    handleFetchStandardId() {
      eventVue.$on('fetchStandardId', (standardId) => {
        this.standardId = standardId
      })
    },
    // 新增气体警报等级
    handleCreateGasLevelInfo() {
      eventVue.$emit('createGasLevel', this.coGasType, this.standardId)
    },
    // 编辑气体警报等级
    handleUpdateGasLevelInfo(row) {
      eventVue.$emit('updateGasLevel', row)
    },
    // 删除气体警报等级
    handleDeleteGasLevelInfo(row) {
      eventVue.$emit('deleteGasLevel', row)
      // 添加操作记录
      const str = '删除一氧化碳警报等级：' + row.levelName
      this.requestFun.handleAddOperateData(str)
    }
  }
}
</script>

