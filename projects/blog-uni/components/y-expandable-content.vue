<template>
	<view class="expandable-content">
		{{ isExpanded ? content : getSummary(content) }}
		<view class="action-btn" @click.stop="handleExpand"
			v-if="showBtn && content.length > maxLength">{{ isExpanded ? '收起' : '展开' }}</view>
	</view>
</template>

<script>
	import {
		useScrollStatusStore
	} from '@/stores/scrollStatus.js'

	export default {
		name: "y-expandable-content",
		props: {
			maxLength: {
				type: Number,
				default: 180
			},
			content: String,
			showBtn: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				isExpanded: false,
				scrollTop: 0
			}
		},
		methods: {
			handleExpand() {
				this.isExpanded = !this.isExpanded
				const s = useScrollStatusStore()
				if (this.isExpanded) {
					this.scrollTop = s.scrollTop
				} else {
					uni.pageScrollTo({
						scrollTop: this.scrollTop
					})
				}
			},
			getSummary(content) {
				if (content && content.length > this.maxLength) {
					return content.slice(0, this.maxLength) + '...'
				} else {
					return content
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.expandable-content {
		display: inline;
	}

	.action-btn {
		color: $uni-primary;
		display: inline-block;
	}
</style>
