<template>
  <div>
    <el-tabs v-model= "standardName" type="card" class="m_tableContent2" closable @tab-remove="removeTab" @tab-click="handleStandardData">
      <el-tab-pane
        v-for="item in standardData"
        :key="item.standardId"
        :label="item.standardName"
        :name="item.standardName"
      />
    </el-tabs>
    <div class="m_standardDescT">
      <div class="m_standardDesc">
        <span v-if="standardInfo.createTime = 'undefined'">创建时间:</span>
        <span v-else>创建时间:{{ standardInfo.createTime | formatDate }}</span>
        <span>标准描述：{{ standardInfo.standardDesc }} </span>
        <span>甲烷标准：{{ standardInfo.ch4Standard }} </span>
        <span>一氧化碳标准：{{ standardInfo.coStandard }} </span>
        <span>氧气描述：{{ standardInfo.o2Standard }} </span>
        <span>温度标准：{{ standardInfo.tStandard }} </span>
        <span>湿度标准：{{ standardInfo.hStandard }} </span>
      </div>
      <div class="m_standardDescR">
        <el-button size="small" type="success" plain @click="handleAddStandard">新增标准</el-button>
        <el-button size="small" type="primary" plain @click="handleUpdateStandard(standardInfo)">编辑标准</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { fetchStandardInfo, deleteStandardInfoById } from '@/api/warnlevel'
export default {
  name: 'StandardTabs',
  props: {
    standardInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isCheckPassword: false,
      standardData: [],
      standardName: '',
      editableTabs2: [{ title: '标准1', name: '1', content: 'Tab 1 content' }, { title: '标准2', name: '2', content: 'Tab 2 content' }],
      tabIndex: 2
    }
  },
  watch: {
    standardData: function() {
      for (const i of this.standardData) {
        if (this.standardName === i.standardName) {
          this.standardId = i.standardId
        }
      }
      this.$emit('fetchWarnGasLevelByParams', this.standardId)// 根据标准id获取当前标准下的气体数据信息
      eventVue.$emit('fetchStandardId', this.standardId) // 兄弟组件通信 获取当前标准气体数据ID
    }
  },
  created() {
    this.handleFetchStandardInfo() // 获取所有标准信息
    this.checkPassWordResult() // 兄弟组件通信
  },
  beforeDestroy() {
    eventVue.$off('checkPassWordResult')
    eventVue.$off('fetchStandardInfo')
  },
  methods: {
    // 兄弟组件通信
    checkPassWordResult() {
      // 传递校验结果
      eventVue.$on('checkPassWordResult', (isCheckPassword) => {
        this.isCheckPassword = isCheckPassword
      })
      // 获取所有标准数据
      eventVue.$on('fetchStandardInfo', () => {
        this.handleFetchStandardInfo()
      })
    },
    // 获取所有标准数据
    handleFetchStandardInfo() {
      fetchStandardInfo().then(resp => {
        if (resp.data.code === 200) {
          this.standardData = resp.data.data
          this.standardId = this.standardData[0].standardId
          this.standardName = this.standardData[0].standardName
        } else if (resp.data.code === 111) {
          this.standardData = []
          this.standardId = null
          this.standardName = ''
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 新增标准数据
    handleAddStandard() {
      eventVue.$emit('createStandard')
    },
    // 编辑标准数据
    handleUpdateStandard(standardInfo) {
      eventVue.$emit('updateStandard', standardInfo)
    },
    // 根据tab的值获取相应标准下的气体等级数据
    handleStandardData() {
      // 根据tabName 与现有的 standardData中的数据做比较找到standardName对应的standardId
      for (const i of this.standardData) {
        if (this.standardName === i.standardName) {
          this.standardId = i.standardId
        }
      }
      this.$emit('fetchWarnGasLevelByParams', this.standardId)// 根据标准id获取当前标准下的气体数据信息
      eventVue.$emit('fetchStandardId', this.standardId) // 兄弟组件通信 获取当前标准气体数据ID
    },
    // 删除标准tab
    removeTab(targetName) {
      // 判断是否进行了密码校验
      if (this.isCheckPassword === false) {
        eventVue.$emit('checkPassWordData')
      } else {
        this.$confirm('此操作将永久删除该标准, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 根据tabName 与现有的 standardData中的数据做比较找到standardName对应的standardId
          for (const i of this.standardData) {
            if (targetName === i.standardName) {
              this.standardId = i.standardId
            }
          }
          this.deleteStandardInfo()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 删除警报标准
    deleteStandardInfo() {
      deleteStandardInfoById(this.standardId).then(resp => {
        if (resp.data.code === 200) {
          // 新增操作记录
          const str = '删除警报标准:' + this.standardName
          this.requestFun.handleAddOperateData(str)
        } else {
          this.$message({
            type: 'error',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
        this.handleFetchStandardInfo() // 删除标准后重新获取tab内容
      }).catch(e => { this.$message({ type: 'error', message: e }) })
    }
  }
}
</script>
