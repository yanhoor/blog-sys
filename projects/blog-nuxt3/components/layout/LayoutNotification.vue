<template>
  <n-badge :value="notificationUnreadCount" :max="99">
    <n-icon :size="28" :component="Chat24Regular" />
  </n-badge>
</template>

<script setup lang="ts">
import {
  NIcon,
  NBadge
} from "naive-ui"
import { Chat24Regular } from '@vicons/fluent'
import {useNotificationUnreadCount} from "~/composables/useNotification";

const notificationUnreadCount = useNotificationUnreadCount()

</script>
