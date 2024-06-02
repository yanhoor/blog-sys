<template>
  <div class="user-follow-dropdown" v-if="user.id !== myInfo.id">
    <lazy-el-dropdown
      :options="userOptions"
      @command="handleDropdownSelect"
      v-if="user.isFollowing"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="action of userOptions"
            :key="action.key"
            :command="action.key"
            >{{ action.label }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
      <slot>
        <el-button
          round
          size="small"
          :round="roundBtn"
          :loading="followLoading"
          >{{ user.isMutualFollowing ? '互相关注' : '已关注' }}</el-button
        >
      </slot>
    </lazy-el-dropdown>
    <el-button
      type="primary"
      :round="roundBtn"
      @click="handleFollow(1)"
      :loading="followLoading"
      v-else
      >关注
      <template #icon>
        <Icon name="fluent:add-20-regular"></Icon>
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { User } from 'sys-types'
import { useFollowGroupSelectStore } from '~/store/modules/followGroupSelectStore'

interface Props {
  user: User
  roundBtn?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  roundBtn: true
})
const emit = defineEmits(['updateFollow'])
const myInfo = useUserInfo()
const followGroupSelectStore = useFollowGroupSelectStore()
const { followLoading, handleFollowUser } = useUserActions(props.user)
const userOptions = ref([
  {
    label: '取消关注',
    key: 'unfollow'
  },
  {
    label: '设置分组',
    key: 'setGroup'
  }
])

function handleDropdownSelect(key: string | number) {
  switch (key) {
    case 'unfollow':
      handleFollow(2)
      break
    case 'setGroup':
      followGroupSelectStore.showSelect = true
      followGroupSelectStore.userId = props.user.id
      break
  }
}

async function handleFollow(type: number) {
  try {
    await handleFollowUser(type)
    emit('updateFollow')
  } catch (e) {}
}
</script>
