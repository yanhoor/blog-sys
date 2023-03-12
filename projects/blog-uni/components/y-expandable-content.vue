<template>
	<view class="expandable-content">
		{{ isExpanded ? content : getSummary(content) }}
		<slot name="action" v-if="showAction">
			<view class="action-btn" @click.stop="handleExpand">
				{{ isExpanded ? '收起' : '展开' }}</view>
		</slot>
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
			maxLine: {
				type: Number,
				default: 3
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
		computed: {
			contentLineList(){
				return this.content.split('\n')
			},
			showAction(){
				if(this.showBtn) {
					if(this.contentLineList.length > this.maxLine) return true
					if(this.content.length > this.maxLength) return true
					return false
				} else{
					return false
				}
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
				if (this.contentLineList.length > this.maxLine){
					return this.contentLineList.slice(0, this.maxLine).join('\n') + (this.showBtn ? '\n' : '\n...')
				}else if(content && content.length > this.maxLength) {
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
		white-space: pre-wrap;
	}

	.action-btn {
		color: $uni-primary;
		display: inline-block;
	}
</style>
