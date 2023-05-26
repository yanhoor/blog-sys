<template>
  <el-menu
    background-color="#324057"
    text-color="#fff"
    router
    :default-active="defaultActive"
  >
    <!--在 Vue 3.x 中，key 则应该被设置在 <template> 标签上。-->
    <template v-for="(firstMenu, index) of menuList" :key="firstMenu.title">
      <MenuItem :menu="firstMenu" :menuIndex="index + 1" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import menuList from '../config/menu'
import MenuItem from './menuItem.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const defaultActive = computed(() => route.path.replace('/', ''))
</script>

<style lang="postcss" scoped>
.el-menu {
  min-height: 100%;
}
</style>
