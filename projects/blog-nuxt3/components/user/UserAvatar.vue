<template>
  <UserCard :userId="user.id" :disabled="disabled">
    <template #trigger>
      <n-avatar
        class="flex justify-center items-center shrink-0 cursor-pointer"
        round
        :size="size"
        :src="config.imageBase + user.avatar"
        :render-fallback="renderErrorAvatar"
        @click="handleUserHome"
      ></n-avatar>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import {
  NAvatar,
  NIcon,
} from "naive-ui"
import { h } from 'vue'
import {Person24Regular} from "@vicons/fluent"
import { User } from '@/types'

interface Props{
  user: User
  disabled?: boolean
  size?: number | "small" | "medium" | "large"
}
const props = defineProps<Props>()
const config = useRuntimeConfig()

async function handleUserHome(){
  if(props.disabled) return

  await navigateTo({ path: '/user/' + props.user.id })
}

function renderErrorAvatar() {
  return h(
    NIcon,
    {
      component: Person24Regular
    }
  )
}
</script>
