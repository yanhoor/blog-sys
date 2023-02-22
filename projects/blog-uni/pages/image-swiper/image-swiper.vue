<template>
	<swiper class="swiper" :current="initIndex">
		<swiper-item v-for="image in imageList" :key="image.id">
			<view class="page-item">
				<view class="image-container">
					<YImage class="y-image" :url="image.url" mode="aspectFit" @tap="handleClickImage(image)">
					</YImage>
					<YExpandanleContent class="blog-content" :content="image.blog.content" :maxLength="80"
						@tap="handleToPostDetail(image.blog)">
						<template #action>
							<view class="action-btn">
								全文
							</view>
						</template>
					</YExpandanleContent>
				</view>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	import {
		imageHost
	} from "@/config/index.js"
	import {
		useImageSwiperStore
	} from '@/stores/imageSwiperStore.js'
	import YImage from '@/components/y-image.vue'
	import YExpandanleContent from '@/components/y-expandable-content.vue'
	import {
		mapState,
		mapActions,
	} from 'pinia'

	export default {
		components: {
			YImage,
			YExpandanleContent,
		},
		data() {
			return {}
		},
		created() {},
		computed: {
			...mapState(useImageSwiperStore, ['imageList', 'initIndex'])
		},
		methods: {
			handleToPostDetail(blog) {
				uni.navigateTo({
					url: '/pages/post/post?id=' + blog.id
				})
			},
			handleClickImage(image) {
				uni.previewImage({
					urls: [imageHost + image.url],
					current: imageHost + image.url,
					indicator: 'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #000;
	}
</style>

<style lang="scss" scoped>
	.swiper {
		width: 100vw;
		height: 100vh;

		.page-item {
			width: 100%;
			height: 100%;

			.image-container {
				width: 100%;
				height: 100%;
				background-color: #000;
				position: relative;

				.blog-content {
					position: absolute;
					bottom: env(safe-area-inset-bottom);
					left: 0;
					color: #fff;
					padding: 0 24rpx;

					.action-btn {
						display: inline-block;
						color: $uni-extra-color;
					}
				}
			}
		}
	}
</style>
