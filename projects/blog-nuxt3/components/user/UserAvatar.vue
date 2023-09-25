<template>
  <UserCard
    class="leading-[1]"
    :uid="user.id"
    :uname="user.name"
    :disabled="disabled"
  >
    <template #trigger>
      <span @click="handleUserHome" :class="{ 'cursor-pointer': !disabled }">
        <n-icon
          :component="PersonCircle20Regular"
          v-if="!user.avatar"
          :size="size"
        ></n-icon>
        <n-avatar
          v-else
          class="flex shrink-0 items-center justify-center"
          round
          :size="size"
          :src="config.public.imageBase + user.avatar"
          :render-fallback="renderErrorAvatar"
        ></n-avatar>
      </span>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import { NAvatar, NIcon } from 'naive-ui'
import { h } from 'vue'
import { PersonCircle20Regular } from '@vicons/fluent'
import { User } from 'sys-types'

interface Props {
  user: User
  disabled?: boolean
  size?: number
}
const props = withDefaults(defineProps<Props>(), {
  size: 32
})
const config = useRuntimeConfig()

async function handleUserHome() {
  if (props.disabled) return

  await navigateTo({ path: '/user/id/' + props.user.id })
}

function renderErrorAvatar() {
  return h(NIcon, {
    component: PersonCircle20Regular
  })
}
</script>
