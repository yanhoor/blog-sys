<template>
	<view class="map-page">
		<map :latitude="latitude" :longitude="longitude" enable-building enable-traffic show-compass enable-3D :markers="[{ id: 0, width: 30, height: 30, latitude, longitude, ...markers }]" v-if="latitude"></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: '',
				longitude: '',
				markers: {
					iconPath: '/static/images/location.png'
				}
			}
		},
		onLoad(params) {
			this.latitude = params.latitude
			this.longitude = params.longitude
		}
	}
</script>

<style lang="scss" scoped>
.map-page{
	width: 100vw;
	height: 100vh;
	map{
		width: 100%;
		height: 100%;
	}
}
</style>
