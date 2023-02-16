<template>
	<image class="user-avatar" :style="{'width': size + 'px', 'height': size + 'px' }" :src="imageHost + url"></image>
</template>

<script>
	import { imageHost } from "@/config/index.js"

	export default {
		name: 'user-avatar',
		props: {
			url: String,
			size: {
				type: Number,
				default: 52
			}
		},
		data() {
			return {
				imageHost
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-avatar{
		border-radius: 50%;
	}
</style>
