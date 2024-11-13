<template>
  <el-container
    class="default-layout bg-page-light dark:bg-page-dark min-h-full pb-[20px]"
  >
    <el-header
      class="bg-block-light dark:bg-block-dark fixed left-0 right-0 top-0 z-50 flex h-[60px] w-[100vw] items-center justify-between gap-[12px] px-[20px] py-0 shadow"
    >
      <div class="flex">
        <el-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <Icon name="fluent:home-20-regular" size="20" />
          </template>
        </el-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <LayoutSearch />

        <LayoutUser />

        <LayoutColorMode />
      </div>
    </el-header>
    <el-main
      class="bg-page-light dark:bg-page-dark mx-auto mt-[80px] w-auto [overflow:initial_!important]"
    >
      <div class="flex items-start">
        <div class="flex max-w-full flex-1 justify-center">
          <slot />
        </div>
      </div>
    </el-main>
    <GlobalComponentWrapper />
  </el-container>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const userInfo = useUserInfo()
</script>

<style lang="postcss" scoped>
.n-layout.default-layout {
  overflow: initial;
  :deep(.n-layout-scroll-container) {
    overflow-x: initial;
  }
}
</style>
