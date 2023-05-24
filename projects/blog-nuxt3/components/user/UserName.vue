<template>
  <span
    class="cursor-pointer text-green-700"
    @click="navigateTo({ path: '/user/' + user.id })"
  >
    {{ (showAt ? '@' : '') + user.name }}
  </span>
</template>

<script setup lang="ts">
import { User } from 'sys-types'

interface Props {
  user: User
  showAt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAt: false
})
</script>
