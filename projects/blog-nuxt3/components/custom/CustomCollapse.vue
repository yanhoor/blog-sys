<template>
  <div class="custom-collapse">
    <div
      class="flex cursor-pointer select-none items-center justify-between gap-[5px] py-[6px]"
      @click="expand = !expand"
    >
      <div class="flex items-center gap-[4px]">
        <slot name="icon"></slot>
        <p class="whitespace-nowrap">{{ title }}</p>
      </div>
      <p
        class="placeholder-text-color ellipsis-text flex-1"
        v-if="currentOption"
      >
        (<span>{{ currentOption.label }}</span
        >)
      </p>
      <n-icon
        class="transition-transform ease-linear"
        :class="[expand ? 'rotate-90' : '']"
        :component="ChevronRight12Regular"
      ></n-icon>
    </div>
    <n-collapse-transition :show="expand" class="ml-[12px]">
      <p
        class="ellipsis-text cursor-pointer py-[5px] hover:text-primary"
        :class="{ 'text-primary': currentOption?.value === option.value }"
        v-for="option of options"
        :key="option.label"
        @click="handleClickOption(option)"
      >
        {{ option.label }}
      </p>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NCollapseTransition } from 'naive-ui'
import { ChevronRight12Regular } from '@vicons/fluent'

interface Option {
  label: string
  value: any
}
interface Props {
  title: string
  modelValue: any
  options: Option[]
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  change: [v: any]
  'update:modelValue': [v: any]
}>()
const expand = ref(false)
const currentOption = ref(
  props.options.find((o) => o.value === props.modelValue)
)

function handleClickOption(val: any) {
  if (currentOption.value === val) return

  currentOption.value = val
  // 顺序不能乱
  emits('update:modelValue', val.value)
  emits('change', val.value)
}
</script>
