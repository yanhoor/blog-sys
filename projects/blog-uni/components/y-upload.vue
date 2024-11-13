<template>
  <view class="y-upload">
    <view v-if="uploadMode === 1" class="image-list">
      <view
        v-for="(image, index) in modelValue"
        :key="image.file.url"
        class="image-item-container"
      >
        <YImage :url="image.file.url" />
        <uni-icons
          class="close"
          type="clear"
          :size="32"
          color="#18a058"
          @click="handleRemove(index)"
        />
      </view>
      <view class="upload-action-container" @click="chooseMedia">
        <uni-icons
          v-if="loading"
          type="spinner-cycle"
          size="42"
          color="#18a058"
        />
        <uni-icons v-else type="plusempty" size="42" color="#18a058" />
      </view>
    </view>
    <view v-else>
      <view
        v-if="!modelValue.length"
        class="upload-action-container"
        @click="chooseMedia"
      >
        <uni-icons
          v-if="loading"
          type="spinner-cycle"
          size="42"
          color="#18a058"
        />
        <uni-icons v-else type="plusempty" size="42" color="#18a058" />
      </view>
      <view
        v-for="(video, index) in modelValue"
        :key="video.file.url"
        class="video-item-wrapper"
      >
        <view class="video-item-container">
          <video
            class="video"
            :src="imageHost + video.file.url"
            controls
            objectFit="contain"
          />
        </view>
        <uni-icons
          class="close"
          type="clear"
          :size="32"
          color="#18a058"
          @click="handleRemove(index)"
        />
      </view>
    </view>
  </view>
</template>

<script>
import {
  baseUrl,
  imageHost,
  supportedImageType,
  supportedVideoType
} from '@/config/index.js'
import YImage from '@/components/y-image.vue'
import Http, { urls } from '@/http'

export default {
  name: 'YUpload',
  components: {
    YImage
  },
  props: {
    modelValue: Array
  },
  emits: ['update:modelValue'],
  data() {
    return {
      imageHost,
      loading: false
    }
  },
  computed: {
    // 1--图片，2--视频，3--混合
    uploadMode() {
      if (!this.modelValue.length) return 3
      const t = this.getFileExtName(this.modelValue[0].file.url)
      // console.log('++++++++++++++', t)
      return supportedImageType.includes(t) ? 1 : 2
    }
  },
  methods: {
    chooseMedia() {
      if (this.loading) return

      let mediaType = ['image', 'video']
      if (this.uploadMode === 1) mediaType = ['image']
      if (this.uploadMode === 2) mediaType = ['video']
      if (this.uploadMode === 3) mediaType = ['image', 'video']
      uni.chooseMedia({
        maxDuration: 30,
        mediaType,
        success: (res) => {
          // console.log('++++++++++++++', res)
          const { tempFiles } = res
          tempFiles.forEach((f) => {
            this.handleUploadFile(f)
          })
        }
      })
    },
    async handleUploadFile(tempFile) {
      // console.log('=======handleUploadFile===========', tempFile.tempFilePath);
      const token = uni.getStorageSync('token')
      let Authorization = ''
      if (token) Authorization = 'Bearer ' + token
      this.loading = true
      const uploadTask = uni.uploadFile({
        url: baseUrl + urls.upload,
        filePath: tempFile.tempFilePath,
        name: 'file',
        header: {
          Authorization
        },
        // formData: {
        // 	md5
        // },
        success: (uploadFileRes) => {
          // console.log(uploadFileRes.data);
          const { result, success } = JSON.parse(uploadFileRes.data)
          if (success) {
            this.$emit(
              'update:modelValue',
              this.modelValue.concat({
                fileId: result.id,
                file: result
              })
            )
          } else {
            uni.showToast({
              title: '上传失败',
              icon: 'error'
            })
          }
        },
        complete: () => {
          this.loading = false
        }
      })
      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    },
    handleRemove(idx) {
      const copy = this.modelValue.slice()
      copy.splice(idx, 1)
      this.$emit('update:modelValue', copy)
    },
    // png/jpeg...
    getFileExtName(path) {
      const idx = path.lastIndexOf('.')
      return path.slice(idx + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-action-container {
  width: 120px;
  height: 120px;
  box-sizing: border-box;
  border: 1px dashed $uni-primary;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .image-item-container {
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    border: 1px solid $uni-primary;
    position: relative;
  }
}

.video-item-wrapper {
  position: relative;

  .video-item-container {
    position: relative;
    width: 100%;
    height: 0;
    box-sizing: border-box;
    padding-top: calc(100% * 9 / 16);
    border-radius: 5px;

    .video {
      border-radius: inherit;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
}

.close {
  position: absolute;
  top: -16px;
  right: -12px;
}
</style>
