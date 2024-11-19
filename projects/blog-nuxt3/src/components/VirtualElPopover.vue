<template>
  <div class="virtual-el-popover">
    <div
      ref="triggerRef"
      :key="showPopover"
      @mouseenter="handleChangeVisibility(true)"
    >
      <slot name="trigger" />
    </div>
    <el-popover
      v-if="showPopover"
      ref="popoverRef"
      v-bind="$attrs"
      virtual-triggering
      :virtual-ref="triggerRef"
      @hide="handleChangeVisibility(false)"
    >
      <slot />
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
const showPopover = ref(false)
const triggerRef = ref()
const popoverRef = ref()
const attrs = useAttrs()

function handleChangeVisibility(visible: boolean) {
  if (attrs.disabled) return

  showPopover.value = visible
}
</script>
