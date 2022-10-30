<template>
  <el-container class="app-container">
    <el-aside width="280px">
      <Menu class="menu"/>
    </el-aside>
    <el-container>
      <el-header>
        <RouteNav />
        <UserAvatar class="user-avatar"/>
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
</script>
<style lang="less" scoped>
.app-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--el-color-primary-light-9);
  }
  .el-main{
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }
}
</style>
