<template>
  <LineChart />
</template>

<script setup lang="ts">
import $http, {urls} from "@/http"
import {ElMessage} from "element-plus"
import LineChart from '@/components/echarts/lineChart.vue'

getAllUser()

async function getAllUser(){
  try{
    const {success, result, msg} = await $http.post(urls.statis_daily_count, {})
    if(success){

    }else{
      ElMessage.error({
        message: msg
      })
      console.log('===============', result)
    }
  }catch (e) {

  }
}
</script>
