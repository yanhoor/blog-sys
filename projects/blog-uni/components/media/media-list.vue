<template>
	<view class="media-list" @click="$emit('space-click')">
		<view class="media-item" v-for="(media, index) in displayImageList" :key="media.id" @click.stop>
			<view class="media-image-container media-item-container" @click="handleClickImage(media)">
				<YImage class="media-image" :url="media.file.url" ratio="70" mode="aspectFill"></YImage>
				<view class="media-modal" v-if="maxCount && index === maxCount - 1">

				</view>
			</view>
			<view class="over-num" v-if="maxCount && index === maxCount - 1" @click.stop="handleToPostDetail(media)">
				+{{ imageList.length - maxCount }}
			</view>
			<view class="image-tag" v-if="getFileExt(media.file.url) === 'gif'">
				Gif
			</view>
		</view>
		<view class="media-video-container media-item-container" v-for="video in videoList" :key="video.id" @click.stop>
			<video :src="imageHost + video.file.url" controls objectFit="contain"></video>
		</view>
	</view>
</template>

<script>
	import {
		imageHost
	} from "@/config/index.js"
	import YImage from '@/components/y-image.vue'
	import {
		supportedImageType,
		supportedVideoType
	} from '@/config/index.js'

	export default {
		name: 'media-list',
		props: {
			list: Array,
			previewEnable: {
				type: Boolean,
				default: true
			},
			maxCount: Number
		},
		emits: ['space-click'],
		components: {
			YImage
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
				return this.list.filter(item => this.supportedImageType.includes(this.getFileExt(item.file.url)))
			},
			displayImageList() {
				return this.maxCount ? this.imageList.slice(0, this.maxCount) : this.imageList
			},
			videoList() {
				return this.list.filter(item => this.supportedVideoType.includes(this.getFileExt(item.file.url)))
			}
		},
		methods: {
			getFileExt(path) {
				const index = path.lastIndexOf('.')
				return path.slice(index + 1).toLowerCase()
			},
			handleClickImage(image) {
				if (this.previewEnable) {
					uni.previewImage({
						urls: this.imageList.map(i => this.imageHost + i.file.url),
						current: this.imageHost + image.file.url,
						indicator: 'number'
					})
				}
			},
			handleToPostDetail(media) {
				if (media.blogId) {
					uni.navigateTo({
						url: '/pages/post/post?id=' + media.blogId
					})
				}

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
			width: calc(100%/3);
			box-sizing: border-box;
			padding-left: 6px;
			padding-top: 6px;
			position: relative;

			.over-num {
				font-size: 24px;
				font-weight: 600;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				word-break: keep-all;
				color: #fff;
			}

			.image-tag {
				padding: 0 8px;
				background: hsla(0, 0%, 100%, .6);
				border-radius: 5px 0 0 0;
				text-align: center;
				color: $uni-base-color;
				bottom: 0;
				right: 0;
				display: inline-block;
				position: absolute;
			}
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

		.media-modal {
			position: absolute;
			top: 0px;
			left: 0px;
			height: 100%;
			width: 100%;
			border-radius: inherit;
			background: rgba(0, 0, 0, 0.3);
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
