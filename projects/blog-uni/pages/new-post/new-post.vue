<template>
	<view class="new-post" v-if="myInfo">
		<uni-easyinput type="textarea" :maxlength="-1" :trim="true" v-model="postForm.content"
			placeholder="总得写点什么..." />
		<yUpload class="file-picker" v-model="postForm.medias"></yUpload>
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
		onShow() {
			const back = uni.getStorageSync('back_from_login')
			if(back == 1){
				uni.removeStorageSync('back_from_login')
				uni.switchTab({
					url:'/pages/index/index'
				})
			}else if (!this.myInfo) {
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		},
		methods: {
			resetForm(){
				return {
					content: '',
					medias: []
				}
			},
			async handleSubmit(){
				if(!this.postForm.content){
					uni.showToast({
						icon: 'error',
						title:'请填写发布内容'
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
							title:'已发布'
						})
						uni.switchTab({
							url:'/pages/index/index'
						})
						uni.$emit('index_page_refresh', true)
						this.postForm = this.resetForm()
					}
					this.loading = false
				} catch (e) {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-post {
		margin: 0 12px;
	}

	.file-picker {
		::v-deep .y-upload {
			margin-top: 20px;
		}
	}
	.submit-btn{
		margin-top: 20px;
	}
</style>
