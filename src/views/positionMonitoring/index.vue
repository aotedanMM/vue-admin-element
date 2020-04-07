<template>
  <div class="app-container" style="margin: 0 !important;padding: 0 !important;">
    <el-row class="m_tableTopRow3">
      <el-col :xs="20" :sm="20" :md="15" :lg="14" :xl="14" class="m_row1">
        <!--悬浮窗 筛选推送气体-->
        <float-window-filter
          ref="floatWindowFilterRefs"
          @showTerminalNum="showTerminalNum"
          @closeTerminalNum="closeTerminalNum"
          @removePartOfStation="handleRemovePartOfStation"/>
      </el-col>
      <el-col :xs="20" :sm="20" :md="9" :lg="10" :xl="10" class="m_row2">
        <!--悬浮窗-->
        <float-window
          ref="floatWindowRefs"
          @openWarnAreaDialog="handleOpenWarnAreaDialog"
          @openDownHoleDialog="handleOpenDownHoleDialog"
        />
      </el-col>
    </el-row>
    <!--地图图例-->
    <el-row class="m_tableTopRow5">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <map-legend/>
      </el-col>
    </el-row>
    <!--井下人数-->
    <down-hole
      ref="downHoleRefs"
      :down-hole-visible="downHoleVisible"
      @closeDownHoleDialog="handleCloseDownHoleDialog"
    />
    <!--限制区域人数-->
    <warn-area
      ref="warnAreaRefs"
      :warn-area-visible="warnAreaVisible"
      @closeWarnAreaDialog="handleCloseWarnAreaDialog"
    />
    <!--wifi探针详情-->
    <wifi-probe
      ref="wifiProbeRefs"
      :person-detail="personDetail"
      :probe-query="probeQuery"
      :wifi-probe-visible="wifiProbeVisible"
      @closeWifiProbe="handleCloseWifiProbeDialog"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
    />
    <!--地图-->
    <div class="m_Map">
      <div id="fengmap" style="height: 900px !important;"/>
    </div>
    <!--点击地图区域显示区域内人员-->
    <area-staff-detail ref="areaStaffDetailRef"/>
  </div>
