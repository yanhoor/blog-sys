<template>
  <ListWrapper>
    <template #filter>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input placeholder="标题" v-model="filterForm.title" clearable @keyup.enter="getList" @clear="getList"></el-input>
        </el-col>
        <el-col :span="8">
          <el-select placeholder="创建用户" v-model="filterForm.createById" clearable @change="getList">
            <el-option :key="item.id" :value="item.id" :label="item.name" v-for="item of pageState.userList"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </template>

    <template #actions>
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button @click="getList">查询</el-button>
    </template>

    <template #table>
      <el-table border stripe :data="pageState.tableList" height="auto" v-loading="pageState.loading">
        <el-table-column key="seq" type="index" width="60" label="#"></el-table-column>
        <el-table-column key="title" prop="title" label="标题"></el-table-column>
        <el-table-column key="cate" label="所属分类">
          <template #default="{ row }">
            <div>{{ row.cate?.name }}</div>
          </template>
        </el-table-column>
        <el-table-column key="launch" label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.launch" type="success">已发布</el-tag>
            <el-tag v-else type="info">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="operateAt" label="发布/下架时间">
          <template #default="{ row }">
            <div>{{dayjs(row.operateAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column key="createBy" label="创建用户">
          <template #default="{ row }">
            <div>{{ row.createBy?.name }}</div>
          </template>
        </el-table-column>
        <el-table-column key="updateTime" label="更新时间">
          <template #default="{ row }">
            <div>{{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column key="createTime" label="创建时间">
          <template #default="{ row }">
            <div>{{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column key="operate" label="操作" min-width="120">
          <template #default="{ row }">
            <el-button @click="operateItem(row.id, 0)" link type="warning" v-if="row.launch">下架</el-button>
            <el-button @click="operateItem(row.id, 1)" link type="success" v-else>发布</el-button>
            <el-button @click="viewItem(row.id)" link type="primary">查看</el-button>
            <el-button @click="deleteItem(row.id)" link type="danger">删除</el-button>
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
import { reactive, ref } from 'vue'
import ListWrapper from '@/layout/listWrapper.vue'
import $http, { urls } from "@/http";
import { ElMessage, ElMessageBox } from "element-plus"
import dayjs from "dayjs"
import { useRouter } from 'vue-router'

const router = useRouter()
const pageState = reactive({
  loading: false,
  tableList: [],
  userList: [],
  pageSizeList: [20, 50, 100, 200],
  tableTotal: 0,
})
const filterForm = reactive({
  title: '',
  createById: '',
  page: 1,
  pageSize: 20
})

getList()
getAllUser()

function handleAdd() {
  router.push('/blogEdit')
}

async function getList(){
  try{
    pageState.loading = true
    const {success, result, msg} = await $http.post(urls.blog_list, filterForm)
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

async function getAllUser(){
  try{
    const {success, result, msg} = await $http.post(urls.user_all, {})
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      pageState.userList = result
    }
  }catch (e) {

  }
}

async function viewItem(id: string) {
  // window.open(import.meta.env.VITE_BLOG_BASE + '/blog?id=' + id)
  router.push({
    path: '/blogEdit',
    query: {
      id
    }
  })
}

async function deleteItem(id: string) {
  ElMessageBox.confirm(
    '确定删除？',
    '删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( async () => {
    try{
      const {success, result, msg} = await $http.post(urls.blog_delete, {id})
      if(!success){
        ElMessage.error({
          message: msg
        })
      }else{
        ElMessage.error({
          message: '已删除'
        })
        getList()
      }
    }catch (e) {

    }
  }).catch(() => {})
}

async function operateItem(id: string, launch: number) {
  ElMessageBox.confirm(
    launch ? '确定发布？' : '确定下架？',
    launch ? '发布' : '下架',
    {
      confirmButtonText: launch ? '发布' : '下架',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( async () => {
    try{
      const {success, result, msg} = await $http.post(urls.blog_operate, { id, launch })
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
