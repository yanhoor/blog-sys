<template>
	<image class="y-image" :style="style" :src="imageUrl" :mode="mode" :lazy-load="true"></image>
</template>

<script>
	import { imageHost } from "@/config/index.js"

	export default {
		name:"y-image",
		props: {
			url: String,
			ratio: String,
			width: String,
			height: String,
			size: String,
			round: Boolean,
			mode: {
				type: String,
				default: 'aspectFill'
			},
		},
		options: {
		    // 微信小程序中 options 选项
		    // multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
		    // styleIsolation: "isolated",  //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
		    // addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
		    // virtualHost: true,  //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		  },
		data(){
			return {
				imageHost
			}
		},
		computed: {
			imageUrl(){
				let r = imageHost + this.url
				return this.ratio ? r += '?x-oss-process=image/resize,p_' + this.ratio : r
			},
			style(){
				const result = {}
				if(this.size){
					result.height = result.width = Object.is(Number(this.size), NaN) ? this.size : this.size + 'px'
				}
				if(this.width) result.width = Object.is(Number(this.width), NaN) ? this.width : this.width + 'px'
				if(this.height) result.height = Object.is(Number(this.height), NaN) ? this.height : this.height + 'px'
				return result
			}
		},
	}
</script>

<style lang="scss" scoped>
.y-image{
	width: 100%;
	height: 100%;
	border-radius: inherit;
}
</style>
