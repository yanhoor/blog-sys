<template>
	<view class="y-upload">
		<view class="image-list" v-if="uploadMode === 1">
			<view class="image-item-container" v-for="(image, index) in modelValue" :key="image.url">
				<YImage :url="image.url"></YImage>
				<uni-icons class="close" type="clear" :size="32" color="#18a058" @click="handleRemove(index)">
				</uni-icons>
			</view>
			<view class="upload-action-container" @click="chooseMedia">
				<uni-icons type="spinner-cycle" size="42" color="#18a058" v-if="loading"></uni-icons>
				<uni-icons type="plusempty" size="42" color="#18a058" v-else></uni-icons>
			</view>
		</view>
		<view v-else>
			<view class="upload-action-container" @click="chooseMedia" v-if="!modelValue.length">
				<uni-icons type="spinner-cycle" size="42" color="#18a058" v-if="loading"></uni-icons>
				<uni-icons type="plusempty" size="42" color="#18a058" v-else></uni-icons>
			</view>
			<view class="video-item-wrapper" v-for="(video, index) in modelValue" :key="video.url">
				<view class="video-item-container">
					<video class="video" :src="imageHost + video.url" controls objectFit="contain"></video>
				</view>
				<uni-icons class="close" type="clear" :size="32" color="#18a058" @click="handleRemove(index)">
				</uni-icons>
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
	import Http, {
		urls
	} from '@/http'

	export default {
		name: "y-upload",
		props: {
			modelValue: Array,
		},
		emits: ['update:modelValue'],
		components: {
			YImage
		},
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
				const t = this.getFileExtName(this.modelValue[0].url)
				// console.log('++++++++++++++', t)
				return supportedImageType.includes(t) ? 1 : 2
			}
		},
		methods: {
			chooseMedia() {
				if(this.loading) return
				
				let mediaType = ['image', 'video']
				if (this.uploadMode === 1) mediaType = ['image']
				if (this.uploadMode === 2) mediaType = ['video']
				if (this.uploadMode === 3) mediaType = ['image', 'video']
				uni.chooseMedia({
					maxDuration: 30,
					mediaType,
					success: (res) => {
						// console.log('++++++++++++++', res)
						const {
							tempFiles
						} = res
						tempFiles.forEach(f => {
							this.handleUploadFile(f)
						})
					}
				})
			},
			async handleUploadFile(tempFile) {
				this.loading = true
				const uploadTask = uni.uploadFile({
					url: baseUrl + urls.upload, //仅为示例，非真实的接口地址
					filePath: tempFile.tempFilePath,
					name: 'file',
					// formData: {
					// 	'user': 'test'
					// },
					success: (uploadFileRes) => {
						// console.log(uploadFileRes.data);
						const {
							result
						} = JSON.parse(uploadFileRes.data)
						this.$emit('update:modelValue', this.modelValue.concat({
							url: result.path
						}))
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
		},
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
