<template>
  <LayoutMain class="flex items-start gap-[12px]">
    <el-menu
      class="sticky top-[62px]"
      :collapse="collapsed"
      @close="collapsed = true"
      @open="collapsed = false"
      @select="handleMenuSelectChange"
    >
      <el-menu-item index="/my/following">
        <Icon name="fluent:people-20-regular"></Icon>
        <template #title>我的关注</template>
      </el-menu-item>
      <el-menu-item index="/my/follower">
        <Icon name="fluent:people-checkmark-20-regular"></Icon>
        <template #title>我的粉丝</template>
      </el-menu-item>
      <el-menu-item index="/my/like">
        <Icon name="fluent:thumb-like-20-filled"></Icon>
        <template #title>我的点赞</template>
      </el-menu-item>
      <el-menu-item index="/my/collection">
        <Icon name="fluent:star-20-filled"></Icon>
        <template #title>我的收藏</template>
      </el-menu-item>
    </el-menu>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </LayoutMain>
</template>

<script lang="ts" setup>
import { Icon } from '#components'

definePageMeta({
  redirect: '/my/follower',
  middleware: ['auth']
})
const route = useRoute()
const activeMenuKey = ref(route.path || '/my/follower')
watch(
  () => route.path,
  (val) => {
    activeMenuKey.value = val
  }
)
const collapsed = ref(false)

function expandIcon() {
  return h(Icon, { name: 'fluent:caret-down-20-regular' })
}

async function handleMenuSelectChange(key: string) {
  activeMenuKey.value = key
  await navigateTo(key)
}
</script>
