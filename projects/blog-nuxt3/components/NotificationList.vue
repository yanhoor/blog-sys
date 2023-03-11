<template>
  <div class="notification-list">
    <SkeletonNotification v-if="pageLoading && pageFetchParams.page === 1"/>

    <div v-loadMore="handleLoadNextPage" v-else>
      <div class="flex justify-between items-center mb-[12px]">
        <div class="flex items-center gap-[6px]">
          <template v-if="pageList.length > 0 && fetchResult.unreadTotal > 0">
            <div class="flex items-center gap-[6px]">
              <template v-if="showCheck">
                <n-checkbox size="large" @update:checked="handleCheckAll" v-model:checked="checkAll" :indeterminate="isIndeterminate"></n-checkbox>
                <n-button size="small" @click="handleCancelCheck">取消</n-button>
                <n-button size="small" :type="checkedList.length > 0 ? 'primary' : 'tertiary'" @click="handleMultiRemark(false)" :disabled="batchProcessing">标为已读</n-button>
              </template>
              <n-button size="small" @click="showCheck = true" v-else>
                <template #icon>
                  <n-icon :component="TaskListLtr20Filled" size="24"/>
                </template>
              </n-button>
            </div>
            <n-button size="small" @click="handleMultiRemark(true)" :disabled="batchProcessing">全部标为已读</n-button>
          </template>
        </div>
        <n-radio-group v-model:value="pageFetchParams.isRead" @update:value="handleLoadNextPage(1)" size="small">
          <n-radio-button :value="0" label="未读"></n-radio-button>
          <n-radio-button :value="3" :label="`全部(${fetchResult?.total || 0})`"></n-radio-button>
        </n-radio-group>
      </div>
      <template v-if="pageList.length">
        <n-checkbox-group class="overflow-hidden grid grid-cols-1 gap-[12px]" v-model:value="checkedList" @update:value="handleCheckItem">
          <div v-for="notification of pageList" :key="notification.id" class="flex items-start gap-[12px]">
            <n-checkbox size="large" :value="notification.id" :disabled="!!notification.isRead" v-if="showCheck"></n-checkbox>
            <n-card class="overflow-hidden">
              <div class="group flex flex-col gap-[12px] items-start divide-y divide-border-light dark:divide-border-dark" :class="{ 'text-gray-400': notification.isRead}">

                <slot :notification="notification"></slot>

                <div class="flex justify-between items-center w-full pt-[12px]">
                  <span v-time="notification.createdAt" class="text-gray-400"/>
                  <n-button text type="primary" class="hidden group-hover:block" v-if="!notification.isRead" @click="handleRemarkRead(notification.id)">标为已读</n-button>
                  <span class="text-green-700 hidden group-hover:block" v-else>已读</span>
                </div>
              </div>
            </n-card>
          </div>
        </n-checkbox-group>
      </template>
      <div class="text-center mt-[20px]" v-if="pageLoading">
        <n-spin :size="24"/>
      </div>
      <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)"/>
      <ResultEmpty v-else-if="pageList.length === 0" @refresh="handleLoadNextPage(1)"/>
      <ResultNoMore v-else-if="pageLoadedFinish"/>
      <n-back-top :right="50"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NSpin,
  NIcon,
  NCheckbox,
  NCheckboxGroup,
  NRadioGroup,
  NRadioButton,
  NBackTop,
  createDiscreteApi
} from "naive-ui"
import { Notification } from "~/types"
import { TaskListLtr20Filled } from '@vicons/fluent'

interface Props{
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
}
const { pageList, pageLoading, pageFetchParams, fetchResult, pageLoadedFinish, handleLoadNextPage  } = useListAppendFetch<Notification>('/notification/list', { type: fetchType, isRead: 0 }, {})
const showCheck = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const batchProcessing = ref(false)
const checkedList = ref<any[]>([])
const allItemList = computed(() => pageList.value.filter(i => !i.isRead)) // 排除已读的所有可选项

handleLoadNextPage()

function handleCheckAll(v: boolean) {
  checkedList.value = v ? allItemList.value.map(i => i.id) : []
  isIndeterminate.value = false
}

function handleCheckItem() {
  checkAll.value = checkedList.value.length === allItemList.value.length
  isIndeterminate.value = checkedList.value.length > 0 && checkedList.value.length < allItemList.value.length
}

function handleCancelCheck() {
  showCheck.value = false
  isIndeterminate.value = false
  checkAll.value = false
  checkedList.value = []
}

async function handleRemarkRead(id: string, isAll = false) {
  let params = { }
  if(isAll) {
    params = { isAll: 1, type: fetchType }
  }else{
    params = { id }
  }
  try{
    const { result, success } = await useFetchPost('/notification/read', params)
    if(success){
      useFetchNotificationCount()
      handleLoadNextPage(1)
      handleCancelCheck()
      return true
    }
    return false
  }catch (e) {
    return false
  }
}

async function handleMultiRemark(isAll: boolean) {
  const { message, dialog } = createDiscreteApi(["message", "dialog"])
  if(isAll){
    dialog.warning({
      title: '全部标为已读',
      content: `确定将所有未读${props.typeName}通知标为已读?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        batchProcessing.value = true
        const r = await handleRemarkRead('', true)
        if(r){
          message.success('操作成功')
        }
        batchProcessing.value = false
      },
      onNegativeClick: () => {

      }
    })
  }else{
    const s = checkedList.value.toString()
    batchProcessing.value = true
    const r = await handleRemarkRead(s)
    batchProcessing.value = false
  }
}
</script>
