<template>
  <el-menu-item-group
    v-if="menu.children && menu.groupTitle"
    :title="menu.groupTitle"
  >
    <template v-for="childMenu of menu.children" :key="childMenu.title">
      <!-- 通过组件 name 递归自身 -->
      <menu-item :menu="childMenu" />
    </template>
  </el-menu-item-group>
  <!--menuIndex 没啥用处了-->
  <el-sub-menu v-else-if="menu.children" :index="menu.menuIndex + ''">
    <template #title>
      <el-icon v-if="menu.icon">
        <component :is="menu.icon"></component>
      </el-icon>
      <span>{{ menu.title }}</span>
    </template>
    <template v-for="childMenu of menu.children" :key="menu.title">
      <menu-item :menu="childMenu" />
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path">
    <el-icon v-if="menu.icon">
      <component :is="menu.icon"></component>
    </el-icon>
    <span>{{ menu.title }}</span>
  </el-menu-item>
</template>

<script lang="ts" setup>
defineProps({
  menu: Object
})
</script>
