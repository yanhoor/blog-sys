<template>
  <LayoutMain class="flex items-start gap-[12px]">
    <n-layout-sider
      class="sticky top-[62px]"
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        :value="activeMenuKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :expand-icon="expandIcon"
        @update:value="handleMenuSelectChange"
      />
    </n-layout-sider>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </LayoutMain>
</template>

<script lang="ts" setup>
import { NLayoutSider, NMenu } from 'naive-ui'
import { Icon } from '#components'
import type { MenuOption } from 'naive-ui'

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
const menuOptions: MenuOption[] = [
  {
    label: '我的关注',
    key: '/my/following',
    icon: () => h(Icon, { name: 'fluent:people-20-regular' })
  },
  {
    label: '我的粉丝',
    key: '/my/follower',
    icon: () => h(Icon, { name: 'fluent:people-checkmark-20-regular' })
  },
  {
    label: '我的点赞',
    key: '/my/like',
    icon: () => h(Icon, { name: 'fluent:thumb-like-20-filled' })
  },
  {
    label: '我的收藏',
    key: '/my/collection',
    icon: () => h(Icon, { name: 'fluent:star-20-filled' })
  }
]
const collapsed = ref(false)

function expandIcon() {
  return h(Icon, { name: 'fluent:caret-down-20-regular' })
}

async function handleMenuSelectChange(key: string) {
  activeMenuKey.value = key
  await navigateTo(key)
}
</script>
