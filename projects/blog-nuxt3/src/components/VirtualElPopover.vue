<template>
  <div class="virtual-el-popover">
    <div ref="triggerRef" @mouseenter="showPopover = true" :key="showPopover">
      <slot name="trigger"></slot>
    </div>
    <el-popover
      v-if="showPopover"
      ref="popoverRef"
      v-bind="$attrs"
      virtual-triggering
      :virtual-ref="triggerRef"
    >
      <slot></slot>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
const showPopover = ref(false)
const triggerRef = ref()
const popoverRef = ref()
</script>
