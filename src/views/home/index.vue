<template>
  <div class="home-container">
    <div class="m_home">
      <img src="static/img/welcome.png">
      <p class="m_homeContent">欢迎您使用矿用人员管理及环境参数移动通话监测系统</p>
    </div>
    <p class="m_homeBottom1">中科鑫合科技有限公司</p>
    <p class="m_homeBottom2">Copyright © 2018 - 2028 Zhongke Xinhe Co., Ltd All Rights Reserved.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.home-container{
  width: 100% !important;
  height: 100% !important;
}
.m_home{width: 50%;height: 40%; position: absolute;top: 20%;left: 25%;text-align: center;}
.m_home img{height: 100%;}
.m_homeContent{line-height: 50px;font-size: 28px;color: #1d5fb9;}
.m_homeBottom1{position: absolute;bottom: 25px;font-size: 15px;color: #666;text-align: center; width: 100%;}
.m_homeBottom2{position: absolute;bottom: 5px;font-size: 12px;color: #999;text-align: center;width: 100%; }
</style>
