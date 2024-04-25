<template>
  <UserCard :uid="user.id" :uname="user.name" :disabled="disabled">
    <template #trigger>
      <span
        class="cursor-pointer text-primary"
        @click="navigateTo({ path: '/user/id/' + user.id })"
      >
        {{ (showAt ? '@' : '') + user.name }}
      </span>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import type { User } from 'sys-types'

interface Props {
  user: User
  showAt?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAt: false,
  disabled: false
})
</script>
