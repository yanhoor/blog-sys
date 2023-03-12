<template>
	<view class="login-page">
		<uni-card class="card" margin="5px" spacing="0">
			<view class="content-container">
				<uni-forms ref="registerFormRef" label-width="100px" label-position="top" :modelValue="registerForm"
					:rules="rules" v-if="isRegister">
					<uni-forms-item label="用户名" name="name">
						<uni-easyinput type="text" v-model="registerForm.name" maxlength="8" :trim="true"
							placeholder="请输入用户名"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="手机号" name="mobile">
						<uni-easyinput type="number" maxlength="11" :trim="true" v-model="registerForm.mobile"
							placeholder="请输入手机号" />
					</uni-forms-item>
					<uni-forms-item label="密码" name="password">
						<uni-easyinput type="password" :trim="true" v-model="registerForm.password" placeholder="请输入密码">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="再次输入密码" name="repeatPassword">
						<uni-easyinput type="password" :trim="true" v-model="registerForm.repeatPassword"
							placeholder="请再次输入密码"></uni-easyinput>
					</uni-forms-item>
				</uni-forms>
				<uni-forms ref="formRef" label-position="top" :modelValue="formData" :rules="rules" v-else>
					<uni-forms-item label="手机号" name="mobile">
						<uni-easyinput type="number" maxlength="11" v-model="formData.mobile" placeholder="请输入手机号" />
					</uni-forms-item>
					<uni-forms-item label="密码" name="password">
						<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码"></uni-easyinput>
					</uni-forms-item>
				</uni-forms>
				<button class="btn" type="primary" :loading="loading" @click="handleRegister"
					v-if="isRegister">注册</button>
				<button class="btn" type="primary" :loading="loading" @click="submitForm" v-else>登录</button>
				<button class="btn" type="default" @click="isRegister = false" v-if="isRegister">已有账号，去登录</button>
				<button class="btn" type="default" @click="isRegister = true" v-else>没有账号，去注册</button>
				<!-- <button type="default" @click="getUserInfo">test</button>
				<button type="default" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber">test</button> -->
			</view>
		</uni-card>
		<uni-popup ref="messageRef" type="message">
			<uni-popup-message type="error" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
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
				messageText: '',
				formData: {
					mobile: '',
					password: ''
				},
				registerForm: {
					name: '',
					mobile: '',
					password: '',
					repeatPassword: '',
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入用户名',
						}]
					},
					mobile: {
						rules: [{
							required: true,
							errorMessage: '请输入手机号',
						}]
					},
					// 对email字段进行必填验证
					password: {
						rules: [{
							required: true,
							errorMessage: '请输入密码',
						}]
					},
					repeatPassword: {
						rules: [{
							required: true,
							errorMessage: '请再次输入密码',
						}]
					}
				},
				isRegister: false,
				loading: false
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
		},
		created() {
			uni.removeStorageSync('index-view-group-id')
			uni.setStorageSync('token', '')
		},
		onUnload() {
			// console.log('+++++++++++login page onUnload+++++++++++')
			uni.setStorageSync('back_from_login', this.myInfo ? 2 : 1)
		},
		methods: {
			...mapActions(useMyInfoStore, ['getMyInfo']),
			submitForm() {
				this.$refs.formRef.validate().then(async (res) => {
					this.loading = true
					try {
						const {
							success,
							result,
							msg
						} = await Http.post(urls.login, this.formData)
						this.loading = false
						if (success) {
							uni.setStorageSync('token', result)
							await this.getMyInfo()
							// const s = useScrollStatusStore()
							// s.setPullDownRefresh(['pages/notification', 'pages/index'])
							uni.$emit('refresh_index_page')
							uni.navigateBack()
						} else {
							this.messageText = msg
							this.$refs.messageRef.open()
						}
					} catch (e) {
						this.loading = false
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			handleRegister() {
				this.$refs.registerFormRef.validate().then(async (res) => {
					this.loading = true
					try {
						const {
							success,
							result,
							msg
						} = await Http.post(urls.register, this.registerForm)
						this.loading = false
						if (success) {
							uni.showToast({
								title: '注册成功'
							})
							this.isRegister = false
						} else {
							this.messageText = msg
							this.$refs.messageRef.open()
						}
					} catch (e) {
						this.loading = false
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			// https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
			getUserInfo(e) {
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success: async function(event) {
						const {
							code
						} = event
						console.log('++++++++++++', event)
						await Http.post('/wechat/login', {
							code
						})
					},
					fail: function(err) {
						// 登录授权失败  
						// err.code是错误码
					}
				})

			},
			// 暂不支持个人开发者，参考 https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
			getPhoneNumber(c) {
				console.log('+++++++getPhoneNumber++++++++', c)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;

		.card {
			width: 100%;
		}
	}

	.btn {
		width: 100%;
		text-align: center;
	}

	.content-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
</style>
