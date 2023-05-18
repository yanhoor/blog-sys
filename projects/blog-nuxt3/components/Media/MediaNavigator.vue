<template>
  <div class="w-full relative">
    <div class="w-full overflow-hidden">
      <div
        class="flex transition-all -ml-[6px]"
        :style="{ transform: `translateX(-${(currentPage - 1) * 100}%)` }"
      >
        <div
          class="pl-[6px] relative shrink-0"
          :style="`width: calc(100% / ${pageSize})`"
          v-for="(media, index) of list"
          :key="media.file.url"
        >
          <div class="image-item-container">
            <MediaImgView
              alt="图像"
              class="image-item border-solid border-green-500"
              :url="media.file.url"
              ratio="80"
            />
            <div
              class="list-item-mask border-2 border-green-500"
              v-if="modelValue === media.file"
            ></div>
            <div
              class="list-item-mask bg-gray-600 opacity-30 cursor-pointer"
              v-if="modelValue !== media.file"
              @click="handlePreview(media.file, index)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center cursor-pointer absolute -left-[20px] h-full top-0"
      @click="handleNextImagePage(-1)"
      v-if="currentPage > 1"
    >
      <n-icon :component="ChevronLeft24Regular" size="24" />
    </div>
    <div
      class="flex items-center cursor-pointer h-full top-0 absolute -right-[20px]"
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

<style lang="scss" scoped>
.image-item-container {
  @apply relative w-full h-0;
  padding-top: 100%;
  border-radius: 5px;
  .image-item {
    @apply w-full h-full object-cover overflow-clip absolute top-0;
    border-radius: inherit; // 图片圆角
  }
}
.list-item-mask {
  @apply absolute top-0 left-0 w-full h-full rounded-[5px];
}
</style>
