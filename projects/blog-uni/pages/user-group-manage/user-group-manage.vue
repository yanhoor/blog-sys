<template>
	<view class="user-group-manage">
		<view v-if="loading">loding...</view>

		<view class="page-content" v-else>
			<view class="tip">
				*点击分组修改名称或删除
			</view>
			<view class="group-container">
				<HM-dragSorts ref="dragSorts" :list="pageList" :autoScroll="true" :feedbackGenerator="true"
					:listHeight="500" :rowHeight="55" @change="change" @confirm="confirm" @onclick="onclick"
					v-if="pageList.length"></HM-dragSorts>
			</view>
			<uni-card margin="5px" spacing="0">
				<view class="edit-section">
					<view class="edit-title">
						{{ editForm.id ? '修改分组' : '新增分组' }}
					</view>
					<uni-easyinput v-model="editForm.name" placeholder="输入分组名称" trim />
					<button type="primary" size="mini" @click="handleSave" :loading="saveLoading">保存</button>
					<button type="warn" size="mini" v-if="editForm.id" @click="handleDeleteGroup"
						:loading="deleteLoading">删除分组</button>
					<button type="default" size="mini" v-if="editForm.id" @click="editForm = { name: '' }">取消</button>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import Http, {
		urls
	} from '@/http'

	export default {
		data() {
			return {
				pageList: [],
				loading: false,
				saveLoading: false,
				deleteLoading: false,
				urls,
				editForm: {
					name: ''
				},
			}
		},
		created() {
			this.getAllGroup()
		},
		methods: {
			async getAllGroup() {
				// this.loading = true
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.followGroup_all)
					this.loading = false
					if (success) {
						this.pageList = result
					}
				} catch (e) {
					this.loading = false
				}
			},
			onclick(e) {
				console.log('=== onclick start ===');
				console.log("被点击行: " + JSON.stringify(e.value));
				console.log("被点击下标: " + JSON.stringify(e.index));
				console.log('=== onclick end ===');
				this.editForm = JSON.parse(JSON.stringify(this.pageList[e.index]))
			},
			change(e) {
				console.log('=== change start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：', e.index);
				console.log('移动到：', e.moveTo);
				console.log('=== change end ===');
			},
			confirm(e) {
				console.log('=== confirm start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：', e.index);
				console.log('移动到：', e.moveTo);
				console.log('拖动后的列表：', e.list);
				console.log('=== confirm end ===');
				this.handleSaveSort(e.list)
			},
			async handleSave() {
				this.saveLoading = true
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.followGroup_edit, this.editForm)
					this.saveLoading = false
					if (success) {
						this.editForm = {
							name: ''
						}
						uni.$emit('refresh_index_group')
						this.getAllGroup()
					}
				} catch (e) {
					this.saveLoading = false
				}
			},
			async handleDeleteGroup() {
				uni.showModal({
					title: '提示',
					content: `${ this.editForm.memberCount ? '该分组有' + this.editForm.memberCount + '个成员，' : ''}确定删除吗`,
					success: async (res) => {
						if (res.confirm) {
							this.deleteLoading = true
							try {
								const {
									success,
									result,
									msg
								} = await Http.post(urls.followGroup_delete, {
									id: this.editForm.id
								})
								this.deleteLoading = false
								if (success) {
									this.editForm = {
										name: ''
									}
									uni.$emit('refresh_index_group')
									this.getAllGroup()
								}
							} catch (e) {
								this.deleteLoading = false
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			async handleSaveSort(list) {
				const ids = list.map(i => i.id).toString()
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.followGroup_sort, {
						ids
					})
					if (success) {
						uni.$emit('refresh_index_group')
						this.getAllGroup()
					}
				} catch (e) {

				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.user-group-manage {
		height: 100vh;
	}

	.page-content {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		height: 100%;

		.tip {
			color: $uni-secondary-color;
			font-size: 14px;
			margin: 0 20rpx;
		}

		.group-container {}
	}

	.edit-section {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		button {
			width: 100%;
		}
	}
</style>
