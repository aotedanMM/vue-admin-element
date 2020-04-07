<template>
  <div class="m_Map">
    <div id="fengmap" style="height: 900px !important;"/>
    <div class="m_export">
      <!--<el-button class="m_mapTips" plain type="warning" @click="handleChange">修改</el-button>-->
      <el-button class="m_mapTips" plain type="primary" @click="handleCreateArea">预览</el-button>
      <el-button class="m_mapTips" plain type="danger" @click="handleReset">重置</el-button>
      <el-button class="m_mapTips" plain type="success" @click="handleSubmit">提交</el-button>
      <el-button class="m_mapTips" plain type="error" @click="handleGoBack">返回</el-button>
      <div class="tuli">
        <ul>
          <li><p class="zdqy"/>重点区域</li>
          <li><p class="xzqy"/>限制区域</li>
          <li><p class="dqqy"/>当前区域</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { insertAreaData, getAreaDataByWarningAreaId } from '@/api/mapArea'
import { deleteCoordinate } from '@/api/warningArea'
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
const hashMap = new Map() // 电子围栏数据
const tempMap = new Map() // 临时电子围栏
export default {

  data: function() {
    return {
      map: null, // fengMap对象
      clickingState: false, // 地图是否可以点击设置
      areaData: [], // 生成的临时电子围栏数据
      coordinate: [], // 上传至后台的坐标集合
      warningAreaId: null, // 路由传入的警告区域ID
      electronicFence: null, // 当前电子围栏数据
      currentList: [], // 非当前电子围栏数据,
      // pointArray: [] // 临时点集合
      bubbleObj: null
    }
  },
  created() {
    this.warningAreaId = this.$route.params.areaId
    this.initMap()
  },
  methods: {
    initMap() {
      const that = this
      const compassVisible = true
      this.$nextTick(() => {
        that.map = new fengmap.FMMap({
          container: document.getElementById('fengmap'), // 设置显示地图容器
          // 设置本地地图数据的相对路径。对应的地图文件为:data/{fmapID}/{fmapID}.fmap
          key: '7d0bb8ec7d6c5359431e3223e1b91e98', // 开发者申请应用下web服务的key
          mapServerURL: '/static/data/' + fmapID, // 地图数据位置
          mapThemeURL: '/static/data/theme', // 设置主题
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
        that.map.openMapById(fmapID, function(error) {
          // 打印错误信息
          // console.log(error)
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
        that.map.on('loadComplete', function() {
          // 注册点击监听事件
          that.mapClickNode()
          // 添加数据到地图上
          that.getElectronicFenceData()
          // this.bubbleObj = new createBubble(that.map)
          // 注入地图加载完成函数
          that.mapLoadComplete()
        })
      })
    },
    // 地图加载完成
    mapLoadComplete() {
      const that = this
      this.map.on('loadComplete', function() {
        // 放大、缩小控件
        that.zoomInControl()
        that.currentGid = that.map.focusGroupID // 获取全局的焦点楼层id
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
    // 页面初始化，获取所有的电子围栏数据并渲染到页面上
    getElectronicFenceData() {
      const id = this.warningAreaId
      getAreaDataByWarningAreaId(id).then((resp) => {
        const result = resp.data
        if (result.code === 200) {
          this.electronicFence = result.data.currentArea // 当前的围栏
          this.currentList = result.data.otherArea // 其他的围栏
          if (this.electronicFence.coordinateVOS.length < 3) {
            this.clickingState = true
          }
          if (this.electronicFence.coordinateVOS.length > 2) {
            this.createWarningArea(this.electronicFence.warningAreaName, this.electronicFence.warningAreaDesc, this.electronicFence.warningAreaId, '#E6A23C', this.electronicFence.coordinateVOS)
          }
          for (let i = 0; i < this.currentList.length; i++) {
            if (this.currentList[i].warningAreaType === 1) {
              // 重点区域
              if (this.currentList[i].coordinateVOS.length > 2) {
                this.createWarningArea(this.currentList[i].warningAreaName, this.currentList[i].warningAreaDesc, this.currentList[i].warningAreaId, '#4cb7e7', this.currentList[i].coordinateVOS)
              }
            } else {
              // 限制区域
              if (this.currentList[i].coordinateVOS.length > 2) {
                this.createWarningArea(this.currentList[i].warningAreaName, this.currentList[i].warningAreaDesc, this.currentList[i].warningAreaId, '#666', this.currentList[i].coordinateVOS)
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
    // 创建marker点
    createImageMarker(coord) {
      const that = this
      const layer = that.getFMGroupLayer('imageMarker')
      const im = new fengmap.FMImageMarker({
        x: coord.x,
        y: coord.y,
        height: 0,
        url: 'static/img/point.png',
        size: 32,
        callback: function() {
          im.alwaysShow()
        }
      })
      layer.addMarker(im)
    },
    /**
     * 创建电子围栏方法
     * @param warningAreaName
     * @param warningAreaDesc
     * @param warningAreaId
     * @param color
     * @param data
     */
    createWarningArea(warningAreaName, warningAreaDesc, warningAreaId, color, data) {
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
        points: data
      })
      polygonLayer.addMarker(polygonMarker)

      const centerPoint = this.computingCenterPoint(data)
      // todo 中心点添加名称与描述
      // console.log(centerPoint)
      const textLayer = that.getFMGroupLayer('textMarker')
      const tm = new fengmap.FMTextMarker({
        name: warningAreaName,
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
        warningAreaName: warningAreaName,
        warningAreaDesc: warningAreaDesc,
        polygonMarker: polygonMarker,
        data: data
      }
      hashMap.set(warningAreaId, val)
    },
    // 生成电子围栏示意图
    handleCreateArea() {
      if (this.areaData.length < 3) {
        this.$message({
          message: '提交数据点不能少于三个',
          type: 'warning'
        })
        return
      }
      const that = this
      // console.log('生成电子围栏')
      // 获取layer
      const layer = that.getFMGroupLayer('polygonMarker')
      const polygonMarker = new fengmap.FMPolygonMarker({
        // 设置颜色
        color: '#E6A23C',
        // 设置透明度
        alpha: 0.5,
        // 设置边框线的宽度
        lineWidth: 0.5,
        // 设置高度
        height: 6,
        // 设置电子围栏的坐标点
        points: that.areaData
      })
      layer.addMarker(polygonMarker)
      const val = {
        layer: layer,
        polygonMarker: polygonMarker
      }
      // 提交临时电子围栏数据
      tempMap.set('tempKey', val)
      that.areaData = []
    },
    handleSubmit() {
      if (this.coordinate.length < 3) {
        this.$message({
          message: '提交数据点不能少于三个',
          type: 'warning'
        })
        return
      }
      insertAreaData(this.warningAreaId, this.coordinate).then((resp) => {
        const result = resp.data
        if (result.code === 200) {
          this.$message({
            message: result.msg,
            type: 'success'
          })
          this.clickingState = false
          this.coordinate = []
          this.$router.push({
            path: '/partition/map/index',
            name: 'MapArea',
            params: {
              areaId: this.warningAreaId
            }
          })
        } else {
          this.$message({
            message: result.code + ':' + result.msg,
            type: 'warning'
          })
        }
      }).catch((e) => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    handleGoBack() {
      this.$router.push({
        path: '/partition/index',
        name: 'Partition'
      })
    },
    handleChange() {
      // console.log(this.warningAreaId)
      if (this.warningAreaId === undefined || this.warningAreaId === null || this.warningAreaId === '' || this.warningAreaId === 'undefined') {
        this.$message({
          message: '当前区域ID为空，请返回设置电子围栏页面，重新设置',
          type: 'warning'
        })
        return
      }
      // 设置为允许点击打点
      this.clickingState = true
      // 移除当前要求改的内容
      const val = hashMap.get(this.warningAreaId)
      if (val !== undefined) {
        const polygonLayer = val.polygonLayer
        const textLayer = val.textLayer
        polygonLayer.removeMarker(val.polygonMarker)
        textLayer.removeMarker(val.tm)
      }
    },
    mapClickNode() {
      const that = this
      this.map.on('mapClickNode', function(e) {
        // console.log(that.clickingState)
        if (!that.clickingState) {
          that.$message({
            type: 'warning',
            message: '请先点击重置按钮'
          })
          return
        }
        const model = e
        /** 前端显示**/
        const result = {
          x: model.eventInfo.coord.x,
          y: model.eventInfo.coord.y
        }
        // 前端暂时显示的数据
        that.areaData.push(result)
        /** 打点**/
        const coord = {
          x: model.eventInfo.coord.x,
          y: model.eventInfo.coord.y,
          z: that.getFMGroup().groupHeight + that.map.layerLocalHeight
        }
        // 创建marker点
        that.createImageMarker(coord)
        /** 提交数据**/
        const t_data = {
          coordinateX: model.eventInfo.coord.x,
          coordinateY: model.eventInfo.coord.y,
          coordinateZ: 60,
          warningAreaId: that.warningAreaId
        }
        // 提交后台的数据
        that.coordinate.push(t_data)

        // const position = {
        //   // 设置气泡的x坐标
        //   x: model.eventInfo.coord.x,
        //   // 设置气泡的y坐标
        //   y: model.eventInfo.coord.y,
        //   // 设置气泡的高度
        //   z: that.map.getGroupHeight(that.map.focusGroupID) + that.map.layerLocalHeight,
        //   // 设置气泡的自定义属性
        //   name: '1111'
        // }
        // that.bubbleObj.bubbledomEvent(position)
      })
    },
    // 重置电子围栏数据
    handleReset() {
      this.handleChange()

      // 删除此区域在地图上的坐标
      deleteCoordinate(this.warningAreaId).then(resp => {
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

      this.areaData = []
      this.coordinate = []
      // this.getElectronicFenceData()
      // 清除临时电子围栏数组
      // 移除所有点
      const layer = this.getFMGroupLayer('imageMarker')
      layer.removeAll()
      if (tempMap.size === 0) {
        return
      }
      tempMap.get('tempKey').layer.removeMarker(tempMap.get('tempKey').polygonMarker)
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
<style>
  .tuli{ text-align: right;line-height: 80px;position: fixed;right: 20px; }
  /*重点区域*/
  .zdqy{width:12px;height: 12px;border-radius: 4px; background: #4cb7e7;margin-right: 10px !important;display: inline-block; }
  /*限制区域*/
  .xzqy{width:12px;height: 12px;border-radius: 4px; background: #666;margin-right: 10px !important;display: inline-block; }
  /*当前区域*/
  .dqqy{width:12px;height: 12px;border-radius: 4px; background: #E6A23C;margin-right: 10px !important;display: inline-block; }
</style>
