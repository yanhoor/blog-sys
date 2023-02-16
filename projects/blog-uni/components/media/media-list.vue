<template>
	<view class="media-list">
		<view class="media-item" v-for="media in imageList" :key="media.id">
			<view class="media-image-container media-item-container">
				<TImage class="media-image" :url="media.url"></TImage>
			</view>
		</view>
		<view class="media-video-container media-item-container" v-for="video in videoList" :key="video.id">
			<video :src="imageHost + video.url" controls objectFit="contain"></video>
		</view>
	</view>
</template>

<script>
	import {
		imageHost
	} from "@/config/index.js"
	import TImage from '@/components/y-image.vue'
	import {
		supportedImageType,
		supportedVideoType
	} from '@/config/index.js'

	export default {
		name: 'media-list',
		props: {
			list: Array
		},
		components: {
			TImage
		},
		data() {
			return {
				imageHost,
				supportedImageType,
				supportedVideoType,
			}
		},
		computed: {
			imageList() {
				return this.list.filter(item => this.supportedImageType.includes(this.getFileExt(item.url)))
			},
			videoList() {
				return this.list.filter(item => this.supportedVideoType.includes(this.getFileExt(item.url)))
			}
		},
		methods: {
			getFileExt(path) {
				const index = path.lastIndexOf('.')
				return path.slice(index + 1).toLowerCase()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.media-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin-left: -6px;
		margin-top: -6px;

		.media-item {
			width: 25%;
			box-sizing: border-box;
			padding-left: 6px;
			padding-top: 6px;

		}
	}

	.media-item-container {
		border-radius: 5px;
		height: 0;
		position: relative;
		width: 100%;
	}

	.media-image-container {
		padding-top: 100%;

		.media-image {
			border-radius: inherit;

			::v-deep image {
				border-radius: inherit;
				height: 100%;
				object-fit: cover;
				overflow: clip;
				position: absolute;
				top: 0;
				width: 100%;
			}
		}
	}

	.media-video-container {
		margin: 6px 0 12px;
		padding-top: 56.25%;

		video {
			border-radius: inherit;
			position: absolute;
			top: 0;
			width: 100%;
		}
	}
</style>
