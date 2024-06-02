<template>
  <div class="result-empty flex w-full flex-col items-center gap-[12px]">
    <img src="@/assets/images/box-empty.svg" alt="" class="result-icon" />
    <p class="text-[16px] font-semibold">暂无内容</p>
    <el-button type="primary" @click="emits('refresh')">刷新</el-button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  size?: string
}
const emits = defineEmits(['refresh'])
const props = withDefaults(defineProps<Props>(), {
  size: '150px'
})
</script>

<style lang="postcss" scoped>
.result-icon {
  width: v-bind('props.size');
}
</style>
