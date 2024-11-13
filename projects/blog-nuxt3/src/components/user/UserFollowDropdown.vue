<template>
  <div v-if="user.id !== myInfo.id" class="user-follow-dropdown">
    <el-dropdown
      v-if="user.isFollowing"
      :options="userOptions"
      :teleported="false"
      @command="handleDropdownSelect"
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
    </el-dropdown>
    <el-button
      v-else
      type="primary"
      :round="roundBtn"
      :loading="followLoading"
      @click="handleFollow(1)"
      >关注
      <template #icon>
        <Icon name="fluent:add-20-regular" />
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
    if (type === 2) {
      await ElMessageBox.confirm('确定取消关注吗？', {
        title: '取消关注',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    }
    await handleFollowUser(type)
    emit('updateFollow')
  } catch (e) {}
}
</script>
