<template>
  <div class="m_Map">
    <div id="fengmap" style="height: 900px !important;"/>
    <!--<p class="m_mapTitle">煤矿人员定位系统立体示意图</p>-->
    <div v-show="buttonGroupVisible" class="m_export mapBtnGroup">
      <el-button class="m_mapTips" plain type="primary" @click="goBackBaseStation">返回</el-button>
      <el-button class="m_mapTips" plain type="success" @click="updateDataStation">提交</el-button>
      <el-button class="m_mapTips" plain type="warning" @click="changeDataStation">修改</el-button>
      <el-button class="m_mapTips" plain type="danger" @click="deleteDataStation">删除</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { bindStation, removeStation, findStationById, fetchUsedStation } from '@/api/station'
import CreateBubble from '@/assets/js/CreateBubble'
const fengmap = require('fengmap')
const fmapID = 'wifi-875'
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
let popMak
// let popMarker
export default {
  data: function() {
    return {
      popMarker: null,
      buttonGroupVisible: false,
      currentMarker: null,
      stationArr: [],
      map: null,
      bubbleObj: null,
      groupID: '',
      zoomControl: '',
      isDynamicMarker: false, // 地图的点击事件是否可用
      zoomVisible: true, // 控制放大、缩小控件显示/隐藏
      changeMarker: false, // 控制改变图片标注
      addMarker: false, // 控制添加图片标注
      stationForm: {},
      position: '',
      layer: null,
      positionNow: {}, // 图片标注的坐标
      currentGid: '' // 焦点楼层id
    }
  },
  created() {
    this.init() // 初始化地图
    this.fetchAllUsedStation() // 获取所有已使用的基站信息
    if (this.$route.params.baseStationId !== undefined) {
      this.getStationId() // 获取基站信息
    }
  },
  destroyed() {
    this.removePosition()
  },
  methods: {
    // 获取所有已使用的基站信息
    fetchAllUsedStation() {
      fetchUsedStation().then(resp => {
        const result = resp.data
        if (result.code === 200) {
          this.stationArr = resp.data.data
        } else if (result.code === 111){
        } else{
          this.$message({
            type: 'warning',
            message: '获取基站信息失败'
          })
        }
      })
    },
    // 获取基站信息
    getStationId() {
      this.buttonGroupVisible = true // 显示基站位置时,显示顶部按钮组
      // 路由传参数，根据基站ID获取基站坐标信息打点到地图上
      this.stationForm.baseStationId = this.$route.params.baseStationId
      this.positionNow.baseStationId = this.$route.params.baseStationId
      findStationById(this.stationForm.baseStationId).then(resp => {
        // 判断基站的使用状态，未使用则设置点击事件为true
        if (resp.data.data.status === 1) {
          // 通过基站ID查询到基站的位置信息，完成在地图上显示
          this.positionNow.positionX = resp.data.data.positionX
          this.positionNow.positionY = resp.data.data.positionY
          this.positionNow.positionZ = resp.data.data.positionZ
          this.isDynamicMarker = false
        } else {
          this.isDynamicMarker = true
        }
      })
    },
    // 初始化地图
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
          focusAnimateMode: false, // 开启聚焦层切换的动画显示
          viewModeAnimateMode: true, // 开启2维，3维切换的动画显示
          moveToAnimateMode: false, // 地图定位跳转动画设置
          viewMode: fengmap.FMViewMode.MODE_2D // 设置地图为二维显示模式
        })
        that.map.gestureEnableController.enableMapHover = true
        // 打开Fengmap服务器的地图数据和主题
        that.map.openMapById(fmapID, function(error) {
          // 打印错误信息
          // console.log(error)
        })
        // 地图加载完成之后执行的函数
        that.mapLoadComplete()
        // 显示指北针
        that.map.showCompass = compassVisible
        // 点击指南针事件, 使角度归0
        that.mapClickCompass()
        // 地图点击事件
        that.mapClickNode()
        that.mapHoverNode()
      })
    },
    // 地图加载完成事件
    mapLoadComplete() {
      const that = this
      this.map.on('loadComplete', function() {
        // 放大、缩小控件
        that.zoomInControl()
        // 地图标记事件
        that.currentGid = that.map.focusGroupID // 获取全局的焦点楼层id
        // 调用addMarkers方法，通过ID查询到的坐标传给addMarker方法，实现地图显示
        that.addMarkers(that.currentGid, that.positionNow)
        // 添加提示坐标的信息窗(判断当前基站是否已经使用,如果使用,则显示坐标信息窗)
        if (that.positionNow.positionX !== undefined) {
          that.addInfoWindow(that.positionNow)
        }
        // 初始化气泡对象
        that.bubbleObj = new CreateBubble(that.map)
        for (let i = 0; i < that.stationArr.length; i++) {
          // 遍历获取到的已部署的基站的位置信息的数组，调用addMarker方法
          that.bubbleName = that.stationArr[i].baseStationName
          that.bubbleNameX = parseInt(that.stationArr[i].positionX)
          that.bubbleNameY = parseInt(that.stationArr[i].positionY)
          that.bubbleName = '@' + that.stationArr[i].baseStationNum + '@' + that.bubbleName + '<br/>' + '(' + that.bubbleNameX + ',' + that.bubbleNameY + ')'

          // 移除当前部署的基站
          if (that.stationForm.baseStationId === that.stationArr[i].baseStationId) {
            that.stationArr.splice(i, 1)
          }
          that.addMarkers(that.currentGid, that.stationArr[i], that.bubbleName)
        }
      })
    },
    // 添加图片标注
    addMarkers(gid, coord) {
      const that = this
      let url = 'static/img/baseStation.png'
      // 若coord值存在则进行以下操作
      if(coord !== undefined){
      if (coord.baseStationId === that.stationForm.baseStationId) {
        url = 'static/img/baseStation2.png'
      }
      const group = that.map.getFMGroup(gid)
      // 返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
      that.layer = group.getOrCreateLayer('imageMarker')
      const im = new fengmap.FMImageMarker({
        x: coord.positionX,
        y: coord.positionY,
        z: coord.positionZ,
        name: that.bubbleName,
        height: 0.4,
        url: url,
        size: 32,
        callback: function() {
          im.alwaysShow()
        }
      })
      if (coord.baseStationId === that.stationForm.baseStationId) {
        that.currentMarker = im
      }
      // 在地图上显示
      that.layer.addMarker(im)
      }
    },
    // 悬浮 注释悬浮 避免bug
    mapHoverNode() {
      // const that = this
      // this.map.on('mapHoverNode', function(event) {
      //   const coord = event.eventInfo.coord
      //   const gid = event.groupID
      //   const name = event.name || event.name_
      //   if (event.nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
      //     that.addPopWin(coord, gid, name, event)
      //   }
      // })
    },
    removePopWin() {
      if (popMak) {
        popMak.close()
        popMak = null
      }
    },
    // 新增弹出框
    addPopWin(coord, gid, txt, event) {
      const that = this
      that.removePopWin()
      // 信息框控件大小配置
      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          // 设置弹框的x轴
          x: event.target.x,
          // 设置弹框的y轴
          y: event.target.y,
          height: 1, // 控制信息窗的高度
          // 设置弹框位于的楼层
          groupID: 1
        },
        // 设置弹框的宽度
        width: 220,
        // 设置弹框的高度
        height: 100,
        marginTop: 10,
        // 设置弹框的内容
        content: event.name || event.name_,
        closeCallBack: function() {
          // 信息窗点击关闭操作
        }
      })
      popMak = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
      return popMak
    },
    // 添加信息窗
    addInfoWindow(positionNow) {
      const positionX = parseInt(positionNow.positionX)
      const positionY = parseInt(positionNow.positionY)
      // 信息框控件大小配置
      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          // 设置弹框的x轴
          x: positionX,
          // 设置弹框的y轴
          y: positionY,
          height: 6, // 控制信息窗的高度
          // 设置弹框位于的楼层
          groupID: 1
        },
        // 设置弹框的宽度
        width: 200,
        // 设置弹框的高度
        height: 100,
        marginTop: -5,
        // 设置弹框的内容
        content: '当前基站坐标为: (' + positionX + ',' + positionY + ')',
        closeCallBack: function() {
          // 信息窗点击关闭操作
          // alert('信息窗关闭了！');
        }
      })
      this.popMarker = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
      // 添加弹框到地图上
      //  that.popMarker = new fengmap.FMPopInfoWindow(map, ctlOpt)
      // popMarker.close(); 关闭信息窗
    },
    // 地图点击事件
    mapClickNode() {
      const that = this
      this.map.on('mapClickNode', function(event) {
        if (event.nodeType === fengmap.FMNodeType.NONE) return
        if (that.isDynamicMarker) {
          // loadComplete中拿到了全局的currentGid这里省略
          const coord = {
            positionType: that.positionNow.positonType,
            baseStationId: that.stationForm.baseStationId,
            positionX: event.eventInfo.coord.x,
            positionY: event.eventInfo.coord.y,
            // z: map.getFMGroup(currentGid).groupHeight + map.layerLocalHeight
            positionZ: 2
          }
          that.positionNow = coord
          // 添加Marker
          that.addMarkers(that.currentGid, coord)
          that.addInfoWindow(coord)
        }
        // 判断当前地图上是否有标注，如果有，则点击事件设置为false
        if (that.positionNow.positionX !== '') {
          that.isDynamicMarker = false
        }
      })
    },
    // 点击指南针事件, 使角度归0
    mapClickCompass() {
      const that = this
      this.map.on('mapClickCompass', function() {
        that.map.rotateTo({
          // 设置角度
          to: 0,
          // 动画持续时间，默认为。3秒
          duration: 0.3,
          callback: function() { // 回调函数
          }
        })
      })
    },
    // 放大、缩小控件
    zoomInControl() {
      new fengmap.zoomControl(this.map, ctlOpt1)
    },
    // 在地图上绑定基站位置信息
    updateDataStation() {
      // 判断当前地图上是否有标记
      if (this.positionNow.positionX === '') {
        this.$message({
          message: '请在地图上点击选取基站的位置',
          type: 'warning'
        })
      } else {
        this.$confirm('是否提交基站位置信息?', '提示', {
          message: '您当前选取的位置坐标如下，是否提交？' + '(' + this.positionNow.positionX + ',' + this.positionNow.positionY + ',' + this.positionNow.positionZ + ')',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          bindStation(this.stationForm.baseStationId, this.positionNow.positionX, this.positionNow.positionY, this.positionNow.positionZ).then(resp => {
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.data.code + ':' + resp.data.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
      }
    },
    // 更改位置信息
    changeDataStation() {
      // 先判断当前地图上是否有标记
      if (this.positionNow.positionX === '') {
        this.$message({
          message: '请先在地图上点击选取基站的位置后再试',
          type: 'warning'
        })
      } else {
        this.removePosition() // 坐标清空
        this.layer.removeMarker(this.currentMarker) // 删除地图上的图片标记
      }
      this.isDynamicMarker = true // 把点击事件设置为true
    },
    // 清除位置信息
    removePosition() {
      // 清除坐标信息窗
      if(this.popMarker){
        this.popMarker.close()
      }
      this.positionNow.positionX = ''
      this.positionNow.positionY = ''
      this.positionNow.positionZ = ''
    },
    // 删除位置信息
    deleteDataStation() {
      // 先判断当前地图上是否有标记
      if (this.positionNow.positionX === '') {
        this.$message({
          message: '请先在地图上点击选取基站的位置后再试',
          type: 'warning'
        })
      } else {
        this.$confirm('是否删除基站位置信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 清除坐标信息窗
          // this.popMarker.close()
          removeStation(this.stationForm.baseStationId).then(resp => {
            this.$message({
              type: 'success',
              message: resp.data.msg
            })
          })
          this.layer.removeMarker(this.currentMarker) // 删除当前标记的点
          this.removePosition() // 坐标清空
          this.isDynamicMarker = true // 把点击事件设置为true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 返回基站信息管理页面
    goBackBaseStation() {
      this.$router.push({
        path: 'equipment/baseStation',
        name: 'BaseStation'
      })
    }
  }
}
</script>
<style>
  /*信息窗的关闭按钮不可见*/
.fm-control-popmarker input{display: none;}
</style>
