<template>
	<view class="media-image-wall">
		<uni-card spacing="0" padding="0" :isFull="true" v-if="pageList.length">
			<swiper class="swiper">
				<swiper-item v-for="(page, idx) in pageList" :key="idx">
					<view class="page-item">
						<view class="image-container" v-for="image in page" :key="image.id">
							<YImage class="y-image" :url="image.url" @tap="handleImagePreview(image)" ratio="70">
							</YImage>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</uni-card>
		
	</view>
</template>

<script>
	import YImage from '@/components/y-image.vue'
	import Http, {
		urls
	} from '@/http'
	import {
		imageHost
	} from "@/config/index.js"
	import { useImageSwiperStore } from '@/stores/imageSwiperStore.js'

	export default {
		name: 'media-image-wall',
		props: {
			userId: Number,
		},
		emits: ['fetch-end'],
		components: {
			YImage
		},
		data() {
			return {
				imageList: [],
				urls,
				imageHost,
			}
		},
		created() {
			this.getImageList()
		},
		computed: {
			pageList() {
				const result = []
				const page = Math.ceil(this.imageList.length / 5)
				for (let i = 0; i < page; i++) {
					result.push(this.imageList.slice(i * 5, (i + 1) * 5))
				}
				return result
			}
		},
		methods: {
			async getImageList() {
				try {
					const {
						success,
						result,
						msg
					} = await Http.post(urls.user_media_list, {
						userId: this.userId,
						type: 1
					})
					if (success) {
						this.imageList = result.list
						this.$emit('fetch-end', result)
					}
				} catch (e) {}
			},
			handleImagePreview(image){
				// uni.previewImage({
				// 	urls: this.imageList.map(i => this.imageHost + i.url),
				// 	current: this.imageHost + image.url,
				// 	indicator: 'number'
				// })
				const s = useImageSwiperStore()
				s.setImageList(this.imageList)
				const idx = this.imageList.indexOf(image)
				s.setInitIndex(idx)
				uni.navigateTo({
					url:'/pages/image-swiper/image-swiper'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 80px;
		.page-item {
			width: 100%;
			height: 100%;
			display: flex;

			.image-container {
				width: 20%;
				height: 100%;
			}

			.y-image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
