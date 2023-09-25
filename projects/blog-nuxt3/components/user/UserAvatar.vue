<template>
  <UserCard :uid="user.id" :uname="user.name" :disabled="disabled">
    <template #trigger>
      <n-avatar
        class="flex shrink-0 items-center justify-center"
        :class="{ 'cursor-pointer': !disabled }"
        round
        :size="size"
        :src="config.public.imageBase + user.avatar"
        :render-fallback="renderErrorAvatar"
        @click="handleUserHome"
      ></n-avatar>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import { NAvatar, NIcon } from 'naive-ui'
import { h } from 'vue'
import { Person24Regular } from '@vicons/fluent'
import { User } from 'sys-types'

interface Props {
  user: User
  disabled?: boolean
  size?: number | 'small' | 'medium' | 'large'
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})
const config = useRuntimeConfig()

async function handleUserHome() {
  if (props.disabled) return

  await navigateTo({ path: '/user/id/' + props.user.id })
}

function renderErrorAvatar() {
  return h(NIcon, {
    component: Person24Regular
  })
}
</script>
