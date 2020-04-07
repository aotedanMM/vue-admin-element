import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/map', component: () => import('@/views/map'), hidden: true },
  { path: '/1', component: () => import('@/views/test/'), hidden: true },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index')
      },
      {
        path: 'operateRecord',
        name: 'OperateRecord',
        meta: { title: '操作记录', icon: '' },
        component: () => import('@/views/operateRecord/index')
      },
      {
        path: 'editOrPrint',
        name: 'EditOrPrint',
        meta: { title: '编辑&打印', icon: '' },
        component: () => import('@/views/editOrPrint/index')
      }
    ]
  },
  // 大数据分析
  // {
  //   path: '/bigData',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/bigData',
  //       meta: { title: '数据分析', icon: 'bigData' }
  //     }
  //   ]
  // 实时监测
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/gasMonitoring',
    name: 'Monitor',
    meta: { title: '实时监测', icon: 'monitor' },
    children: [
      {
        path: 'gasMonitoring',
        name: 'GasMonitoring',
        component: () => import('@/views/gasMonitoring/index'),
        meta: { title: '实时气体监测', icon: '' }
      },
      {
        path: 'positionMonitoring',
        name: 'PositionMonitoring',
        component: () => import('@/views/positionMonitoring/index'),
        meta: { title: '实时定位监测', icon: '' }
      },
      {
        path: 'equipmentMonitor',
        name: 'EquipmentMonitor',
        component: () => import('@/views/equipmentMonitor/index'),
        meta: { title: '实时设备监测', icon: '' }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/map/index'),
        meta: { title: '地图', icon: '' },
        hidden: true
      }
    ]
  },
  // 警报提醒
  {
    path: '/warn',
    component: Layout,
    redirect: '/warn/gas',
    name: 'Warn',
    meta: { title: '警报提醒', icon: 'warn' },
    children: [
      {
        path: 'gas',
        name: 'Gas',
        component: () => import('@/views/gas/index'),
        meta: { title: '气体警报', icon: '' }
      },
      {
        path: 'malfunction',
        name: 'Malfunction',
        component: () => import('@/views/malfunction/index'),
        meta: { title: '设备故障', icon: '' }
      },
      {
        path: 'batteryAlarm',
        name: 'BatteryAlarm',
        component: () => import('@/views/batteryAlarm/index'),
        meta: { title: '电量警报', icon: '' }
      },
      {
        path: 'offlineStation',
        name: 'OfflineStation',
        component: () => import('@/views/offlineStation/index'),
        meta: { title: '基站掉线', icon: '' }
      },
      {
        path: 'emergencyCall',
        name: 'EmergencyCall',
        component: () => import('@/views/emergencyCall/index'),
        meta: { title: '紧急呼叫', icon: '' },
        hidden: true
      },
      {
        path: 'workAbnormal',
        name: 'WorkAbnormal',
        component: () => import('@/views/WorkAbnormal/index'),
        meta: { title: '工作异常' }
      }
    ]
  },
  // 设备管理
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/baseStation',
    name: 'Equipment',
    meta: {
      title: '设备管理',
      icon: 'equipment'
    },
    children: [
      {
        path: 'baseStation',
        name: 'BaseStation',
        component: () => import('@/views/baseStation/index'), // Parent router-view
        meta: { title: '基站信息管理' }
      },
      {
        path: 'terminal',
        name: 'Terminal',
        component: () => import('@/views/terminal/index'), // Parent router-view
        meta: { title: '终端信息管理' }
      },
      {
        path: 'partition',
        name: 'Partition',
        component: () => import('@/views/partition/index'),
        meta: { title: '矿下区域管理', icon: '' }
      },
      {
        path: 'mapArea',
        hidden: true,
        name: 'MapArea',
        component: () => import('@/views/partition/map/index'),
        meta: { title: '区域划分', icon: '' }
      }
    ]
  },
  // 人员管理
  {
    path: '/people',
    component: Layout,
    redirect: '/people/staffInfo',
    name: 'People',
    meta: { title: '人员管理', icon: 'people' },
    children: [
      {
        path: 'staffInfo',
        name: 'StaffInfo',
        component: () => import('@/views/staffInfo/index'),
        meta: { title: '人员信息管理', icon: '' }
      },
      {
        path: 'orgInfo',
        name: 'OrgInfo',
        component: () => import('@/views/orgInfo/index'),
        meta: { title: '组织结构管理', icon: '' }
      },
      {
        path: 'staffJob',
        name: 'staffJob',
        component: () => import('@/views/staffJob/index'),
        meta: { title: '工种类别管理', icon: '' }
      },
      {
        path: 'assignRecord',
        name: 'AssignRecord',
        component: () => import('@/views/assignRecord/index'),
        meta: { title: '指派信息管理', icon: '' }
      }
    ]
  },
  // 历史轨迹
  {
    path: '/history',
    component: Layout,
    redirect: '/history/personTrack',
    name: 'history',
    meta: { title: '历史轨迹', icon: 'history' },
    children: [
      {
        path: 'personTrack',
        name: 'PersonTrack',
        component: () => import('@/views/personTrack/index'),
        meta: { title: '人员历史轨迹', icon: '' }
      },
      {
        path: 'carTrack',
        name: 'CarTrack',
        component: () => import('@/views/carTrack/index'),
        meta: { title: '车辆历史轨迹', icon: '' }
      }
    ]
  },
  // 考勤管理
  {
    path: '/attendance',
    component: Layout,
    redirect: '/attendance/attendance',
    name: 'attendance',
    meta: { title: '考勤管理', icon: 'attendance' },
    children: [
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('@/views/attendance/index'),
        meta: { title: '考勤信息管理', icon: '' }
      },
      {
        path: 'timeStandard',
        name: 'TimeStandard',
        component: () => import('@/views/timeStandard/index'),
        meta: { title: '考勤标准管理', icon: '' }
      }
    ]
  },
  // 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/warnLevelManage',
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      // {
      //   path: 'ruleManage',
      //   name: 'RuleManage',
      //   component: () => import('@/views/ruleManage/index'),
      //   meta: { title: '引擎规则管理', icon: '' }
      // },
      {
        path: 'warnLevelManage',
        name: 'WarnLevelManage',
        component: () => import('@/views/warnLevelManage/index'),
        meta: { title: '警报等级管理', icon: '' }
      },
      {
        path: 'warnStandardManage',
        name: 'WarnStandardManage',
        component: () => import('@/views/warnStandardManage/index'),
        meta: { title: '警报标准管理', icon: '' }
      },
      {
        path: 'systemVoice',
        name: 'SystemVoice',
        component: () => import('@/views/systemVoice/index'),
        meta: { title: '系统声音管理', icon: '' }
      },
      {
        path: 'reportStatistic',
        name: 'ReportStatistic',
        component: () => import('@/views/reportStatistic/index'),
        meta: { title: '报表统计', icon: '' }
      }
      // {
      //   path: 'dataBackup',
      //   name: 'DataBackup',
      //   component: () => import('@/views/dataBackup/index'),
      //   meta: { title: '数据备份', icon: '' }
      // }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
