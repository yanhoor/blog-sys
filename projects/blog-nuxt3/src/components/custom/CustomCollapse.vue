<template>
  <div class="custom-collapse">
    <div
      class="flex cursor-pointer select-none items-center justify-between gap-[5px] py-[6px]"
      @click="expand = !expand"
    >
      <div class="flex items-center gap-[4px]">
        <slot name="icon" />
        <p class="whitespace-nowrap">{{ title }}</p>
      </div>
      <p
        v-if="currentOption"
        class="placeholder-text-color ellipsis-text flex-1"
      >
        (<span>{{ currentOption.label }}</span
        >)
      </p>
      <Icon
        name="fluent:chevron-right-20-regular"
        class="transition-transform ease-linear"
        :class="[expand ? 'rotate-90' : '']"
      />
    </div>
    <div v-show="expand" class="ml-[12px]">
      <p
        v-for="option of options"
        :key="option.label"
        class="ellipsis-text hover:text-primary cursor-pointer py-[5px]"
        :class="{ 'text-primary': currentOption?.value === option.value }"
        @click="handleClickOption(option)"
      >
        {{ option.label }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: any
}
interface Props {
  title: string
  modelValue: any
  optionKey?: string // option 唯一值的 key
  options: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  optionKey: 'value'
})
const emits = defineEmits<{
  change: [v: any]
  'update:modelValue': [v: any]
}>()
const expand = ref(false)
const currentOption = ref(
  props.options.find((o) => o.value === props.modelValue)
)

function handleClickOption(val: any) {
  if (currentOption.value[props.optionKey] === val[props.optionKey]) return

  currentOption.value = val
  // 顺序不能乱
  emits('update:modelValue', val.value)
  emits('change', val.value)
}
</script>
