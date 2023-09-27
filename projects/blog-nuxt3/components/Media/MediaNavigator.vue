<template>
  <div class="relative w-full">
    <div class="w-full overflow-hidden">
      <div
        class="-ml-[6px] flex transition-all"
        :style="{ transform: `translateX(-${(currentPage - 1) * 100}%)` }"
      >
        <div
          class="relative shrink-0 pl-[6px]"
          :style="`width: calc(100% / ${pageSize})`"
          v-for="(media, index) of list"
          :key="media.file.url"
        >
          <div class="image-item-container">
            <MediaImgView
              alt="图像"
              class="image-item border-solid border-green-500"
              :url="media.file.url"
            />
            <div
              class="list-item-mask border-2 border-green-500"
              v-if="modelValue === media.file"
            ></div>
            <div
              class="list-item-mask cursor-pointer bg-gray-600 opacity-30"
              v-if="modelValue !== media.file"
              @click="handlePreview(media.file, index)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute -left-[20px] top-0 flex h-full cursor-pointer items-center"
      @click="handleNextImagePage(-1)"
      v-if="currentPage > 1"
    >
      <n-icon :component="ChevronLeft24Regular" size="24" />
    </div>
    <div
      class="absolute -right-[20px] top-0 flex h-full cursor-pointer items-center"
      @click="handleNextImagePage(1)"
      v-if="currentPage < imageTotalPage"
    >
      <n-icon :component="ChevronRight24Regular" size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Media, MediaFile } from 'sys-types'
import { NIcon } from 'naive-ui'
import { ChevronLeft24Regular, ChevronRight24Regular } from '@vicons/fluent'

interface Props {
  list: Media[]
  modelValue: MediaFile | undefined
  pageSize: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'itemChange'])
const imageTotalPage = Math.ceil(props.list.length / props.pageSize) // 总页数
const currentPage = ref(1)
const currentIndex = ref<number>()

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return

    currentIndex.value = props.list.findIndex((item) => item.file === val)
    currentPage.value = Math.ceil((currentIndex.value + 1) / props.pageSize)
  },
  { immediate: true }
)

function handleNextImagePage(p: number) {
  currentPage.value += p
}

function handlePreview(m: Media, idx: number) {
  emit('update:modelValue', m)
  emit('itemChange', m, idx)
}
</script>

<style lang="postcss" scoped>
.image-item-container {
  @apply relative h-0 w-full;
  padding-top: 100%;
  border-radius: 5px;
  .image-item {
    @apply absolute top-0 h-full w-full overflow-clip object-cover;
    border-radius: inherit;
  }
}
.list-item-mask {
  @apply absolute left-0 top-0 h-full w-full rounded-[5px];
}
</style>
