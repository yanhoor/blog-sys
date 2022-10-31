<template>
  <el-container class="default-layout">
    <el-header class="header">
      <el-switch
        v-model="colorModel"
        inline-prompt
        active-value="dark"
        inactive-value="light"
        :active-icon="Moon"
        :inactive-icon="Sunny"
      />
    </el-header>
    <el-main>
      <slot />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElMain, ElHeader, ElContainer, ElSwitch } from 'element-plus/dist/index.full.js'
import {useColorMode} from "@vueuse/core"
import { Sunny, Moon } from "@element-plus/icons-vue"

const colorModel = useColorMode()
function toggleDark() {
  colorModel.value = colorModel.value === 'dark' ? 'light' : 'dark'
}
</script>

<style lang="scss" scoped>
.header{
  height: 70px;
}
</style>
