<template>
  <LayoutMain size="large">
    <div class="flex items-start gap-[12px]">
      <n-card class="sticky top-[80px] w-[180px]" v-if="myInfo">
        <p
          class="group-title"
          :class="{ active: !currentGroupId }"
          @click="handleChangeGroup()"
        >
          全部关注
        </p>
        <p
          class="group-title"
          :class="{ active: currentGroupId == group.id }"
          v-for="group of systemGroupList"
          :key="group.id"
          @click="handleChangeGroup(group.id)"
        >
          {{ group.name }}
        </p>
        <div class="flex items-center" v-if="customGroupList.length">
          <p class="my-[6px] flex-1 text-[16px] font-semibold">自定义分组</p>
          <n-button size="small" text @click="showManageGroup = true">
            <template #icon>
              <Icon name="uil:edit-alt" size="18"></Icon>
            </template>
          </n-button>
        </div>
        <div v-auto-animate>
          <p
            class="group-title"
            :class="{ active: currentGroupId == group.id }"
            v-for="group of customGroupList"
            :key="group.id"
            @click="handleChangeGroup(group.id)"
          >
            {{ group.name }}
          </p>
        </div>
      </n-card>
      <PostList
        ref="listRef"
        class="flex-1"
        :searchParams="{ gid: currentGroupId }"
      />
      <TopicHotList class="relative sticky top-[80px] w-[280px]" />
    </div>

    <div class="mt-[20px] text-center text-gray-400">
      <a
        href="https://beian.miit.gov.cn"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary"
        >粤ICP备2022151349号</a
      >
    </div>

    <UserFollowGroupManage
      v-model:show="showManageGroup"
      @change="getAllGroup"
      :groupList="customGroupList"
    />
  </LayoutMain>
</template>

<script setup lang="ts">
import { NCard, NButton } from 'naive-ui'
import type { FollowGroup } from 'sys-types'

useHead({
  title: '首页'
})
definePageMeta({
  pageTransition: false,
  key: (route) => route.fullPath
})

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

  const { message } = useDiscreteApi(['message'])
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await useFetchPost('/followGroup/all', {})
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
      message.error(msg as string)
    }
  } catch (e) {}
}

async function handleChangeGroup(gid?: number) {
  gid ? await navigateTo({ path: '/', query: { gid } }) : await navigateTo('/')
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
