<template>
  <div class="navBarContent">
    <el-menu class="navbar" mode="horizontal">
      <el-row class="m_navBarRow">
        <el-col :xs="24" :sm="24" :md="4" :lg="6" :xl="4">
          <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
          <system-time/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="20" class="navBarRight">
          <!--工作异常-->
          <div class="navBarItem" @click="showWorkAbnormal" >
            <el-badge :value="positionAbValue" :max="99" :hidden="positionHidden" class="item">
              <img src="static/img/1.png">
              <el-button type="text">工作异常</el-button>
            </el-badge>
          </div>
          <!--紧急呼叫-->
          <div class="navBarItem" @click="showEmergency" >
            <el-badge :value="emCallValue" :max="99" :hidden="emCallHidden" class="item" >
              <img src="static/img/emergency.png">
              <el-button type="text">紧急呼叫</el-button>
            </el-badge>
          </div>
          <!--气体警报-->
          <div class="navBarItem" @click="showWarningGas" >
            <el-badge :value="warnGasValue" :max="99" :hidden="warnGasHidden" class="item">
              <img src="static/img/notice.png">
              <el-button type="text">气体警报</el-button>
            </el-badge>
          </div>
          <!--通讯录-->
          <div class="navBarItem" @click="showPhoneList" >
            <img src="static/img/phone.png">
            <el-button type="text">通讯录</el-button>
          </div>
          <!--基站掉线-->
          <div class="navBarItem" @click="showBaseStationDropped" >
            <el-badge :value="offLineStationValue" :max="99" class="item" >
              <img src="static/img/dropped.png">
              <el-button type="text">基站掉线</el-button>
            </el-badge>
          </div>
          <!--自检异常-->
          <div class="navBarItem" @click="showMalfunction">
            <el-badge :value="malfunctionValue" :max="99" class="item">
              <img src="static/img/check.png">
              <el-button type="text">设备故障</el-button>
            </el-badge>
          </div>
          <!--电量警报-->
          <div class="navBarItem" @click="showBatteryAlarm">
            <el-badge :value="batteryAlarmValue" :max="99" class="item" >
              <img src="static/img/battery.png">
              <el-button type="text">电量警报</el-button>
            </el-badge>
          </div>
          <!--个人中心-->
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <img src="static/img/center.png" class="user-avatar">
              <span>{{ userName }}</span>
              <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>
                  <span>首页</span>
                </el-dropdown-item>
              </router-link>
              <router-link to="/operateRecord">
                <el-dropdown-item divided>
                  <span>操作记录</span>
                </el-dropdown-item>
              </router-link>
              <router-link to="/editOrPrint">
                <el-dropdown-item divided>
                  <span>编辑&打印</span>
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span>警报提醒</span>
                <el-switch
                  v-model="noticeSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-dropdown-item>
              <el-dropdown-item divided >
                <span @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <div/>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import SystemTime from '@/components/SystemTime/index'
