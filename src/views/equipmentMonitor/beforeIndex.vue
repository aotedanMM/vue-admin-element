<template>
  <div class="app-container" style="margin: 0 !important;padding: 0 !important;">
    <!--地图-->
    <div class="m_Map">
      <div id="fengmap" style="height: 900px !important;"/>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  import eventVue from '@/api/eventVue'
  import CreateBubble from '@/assets/js/CreateBubble'
  import { fetchUsedStation, getMacNum, fetchStaffPosition } from '@/api/station'
  import { getAllWarningAreaData } from '@/api/mapArea'
  import { findPersonDetailInfo } from '@/api/macStation'
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
  const tzMap = new Map()
  const tzCloseMap = new Set()
  export default {
    name: 'EquipmentMonitor',
    inject: ['reload'],
    data: function() {
      return {
        data:[],
        temporaryArr: [
          {
            type:1,
            baseStationId: 1,
            baseStationName: "电源箱",
            baseStationNum: 1,
            positionX: 12956673.29414956,
            positionY: 4851814.616004142,
            positionZ: 2,
          },
          {
            type:2,
            baseStationId: 1,
            baseStationName: "交换机",
            baseStationNum: 1,
            positionX: 12957022.860078914,
            positionY: 4851823.146304249,
            positionZ: 2,
          },
          {
            type:3,
            baseStationId: 1,
            baseStationName: "电缆",
            baseStationNum: 1,
            positionX: 12956673.860078914,
            positionY: 4851700.146304249,
            positionZ: 2,
          }
        ],
        url: '',
        positionTimer: null,
        resultArr: [],
        times: 0,
        wifiProbeVisible: false,
        downHoleVisible: false,
        warnAreaVisible: false,
        personDetail: [],
        probeQuery: { total: null, pageSize: 10, startPage: 1 },
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
      this.init()
      // this.fetchAllUsedStation()
    },
    methods: {
      // 获取所有已使用的基站信息
      // fetchAllUsedStation() {
      //   fetchUsedStation().then(resp => {
      //     console.log('获取所有已使用的基站信息')
      //     console.log(resp.data)
      //     const result = resp.data
      //     if (result.code === 200) {
      //       this.temporaryArr = resp.data.data
      //     } else {
      //       this.$message({
      //         message: result.code + ':' + result.msg,
      //         type: 'warning'
      //       })
      //     }
      //   }).catch(e => {
      //     this.$message({
      //       message: e,
      //       type: 'error'
      //     })
      //   })
      // },
      // 地图加载完成
      mapLoadComplete() {
        const that = this
        this.map.on('loadComplete', function() {
          // 放大、缩小控件
          that.zoomInControl()
          that.currentGid = that.map.focusGroupID // 获取全局的焦点楼层id
          // 添加定时器,分批渲染基站
          // 初始化气泡对象
          that.bubbleObj = new CreateBubble(that.map)
          that.mapHoverNode()
          for (let i = 0; i < that.temporaryArr.length; i++) {
            tzMap.set(that.temporaryArr[i].baseStationNum, that.temporaryArr[i])
            // 遍历获取到的已部署的基站的位置信息的数组，调用addMarker方法
            that.bubbleName = that.temporaryArr[i].baseStationName
            that.bubbleNameX = parseInt(that.temporaryArr[i].positionX)
            that.bubbleNameY = parseInt(that.temporaryArr[i].positionY)
            that.bubbleName = '@' + that.temporaryArr[i].baseStationNum + '@' + that.bubbleName + '<br/>' + '(' + that.bubbleNameX + ',' + that.bubbleNameY + ')'
            that.addMarkers(that.currentGid, that.temporaryArr[i], that.bubbleName)
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
          that.mapHoverNode()
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
      // 地图鼠标悬浮事件
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
      // 移除信息窗
      removePopWin() {
        if (popMak) {
          popMak.close()
          popMak = null
        }
      },
      // 新增信息窗
      addPopWin(coord, gid, txt, event) {
        const that = this
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
      // 显示基站位置
      addMarkers(gid, coord,bubbleName) {
        const that = this
        const group = this.map.getFMGroup(that.currentGid)
        // 根据type判断类型
        switch (coord.type) {
          case 1:
            that.url = 'static/img/equipment1.png'
            break
          case 2:
            that.url = 'static/img/equipment2.png'
            break
          case 3:
            that.url = 'static/img/equipment3.png'
            break
        }
        // 返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        that.layer = group.getOrCreateLayer('imageMarker')
        const im = new fengmap.FMImageMarker({
          name: bubbleName,
          x: coord.positionX,
          y: coord.positionY,
          z: coord.positionZ,
          height: 0.2,
          // url: 'static/img/baseStation.png',
          url: that.url,
          size: 32, // 基站显示比例
          callback: function() {
            im.alwaysShow()
          }
        })
        // 在地图上显示
        that.layer.addMarker(im)
      }
    }
  }
</script>
