<template>
	<view class="y-upload-img">
		<view class="image-item-container" v-if="modelValue">
			<YImage :url="modelValue"></YImage>
			<uni-icons class="close" type="clear" :size="32" color="#18a058" @click="$emit('update:modelValue', '')">
			</uni-icons>
		</view>
		<view class="upload-action-container" @click="chooseMedia" v-else>
			<uni-icons type="spinner-cycle" size="42" color="#18a058" v-if="loading"></uni-icons>
			<uni-icons type="plusempty" size="42" color="#18a058" v-else></uni-icons>
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
		name: "y-upload-img",
		props: {
			modelValue: String,
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
		methods: {
			chooseMedia() {
				if (this.loading) return

				uni.chooseMedia({
					maxDuration: 30,
					mediaType: ['image'],
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
				const token = uni.getStorageSync('token')
				let Authorization = ""
				if (token) Authorization = 'Bearer ' + token
				const uploadTask = uni.uploadFile({
					url: baseUrl + urls.upload, //仅为示例，非真实的接口地址
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
						const {
							result,
							success
						} = JSON.parse(uploadFileRes.data)
						if (success) {
							this.$emit('update:modelValue', result.url)
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
		}
	}
</script>

<style lang="scss" scoped>
	.image-item-container {
		width: 120px;
		height: 120px;
		box-sizing: border-box;
		border: 1px solid $uni-primary;
		position: relative;
	}

	.upload-action-container {
		width: 120px;
		height: 120px;
		box-sizing: border-box;
		border: 1px dashed $uni-primary;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.close {
		position: absolute;
		top: -16px;
		right: -12px;
	}
</style>