import eventVue from '@/api/eventVue'
export default {
  components: {
    SystemTime,
    Hamburger
  },
  data() {
    return {
      userName: localStorage.getItem('account'),
      positionHidden: false,
      emCallHidden: false,
      warnGasHidden: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    // 警报开关
    noticeSwitch: {
      get() {
        return this.$store.state.user.noticeSwitch
      },
      set(val) {
        this.$store.dispatch('handleChangeNoticeSwitch', val)
      }
    },
    // 工作异常数量
    positionAbValue() {
      return this.$store.state.user.positionAbValue
    },
    // 紧急呼叫数量
    emCallValue() {
      return this.$store.state.user.emCallValue
    },
    // 气体警报数量
    warnGasValue() {
      return this.$store.state.user.warnGasValue
    },
    // 基站掉线数量
    offLineStationValue() {
      return this.$store.state.offLineStationValue
    },
    // 终端故障
    malfunctionValue() {
      return this.$store.state.malfunctionValue
    },
    // 电量警报
    batteryAlarmValue() {
      return this.$store.state.batteryAlarmValue
    }
  },
  watch: {
    // val() {
    //   console.log(this.val)
    //   this.$store.dispatch('handleChangeNoticeSwitch', this.val)
    // },
    positionAbValue: function() {
      // 监听 值为0时,隐藏红点标记
      this.positionHidden = this.$store.state.user.positionAbValue === 0
    },
    emCallValue: function() {
      // 监听 值为0时,隐藏红点标记
      this.emCallHidden = this.$store.state.user.emCallValue === 0
    },
    warnGasValue: function() {
      // 监听 值为0时,隐藏红点标记
      this.warnGasHidden = this.$store.state.user.warnGasValue === 0
    }
  },
  created() {
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('positionAbValue', JSON.stringify(this.$store.state.user.positionAbValue))
      localStorage.setItem('emCallValue', JSON.stringify(this.$store.state.user.emCallValue))
      localStorage.setItem('warnGasValue', JSON.stringify(this.$store.state.user.warnGasValue))
      localStorage.setItem('noticeSwitch', JSON.stringify(this.$store.state.user.noticeSwitch))
    })
    this.handleJudgeHidden()
    // this.$store.dispatch('handleChangeNoticeSwitch', localStorage.getItem('noticeSwitch'))
    // console.log('created')
    // console.log(localStorage.getItem('noticeSwitch'))
    // console.log(this.$store.state.user.noticeSwitch)
  },
  methods: {
    // 第一次加载页面时,若值为0,则不显示红点标记,进行判断
    handleJudgeHidden() {
      this.positionHidden = this.$store.state.user.positionAbValue === 0
      this.emCallHidden = this.$store.state.user.emCallValue === 0
      this.warnGasHidden = this.$store.state.user.warnGasValue === 0
    },
    // 路由跳转,打开工作异常页面
    showWorkAbnormal() {
      this.$router.push({
        path: 'workAbnormal',
        name: 'WorkAbnormal'
      })
      this.positionHidden = true
    },
    // 路由跳转,打开紧急呼叫页面
    showEmergency() {
      this.$router.push({
        path: 'emergencyCall',
        name: 'EmergencyCall'
      })
      this.emCallHidden = true
    },
    // 路由跳转,打开警报气体页面
    showWarningGas() {
      this.$router.push({
        path: 'warn/gas',
        name: 'Gas'
      })
      this.warnGasHidden = true
    },
    // 路由跳转,打开自检异常页面
    showMalfunction() {
      this.$router.push({
        path: 'warn/malfunction',
        name: 'Malfunction'
      })
    },
    // 路由跳转,打开电量警报页面
    showBatteryAlarm() {
      this.$router.push({
        path: 'warn/batteryAlarm',
        name: 'BatteryAlarm'
      })
    },
    // 基站掉线数量
    showBaseStationDropped() {
      this.$router.push({
        path: 'offlineStation',
        name: 'OfflineStation'
      })
    },
    // 打开通讯录
    showPhoneList() {
      this.$store.dispatch('showVoiceDialog')
      this.$store.dispatch('handleStopOtherPlay')
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // 关闭各种webSocket连接
        eventVue.$emit('closeGlobalWebSocket')
        eventVue.$emit('closePositionWebSocket')
        eventVue.$emit('closeVoiceWebSocket')
      })
      localStorage.removeItem('token')
      localStorage.removeItem('account')
      localStorage.removeItem('userId')
      this.$router.push({
        path: '/login'
      })
      location.reload() // 为了重新实例化vue-router对象 避免bug
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" >
  .app-breadcrumb.el-breadcrumb{line-height: 50px !important;}
  .el-badge__content.is-fixed{right: 5px !important;top: 12px !important;}
  .navBarItem img{height: 22px;width: 22px;position: relative;top:5px;}
  .navbar {
    height:60px;
    line-height: 60px;
    border-radius: 0px !important;
    .hamburger-container {
      position: relative;
      z-index: 999999;
      line-height: 60px;
      height: 60px;
      float: left;
      padding: 5px 10px;
      margin-left: 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 60px;
      display: inline-block;
      margin-right: 20px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .el-icon-caret-bottom {
          font-size: 12px;
        }
      }
    }
  }
  .avatar-wrapper{ height: 60px;color: #666;font-size: 14px; display: inline-block;cursor: pointer;position: relative;margin-right: 30px !important;}
  .user-avatar {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    position: relative;
    top: 5px;
  }
  .el-icon-caret-bottom {
    font-size: 12px;
  }
  .navbar .avatar-container .avatar-wrapper{margin-top: 0 !important;}
</style>

