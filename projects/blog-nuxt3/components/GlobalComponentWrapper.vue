<template>
  <UserFollowGroupSelect
    v-model:show="followGroupSelectStore.showSelect"
    :userId="followGroupSelectStore.userId"
  />
</template>

<script setup lang="ts">
import { useFollowGroupSelectStore } from '~/store/modules/followGroupSelectStore'

const followGroupSelectStore = useFollowGroupSelectStore()
</script>
