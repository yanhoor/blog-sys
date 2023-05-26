<template>
  <div class="h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import chalk from '@/assets/echartThemes/chalk.json'
import macarons from '@/assets/echartThemes/macarons.json'
import { useDarkStore } from '@/store/modules/darkStore'
import { storeToRefs } from 'pinia'

export declare type LineChartProps = {
  title?: string
  xAxis: string[]
  legend: string[]
  series: {
    type: string
    name: string // 会作为图例
    data: number[]
  }[]
}

const props = defineProps<LineChartProps>()

const chartRef = ref()
let echart: any = null // 这个不能用响应式，不然不会显示图例或者点击图例报错
const darkStore = useDarkStore()
const { isDark } = storeToRefs(darkStore)

echarts.registerTheme('chalk', chalk)
echarts.registerTheme('macarons', macarons)
const option = {
  title: {
    text: props.title
  },
  legend: {
    // 需要与 series.name 一样才会显示
    data: props.legend
    // data: ['博客发布量', '用户注册量']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: props.xAxis
    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: props.series
  // series: [
  //   {
  //     data: [150, 230, 224, 218, 135, 147, 260],
  //     type: 'line'
  //   }
  // ]
}

watch(isDark, (val) => {
  echart.dispose()
  if (val) {
    echart = echarts.init(chartRef.value, 'chalk')
  } else {
    echart = echarts.init(chartRef.value, 'macarons')
  }
  echart.setOption(option)
})

onMounted(() => {
  echart = echarts.init(chartRef.value, isDark.value ? 'chalk' : 'macarons')
  echart.setOption(option)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  echart.resize()
}
</script>

<style lang="postcss" scoped></style>
