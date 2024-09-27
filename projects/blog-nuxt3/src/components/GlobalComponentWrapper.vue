<template>
  <div>
    <client-only>
      <UserFollowGroupSelect
          v-model:show="followGroupSelectStore.showSelect"
          :userId="followGroupSelectStore.userId"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useFollowGroupSelectStore } from '~/store/modules/followGroupSelectStore'

const followGroupSelectStore = useFollowGroupSelectStore()
</script>
