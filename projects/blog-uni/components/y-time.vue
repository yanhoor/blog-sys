<template>
	<view>
		{{ formatedTime }}
	</view>
</template>

<script>
	import dayjs from 'dayjs'

	export default {
		name: "y-time",
		props: {
			time: String,
			type: {
				validator: function(value) {
					// 这个值必须匹配下列字符串中的一个
					return ['format', ].includes(value)
				}
			}
		},
		data() {
			return {

			}
		},
		computed: {
			formatedTime() {
				const t = new Date(this.time)
				if (this.type === 'format') {
					return dayjs(t).format('YYYY-MM-DD HH:mm')
				}

				const sec = dayjs().diff(dayjs(t), 'second')
				if (sec < 30) {
					return '刚刚'
				}
				if (sec < 60) {
					return sec + '秒前'
				}
				const min = dayjs().diff(dayjs(t), 'minute')
				if (min < 60) {
					return min + '分钟前'
				}
				const h = dayjs().diff(dayjs(t), 'hour')
				if (h < 24) {
					return h + '小时前'
				}
				if (h < 48) {
					return '昨天 ' + dayjs(t).format('HH:mm')
				}
				return dayjs(t).format('YYYY-MM-DD HH:mm')
			}
		}
	}
</script>

<style>

</style>
