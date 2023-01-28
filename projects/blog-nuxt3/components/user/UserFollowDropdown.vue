<template>
  <div>
    <n-dropdown :options="userOptions" @select="handleDropdownSelect">
      <slot></slot>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NSpace,
  NModal,
  NIcon,
  NDropdown,
  createDiscreteApi
} from "naive-ui"
import { User } from "~/types"

interface Props{
  user: User
}
const props = defineProps<Props>()
const emit = defineEmits(['unfollow', 'selectGroup'])
const userOptions = ref([
  {
    label: '取消关注',
    key: 'unfollow',
  },
  {
    label: '设置分组',
    key: 'setGroup',
  }
])

function handleDropdownSelect(key: string | number){
  switch (key) {
    case 'unfollow':
      emit('unfollow')
      break
    case 'setGroup':
      emit('selectGroup')
      break
  }
}
</script>
