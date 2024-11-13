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
        :class="{ 'cursor-pointer': !disabled }"
        @click="handleUserHome"
      >
        <Icon
          v-if="!user.avatar"
          name="fluent:person-circle-20-regular"
          :size="size.toString()"
        />
        <el-avatar
          v-else
          class="flex shrink-0 items-center justify-center"
          round
          :size="size"
          :src="config.public.imageBase + user.avatar"
          :render-fallback="renderErrorAvatar"
        />
      </div>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Icon } from '#components'
import type { User } from 'sys-types'

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
