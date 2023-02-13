<template>
  <div class="user-follow-dropdown">
    <n-dropdown :options="userOptions" @select="handleDropdownSelect" v-if="user.isFollowing">
      <slot>
        <n-button type="tertiary" size="small" round :loading="followLoading">{{ user.isMutualFollowing ? '互相关注' : '已关注' }}</n-button>
      </slot>
    </n-dropdown>
    <n-button type="primary" round @click="handleFollow(1)" :loading="followLoading" v-else-if="user.id !== myInfo.id">关注
      <template #icon>
        <n-icon :component="Add24Regular"></n-icon>
      </template>
    </n-button>
    <UserFollowGroupSelect v-model:show="showGroupSelect" :userId="user.id"/>
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
import { Add24Regular } from '@vicons/fluent'

interface Props{
  user: User
}
const props = defineProps<Props>()
const emit = defineEmits(['update'])
const followLoading = ref(false)
const showGroupSelect = ref(false)
const myInfo = useUserInfo()
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
      handleFollow(2)
      break
    case 'setGroup':
      showGroupSelect.value = true
      break
  }
}

async function handleFollow(type: number) {
  followLoading.value = true
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/user/follow', { id: props.user?.id, type })
    if(success){
      emit('update')
    }else{
      message.error(msg as string)
    }
    followLoading.value = false
  }catch (e) {
    followLoading.value = false
  }
}
</script>
