<template>
  <n-badge :value="notificationUnreadCount" :max="99" @click="toNotification">
    <n-icon :size="28" :component="Chat24Regular" />
  </n-badge>
</template>

<script setup lang="ts">
import {
  NIcon,
  NBadge
} from "naive-ui"
import { Chat24Regular } from '@vicons/fluent'

const notificationUnreadCount = useNotificationUnreadCount()

function toNotification() {
  navigateTo('/notification')
  if(notificationUnreadCount.value){
    navigateTo('/notification')
  }
}

</script>
