<template>
  <div class="m_voiceCallRecordContainer">
    <div class="m_triangle"/>
    <div class="m_triangle2"/>
    <div class="m_voiceCallRecord">
      <img src="static/img/call2.png" class="m_callImg">
      <p class="m_voiceCallTips">{{ voiceCallTips }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoiceCallRecordReceive',
  props: {
    voiceCallTips: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .m_voiceCallRecordContainer{width: 100%;height: 50px;margin: 10px 0;position: relative;  }
  .m_voiceCallRecord{ width: fit-content;height: 50px;background:#fff; border: 1px solid #ddd;color: #333;border-radius: 5px;display: flex;justify-content: space-between;padding: 0 10px;   }
  .m_callImg{height: 20px;margin: 15px 0;}
  .m_voiceCallTips{line-height: 50px;margin-left: 10px !important; }
  .m_triangle{
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: #ddd;
    float: left;
    margin-top: 19px;
  }
  .m_triangle2{
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right-color: #fff;
    position: absolute;
    top: 20px;
    left: 3px;
  }
</style>
