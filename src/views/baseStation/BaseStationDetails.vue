<template>
  <!--查看基站详细信息-->
  <div id="m_stationDetails">
    <el-dialog :visible.sync="baseStationDetailsVisible" title="基站详细信息" @open="common.toggleBody(1)" @close="common.toggleBody(0)">
      <el-table
        :data="baseStationDetailsData">
        <el-table-column property="baseStationNum" label="基站编号"/>
        <el-table-column property="baseStationName" label="基站名称" width="200px"/>
        <el-table-column property="baseStationIp" label="基站IP"/>
        <el-table-column property="ssid" label="wifi名称"/>
        <el-table-column property="subnetMask" label="子网掩码"/>
        <el-table-column property="zoneName" label="所属区域"/>
        <el-table-column property="softwareVersion" label="软件版本号" width="100px"/>
        <el-table-column property="hardwareVersion" label="硬件版本号" width="100px"/>
        <el-table-column property="powerSupply" label="电池"/>
        <el-table-column property="channel" label="信道"/>
        <el-table-column property="emissivePower" label="发射功率" />
        <el-table-column property="frequency" label="上传频率（秒/s）" />
        <el-table-column property="antennaGain" label="天线增益"/>
        <el-table-column property="encryption" label="加密方式" width="120px"/>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
export default {
  name: 'BaseStationDetails',
  data() {
    return {
      baseStationDetailsData: [{}],
      baseStationDetailsVisible: false
    }
  },
  created() {
    this.handleDetailsBaseStationData() // 基站详情
  },
  beforeDestroy() {
    eventVue.$off('detailsBaseStation')
  },
  methods: {
    // 基站详情
    handleDetailsBaseStationData() {
      eventVue.$on('detailsBaseStation', (row) => {
        // object转array
        for (const i in row) {
          this.$set(this.baseStationDetailsData[0], i, row[i])
        }
        const encryptionData = this.baseStationDetailsData[0].encryption
        switch (encryptionData) {
          case 0:
            this.baseStationDetailsData[0].encryption = 'WPA-PSK/WPA2-PSK'
            break
          case 1:
            this.baseStationDetailsData[0].encryption = 'WPA/WPA2'
            break
          case 2:
            this.baseStationDetailsData[0].encryption = 'WEP'
            break
        }
        this.baseStationDetailsVisible = true
      })
    }
  }
}
</script>
