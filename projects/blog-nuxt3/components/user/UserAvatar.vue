<template>
  <UserCard
    class="leading-[1]"
    :uid="user.id"
    :uname="user.name"
    :disabled="disabled"
  >
    <template #trigger>
      <div
        class="leading-[1]"
        @click="handleUserHome"
        :class="{ 'cursor-pointer': !disabled }"
      >
        <Icon
          name="fluent:person-circle-20-regular"
          v-if="!user.avatar"
          :size="size.toString()"
        ></Icon>
        <n-avatar
          v-else
          class="flex shrink-0 items-center justify-center"
          round
          :size="size"
          :src="config.public.imageBase + user.avatar"
          :render-fallback="renderErrorAvatar"
        ></n-avatar>
      </div>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import { NAvatar } from 'naive-ui'
import { h } from 'vue'
import { Icon } from '#components'
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
  return h(Icon, { name: 'fluent:person-circle-20-regular' })
}
</script>
