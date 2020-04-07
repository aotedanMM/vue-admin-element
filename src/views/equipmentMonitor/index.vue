<template>
  <div class="app-container equContainer">
    <!--图例-->
    <div class="m_legend2 m_tableTopRowRight">
      <ul>
        <li><p class="euqLegend1"/>工作正常</li>
        <li><p class="euqLegend2"/>工作异常</li>
      </ul>
    </div>
    <!--井上-->
    <div class="well">
      <div class="euqGroup2">
        <p class="euqItem host">打印机</p>
        <!--<div class="rowLine"/>-->
        <!--<p class="euqItem printer">打印机</p>-->
      </div>
      <div class="columnLine"/>
      <div class="rowLine2"/>
      <div class="euqGroup">
        <div class="columnLine2"/>
        <div class="columnLine3"/>
        <div class="columnLine4"/>
        <div class="columnLine5"/>
        <div class="rowLine groupRowLine"/>
        <div class="columnLine groupColumnLine"/>
        <p class="euqItem upsPower">ups电源</p>
        <p class="euqItem masterServer">主机</p>
        <p class="euqItem spareServer">备机</p>
        <p class="euqItem lightningProtection">电源避雷器</p>
      </div>
      <div class="rowLine2"/>
      <div class="columnLine"/>
      <p class="euqItem switch">TP-Link三层交换机</p>
      <div class="columnLine"/>
      <div class="euqGroup2">
        <p class="euqItem2 station">基站</p>
        <div class="rowLine"/>
        <p class="euqItem2 power">电源</p>
      </div>
    </div>
    <!--分割线-->
    <div class="splitLine">
      <div class="splitLine1">
        <div class="shadow">
          <div class="splitLine11"/>
          <div class="splitLine11"/>
          <div class="splitLine11"/>
        </div>
      </div>
      <div class="splitLine2">
        <p class="wellTop">井上</p>
        <p class="wellBottom">井下</p>
        <div class="shadow">
          <div class="splitLine11"/>
          <div class="splitLine11"/>
          <div class="splitLine11"/>
        </div>
      </div>
    </div>
    <!--井下-->
    <div class="wellBottomContainer">
      <p class="columnLine8"/>
      <p class="columnLine9"/>
      <p class="turnLine"/>
      <!--<p class="turnLine2"/>-->
      <p class="rowLine3"/>
      <p class="rowLine4"/>
      <div class="splitLine21"/>
      <div class="splitLine22"/>
      <div class="splitLine23"/>
      <div class="splitLine24"/>
      <div class="wellBottomStation5">
        <p class="euqItem2 station6">基站</p>
        <div class="columnLine"/>
        <p class="euqItem2 power6">电源</p>
      </div>

      <div class="wellBottomStation1">
        <p class="euqItem2 station2">基站</p>
        <p class="rowLine"/>
        <p class="euqItem2 power2">电源</p>
      </div>
      <div class="wellBottomStation2">
        <p class="euqItem2 station3">基站</p>
        <p class="rowLine"/>
        <p class="euqItem2 power3">电源</p>
      </div>
      <div class="wellBottomStation3">
        <p class="euqItem2 power4">电源</p>
        <p class="rowLine"/>
        <p class="euqItem2 station4">基站</p>
      </div>
      <div class="wellBottomStation4">
        <p class="euqItem2 power5">电源</p>
        <p class="rowLine"/>
        <p class="euqItem2 station5">基站</p>
      </div>
      <!--树形-->
      <p class="columnLine31"/>
      <p class="columnLine32"/>
      <div class="wellBottomStation31">
        <p class="euqItem2 power4">电源</p>
        <p class="rowLine"/>
        <p class="euqItem2 station4">基站</p>
      </div>
      <div class="wellBottomStation32">
        <p class="euqItem2 power4">电源</p>
        <p class="rowLine"/>
        <p class="euqItem2 station4">基站</p>
      </div>
      <!--环形-->
      <p class="columnLine33"/>
      <div class="wellBottomStation21">
        <p class="euqItem2 station4">基站</p>
        <p class="rowLine"/>
        <p class="euqItem2 power4">电源</p>
      </div>

      <div class="wellBottomStation22">
        <p class="euqItem2 station4">基站</p>
        <p class="rowLine"/>
        <p class="euqItem2 power4">电源</p>
      </div>

      <div class="wellBottomStation23">
        <p class="euqItem2 power4">电源</p>
        <p class="rowLine"/>
        <p class="euqItem2 station4">基站</p>
      </div>

      <div class="wellBottomStation24">
        <p class="euqItem2 station4">基站</p>
        <p class="rowLine"/>
        <p class="euqItem2 power4">电源</p>
      </div>

      <!--终端-->
      <div class="wellTerminal">
        <P class="euqItem2 euqTerminal">终端</P>
        <img src="static/img/wifi.png" class="wifiImg">
      </div>
      <div class="wellTerminal2">
        <P class="euqItem2 euqTerminal2">终端</P>
        <img src="static/img/wifi.png" class="wifiImg2">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EquipmentMonitor',
  data() {
    return {

    }
  },
  created() {
    this.handleDrawSystemFramework()
  },
  methods: {
    // 绘制系统架构图
    handleDrawSystemFramework() {
    }

  }
}
</script>
