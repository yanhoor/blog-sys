<template>
  <el-container class="app-container">
    <el-aside width="280px">
      <Menu class="menu" />
    </el-aside>
    <el-container class="bg-white dark:bg-black">
      <el-header>
        <RouteNav />
        <div class="flex items-center">
          <ThemeSwitcher />
          <UserAvatar class="user-avatar" />
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Menu from './menu.vue'
import UserAvatar from './userAvatar.vue'
import RouteNav from './routeNav.vue'
import ThemeSwitcher from '@/layout/themeSwitcher.vue'
</script>
<style lang="postcss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--el-color-primary-light-9);
  }
  .el-main {
    display: flex;
    flex-direction: column;
  }
}
</style>
