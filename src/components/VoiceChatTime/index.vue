<template>
  <div>
    <div class="m_time">
      {{ currentChatTime | formatDateMinute }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoiceChatTime',
  props: {
    currentChatTime: {
      required: true,
      type: Number
    }
  }
}
</script>

<style scoped>

</style>
