<template>
  <LayoutMain size="large">
    <div class="flex items-start gap-[12px]">
      <el-card v-if="myInfo" class="sticky top-[80px] w-[180px]">
        <p
          class="group-title"
          :class="{ active: !currentGroupId }"
          @click="handleChangeGroup()"
        >
          全部关注
        </p>
        <p
          v-for="group of systemGroupList"
          :key="group.id"
          class="group-title"
          :class="{ active: currentGroupId == group.id }"
          @click="handleChangeGroup(group.id)"
        >
          {{ group.name }}
        </p>
        <div v-if="customGroupList.length" class="flex items-center">
          <p class="my-[6px] flex-1 text-[16px] font-semibold">自定义分组</p>
          <el-button size="small" text @click="showManageGroup = true">
            <template #icon>
              <Icon name="uil:edit-alt" size="18" />
            </template>
          </el-button>
        </div>
        <div v-auto-animate>
          <p
            v-for="group of customGroupList"
            :key="group.id"
            class="group-title"
            :class="{ active: currentGroupId == group.id }"
            @click="handleChangeGroup(group.id)"
          >
            {{ group.name }}
          </p>
        </div>
      </el-card>
      <PostList
        ref="listRef"
        class="flex-1"
        :search-params="{ gid: currentGroupId }"
      />
      <TopicHotList class="relative sticky top-[80px] w-[280px]" />
    </div>

    <client-only>
      <UserFollowGroupManage
        v-model:show="showManageGroup"
        :group-list="customGroupList"
        @change="getAllGroup"
      />
    </client-only>
  </LayoutMain>
</template>

<script setup lang="ts">
import type { FollowGroup } from 'sys-types'

useHead({
  title: '首页'
})
definePageMeta({
  pageTransition: false,
  key: (route) => route.fullPath
})

const { $HttpUtils } = useNuxtApp()
const route = useRoute()
const customGroupList = ref<FollowGroup[]>([])
const systemGroupList = ref<FollowGroup[]>([])
const currentGroupId = ref(route.query.gid)
const listRef = ref()
const myInfo = useUserInfo()
const showManageGroup = ref(false)

getAllGroup()

async function getAllGroup() {
  if (!myInfo.value) return

  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await $HttpUtils.post('/followGroup/all', {})
    if (success) {
      systemGroupList.value = []
      customGroupList.value = []
      result.forEach((g) => {
        if (g.system === 1) {
          systemGroupList.value.push(g)
        } else {
          customGroupList.value.push(g)
        }
      })
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}

async function handleChangeGroup(gid?: number) {
  gid
    ? await navigateTo({ path: '/', query: { gid } }, { replace: true })
    : await navigateTo('/', { replace: true })
  window.scrollTo(0, 0)
}
</script>

<style lang="postcss" scoped>
.group-title {
  @apply cursor-pointer px-[6px] py-[8px] text-[15px];

  &:hover {
    @apply rounded bg-gray-200 dark:bg-gray-700;
  }

  &.active {
    @apply text-green-600;
  }
}
</style>
