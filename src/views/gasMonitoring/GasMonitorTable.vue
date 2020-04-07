<template>
  <div class="m_tableContent m_gasMonitoring" @click="handleClick($event)">
    <div class="m_tableTitle gasTableTitle">
      <ul>
        <li v-for="(item,index) in titleData" :key="index"> {{ item }}</li>
      </ul>
    </div>
    <vue-seamless-scroll :data="listData" :class-option="classOption" class="seamless-warp ">
      <ul v-loading="loading" class="item seamless-table">
        <li v-for="(item,index) in listData" :key="index" class="seamless-row m_gasMonitorTable">
          <p class="m_rowItem ">{{ item.gasPositionId }}</p>
          <p v-if="item.createTime !== null" class="m_rowItem">{{ item.createTime | formatDateSecond }}</p>
          <p class="m_rowItem">{{ item.staffName }}</p>
          <p class="m_rowItem">
            <span :class="[item.co_type===0?'normalGas': [item.co_type===1 ?'warnGas1': [item.co_type === 2? 'warnGas2' : [item.co_type === 3? 'warnGas3': [item.co_type === 4? 'warnGas4': [item.co_type === 5? 'warnGas5':'m_rowItem'] ] ]] ] ]" >{{ item.co }}</span>
          </p>
          <p class="m_rowItem">
            <span :class="[item.ch4_type===0?'normalGas': [item.ch4_type===1 ?'warnGas1': [item.ch4_type === 2? 'warnGas2' : [item.ch4_type === 3? 'warnGas3': [item.ch4_type === 4? 'warnGas4': [item.ch4_type === 5? 'warnGas5':'m_rowItem'] ] ]] ] ]" >{{ item.ch4 }}</span>
          </p>
          <p class="m_rowItem">
            <span :class="[item.o2_type===0?'normalGas': [item.o2_type===1 ?'warnGas1': [item.o2_type === 2? 'warnGas2' : [item.o2_type === 3? 'warnGas3': [item.o2_type === 4? 'warnGas4': [item.o2_type === 5? 'warnGas5':'m_rowItem'] ] ]] ] ]" >{{ item.o2 }}</span>
          </p>
          <p class="m_rowItem">
            <span :class="[item.temperature_type===0?'normalGas': [item.temperature_type===1 ?'warnGas1': [item.temperature_type === 2? 'warnGas2' : [item.temperature_type === 3? 'warnGas3': [item.temperature_type === 4? 'warnGas4': [item.temperature_type === 5? 'warnGas5':'m_rowItem'] ] ]] ] ]" >{{ item.temperature }}</span>
          </p>
          <p class="m_rowItem">
            <span :class="[item.humidity_type===0?'normalGas': [item.humidity_type===1 ?'warnGas1': [item.humidity_type === 2? 'warnGas2' : [item.humidity_type === 3? 'warnGas3': [item.humidity_type === 4? 'warnGas4': [item.humidity_type === 5? 'warnGas5':'m_rowItem'] ] ]] ] ]" >{{ item.humidity }}</span>
          </p>
          <p class="m_rowItem2">{{ item.tempRoadName }}</p>
          <p class="m_rowItem">
            <button :id="item.staffId" :name="item.staffName" :data-dept="item.deptName" type="danger" class="el-button el-button--danger el-button--mini is-plain" plain size="mini">呼叫</button>
          </p>
        </li>
      </ul>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import { getGasInfor } from '@/api/gasMonitoring'
import eventVue from '@/api/eventVue'
export default {
  name: 'GasMonitorTable',
  data() {
    return {
      rowClass: 'm_rowItem',
      titleData: ['编号', '时间', '员工姓名', '一氧化碳(ppm)', '甲烷(%)', '氧气(%)', '温度(℃)', '湿度(%)', '地点', '操作'],
      staffInfo: { staffId: null, staffName: '', deptName: '' },
      loading: false,
      listLoading: false,
      num: 20,
      listData: [{ createTime: null, co_type: null, ch4_type: null, o2_type: null, temperature_type: null, humidity_type: null, humidity: null, temperature: null, tempRoadName: '' }]
    }
  },
  computed: {
    // 无缝滚动自定义属性
    classOption() {
      return {
        step: 0.5 // 修改滚动速度
        // hoverStop: false
      }
    }
  },
  created() {
    this.gasInfo()
  },
  methods: {
    handleClick(event) {
      // 判断当前点击的是否为button
      if (event.target.nodeName.toLowerCase() === 'button') {
        this.staffInfo.staffId = parseInt(event.target.id)
        this.staffInfo.staffName = event.target.name
        this.staffInfo.deptName = event.target.dataset.dept
        this.handlePhoneStaff()
      }
    },
    // 呼叫
    handlePhoneStaff() {
      this.$store.dispatch('showVoiceDialog')
      this.$nextTick(() => {
        eventVue.$emit('updateChatList', this.staffInfo) // 更新聊天列表
        eventVue.$emit('phoneListToWindow', this.staffInfo) // 将数据传到聊天窗口
      })
    },
    // 获取气体数据
    gasInfo() {
      if (this.listData.length < 10) {
        getGasInfor(this.num).then(resp => {
          if (resp.data.code === 200) {
            this.listData = resp.data.data
          } else if (resp.data.code === 111) {
            this.listData = []
          } else {
            this.$message({
              type: 'error',
              message: resp.data.code + resp.data.msg
            })
          }
        }).catch(e => { this.$message({ type: 'error', message: e }) })
      }
    }
  }
}
</script>