</template>
<script>
/* eslint-disable */
import eventVue from '@/api/eventVue'
import WifiProbe from './components/WifiProbe/index'
import CreateBubble from '@/assets/js/CreateBubble'
import FloatWindow from './components/FloatWindow/index'
import DownHole from './components/DownHole/index'
import WarnArea from './components/WarnArea/index'
import FloatWindowFilter from './components/FloatWindowFilter/index'
import { fetchUsedStation, getMacNum, fetchStaffPosition } from '@/api/station'
// import { getAllWarningAreaData, inWarningArea, outWarningArea } from '@/api/mapArea'
import { getAllWarningAreaData, fetchAreaStaffNum } from '@/api/mapArea'
import { findPersonDetailInfo } from '@/api/macStation'
import MapLegend from './components/MapLegend/index'
import AreaStaffDetail from './components/AreaStaffDetail/index'
const fmapID = 'wifi-875'
const fengmap = require('fengmap')
const ctlOpt1 = new fengmap.controlOptions({
  // 设置显示的位置为左上角
  position: fengmap.controlPositon.LEFT_TOP,
  // 位置x,y的偏移量
  offset: {
    x: 20,
    y: 60
  },
  imgURL: 'static/img/'
})
const obj = new Map()
let popMak
let AreaAlert
const tzMap = new Map()
const tzCloseMap = new Set()
export default {
  name: 'PositionMonitoring',
  components: { AreaStaffDetail, MapLegend, WifiProbe, FloatWindowFilter, FloatWindow, DownHole, WarnArea },
  inject: ['reload'],
  data: function() {
    return {
      areaStaffNum: 10,
      data:[],
      mapLoadStatus: false,
      positionTimer: null,
      resultArr: [],
      times: 0,
      wifiProbeVisible: false,
      downHoleVisible: false,
      warnAreaVisible: false,
      personDetail: [],
      probeQuery: { total: 0, pageSize: 10, startPage: 1 },
      downHoleData: {},
      popMarker: null,
      currentGid: null,
      eventID: null,
      stationArr: [],
      bubbleObj: null,
      positionData: '',
      bubbleName: '',
      bubblePosition: '',
      map: null,
      im: '',
      fmapID: '',
      groupID: '',
      zoomControl: '',
      isDynamicMarker: true, // 地图的点击事件是否可用
      zoomVisible: true, // 控制放大、缩小控件显示/隐藏
      changeMarker: false, // 控制改变图片标注
      addMarker: false, // 控制添加图片标注
      stationForm: { baseStationId: '', x: '', y: '', z: '' }, // 根据基站ID获取位置信息
      position: '',
      layer: null,
      positionNow: { x: 12956619, y: 4851679 }, // 实时位置坐标
      stationMap: {}
    }
  },
  created() {
    this.handleCommit()
    this.init()
    this.fetchAllUsedStation()
    if (this.$route.params.staffId !== undefined) {
      this.handleStaffPosition() // 传入员工ID,在地图显示员工位置
    }
  },
  mounted(){

  },
  beforeDestroy() {
    eventVue.$off('changeStation')
    eventVue.$off('removeStation')
  },
  destroyed() {
    clearInterval(this.positionTimer)// 清除定时器
    this.positionTimer = null
    // 判断监听事件是否存在若存在移除监听事件
    if(this.fetchBtn) {
    this.fetchBtn.removeEventListener('click',this.handleShowAreaStaff) // 移除查看人员按钮的监听事件
    }
  },
  methods: {
    // 兄弟组件通信
    handleCommit() {
      // 接收推送的数据打点
      eventVue.$on('changeStation', (gasWSRespVO) => {
        // console.log(gasWSRespVO)
        // 推送的数据不为空 && 推送的数据中包含定位X、Y的坐标信息方能打点
        if(gasWSRespVO && gasWSRespVO.terminalRoad.positionX && gasWSRespVO.terminalRoad.positionY ) {
        // 当地图加载完成后才能进行打点操作
        if (this.mapLoadStatus) {
          this.changeDataStation(gasWSRespVO)
        }
        }
      })
      // 移除打的点
      eventVue.$on('removeStation', (staffId) => {
        // 当地图加载完成后才能进行打点操作
        if (this.mapLoadStatus) {
          this.removeDataStation(staffId)
        }
      })
    },
    // 地图加载完成
    mapLoadComplete() {
      const that = this
      this.map.on('loadComplete', function() {
        // 放大、缩小控件
        that.zoomInControl()
        that.currentGid = that.map.focusGroupID // 获取全局的焦点楼层id
        // 添加定时器,分批渲染基站
        if (that.resultArr.length !== 0) {
          setTimeout(() => {
            that.addSetInterval() // 添加定时器
          }, 2000)
        }
        that.getElectronicFenceData()
        // 初始化气泡对象
        that.bubbleObj = new CreateBubble(that.map)
        that.mapHoverNode()
        that.mapClickNode()
        that.mapLoadStatus = true // 地图加载完成标记
      })
    },
    // 地图点击事件
    mapClickNode() {
      const that = this
      this.map.on('mapClickNode', function(event) {
        if (event.nodeType === fengmap.FMNodeType.NONE) return
        if(event.typeID === 200200){
          that.areaId = event.target.ID
          // console.log(event)
          // console.log(event.target.ID)
          const coord = {
            positionX: event.x,
            positionY: event.y,
          }
          that.handleFetchAreaStaff(coord)
        }
      })
    },
    // 获取当前区域人员数量并显示信息窗口
    async handleFetchAreaStaff(coord) {
      await this.handleFetchAreaStaffNum()
      this.addAreaAlert(coord)
    },
    // 获取当前区域人员数量
    async handleFetchAreaStaffNum() {
      await fetchAreaStaffNum(this.areaId).then(resp=>{
        console.log(resp.data)
        if(resp.data.code === 200) {
          this.areaStaffNum = resp.data.data
        } else {
          this.areaStaffNum = 0
          this.$message({
            type: 'warning',
            message: resp.data.code + ':' + resp.data.msg
          })
        }
      })
    },
    // 新增区域人员信息框
    addAreaAlert(coord) {
      const that = this
      // console.log(event)
      that.removeAreaAlert()
      // 信息框控件大小配置
      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          x: coord.positionX, // 设置弹框的x轴
          y: coord.positionY, // 设置弹框的y轴
          height: 1, // 控制信息窗的高度
          groupID: 1 // 设置弹框位于的楼层
        },
        width: 180, // 设置弹框的宽度
        height: 90, // 设置弹框的高度
        marginTop: -25,
        // 设置弹框的内容
        content: '当前区域人数：' + that.areaStaffNum +'<br/>' + '<button id="fetchStaff">查看人员</button>' ,
        closeCallBack: function() {
          // 信息窗点击关闭操作
        }
      })
      that.handleBtnClick()
      AreaAlert = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
      return AreaAlert
    },
    // 添加查看人员的按钮点击监听事件
    handleBtnClick() {
      const that = this
      setTimeout(()=>{
        that.fetchBtn = document.getElementById('fetchStaff')
        that.fetchBtn.addEventListener('click',this.handleShowAreaStaff)
      },100)
    },
    // 显示区域人员信息窗口
    handleShowAreaStaff() {
      this.removeAreaAlert()
      this.$refs.areaStaffDetailRef.handleOpenDialog(this.areaId)
    },
    // 移除区域人员信息框
    removeAreaAlert() {
      if (AreaAlert) {
        AreaAlert.close()
        AreaAlert = null
      }
    },
    // 筛选推送条件
    handleRemovePartOfStation() {
      for (const key in obj) {
        this.layer.removeMarker(obj[key])
      }
    },
    // 添加定时器
    addSetInterval() {
      const that = this // 声明一个变量指向vue实例this,保证作用域一致
      this.positionTimer = setInterval(() => {
        if (that.resultArr.length < that.times) {
          clearInterval(that.positionTimer)
          that.positionTimer = null
        } else {
          // 分批部署基站
          if (that.times < that.resultArr.length) {
            that.deployBaseStation()
          }
          that.times++
        }
      }, 1000)
    },
    // 分批部署基站
    deployBaseStation() {
      const temporaryArr = this.resultArr[this.times]
      for (let i = 0; i < temporaryArr.length; i++) {
        tzMap.set(temporaryArr[i].baseStationNum, temporaryArr[i])
        // 遍历获取到的已部署的基站的位置信息的数组，调用addMarker方法
        this.bubbleName = temporaryArr[i].baseStationName
        this.bubbleNameX = parseInt(temporaryArr[i].positionX)
        this.bubbleNameY = parseInt(temporaryArr[i].positionY)
        this.bubbleName = '@' + temporaryArr[i].baseStationNum + '@' + this.bubbleName + '<br/>' + '(' + this.bubbleNameX + ',' + this.bubbleNameY + ')'
        this.addMarkers(this.currentGid, temporaryArr[i], this.bubbleName)
      }
    },
    // 获取所有已使用的基站信息
    fetchAllUsedStation() {
      fetchUsedStation().then(resp => {
        console.log('获取所有已使用的基站信息')
        console.log(resp.data)
        const result = resp.data
        if (result.code === 200) {
          this.stationArr = resp.data.data
          for (let i = 0, len = this.stationArr.length; i < len; i += 10) {
            this.resultArr.push(this.stationArr.slice(i, i + 10))
          }
        } else {
          this.$message({
            message: result.code + ':' + result.msg,
            type: 'warning'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    // 打开井下人员窗口
    handleOpenDownHoleDialog() {
      this.downHoleVisible = true
    },
    // 关闭井下人员窗口
    handleCloseDownHoleDialog() {
      this.downHoleVisible = false
    },
    // 打开警告区域人员窗口
    handleOpenWarnAreaDialog() {
      this.warnAreaVisible = true
    },
    // 关闭警告区域人员窗口
    handleCloseWarnAreaDialog() {
      this.warnAreaVisible = false
    },
    // 打开wifi探针人员详情
    handleOpenWIfiProbeDialog() {
      this.wifiProbeVisible = true
    },
    // 关闭wifi探针人员详情
    handleCloseWifiProbeDialog() {
      this.wifiProbeVisible = false
      this.personDetail = []
      this.probeQuery.startPage = 1
    },
    // wifi探针人员详情页改变每页显示条数
    handleSizeChange(probeQuery) {
      this.probeQuery = probeQuery
      this.listenerHandle2()
    },
    // wifi探针人员详情页改变当前页数
    handleCurrentChange(probeQuery) {
      this.probeQuery = probeQuery
      this.listenerHandle2()
    },
    // wifi探针详情
    listenerHandle2() {
      findPersonDetailInfo(this.probeQuery).then((resp) => {
        const result = resp.data
        if (result.code === 200) {
          this.personDetail = result.data.list
          this.probeQuery.total = result.data.total
        } else if(result.code === 111) {
          this.personDetail = []
          this.probeQuery.total = 0
        }else{
          this.$message({
            type: 'warning',
            message: result.code + ': ' + result.msg
          })
        }
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: e
        })
      })
      this.handleOpenWIfiProbeDialog()
    },
    // 点击wifi探针的详情，回调函数
    listenerHandle(e) {
      const stationId = e.target.getAttribute('data-stationId')
      // todo 显示页面
      this.probeQuery.stationId = stationId
      findPersonDetailInfo(this.probeQuery).then((resp) => {
        const result = resp.data
        if (result.code === 200) {
          this.personDetail = result.data.list
          this.probeQuery.total = result.data.total
        }else if(result.code === 111) {
          this.personDetail = []
          this.probeQuery.total = 0
        }else{
          this.$message({
            type: 'warning',
            message: result.code + ': ' + result.msg
          })
        }
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: e
        })
        // this.$refs.wifiProbeRefs.handleShow()
      })
      this.wifiProbeVisible = true
      this.handleOpenWIfiProbeDialog()
    },
    createAlert(stationId, name) {
      const val = tzMap.get(stationId)
      const position = {
        x: val.positionX,
        y: val.positionY,
        z: this.map.getGroupHeight(this.map.focusGroupID) + this.map.layerLocalHeight,
        name: '附近终端数量：' + name
      }
      // 信息框控件大小配置
      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          // 设置弹框的x轴
          x: position.x,
          // 设置弹框的y轴
          y: position.y,
          height: position.z, // 控制信息窗的高度
          // 设置弹框位于的楼层
          groupID: this.map.focusGroupID
        },
        width: 160,
        height: 90,
        marginTop:-30,
        content: '附近终端数量：' + name + '<button class = "btn-sss" data-stationId =  ' + stationId + ' >详细信息</button>',
        closeCallBack: function() {
        }
      })
      const popMarker = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
      tzCloseMap.add(popMarker)
    },
    closeTerminalNum() {
      this.handleCloseWifiProbeDialog()
      for (const item of tzCloseMap) {
        item.close()
      }
    },
    showTerminalNum() {
      getMacNum().then(resp => {
        const result = resp.data
        if (result.code === 200) {
          const macNum = result.data
          if (macNum.length > 0) {
            for (let i = 0; i < macNum.length; i++) {
              const macNum1 = macNum[i].macCount
              const t_stationId = macNum[i].stationId
              this.createAlert(t_stationId, macNum1)
            }
            // 对每一个气泡添加点击监听事件
            const selectClass = document.getElementsByClassName('btn-sss')
            for (let i = 0; i < selectClass.length; i++) {
              selectClass[i].addEventListener('click', this.listenerHandle)
            }
          }
        } else {
          this.$message({
            message: result.code + ': ' + result.msg,
            type: 'warning'
          })
        }
      })
    },
    // 传入员工ID,在地图显示员工位置
    handleStaffPosition() {
      this.staffId = this.$route.params.staffId
      this.staffPositionType = true
      fetchStaffPosition(this.staffId).then(resp => {
        if (resp.data.code === 200) {
          // 定位类型为人员定位
          this.positionNow.positonType = 1
          // 通过基站ID查询到基站的位置信息，完成在地图上显示
          this.positionNow.positionX = resp.data.data.positionX
          this.positionNow.positionY = resp.data.data.positionY
          this.positionNow.positionZ = resp.data.data.positionZ
        }
      })
    },
    init() {
      const that = this
      const compassVisible = true
      // 放大、缩小控件配置
      this.$nextTick(() => {
        that.map = new fengmap.FMMap({
          container: document.getElementById('fengmap'), // 设置显示地图容器
          // 设置本地地图数据的相对路径。对应的地图文件为:data/{fmapID}/{fmapID}.fmap
          key: '7d0bb8ec7d6c5359431e3223e1b91e98', // 开发者申请应用下web服务的key
          mapServerURL: 'static/data/' + fmapID, // 地图数据位置
          mapThemeURL: 'static/data/theme', // 设置主题
          defaultThemeName: 'map-zkxh', // 设置默认主题
          appName: 'zkxhmap', // 开发者应用名称
          mapScaleLevelRange: [16, 23], // [15, 29], 比例尺级别范围， 16级到23级
          defaultMapScaleLevel: 18, // 默认比例尺级别设置为19级
          defaultControlsPose: fengmap.FMDirection.NORTH, // 设置地图朝向
          focusAnimateMode: true, // 开启聚焦层切换的动画显示
          viewModeAnimateMode: true, // 开启2维，3维切换的动画显示
          moveToAnimateMode: false // 地图定位跳转动画设置
        })
        // 设置地图为二维显示模式
        that.map.viewMode = fengmap.FMViewMode.MODE_3D
        // 打开Fengmap服务器的地图数据和主题
        that.map.openMapById(fmapID, function(error) {
          // 打印错误信息
          console.log(error)
        })
        // 显示指北针
        that.map.showCompass = compassVisible
        // 点击指南针事件, 使角度归0
        that.map.on('mapClickCompass', function() {
          that.map.rotateTo({
            // 设置角度
            to: 0,
            // 动画持续时间，默认为。3秒
            duration: 0.3,
            callback: function() { // 回调函数
            }
          })
        })
        // 地图标记事件，loadComplete为地图加载完成后执行的map事件
        that.map.gestureEnableController.enableMapHover = true
        // 注入地图加载完成函数
        that.mapLoadComplete()
        // that.mapHoverNode()
        // 显示人员位置
      })
    },
    zoomInControl() {
      new fengmap.zoomControl(this.map, ctlOpt1)
    },
    // 获取某一层模型数据
    getFMGroup() {
      const group = this.map.getFMGroup(this.map.focusGroupID)
      return group
    },
    // 鼠标悬浮事件
    mapHoverNode() {
      const that = this
      this.map.on('mapHoverNode', function(event) {
        const coord = event.eventInfo.coord
        const gid = event.groupID
        const name = event.name || event.name_
        if (event.nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
          that.addPopWin(coord, gid, name, event)
        }
      })
    },
    // 新增弹出框
    addPopWin(coord, gid, txt, event) {
      const that = this
      console.log(event)
      that.removePopWin()
      // 信息框控件大小配置
      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          x: event.target.x, // 设置弹框的x轴
          y: event.target.y, // 设置弹框的y轴
          height: 1, // 控制信息窗的高度
          groupID: 1 // 设置弹框位于的楼层
        },
        width: 180, // 设置弹框的宽度
        height: 90, // 设置弹框的高度
        marginTop: -25,
        // 设置弹框的内容
        content: event.name || event.name_,
        closeCallBack: function() {
          // 信息窗点击关闭操作
        }
      })
      popMak = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
      return popMak
    },
    // 移除信息窗
    removePopWin() {
      if (popMak) {
        popMak.close()
        popMak = null
      }
    },
    // 打矿工移动的点
    addSign(data) {
      const that = this
      let url = 'static/img/person.png'
      const carUrl = 'static/img/car.png'
      let foreignUrl = 'static/img/foreign.png'
      let leaderUrl = 'static/img/leader.png'
      // 当前有人员定位
      if (that.staffPositionType === true && data.staffId===that.staffId) {
        console.log("data")
        console.log(data)
        this.data.push({ staffId: that.staffId })
        if(data.isPerson===0 ){
          url = 'static/img/person2.png'
        }
        if(data.isPerson===1 ){
          leaderUrl = 'static/img/person2.png'
        }
        if(data.isPerson===2 ){
          foreignUrl = 'static/img/person2.png'
        }


      }
      const group = this.map.getFMGroup(that.currentGid)
      that.layer = group.getOrCreateLayer('imageMarker')
      if (data.isPerson === 0) {
        const im = new fengmap.FMImageMarker({
          x: data.terminalRoad.positionX,
          y: data.terminalRoad.positionY,
          z: data.terminalRoad.positionZ,
          // name: data.staffName,
          name: data.staffName + '(' + data.groupName + ')' + '<br/>' +
            'co:' + data.co + 'ppm ' + 'ch4:' + data.ch4 + '% ' + 'o2:' + data.o2 + '% ' + '<br/>' +
            '温度:' + data.temperature + '℃ ' + '湿度:' + data.humidity + '% ' + '<br/>' +
            '(' + parseInt(data.terminalRoad.positionX) + ',' + parseInt(data.terminalRoad.positionY) + ')',
          height: 0.2,
          url: url,
          size: 32,
          callback: function() {
            im.alwaysShow()
          }
        })
        that.layer.addMarker(im)
        return im
      }
      if (data.isPerson === 1) {
        const im = new fengmap.FMImageMarker({
          x: data.terminalRoad.positionX,
          y: data.terminalRoad.positionY,
          z: data.terminalRoad.positionZ,
          // name: data.staffName,
          name: data.staffName + '(' + data.groupName + ')' + '<br/>' +
            'co:' + data.co + 'ppm ' + 'ch4:' + data.ch4 + '% ' + 'o2:' + data.o2 + '% ' + '<br/>' +
            '温度:' + data.temperature + '℃ ' + '湿度:' + data.humidity + '% ' + '<br/>' +
            '(' + parseInt(data.terminalRoad.positionX) + ',' + parseInt(data.terminalRoad.positionY) + ')',
          height: 0.2,
          url: leaderUrl,
          size: 32,
          callback: function() {
            im.alwaysShow()
          }
        })
        that.layer.addMarker(im)
        return im
      }
      if (data.isPerson === 2) {
        const im = new fengmap.FMImageMarker({
          x: data.terminalRoad.positionX,
          y: data.terminalRoad.positionY,
          z: data.terminalRoad.positionZ,
          // name: data.staffName,
          name: data.staffName + '(' + data.groupName + ')' + '<br/>' +
            'co:' + data.co + 'ppm ' + 'ch4:' + data.ch4 + '% ' + 'o2:' + data.o2 + '% ' + '<br/>' +
            '温度:' + data.temperature + '℃ ' + '湿度:' + data.humidity + '% ' + '<br/>' +
            '(' + parseInt(data.terminalRoad.positionX) + ',' + parseInt(data.terminalRoad.positionY) + ')',
          height: 0.2,
          url: foreignUrl,
          size: 32,
          callback: function() {
            im.alwaysShow()
          }
        })
        that.layer.addMarker(im)
        return im
      }
      if (data.isPerson === 3) {
        const im = new fengmap.FMImageMarker({
          x: data.terminalRoad.positionX,
          y: data.terminalRoad.positionY,
          z: data.terminalRoad.positionZ,
          // name: data.staffName,
          name: data.staffName + '(' + data.groupName + ')' + '<br/>' +
            'co:' + data.co + 'ppm ' + 'ch4:' + data.ch4 + '% ' + 'o2:' + data.o2 + '% ' + '<br/>' +
            '温度:' + data.temperature + '℃ ' + '湿度:' + data.humidity + '% ' + '<br/>' +
            '(' + parseInt(data.terminalRoad.positionX) + ',' + parseInt(data.terminalRoad.positionY) + ')',
          height: 0.2,
          url: carUrl,
          size: 32,
          callback: function() {
            im.alwaysShow()
          }
        })
        that.layer.addMarker(im)
        return im
      }
    },
    // 显示基站位置
    addMarkers(gid, coord) {
      const that = this
      const group = this.map.getFMGroup(that.currentGid)
      // 返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
      that.layer = group.getOrCreateLayer('imageMarker')
      const im = new fengmap.FMImageMarker({
        name: that.bubbleName,
        x: coord.positionX,
        y: coord.positionY,
        z: coord.positionZ,
        height: 0.2,
        url: 'static/img/baseStation.png',
        size: 10, // 基站显示比例
        callback: function() {
          im.alwaysShow()
        }
      })
      // 在地图上显示
      that.layer.addMarker(im)
    },
    // 接收推送的数据
    changeDataStation(data) {
      const that = this
      // this.data.push({ staffId: that.staffId })
      // const tempData = JSON.parse(data)
      let url = ''
      // console.log('---准备打点----')
      // console.log(data)
      // console.log('---准备打点----')
      const key = data.staffId
      // 当前有人员定位
      if (that.staffPositionType === true) {
        this.data.push({ staffId: that.staffId })
        url = 'static/img/person2.png'
      }
      // 判断是否存在于地图上
      const flag = obj.has(key)
      let imObj
      if (flag === true) {
        // console.log('---移除原有点打新的点----')
        imObj = obj.get(key)
        //            obj.removeMarker(imObj)
       if(imObj !== null){
         that.layer.removeMarker(imObj)
       }
        imObj = that.addSign(data)
        obj.set(key, imObj)

        // const xy = {
        //   x: data.terminalRoad.positionX,
        //   y: data.terminalRoad.positionY
        // }
        // let ff = false
        //
        // // 判断是否进入重点区域
        // for (const item of hashMap) {
        //   if (item[1].polygonMarker.contain(xy)) {
        //     ff = true
        //     kk.set(key, item[1])
        //     // console.log('已经进入重点区域：')
        //   }
        // }
        // if (ff) {
        //   // 进入重点区域
        //   // console.log(kk)
        //   // console.log('进入了重点区域')
        //   const d = {
        //     staffId: data.staffId,
        //     warningAreaId: kk.get(key).warningAreaId
        //   }
        //   // console.log(d)
        //   let f0 = false
        //   for (const ii of inMap) {
        //     if (ii === data.staffId) {
        //       f0 = true
        //       // 判断上一次是否已经进入重点区域
        //     }
        //   }
        //   if (!f0) {
        //     // 第一次新进入的重点区域
        //     inMap.add(data.staffId)
        //     // inWarningArea(d)
        //     // console.log('已进入区域')
        //     const type = kk.get(key).warningAreaType
        //     const name = kk.get(key).warningAreaName
        //     if (type === 1) {
        //       this.$notify({
        //         title: '重点区域',
        //         message: '员工ID：' + data.staffId + ' 进入重点区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     } else {
        //       this.$notify({
        //         title: '限制区域',
        //         message: '员工ID：' + data.staffId + ' 进入限制区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     }
        //   }
        // } else {
        //   // 没有进入重点区域
        //   let qa = false
        //   // 判断是否是离开重点区域
        //   for (const it of inMap) {
        //     if (data.staffId === it) {
        //       // 离开重点区域
        //       qa = true
        //     }
        //   }
        //   if (qa) {
        //     // console.log('离开区域0')
        //     inMap.delete(data.staffId)
        //     // outWarningArea(data.staffId)
        //     const type = kk.get(key).warningAreaType
        //     const name = kk.get(key).warningAreaName
        //     if (type === 1) {
        //       this.$notify({
        //         title: '重点区域',
        //         message: '员工ID：' + data.staffId + ' 离开重点区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     } else {
        //       this.$notify({
        //         title: '限制区域',
        //         message: '员工ID：' + data.staffId + ' 离开限制区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     }
        //   }
        // }
      } else {
        // 不存在地图上，需要打点
        // console.log('---打新的点----')
        imObj = that.addSign(data)
        obj.set(key, imObj)
        // console.log('---打新的点OK----')
        // console.log('不存在添加，打点在地图上')
        // const xy = {
        //   x: data.terminalRoad.positionX,
        //   y: data.terminalRoad.positionY
        // }
        // let fff = false
        // // 判断是否存在于重点区域或者限制区域
        // for (const item of hashMap) {
        //   if (item[1].polygonMarker.contain(xy)) {
        //     fff = true
        //     k.set(key, item[1])
        //     // console.log(k)
        //   }
        // }
        // if (fff) {
        //   // 进入重点区域或限制区域
        //   const d = {
        //     staffId: data.staffId,
        //     warningAreaId: k.get(key).warningAreaId
        //   }
        //   let f0 = false
        //   // 判断上一状态是否存在于重点区域
        //   for (const ii of inMap) {
        //     if (ii === data.staffId) {
        //       f0 = true
        //       // 上一次已经存在于重点区域，不需要做其他操作
        //     }
        //   }
        //   if (!f0) {
        //     inMap.add(data.staffId)
        //     // inWarningArea(d)
        //     // console.log('已进入区域1')
        //     const type = k.get(key).warningAreaType
        //     const name = k.get(key).warningAreaName
        //     if (type === 1) {
        //       this.$notify({
        //         title: '重点区域',
        //         message: '员工ID：' + data.staffId + ' 进入重点区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     } else {
        //       this.$notify({
        //         title: '限制区域',
        //         message: '员工ID：' + data.staffId + ' 进入限制区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     }
        //   }
        // } else {
        //   // 不在区域内
        //   let fa = false
        //   for (const it of inMap) {
        //     if (data.staffId === it) {
        //       fa = true
        //       // 判断之前的状态是否在重点区域或限制区域
        //     }
        //   }
        //   if (fa) {
        //     // 之前存在于重点限制区域
        //     // console.log('离开区域1')
        //     inMap.delete(data.staffId)
        //     // outWarningArea(data.staffId)
        //     const type = k.get(key).warningAreaType
        //     const name = k.get(key).warningAreaName
        //     if (type === 1) {
        //       this.$notify({
        //         title: '重点区域',
        //         message: '员工ID：' + data.staffId + ' 离开重点区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     } else {
        //       this.$notify({
        //         title: '限制区域',
        //         message: '员工ID：' + data.staffId + ' 离开限制区域：' + name,
        //         type: 'warning',
        //         duration: 10 * 1000
        //       })
        //     }
        //   }
        // }
      }
    },
    removeDataStation(staffId) {
      const that = this
      const flag = obj.has(staffId)
      let imObj
      if (flag === true) {
        imObj = obj.get(staffId)
        that.layer.removeMarker(imObj)
        obj.delete(staffId)
      }
    },
    // 页面初始化，获取所有的电子围栏数据并渲染到页面上
    getElectronicFenceData() {
      // const id = this.warningAreaId
      getAllWarningAreaData().then((resp) => {
        const result = resp.data
        // console.log(result)
        if (result.code === 200) {
          // this.electronicFence = result.data.currentArea // 当前的围栏
          this.currentList = result.data.otherArea // 其他的围栏
          // if (this.electronicFence.coordinateVOS.length < 3) {
          //   this.clickingState = true
          // }
          // if (this.electronicFence.coordinateVOS.length > 2) {
          //   this.createWarningArea(this.electronicFence.warningAreaName, this.electronicFence.warningAreaDesc, this.electronicFence.warningAreaId, '#4169E1', this.electronicFence.coordinateVOS)
          // }
          for (let i = 0; i < this.currentList.length; i++) {
            if (this.currentList[i].warningAreaType === 1) {
              // 重点区域
              if (this.currentList[i].coordinateVOS.length > 2) {
                this.createWarningArea(this.currentList[i], '#4cb7e7')
              }
            } else {
              // 限制区域
              if (this.currentList[i].coordinateVOS.length > 2) {
                this.createWarningArea(this.currentList[i], '#666')
              }
            }
          }
        } else {
          this.$message({
            message: result.code + ':' + result.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取某一层模型数据的layer
    getFMGroupLayer(layerType) {
      const group = this.getFMGroup()
      let layer
      switch (layerType) {
        case 'textMarker':
          layer = group.getOrCreateLayer('textMarker')
          break
        case 'imageMarker':
          layer = group.getOrCreateLayer('imageMarker')
          break
        case 'polygonMarker':
          layer = group.getOrCreateLayer('polygonMarker')
          break
      }
      return layer
    },
    /**
       * 创建电子围栏方法
       * @param warningAreaName
       * @param warningAreaDesc
       * @param warningAreaId
       * @param color
       * @param data
       */
    createWarningArea(data, color) {
      const that = this
      // console.log('生成电子围栏')
      // 获取layer
      const polygonLayer = that.getFMGroupLayer('polygonMarker')
      const polygonMarker = new fengmap.FMPolygonMarker({
        // 设置颜色
        color: color,
        // 设置透明度
        alpha: 0.5,
        // 设置边框线的宽度
        lineWidth: 0.5,
        // 设置高度
        height: 6,
        // 设置电子围栏的坐标点
        points: data.coordinateVOS
      })
      polygonLayer.addMarker(polygonMarker)

      const centerPoint = this.computingCenterPoint(data.coordinateVOS)
      // todo 中心点添加名称与描述
      // console.log(centerPoint)
      const textLayer = that.getFMGroupLayer('textMarker')
      const tm = new fengmap.FMTextMarker({
        name: data.warningAreaName,
        x: centerPoint.x,
        y: centerPoint.y,
        // 填充色
        fillcolor: '3,168,244',
        // 字体大小
        fontsize: 18,
        // 边框色
        strokecolor: '255,255,255',
        callback: function() {
          // 在图片载入完成后，设置 "一直可见"
          tm.alwaysShow()
        }
      })
      textLayer.addMarker(tm)
      // 存入到map
      const val = {
        polygonLayer: polygonLayer,
        textLayer: textLayer,
        tm: tm,
        warningAreaName: data.warningAreaName,
        warningAreaDesc: data.warningAreaDesc,
        warningAreaType: data.warningAreaType,
        warningAreaId: data.warningAreaId,
        polygonMarker: polygonMarker,
        data: data.data
      }
      // hashMap.set(data.warningAreaId, val) // 保存重点区域，限制区域的map数据
    },
    computingCenterPoint(path) {
      let x = 0.0
      let y = 0.0
      for (let i = 0; i < path.length; i++) {
        x = x + parseFloat(path[i].x)
        y = y + parseFloat(path[i].y)
      }
      x = x / path.length
      y = y / path.length
      const result = {
        x: x,
        y: y
      }
      return result
    }
  }
}
</script>
