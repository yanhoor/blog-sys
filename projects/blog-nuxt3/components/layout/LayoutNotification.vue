<template>
  <div class="notification-container">
    <n-badge :value="notificationCount" :max="99">
      <n-icon :size="28" :component="Chat24Regular" />
    </n-badge>
  </div>
</template>

<script setup lang="ts">
import {
  NIcon,
  NBadge
} from "naive-ui"
import { Chat24Regular } from '@vicons/fluent'

const notificationCount = useNotificationCount()

</script>
