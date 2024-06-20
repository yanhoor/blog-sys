<template>
  <div class="notification-list">
    <SkeletonNotification v-if="pageLoading && pageFetchParams.page === 1" />

    <div v-loadMore="handleLoadNextPage" v-else>
      <div class="mb-[12px] flex items-center justify-between">
        <div class="flex items-center gap-[6px]">
          <template v-if="pageList.length > 0 && fetchResult.unreadTotal > 0">
            <div class="flex items-center gap-[6px]">
              <template v-if="showCheck">
                <el-checkbox
                  size="large"
                  @change="handleCheckAll"
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                ></el-checkbox>
                <el-button size="small" @click="handleCancelCheck"
                  >取消</el-button
                >
                <el-button
                  size="small"
                  :type="checkedList.length > 0 ? 'primary' : 'tertiary'"
                  @click="handleMultiRemark(false)"
                  :disabled="batchProcessing"
                  >标为已读</el-button
                >
              </template>
              <el-button size="small" @click="showCheck = true" v-else>
                <template #icon>
                  <Icon name="fluent:task-list-20-regular" size="24"></Icon>
                </template>
              </el-button>
            </div>
            <el-button
              size="small"
              @click="handleMultiRemark(true)"
              :disabled="batchProcessing"
              >全部标为已读</el-button
            >
          </template>
        </div>
        <el-radio-group
          v-model="pageFetchParams.isRead"
          @change="handleLoadNextPage(1)"
          size="small"
        >
          <el-radio-button :value="0" label="未读"></el-radio-button>
          <el-radio-button
            :value="3"
            :label="`全部(${fetchResult?.total || 0})`"
          ></el-radio-button>
        </el-radio-group>
      </div>
      <template v-if="pageList.length">
        <el-checkbox-group
          class="grid grid-cols-1 gap-[12px] overflow-hidden"
          v-model="checkedList"
          @change="handleCheckItem"
        >
          <div v-auto-animate class="[&_div+div]:mt-[24px]">
            <div
              v-for="notification of pageList"
              :key="notification.id"
              class="flex items-start gap-[12px]"
            >
              <el-checkbox
                size="large"
                :value="notification.id"
                :disabled="!!notification.isRead"
                v-if="showCheck"
              ></el-checkbox>
              <el-card class="overflow-hidden w-full">
                <div
                  class="group flex flex-col items-start gap-[12px] divide-y divide-border-light dark:divide-border-dark"
                  :class="{ 'text-gray-400': notification.isRead }"
                >
                  <slot :notification="notification"></slot>

                  <div
                    class="flex w-full items-center justify-between pt-[12px]"
                  >
                    <span
                      v-time="notification.createdAt"
                      class="text-gray-400"
                    />
                    <el-button
                      text
                      type="primary"
                      class="hidden group-hover:block"
                      v-if="!notification.isRead"
                      @click="handleRemarkRead(notification.id)"
                      >标为已读</el-button
                    >
                    <span class="hidden text-primary group-hover:block" v-else
                      >已读</span
                    >
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-checkbox-group>
      </template>
      <ResultLoading v-if="pageLoading" />
      <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)" />
      <ResultEmpty
        v-else-if="pageList.length === 0"
        @refresh="handleLoadNextPage(1)"
      />
      <ResultNoMore v-else-if="pageLoadedFinish" />
      <el-backtop :right="50" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from 'sys-types'

interface Props {
  typeName: string
  type: number
}
const props = defineProps<Props>()
useHead({
  title: `通知--${props.typeName}`
})
let fetchType = 'comment,comment_reply'
switch (props.type) {
  // 评论
  case 1:
    fetchType = 'comment,comment_reply'
    break
  // 点赞
  case 2:
    fetchType = 'like_blog'
    break
  // 收藏
  case 3:
    fetchType = 'collect_blog'
    break
  // 系统
  case 4:
    fetchType = 'system_audit'
    break
}
const {
  pageList,
  pageLoading,
  pageFetchParams,
  fetchResult,
  pageLoadedFinish,
  handleLoadNextPage
} = useListAppendFetch<Notification>(
  '/notification/list',
  { type: fetchType, isRead: 0 },
  {}
)
const showCheck = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const batchProcessing = ref(false)
const checkedList = ref<any[]>([])
const allItemList = computed(() => pageList.value.filter((i) => !i.isRead)) // 排除已读的所有可选项

handleLoadNextPage()

function handleCheckAll(v: boolean) {
  checkedList.value = v ? allItemList.value.map((i) => i.id) : []
  isIndeterminate.value = false
}

function handleCheckItem() {
  checkAll.value = checkedList.value.length === allItemList.value.length
  isIndeterminate.value =
    checkedList.value.length > 0 &&
    checkedList.value.length < allItemList.value.length
}

function handleCancelCheck() {
  showCheck.value = false
  isIndeterminate.value = false
  checkAll.value = false
  checkedList.value = []
}

async function handleRemarkRead(id: string, isAll = false) {
  let params = {}
  if (isAll) {
    params = { isAll: 1, type: fetchType }
  } else {
    params = { id }
  }
  try {
    const { result, success } = await useFetchPost('/notification/read', params)
    if (success) {
      useFetchNotificationCount()
      handleLoadNextPage(1)
      handleCancelCheck()
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

async function handleMultiRemark(isAll: boolean) {
  if (isAll) {
    ElMessageBox.warning(
      `确定将所有未读${props.typeName}通知标为已读?`,
      '全部标为已读',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
      .then(async () => {
        batchProcessing.value = true
        const r = await handleRemarkRead('', true)
        if (r) {
          ElMessage.success('操作成功')
        }
        batchProcessing.value = false
      })
      .catch(() => {})
  } else {
    const s = checkedList.value.toString()
    batchProcessing.value = true
    const r = await handleRemarkRead(s)
    batchProcessing.value = false
  }
}
</script>
