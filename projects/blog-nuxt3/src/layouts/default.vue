<template>
  <el-container
    class="default-layout min-h-full bg-page-light pb-[20px] dark:bg-page-dark"
  >
    <el-header
      class="fixed left-0 right-0 top-0 z-50 flex h-[60px] w-[100vw] items-center justify-between gap-[12px] bg-block-light px-[20px] py-0 shadow dark:bg-block-dark"
    >
      <div class="flex">
        <el-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <Icon name="fluent:home-20-regular" size="20"></Icon>
          </template>
        </el-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <LayoutSearch />

        <client-only>
          <LayoutUser />

          <LayoutColorMode />
        </client-only>
      </div>
    </el-header>
    <el-main
      class="mx-auto mt-[80px] w-auto bg-page-light [overflow:initial_!important] dark:bg-page-dark"
    >
      <div class="flex items-start">
        <div class="flex max-w-full flex-1 justify-center">
          <slot></slot>
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
