<template>
	<view v-if="myInfo">
		<uni-segmented-control class="notification-tab" :current="currentTab" :values="tabList"
			@clickItem="handleChangeTab" styleType="text" activeColor="#18a058"></uni-segmented-control>
		<view class="content">
			<NotificationComment v-if="currentTab === 0"></NotificationComment>
			<NotificationLike v-if="currentTab === 1"></NotificationLike>
			<NotificationCollect v-if="currentTab === 2"></NotificationCollect>
			<NotificationSystemAudit v-if="currentTab === 3"></NotificationSystemAudit>
		</view>
	</view>
</template>

<script>
	import scrollMixin from '@/mixins/scrollMixin.js'
	import NotificationLike from './components/notification-like.vue'
	import NotificationComment from './components/notification-comment.vue'
	import NotificationCollect from './components/notification-collect.vue'
	import NotificationSystemAudit from './components/notification-system-audit.vue'
	import {
		useMyInfoStore
	} from '@/stores/userInfo.js'
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'

	export default {
		components: {
			NotificationLike,
			NotificationComment,
			NotificationCollect,
			NotificationSystemAudit,
		},
		mixins: [scrollMixin],
		data() {
			return {
				currentTab: 0
			}
		},
		computed: {
			...mapState(useMyInfoStore, ['myInfo']),
			tabList() {
				const store = useMyInfoStore()
				const tab1 = store.unreadComment ? `评论(${store.unreadComment})` : '评论'
				const tab2 = store.unreadLike ? `点赞(${store.unreadLike})` : '点赞'
				const tab3 = store.unreadCollect ? `收藏(${store.unreadCollect})` : '收藏'
				const tab4 = store.unreadAudit ? `系统审核(${store.unreadAudit})` : '系统审核'
				return [tab1, tab2, tab3, tab4]
			}
		},
		onUnload() {
			console.log('----------onUnload----------')
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh('pages/notification')
		},
		onShow() {
			const back = uni.getStorageSync('back_from_login')
			if (back == 1) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else if (back == 2) {
				// notification-base 会触发
				// uni.startPullDownRefresh()
			} else if (!this.myInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
			uni.removeStorageSync('back_from_login')
		},
		methods: {
			handleChangeTab(e) {
				this.currentTab = e.currentIndex;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notification-tab ::v-deep .segmented-control {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 2;
		background-color: #f5f5f5;
	}
</style>
