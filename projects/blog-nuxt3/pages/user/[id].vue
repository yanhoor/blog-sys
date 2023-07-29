<template>
  <div>
    <SkeletonUser v-if="loading" />
    <div v-else-if="userInfo">
      <div class="flex-1 overflow-hidden">
        <div>
          <div class="h-[180px] w-full">
            <img
              :src="config.public.imageBase + userInfo.profileCardBg"
              class="h-full w-full object-cover object-center"
              v-if="userInfo.profileCardBg"
            />
            <div
              class="h-full w-full bg-gradient-to-r from-sky-500 to-indigo-500"
              v-else
            ></div>
          </div>
          <div
            class="flex flex-col gap-[12px] bg-card-light p-[12px] pt-0 dark:bg-card-dark"
          >
            <div class="flex items-center gap-[12px]">
              <div class="flex flex-1 gap-[12px]">
                <UserAvatar
                  class="relative -mt-[55px]"
                  :size="120"
                  :user="userInfo"
                  disabled
                />
                <div class="flex flex-col gap-[6px]">
                  <div class="text-3xl font-bold">{{ userInfo?.name }}</div>
                  <div class="flex gap-[6px]">
                    <div
                      class="flex cursor-pointer items-center gap-[6px]"
                      @click="handleViewFriends(2)"
                    >
                      <span class="text-gray-400">粉丝</span>
                      <span class="text-[18px] font-semibold">{{
                        userInfo.followerCount
                      }}</span>
                    </div>
                    <div
                      class="flex cursor-pointer items-center gap-[6px]"
                      @click="handleViewFriends(1)"
                    >
                      <span class="text-gray-400">关注</span>
                      <span class="text-[18px] font-semibold">{{
                        userInfo.followingCount
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-end" v-if="myInfo">
                <n-button
                  type="primary"
                  @click="navigateTo({ name: 'user-profile' })"
                  v-if="myInfo?.id === userInfo.id"
                  >编辑资料</n-button
                >
                <UserFollowDropdown
                  v-else
                  :user="userInfo"
                  @update="getUserInfo"
                />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="flex gap-[12px]">
                <n-tag type="success" round v-if="userInfo.isMyFan">
                  <div class="flex items-center gap-[6px]">
                    <span>您的粉丝</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>阅读数</span>
                    <span>{{ statisInfo.readCount }}</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>点赞</span>
                    <span>{{ statisInfo.likeCount }}</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>被收藏</span>
                    <span>{{ statisInfo.collectCount }}</span>
                  </div>
                </n-tag>
              </div>
            </div>

            <div class="flex max-w-full flex-col gap-[12px] text-gray-600">
              <div
                class="flex items-start gap-[6px]"
                v-if="userInfo?.introduce"
              >
                <n-icon :component="DocumentText24Regular" size="20" />
                <span>{{ userInfo?.introduce }}</span>
              </div>
              <div class="flex items-start gap-[6px]">
                <n-icon :component="CalendarLtr24Regular" size="20" />
                <n-time
                  type="date"
                  format="yyyy-MM-dd"
                  :time="new Date(userInfo.createdAt)"
                ></n-time>
              </div>
            </div>
          </div>
        </div>

        <div class="my-[12px]">
          <n-tabs
            type="line"
            :value="contentType"
            @update:value="handleTabChange"
          >
            <n-tab name="1">精选</n-tab>
            <n-tab name="2">博客</n-tab>
            <n-tab name="3">视频</n-tab>
            <n-tab name="4">图片</n-tab>
          </n-tabs>
        </div>
        <template v-if="contentType == 1">
          <PostList
            :search-params="{ uid: searchParams.uid, sort: '3' }"
            canEdit
          />
        </template>
        <template v-if="contentType == 2">
          <div class="mb-[12px] flex items-center justify-between">
            <div>全部博客({{ blogTotal }})</div>
            <n-button
              quaternary
              size="small"
              type="primary"
              v-if="showSearch"
              @click="showSearch = false"
              >取消</n-button
            >
            <n-button
              size="small"
              type="primary"
              quaternary
              circle
              @click="showSearch = true"
              v-else
            >
              <template #icon>
                <n-icon :component="Search12Regular" />
              </template>
            </n-button>
          </div>
          <n-collapse-transition class="mb-[12px]" :show="showSearch">
            <div class="flex items-center gap-[12px]">
              <y-search
                v-model:value="searchParams.keyword"
                @confirm="handleSearchPost"
              />
              <n-date-picker
                v-model:value="selectDateRange"
                :shortcuts="rangeShortcuts"
                :is-date-disabled="(ts) => ts > Date.now()"
                type="daterange"
                clearable
              />
              <n-button size="small" type="primary" @click="handleSearchPost"
                >确定</n-button
              >
            </div>
          </n-collapse-transition>
          <PostList
            ref="blogListRef"
            :search-params="searchParams"
            @fetchComplete="handleBlogFetchComplete"
            canEdit
          />
        </template>
        <template v-if="contentType == 3">
          <UserVideoWall :user-id="userInfo.id" />
        </template>
        <template v-if="contentType == 4">
          <UserImageWall :user-id="userInfo.id" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarLtr24Regular,
  DocumentText24Regular,
  Search12Regular
} from '@vicons/fluent'
import {
  NCollapseTransition,
  NButton,
  NTabs,
  NTab,
  NTime,
  NIcon,
  NTag,
  NDatePicker,
  createDiscreteApi
} from 'naive-ui'
import { User, Media } from '~/types'
import dayjs from 'dayjs'

definePageMeta({
  key: (route) => route.path
})
const config = useRuntimeConfig()
const route = useRoute()
const myInfo = useUserInfo()
const userInfo = ref<User>()
const loading = ref(false)
const showSearch = ref(false)
const selectDateRange = ref<[number, number]>()
const rangeShortcuts = {
  昨天: () => {
    const start = dayjs().subtract(1, 'd').startOf('date').valueOf()
    const end = dayjs().startOf('date').valueOf()
    return [start, end] as const
  },
  上周: () => {
    const start = dayjs().subtract(1, 'w').startOf('w').valueOf()
    const end = dayjs().subtract(1, 'w').endOf('w').valueOf()
    return [start, end] as const
  },
  上个月: () => {
    const start = dayjs().subtract(1, 'M').startOf('M').valueOf()
    const end = dayjs().subtract(1, 'M').endOf('M').valueOf()
    return [start, end] as const
  },
  今年: () => {
    const start = dayjs().startOf('y').valueOf()
    const end = dayjs().valueOf()
    return [start, end] as const
  }
}
const blogListRef = ref()
const blogTotal = ref(0)
const imageList = ref<Media[]>([])
const searchParams = reactive({
  uid: '',
  keyword: '',
  startTime: '',
  endTime: ''
})
const contentType = ref(route.query.tab || '1')
const statisInfo = ref({
  readCount: 0,
  likeCount: 0,
  collectCount: 0
})

watch(
  () => route.query,
  (val) => {
    contentType.value = val.tab || '1'
  }
)

useHead(() => {
  return {
    title: loading.value ? '加载中...' : `@${userInfo.value?.name}的个人主页`
  }
})

await handlePageInit()

async function handlePageInit() {
  loading.value = true
  await getUserInfo()
  await getUserStatis()
  loading.value = false
}

async function getUserInfo() {
  const { message } = useDiscreteApi(['message'])
  try {
    const { result, success, code, msg } = await useFetchPost(
      '/user/' + route.params.id,
      {}
    )
    if (success) {
      userInfo.value = result
      searchParams.uid = result.id
    } else {
      message.error(msg as string)
      if (code == 222) {
        await navigateTo('/', { replace: true })
      }
    }
  } catch (e) {}
}

async function getUserStatis() {
  const { message } = useDiscreteApi(['message'])
  try {
    const { result, success, code, msg } = await useFetchPost('/statis/user', {
      id: userInfo.value?.id
    })
    if (success) {
      statisInfo.value = result
    } else {
      message.error(msg as string)
    }
  } catch (e) {}
}

function handleBlogFetchComplete(res: any) {
  blogTotal.value = res.value.total
}

function handleTabChange(val: string) {
  searchParams.keyword = ''
  searchParams.startTime = ''
  searchParams.endTime = ''
  selectDateRange.value = undefined
  navigateTo('/user/' + userInfo.value?.id + '?tab=' + val)
}

function handleViewFriends(type: number) {
  if (type === 1) {
    if (userInfo.value?.id === myInfo.value?.id) {
      navigateTo('/my/following')
    }
  }
  if (type === 2) {
    if (userInfo.value?.id === myInfo.value?.id) {
      navigateTo('/my/follower')
    }
  }
}

function handleSearchPost() {
  const { message } = useDiscreteApi(['message'])
  if (selectDateRange.value?.length) {
    const diff = dayjs(selectDateRange.value[1]).diff(
      dayjs(selectDateRange.value[0]),
      'month',
      true
    )
    if (diff > 12) {
      message.warning('时长不能超过一年')
      return
    }
    searchParams.startTime = new Date(selectDateRange.value[0]).toString()
    searchParams.endTime = new Date(selectDateRange.value[1]).toString()
  } else {
    searchParams.startTime = ''
    searchParams.endTime = ''
  }
  blogListRef.value.handleChangeFetchParams(searchParams)
  blogListRef.value.handleLoadNextPage(1)
}
</script>

<style lang="postcss" scoped>
.statis-item {
  @apply flex items-center py-[5px];
  .n-icon {
    @apply mr-[6px];
  }
  .statis-num {
    @apply ml-[6px] text-[18px] font-semibold;
  }
}
</style>
