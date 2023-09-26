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
import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  People24Regular,
  PeopleCheckmark24Regular,
  Star48Filled,
  CaretDown24Regular,
  ThumbLike16Filled
} from '@vicons/fluent'

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
    icon: () => h(NIcon, null, { default: () => h(People24Regular) })
  },
  {
    label: '我的粉丝',
    key: '/my/follower',
    icon: () => h(NIcon, null, { default: () => h(PeopleCheckmark24Regular) })
  },
  {
    label: '我的点赞',
    key: '/my/like',
    icon: () => h(NIcon, null, { default: () => h(ThumbLike16Filled) })
  },
  {
    label: '我的收藏',
    key: '/my/collection',
    icon: () => h(NIcon, null, { default: () => h(Star48Filled) })
  }
]
const collapsed = ref(false)

function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDown24Regular) })
}

async function handleMenuSelectChange(key: string) {
  activeMenuKey.value = key
  await navigateTo(key)
}
</script>
