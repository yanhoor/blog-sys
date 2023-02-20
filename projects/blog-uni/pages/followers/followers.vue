<template>
	<view>
		<uni-card margin="5px" spacing="0">
			<Userlist :pageUrl="pageUrl" :url="urls.user_friends" :searchParams="{ uid: userId, relateType: 2 }"></Userlist>
		</uni-card>
	</view>
</template>

<script>
	import Userlist from '@/components/user/user-list.vue'
	import scrollMixin from '@/mixins/scrollMixin.js'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import Http, {
		urls
	} from '@/http'

	export default {
		mixins: [scrollMixin],
		components: {
			Userlist
		},
		data() {
			return {
				pageUrl: '/pages/followers',
				userId: '',
				urls
			}
		},
		onLoad(params) {
			this.userId = params.userId
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh(this.pageUrl)
		},
	}
</script>

<style lang="scss">

</style>
