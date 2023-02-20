<template>
	<view class="profile-page">
		<uni-card margin="5px" spacing="0">
			<view class="content-container">
				<uni-forms ref="editformRef" :modelValue="editForm" :rules="rules">
					<uni-forms-item label="用户名" name="name">
						<uni-easyinput type="text" v-model="editForm.name" maxlength="8" :trim="true"
							placeholder="请输入用户名"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="性别" name="gender">
						<radio-group @change="editForm.gender = $event.detail.value">
							<view class="radio-container">
								<label>
									<radio :value="0" :checked="editForm.gender == 0"/><text>未设置</text>
								</label>
								<label>
									<radio :value="1" :checked="editForm.gender == 1"/><text>男</text>
								</label>
								<label>
									<radio :value="2" :checked="editForm.gender == 2"/><text>女</text>
								</label>
							</view>
						</radio-group>
					</uni-forms-item>
					<uni-forms-item label="生日" name="birthday">
						<uni-datetime-picker type="date" v-model="editForm.birthday" :end="(new Date()).getTime()" />
					</uni-forms-item>
					<uni-forms-item label="个人简介" name="introduce">
						<uni-easyinput type="textarea" clearable v-model="editForm.introduce" maxlength="80" :trim="true"
							placeholder="请输入个人简介"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="头像" name="avatar">
						<YUploadImg v-model="editForm.avatar"></YUploadImg>
					</uni-forms-item>
					<uni-forms-item label="资料卡背景" name="profileCardBg">
						<YUploadImg v-model="editForm.profileCardBg"></YUploadImg>
					</uni-forms-item>
				</uni-forms>

				<button type="primary" :loading="loading" @click="handleSubmit">保存</button>
			</view>
		</uni-card>
		<uni-popup ref="messageRef" type="message">
			<uni-popup-message :type="messageType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import YUploadImg from '@/components/y-upload-img.vue'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		components: {
			YUploadImg
		},
		data() {
			return {
				loading: false,
				messageText: '',
				messageType: 'success',
				editForm: {
					name: '',
					avatar: '',
					profileCardBg: '',
					gender: 0,
					birthday: '',
					introduce: '',
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入用户名',
						}]
					}
				},
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo'])
		},
		created() {
			this.editForm.name = this.myInfo.name
			this.editForm.avatar = this.myInfo.avatar
			this.editForm.profileCardBg = this.myInfo.profileCardBg
			this.editForm.gender = this.myInfo.gender
			this.editForm.introduce = this.myInfo.introduce
			this.editForm.birthday = this.myInfo.birthday ? new Date(this.myInfo.birthday) : ''
		},
		methods: {
			...mapActions(useMyInfoStore, ['getMyInfo']),
			handleSubmit() {
				this.$refs.editformRef.validate().then(async (res) => {
					this.loading = true
					try {
						const {
							success,
							result,
							msg
						} = await Http.post(urls.user_update, this.editForm)
						this.loading = false
						if (success) {
							this.messageText = '已更新'
							this.messageType = 'success'
							this.$refs.messageRef.open()
							this.getMyInfo()
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1000)
						} else {
							this.messageText = msg || '更新失败'
							this.messageType = 'error'
							this.$refs.messageRef.open()
						}
					} catch (e) {
						this.messageText = '更新失败'
						this.messageType = 'error'
						this.$refs.messageRef.open()
						this.loading = false
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.radio-container{
	display: flex;
	align-items: center;
	gap: 12rpx;
}
</style>
