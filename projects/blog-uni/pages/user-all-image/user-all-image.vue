<template>
	<view class="user-all-image">
		<YAppendListWrapper :pageUrl="pageUrl" :url="urls.user_media_list" v-model="pageList"
			:searchParams="{ type: 1, userId }">
			<view class="image-wrapper">
				<view class="image-item" v-for="(image, idx) in pageList" :key="image.id" @click="handleClickImage(idx)">
					<view class="image-item-container">
						<YImage class="y-image" :url="image.file.url" ratio="70" mode="aspectFill"></YImage>
					</view>
				</view>
			</view>

			<template #skeleton>
				<SkeletonMediaList></SkeletonMediaList>
			</template>
		</YAppendListWrapper>
	</view>
</template>

<script>
	import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
	import SkeletonMediaList from '@/components/skeleton/skeleton-media-list.vue'
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
	import { useImageSwiperStore } from '@/stores/imageSwiperStore.js'
	import scrollMixin from '@/mixins/scrollMixin.js'

	export default {
		mixins: [scrollMixin],
		components: {
			YAppendListWrapper,
			YImage,
			SkeletonMediaList,
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
			handleClickImage(idx) {
				// uni.previewImage({
				// 	urls: this.pageList.map(i => imageHost + i.url),
				// 	current: imageHost + image.url,
				// 	indicator: 'number'
				// })
				const s = useImageSwiperStore()
				s.setImageList(this.pageList)
				s.setInitIndex(idx)
				uni.navigateTo({
					url:'/pages/image-swiper/image-swiper'
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
