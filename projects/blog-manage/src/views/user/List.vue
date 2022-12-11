<template>
  <ListWrapper>
    <template #filter>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input placeholder="用户名" v-model="filterForm.name" clearable @clear="getList" @keyup.enter="getList"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="手机号" maxlength="11" v-model="filterForm.mobile" clearable @clear="getList" @keyup.enter="getList"></el-input>
        </el-col>
      </el-row>
    </template>

    <template #actions>
      <el-button @click="getList">查询</el-button>
    </template>

    <template #table>
      <el-table border stripe :data="pageState.tableList" height="auto" v-loading="pageState.loading">
        <el-table-column type="index" width="60" label="#"></el-table-column>
        <el-table-column prop="name" label="用户名" min-width="100">
          <template #default="{ row }">
            <div class="flex items-center">
              <!--<image :src="IMG_HOST + row.avatar" class="w-[60px] h-[60px] mr-8" />-->
              <el-avatar :src="IMG_HOST + row.avatar"></el-avatar>
              <span class="truncate flex-1 ml-3">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column key="lock" label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.lock === 1" type="danger">已锁定</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blogCount" label="博客数量"></el-table-column>
        <el-table-column prop="likeBlogCount" label="点赞博客数量"></el-table-column>
        <el-table-column label="创建时间">
          <template #default="{ row }">
            <div>{{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="最后活跃时间">
          <template #default="{ row }">
            <div>{{dayjs(row.lastActiveAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="operateItem(row.id, 1)" link type="warning" v-if="row.lock === 2">锁定</el-button>
            <el-button @click="operateItem(row.id, 2)" link type="success" v-else>解锁</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #tablePagination>
      <el-pagination
        v-model:currentPage="filterForm.page"
        v-model:page-size="filterForm.pageSize"
        :page-sizes="pageState.pageSizeList"
        :background="true"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageState.tableTotal"
        @size-change="getList"
        @current-change="getList"
      />
    </template>
  </ListWrapper>
</template>

<script setup lang="ts">
import ListWrapper from '@/layout/listWrapper.vue'
import { reactive, ref } from 'vue'
import $http, { urls, IMG_HOST } from "@/http"
import {ElMessage, ElMessageBox} from "element-plus"
import dayjs from "dayjs"

const filterForm = reactive({
  name: '',
  mobile: '',
  page: 1,
  pageSize: 20
})
const pageState = reactive({
  loading: false,
  tableList: [],
  pageSizeList: [20, 50, 100, 200],
  tableTotal: 0,
})

getList()

async function getList() {
  try{
    pageState.loading = true
    const {success, result, msg} = await $http.post(urls.user_list, filterForm)
    pageState.loading = false
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      pageState.tableList = result.list
      pageState.tableTotal = result.total
    }
  }catch (e) {
    pageState.loading = false
  }
}

async function operateItem(id: string, lock: number) {
  ElMessageBox.confirm(
    lock === 2 ? '确定解锁？' : '确定锁定？',
    lock === 2 ? '解锁' : '锁定',
    {
      confirmButtonText: lock === 2 ? '解锁' : '锁定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( async () => {
    try{
      const {success, result, msg} = await $http.post( lock === 2 ? urls.user_unlock : urls.user_lock, { id, type: lock })
      if(!success){
        ElMessage.error({
          message: msg
        })
      }else{
        ElMessage.success({
          message: '操作成功'
        })
        getList()
      }
    }catch (e) {

    }
  }).catch(() => {})
}
</script>
