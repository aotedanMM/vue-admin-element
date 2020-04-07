<template>
  <div>
    <div class="m_infoPosition">
      <img src="static/img/person2.png">
      <div class="m_info">
        <div class="m_infoHeader">
          <p>员工: {{ staffName }}</p>
          <p>X:{{ x }}</p>
          <p>Y: {{ y | addZero }}</p>
        </div>
        <div class="m_infoFooter"/>
      </div>
    </div>
    <div class="m_mapPosition">
      <img src="static/img/person.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonPosition',
  filters: {
    addZero: function(data) {
      return data.toFixed(2)
    }
  },
  data() {
    return {
      staffName: '吴子棋',
      x: 26.52,
      y: 8.25
    }
  },
  created() {
    this.handleChange()
  },
  methods: {
    handleChange() {
      this.timer = setInterval(() => {
        this.x += 1.8
        this.x = Math.floor(this.x * 100) / 100
      }, 80)
      setTimeout(() => {
        clearInterval(this.timer)
      }, 30 * 1000)
    }
  }
}
</script>

<style scoped>
  .m_mapPosition{
    position: absolute;
    z-index: 2;
    top:0;
    left: 0;
    width:600px;
    height:350px;
    background: url("../../static/img/1234.png");
    background-size:  100% 100%;
  }
  .m_mapPosition img{
    position: absolute;
    left: 290px;
    top: 0;
    animation:mymove3 30s linear 0ms 1 normal;
    -webkit-animation:mymove3 30s linear 0ms 1 normal;
  }
  @keyframes mymove3
  {
    from {top:0;}
    to {top:290px;}
  }

  @-webkit-keyframes mymove3 /*Safari and Chrome*/
  {
    from {top:0;}
    to {top:290px;}
  }
  .m_infoPosition
  {
    background: url("../../static/img/personPositionBg.png");
    width:1920px;
    height:940px;
    position: relative;
  }
  /*animation:mymove 5s infinite;
  -webkit-animation:mymove 5s infinite; /*Safari and Chrome*/
  .m_infoPosition img{
    position: absolute;
    right: 450px;
    /*140*/
    top: 570px;
    /* 535*/
    animation:mymove 30s linear 0ms 1 normal;
    -webkit-animation:mymove 30s linear 0ms 1 normal;
  }
  @keyframes mymove
  {
    from {right:450px;}
    to {right:1600px;}
  }

  @-webkit-keyframes mymove /*Safari and Chrome*/
  {
    from {right:450px;}
    to {right:1600px;}
  }
  @keyframes mymove2
  {
    from {right:408px;}
    to {right:1558px;}
  }

  @-webkit-keyframes mymove2 /*Safari and Chrome*/
  {
    from {right:408px;}
    to {right:1558px;}
  }
  .m_info{
    width: 130px;
    height: 110px;
    position: absolute;
    right: 408px;
    top:470px;
    animation:mymove2 30s linear 0ms 1 normal;
    -webkit-animation:mymove2 30s linear 0ms 1 normal;
  }
  .m_infoHeader{
    padding: 5px;
    line-height: 25px;
    width: 130px;
    height: 90px;
    background: #fff;
    border-radius: 5px;
  }
  .m_infoFooter{
    margin: auto;
    width: 0;
    height: 0;
    border: 15px solid;
    margin-top: -5px;
    border-color: white transparent transparent ;
  }
</style>
