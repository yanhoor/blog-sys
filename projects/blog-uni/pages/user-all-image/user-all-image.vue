<template>
	<view class="user-all-image">
		<YAppendListWrapper :pageUrl="pageUrl" :url="urls.user_media_list" v-model="pageList"
			:searchParams="{ type: 1, userId }" @fetch-end="$emit('fetch-end', $event)">
			<view class="image-wrapper">
				<view class="image-item" v-for="image in pageList" :key="image.id" @click="handleClickImage(image)">
					<view class="image-item-container">
						<YImage class="y-image" :url="image.url" ratio="70" mode="aspectFill"></YImage>
					</view>
				</view>
			</view>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import YImage from '@/components/y-image.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		imageHost
	} from "@/config/index.js"
	import {
		mapState,
		mapActions,
	} from 'pinia'
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'
	import scrollMixin from '@/mixins/scrollMixin.js'

	export default {
		mixins: [scrollMixin],
		components: {
			YAppendListWrapper,
			YImage,
		},
		data() {
			return {
				urls,
				pageUrl: '/pages/user-all-image',
				pageList: [],
				userId: ''
			}
		},
		onLoad(params) {
			this.userId = Number(params.id)
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			const s = useScrollStatusStore()
			s.setPullDownRefresh(this.pageUrl)
		},
		methods: {
			handleClickImage(image) {
				uni.previewImage({
					urls: this.pageList.map(i => imageHost + i.url),
					current: imageHost + image.url,
					indicator: 'number'
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.image-wrapper {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
		margin-top: -12rpx;
		margin-left: -12rpx;
	}

	.image-item {
		width: calc(100%/3);
		box-sizing: border-box;
		padding-top: 12rpx;
		padding-left: 12rpx;

		.image-item-container {
			width: 100%;
			height: 0;
			padding-top: 100%;
			position: relative;

			.y-image {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				border-radius: 3px;
			}
		}
	}
</style>
