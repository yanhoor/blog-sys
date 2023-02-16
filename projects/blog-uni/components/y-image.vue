<template>
	<image :src="imageHost + url"></image>
</template>

<script>
	import { imageHost } from "@/config/index.js"
	
	export default {
		name:"y-image",
		props: {
			url: String
		},
		data(){
			return {
				imageHost
			}
		}
	}
</script>

<style>

</style>