<template>
  <n-avatar
    class="flex justify-center items-center"
    round
    :size="props.size"
    :src="config.imageBase + props.src"
    :render-fallback="renderErrorAvatar"
  ></n-avatar>
</template>

<script setup lang="ts">
import {
  NAvatar,
  NIcon,
} from "naive-ui"
import { h } from 'vue'
import {Person24Regular} from "@vicons/fluent"

const props = defineProps(['src', 'size'])
const config = useRuntimeConfig()

function renderErrorAvatar() {
  return h(
    NIcon,
    {
      component: Person24Regular
    }
  )
}
</script>
