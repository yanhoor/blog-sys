<template>
	<view class="comment-reply-form" v-if="myInfo">
		<uni-popup ref="replyPopupRef" type="bottom" background-color="#fff" @change="handlePopupChange">
			<view class="reply-container">
				<UserAvatar :user="myInfo" :clickable="false" :size="36"></UserAvatar>
				<uni-easyinput type="textarea" v-model="replyForm.content" :trim="true" :maxlength="-1"
					:placeholder="placeholder">
					<template #suffixIcon>
						<uni-icons type="paperplane-filled" color="#18a058" size="28" @click.stop="handleSubmit">
						</uni-icons>
					</template>
				</uni-easyinput>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import UserAvatar from '@/components/user/user-avatar.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'

	export default {
		name: 'comment-reply-form',
		props: {
			show: Boolean,
			blogId: Number,
			currentReplyItem: Object
		},
		emits: ['update:show'],
		components: {
			UserAvatar,
		},
		data() {
			return {
				replyForm: {
					content: ''
				}
			}
		},
		watch: {
			show(val) {
				if (val) {
					if (!this.myInfo) {
						// uni.showToast({
						// 	icon: 'error',
						// 	title: '请先登录',
						// })
						this.$emit('update:show', false)
						uni.navigateTo({
							url: '/pages/login/login'
						})
						return
					}
					// 不然 this.$refs.replyPopupRef 是 undefined
					this.$nextTick(() => {
						console.log('++++++++++++++=', this.$refs, this.$refs.replyPopupRef)
						this.$refs.replyPopupRef.open('bottom')
					})
				}
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
			placeholder() {
				return this.currentReplyItem ? `回复@${this.currentReplyItem.createBy.name}:` : '写评论...'
			}
		},
		methods: {
			handlePopupChange({
				show
			}) {
				if (!show) this.$emit('update:show', false)
			},
			handlePostForm() {
				if (this.currentReplyItem) {
					this.replyForm.blogId = this.currentReplyItem.blogId
					this.replyForm.replyCommentId = this.currentReplyItem.id
					this.replyForm.replyToId = this.currentReplyItem.createBy.id
					this.replyForm.topCommentId = this.currentReplyItem.topCommentId || this.currentReplyItem.id
				} else {
					this.replyForm.blogId = this.blogId
				}
			},
			async handleSubmit() {
				if (!this.replyForm.content) {
					uni.showToast({
						icon: 'error',
						title: '请输入内容'
					})
					return
				}

				this.handlePostForm()

				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.comment_commit, this.replyForm)
					if (success) {
						uni.showToast({
							title: '已发送'
						})
						this.replyForm.content = ''
						this.$refs.replyPopupRef.close()
						this.$emit('update:show', false)
						uni.startPullDownRefresh()
					}
				} catch (e) {

				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.reply-container {
		display: flex;
		align-items: flex-start;
		gap: 20rpx;
		padding: 20rpx 20rpx 0;
	}
</style>
