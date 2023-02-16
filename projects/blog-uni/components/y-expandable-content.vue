<template>
	<view class="expandable-content">
		{{ isExpanded ? content : getSummary(content) }}
		<button class="action-btn" size="mini" type="primary" @click="handleExpand"
			v-if="showBtn && content.length > maxLength">{{ isExpanded ? '收起' : '展开' }}</button>
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
	.expandable-content {}

	.action-btn {
		padding: 0;
		background-color: transparent;
		color: #1aad19;
		border: none;
		line-height: initial;
		border-radius: 0;
	}
</style>
