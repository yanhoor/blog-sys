<template>
  <view class="media-image-wall">
    <uni-card v-if="pageList.length" spacing="0" padding="0" :is-full="true">
      <swiper class="swiper">
        <swiper-item v-for="(page, idx) in pageList" :key="idx">
          <view class="page-item">
            <view v-for="image in page" :key="image.id" class="image-container">
              <YImage
                class="y-image"
                :url="image.file.url"
                ratio="70"
                @tap="handleImagePreview(image)"
              />
            </view>
          </view>
        </swiper-item>
      </swiper>
    </uni-card>
  </view>
</template>

<script>
import YImage from '@/components/y-image.vue'
import Http, { urls } from '@/http'
import { imageHost } from '@/config/index.js'
import { useImageSwiperStore } from '@/stores/imageSwiperStore.js'

export default {
  name: 'MediaImageWall',
  components: {
    YImage
  },
  props: {
    userId: Number
  },
  emits: ['fetch-end'],
  data() {
    return {
      imageList: [],
      urls,
      imageHost
    }
  },
  computed: {
    pageList() {
      const result = []
      const page = Math.ceil(this.imageList.length / 5)
      for (let i = 0; i < page; i++) {
        result.push(this.imageList.slice(i * 5, (i + 1) * 5))
      }
      return result
    }
  },
  created() {
    this.getImageList()
  },
  methods: {
    async getImageList() {
      try {
        const { success, result, msg } = await Http.post(urls.user_media_list, {
          userId: this.userId,
          type: 1
        })
        if (success) {
          this.imageList = result.list
          this.$emit('fetch-end', result)
        }
      } catch (e) {}
    },
    handleImagePreview(image) {
      // uni.previewImage({
      // 	urls: this.imageList.map(i => this.imageHost + i.url),
      // 	current: this.imageHost + image.url,
      // 	indicator: 'number'
      // })
      const s = useImageSwiperStore()
      s.setImageList(this.imageList)
      const idx = this.imageList.indexOf(image)
      s.setInitIndex(idx)
      uni.navigateTo({
        url: '/pages/image-swiper/image-swiper'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  height: 80px;
  .page-item {
    width: 100%;
    height: 100%;
    display: flex;

    .image-container {
      width: 20%;
      height: 100%;
    }

    .y-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
