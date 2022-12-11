<template>
  <div v-if="loading" v-loading="loading"></div>
  <div v-else class="h-full w-full flex flex-col gap-12 home-container">
    <div class="w-full flex gap-6">
      <NumberBoard class="flex-1" title="博客总数" :count="totalCount.blogCount"/>
      <NumberBoard class="flex-1" title="用户总数" :count="totalCount.userRegisterCount"/>
      <NumberBoard class="flex-1" title="今日新增用户数" :count="totalCount.userRegisterTodayCount"/>
      <NumberBoard class="flex-1" title="今日活跃用户数" :count="totalCount.userActiveCount"/>
    </div>
    <div class="flex-1 flex flex-col gap-12">
      <el-card class="flex-1 chart">
        <LineChart v-bind="weekStatis.blog"/>
      </el-card>
      <el-card class="flex-1 chart">
        <LineChart v-bind="weekStatis.user" class="flex-1"/>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import $http, {urls} from "@/http"
import {ElMessage} from "element-plus"
import LineChart from '@/components/echarts/lineChart.vue'
import NumberBoard from "@/components/numberBoard.vue"
import {reactive, ref} from "vue"

const weekStatis: any = reactive({
  blog: null,
  user: null
})

const totalCount: any = reactive({
  blogCount: 0,
  userRegisterCount: 0,
  userActiveCount: 0,
  userRegisterTodayCount: 0
})

const loading = ref(true)

InitPage()

async function InitPage(){
  try {
    loading.value = true
    await Promise.all([
      getWeekCountDetail(),
      getTotalCount()
    ])
    loading.value = false
  }catch (e) {
    loading.value = false
  }
}

// 获取一周的每日数据
async function getWeekCountDetail(){
  try{
    const {success, result, msg} = await $http.post(urls.statis_week_detail, {})
    if(success){
      const blogInfo: any = {
        xAxis: [],
        legend: ['博客发布量'],
        series: []
      }
      const userInfo: any = {
        xAxis: [],
        legend: ['用户注册量'],
        series: []
      }
      blogInfo.xAxis = userInfo.xAxis = Object.keys(result)
      const valueList: any[] = Object.values(result)
      const blogCountInfo: any = {
        type: 'line',
        name: '博客发布量',
        smooth: true,
        data: []
      }
      const userCountInfo: any = {
        type: 'line',
        name: '用户注册量',
        smooth: true,
        data: []
      }
      for (let info of valueList){
        blogCountInfo.data.push(info.blogCount)
        userCountInfo.data.push(info.userRegisterCount)
      }
      blogInfo.series.push(blogCountInfo)
      userInfo.series.push(userCountInfo)

      weekStatis.blog = blogInfo
      weekStatis.user = userInfo
    }else{
      ElMessage.error({
        message: msg
      })
    }
  }catch (e) {
    console.log('===============', e)
  }
}

// 获取总数和每日活跃用户数
async function getTotalCount(){
  try {
    const {success, result, msg} = await $http.post(urls.statis_total_count, {})
    if(success){
      totalCount.blogCount = result.blogCount
      totalCount.userRegisterCount = result.userRegisterCount
      totalCount.userActiveCount = result.userActiveCount
      totalCount.userRegisterTodayCount = result.userRegisterTodayCount
    }
  }catch (e) {

  }
}
</script>

<style lang="scss" scoped>
.home-container{
  .chart:deep(.el-card__body){
    width: 100%;
    height: 100%;
    padding: 0px;
  }
}
</style>
