<template>
	<view class="new-post" v-if="myInfo">
		<uni-easyinput type="textarea" :maxlength="-1" :trim="true" autoHeight v-model="postForm.content"
			placeholder="总得写点什么..." />
		<yUpload class="file-picker" v-model="postForm.medias"></yUpload>
		<view class="address-wrapper">
			<view class="address-container" @click="handleChooseAddress">
				<uni-icons type="location"></uni-icons>
				<view class="address-name text-ellipsis">
					{{ postForm.addressName || "你在哪里？" }}
				</view>
			</view>
			<uni-icons type="closeempty" @click="handleClearAddress" v-if="postForm.addressName"></uni-icons>
		</view>
		<button class="submit-btn" type="primary" :loading="loading" @click="handleSubmit">发布</button>
	</view>
</template>

<script>
	import yUpload from '@/components/y-upload.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import {
		mapState,
		mapActions,
	} from 'pinia'

	export default {
		data() {
			return {
				postForm: this.resetForm(),
				loading: false
			}
		},
		components: {
			yUpload
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
		},
		created() {
			// console.log('+++++++++++++++', this.myInfo)
		},
		onShow() {
			const back = uni.getStorageSync('back_from_login')
			if (back == 1) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else if (!this.myInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
			uni.removeStorageSync('back_from_login')
		},
		methods: {
			...mapActions(useScrollStatusStore, ['setPullDownRefresh']),
			resetForm() {
				return {
					content: '',
					addressName: '',
					address: '',
					latitude: '',
					longitude: '',
					medias: []
				}
			},
			async handleSubmit() {
				if (!this.postForm.content) {
					uni.showToast({
						icon: 'error',
						title: '请填写发布内容'
					})
					return
				}
				this.loading = true
				this.postForm.isPost = 1
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.blog_edit, this.postForm)
					if (success) {
						uni.showToast({
							icon: 'success',
							title: '已发布'
						})
						uni.switchTab({
							url: '/pages/index/index'
						})
						this.setPullDownRefresh('pages/index')
						this.postForm = this.resetForm()
					}
					this.loading = false
				} catch (e) {
					this.loading = false
				}
			},
			handleChooseAddress(){
					uni.authorize({
						scope: 'scope.userLocation',
						success: (res) => {
							uni.chooseLocation({
								success: (res) => {
									const { name, address, latitude, longitude } = res
										this.postForm.address = address
										this.postForm.addressName = name
										this.postForm.latitude = latitude
										this.postForm.longitude = longitude
								}
							})
						}
					})
			},
			handleClearAddress(){
				this.postForm.address = ''
				this.postForm.addressName = ''
				this.postForm.latitude = ''
				this.postForm.longitude = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-post {
		margin: 0 12px;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.address-wrapper {
		display: flex;
		align-items: center;
		gap: 16rpx;
		box-sizing: border-box;
		max-width: 60%;

		.address-container {
			display: flex;
			align-items: center;
			gap: 8rpx;
			border-radius: 30rpx;
			background-color: #e7e7e7;
			padding: 2rpx 10rpx;
			max-width: 80%;
			
			.address-name{
				font-size: 12px;
				color: $uni-base-color;
			}
		}
	}

	.submit-btn {
		width: 100%;
	}
</style>
