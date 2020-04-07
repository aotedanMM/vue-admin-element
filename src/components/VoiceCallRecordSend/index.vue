<template>
  <div>
    <!--<div v-show="showTimeStatus" class="m_time">{{ currentChatTime | formatDateMinute }}</div>-->
    <div class="m_voiceCallRecordContainer">
      <div class="m_triangle"/>
      <div class="m_triangle2"/>
      <div class="m_voiceCallRecord">
        <p class="m_voiceCallTips">{{ voiceCallTips }}</p>
        <img src="static/img/call.png" class="m_callImg">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoiceCallRecordSend',
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
  .m_voiceCallRecord{float: right; width: fit-content;height: 50px;background:#4ba4ff; border: 1px solid #409eff;color: #fff;border-radius: 5px;display: flex;justify-content: space-between;padding: 0 10px;   }
  .m_callImg{height: 20px;margin: 15px 0;}
  .m_voiceCallTips{line-height: 50px;margin-right: 10px !important; }
  .m_triangle{
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: #409eff;
    float: right;
    margin-top: 19px;
  }
  .m_triangle2{
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-left-color: #4ba4ff;
    position: absolute;
    top: 20px;
    right: 3px;
  }
</style>
