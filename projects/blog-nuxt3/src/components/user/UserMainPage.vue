<template>
  <LayoutMain>
    <SkeletonUser v-if="loading" />
    <div v-else-if="userInfo">
      <div class="flex-1 overflow-hidden">
        <div>
          <div class="h-[180px] w-full">
            <img
              v-if="userInfo.profileCardBg"
              :src="config.public.imageBase + userInfo.profileCardBg"
              class="h-full w-full object-cover object-center"
            />
            <div
              v-else
              class="h-full w-full bg-gradient-to-r from-sky-500 to-indigo-500"
            />
          </div>
          <div
            class="bg-card-light dark:bg-card-dark flex flex-col gap-[12px] p-[12px] pt-0"
          >
            <div class="flex items-center gap-[12px]">
              <div class="flex flex-1 gap-[12px]">
                <div class="-mt-[56px]">
                  <UserAvatar :size="120" :user="userInfo" disabled />
                </div>
                <div class="flex flex-col gap-[6px]">
                  <div class="regular-text-color text-3xl font-bold">
                    {{ userInfo?.name }}
                  </div>
                  <div class="flex gap-[6px]">
                    <div
                      class="flex cursor-pointer items-center gap-[6px]"
                      @click="handleViewFriends(2)"
                    >
                      <span class="secondary-text-color">粉丝</span>
                      <span
                        class="regular-text-color text-[18px] font-semibold"
                        >{{ userInfo.followerCount }}</span
                      >
                    </div>
                    <div
                      class="flex cursor-pointer items-center gap-[6px]"
                      @click="handleViewFriends(1)"
                    >
                      <span class="secondary-text-color">关注</span>
                      <span
                        class="regular-text-color text-[18px] font-semibold"
                        >{{ userInfo.followingCount }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="myInfo" class="flex items-end">
                <el-button
                  v-if="myInfo?.id === userInfo.id"
                  type="primary"
                  @click="navigateTo({ name: 'user-profile' })"
                  >编辑资料</el-button
                >
                <UserFollowDropdown
                  v-else
                  :user="userInfo"
                  @update-follow="getUserInfo"
                />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="flex gap-[12px]">
                <el-tag v-if="userInfo.isMyFan" type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>您的粉丝</span>
                  </div>
                </el-tag>
                <el-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>阅读数</span>
                    <span>{{ statisInfo.readCount }}</span>
                  </div>
                </el-tag>
                <el-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>点赞</span>
                    <span>{{ statisInfo.likeCount }}</span>
                  </div>
                </el-tag>
                <el-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>被收藏</span>
                    <span>{{ statisInfo.collectCount }}</span>
                  </div>
                </el-tag>
              </div>
            </div>

            <div
              class="secondary-text-color flex max-w-full flex-col gap-[12px]"
            >
              <div
                v-if="userInfo?.introduce"
                class="flex items-start gap-[6px]"
              >
                <Icon name="fluent:document-text-20-regular" size="20" />
                <span>{{ userInfo?.introduce }}</span>
              </div>
              <div class="flex items-start gap-[6px]">
                <Icon name="fluent:calendar-ltr-20-regular" size="20" />
                <div>{{ formatTime(userInfo.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="my-[12px]">
          <el-tabs v-model="contentType" @tab-change="handleTabChange">
            <el-tab-pane name="1" label="精选" lazy>
              <PostList
                :search-params="{ uid: searchParams.uid, sort: '3' }"
                can-edit
              />
            </el-tab-pane>
            <el-tab-pane name="2" label="博客" lazy>
              <div class="mb-[12px] flex items-center justify-between">
                <div class="regular-text-color">全部博客({{ blogTotal }})</div>
                <el-button
                  v-if="showSearch"
                  quaternary
                  size="small"
                  type="primary"
                  @click="showSearch = false"
                  >取消</el-button
                >
                <el-button
                  v-else
                  size="small"
                  type="primary"
                  quaternary
                  circle
                  @click="showSearch = true"
                >
                  <template #icon>
                    <Icon name="fluent:search-20-regular" />
                  </template>
                </el-button>
              </div>
              <Transition name="fade">
                <div
                  v-if="showSearch"
                  class="mb-[12px] transition-all duration-300"
                >
                  <div class="flex items-center gap-[12px]">
                    <y-search
                      v-model="searchParams.keyword"
                      @confirm="handleSearchPost"
                    />
                    <el-date-picker
                      v-model="selectDateRange"
                      :shortcuts="rangeShortcuts"
                      :disabled-date="(ts: Date) => ts.getTime() > Date.now()"
                      type="daterange"
                      clearable
                    />
                    <el-button
                      size="small"
                      type="primary"
                      @click="handleSearchPost"
                      >确定</el-button
                    >
                  </div>
                </div>
              </Transition>
              <PostList
                ref="blogListRef"
                :search-params="searchParams"
                can-edit
                @fetch-complete="handleBlogFetchComplete"
              />
            </el-tab-pane>
            <el-tab-pane name="3" label="视频" lazy>
              <UserVideoWall :user-id="userInfo.id" />
            </el-tab-pane>
            <el-tab-pane name="4" label="图片" lazy>
              <UserImageWall :user-id="userInfo.id" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <ResultError v-else :msg="errorMsg" @refresh="handlePageInit" />
  </LayoutMain>
</template>

<script setup lang="ts">
import type { User, Media } from 'sys-types'
import { formatTime } from 'sys-types'
import dayjs from 'dayjs'

interface Props {
  uid?: string
  uname?: string
}

const { $HttpUtils } = useNuxtApp()
const props = defineProps<Props>()
const config = useRuntimeConfig()
const route = useRoute()
const myInfo = useUserInfo()
const userInfo = ref<User>()
const loading = ref(false)
const showSearch = ref(false)
const errorMsg = ref()
const selectDateRange = ref<[number, number]>()
const rangeShortcuts = [
  {
    text: '昨天',
    value: () => {
      const start = dayjs().subtract(1, 'd').startOf('date').valueOf()
      const end = dayjs().startOf('date').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上周',
    value: () => {
      const start = dayjs().subtract(1, 'w').startOf('w').valueOf()
      const end = dayjs().subtract(1, 'w').endOf('w').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上个月',
    value: () => {
      const start = dayjs().subtract(1, 'M').startOf('M').valueOf()
      const end = dayjs().subtract(1, 'M').endOf('M').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '今年',
    value: () => {
      const start = dayjs().startOf('y').valueOf()
      const end = dayjs().valueOf()
      return [start, end] as const
    }
  }
]
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

useHead(() => {
  return {
    title: loading.value
      ? '加载中...'
      : userInfo.value?.name
        ? `@${userInfo.value?.name}的个人主页`
        : errorMsg.value || '🤬用户不存在'
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
  try {
    const { result, success, code, msg } = await $HttpUtils.post<User>(
      '/user/userInfo',
      { uid: props.uid, uname: props.uname }
    )
    if (success) {
      userInfo.value = result
      searchParams.uid = result!.id
    } else {
      errorMsg.value = msg
    }
  } catch (e) {
    console.log('=======getUserInfo=======', e)
  }
}

async function getUserStatis() {
  try {
    const { result, success, code, msg } = await $HttpUtils.post<any>(
      '/statis/user',
      {
        id: userInfo.value?.id
      }
    )
    if (success) {
      statisInfo.value = result
    }
  } catch (e) {
    console.log('=======getUserStatis=======', e)
  }
}

function handleBlogFetchComplete(res: any) {
  blogTotal.value = res.value.total
}

async function handleTabChange(val: string) {
  searchParams.keyword = ''
  searchParams.startTime = ''
  searchParams.endTime = ''
  selectDateRange.value = undefined
  await navigateTo('/user/id/' + userInfo.value?.id + '?tab=' + val, {
    replace: true
  })
}

async function handleViewFriends(type: number) {
  if (type === 1) {
    if (userInfo.value?.id === myInfo.value?.id) {
      await navigateTo('/my/following')
    }
  }
  if (type === 2) {
    if (userInfo.value?.id === myInfo.value?.id) {
      await navigateTo('/my/follower')
    }
  }
}

function handleSearchPost() {
  if (selectDateRange.value?.length) {
    const diff = dayjs(selectDateRange.value[1]).diff(
      dayjs(selectDateRange.value[0]),
      'month',
      true
    )
    if (diff > 12) {
      ElMessage.warning('时长不能超过一年')
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

<style lang="postcss" scoped></style>
