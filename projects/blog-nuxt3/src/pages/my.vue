<template>
  <LayoutMain class="flex items-start gap-[12px]">
    <el-menu
      class="!sticky top-[62px] !border-none"
      :default-active="activeMenuKey"
      :collapse="collapsed"
      @close="collapsed = true"
      @open="collapsed = false"
      @select="handleMenuSelectChange"
    >
      <el-menu-item index="/my/following">
        <el-icon><Icon name="fluent:people-20-regular"></Icon></el-icon>
        <span>我的关注</span>
      </el-menu-item>
      <el-menu-item index="/my/follower">
        <el-icon
          ><Icon name="fluent:people-checkmark-20-regular"></Icon
        ></el-icon>
        <span>我的粉丝</span>
      </el-menu-item>
      <el-menu-item index="/my/like">
        <el-icon><Icon name="fluent:thumb-like-20-filled"></Icon></el-icon>
        <span>我的点赞</span>
      </el-menu-item>
      <el-menu-item index="/my/collection">
        <el-icon><Icon name="fluent:star-20-filled"></Icon></el-icon>
        <span>我的收藏</span>
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
