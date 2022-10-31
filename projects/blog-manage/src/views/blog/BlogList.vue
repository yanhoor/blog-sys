<template>
  <ListWrapper>
    <template #filter>
      <el-input placeholder="标题" v-model="filterForm.title"></el-input>
    </template>

    <template #actions>
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button @click="getList">查询</el-button>
    </template>

    <template #table>
      <vxe-table border :data="pageState.tableList" height="auto" v-loading="pageState.loading">
        <vxe-column key="seq" type="seq" width="60"></vxe-column>
        <vxe-column key="title" field="title" title="标题"></vxe-column>
        <vxe-column key="cate" title="所属分类">
          <template #default="{ row }">
            <div>{{ row.cate.name }}</div>
          </template>
        </vxe-column>
        <vxe-column key="launch" title="状态">
          <template #default="{ row }">
            <el-tag v-if="row.launch" type="success">已发布</el-tag>
            <el-tag v-else type="info">下架</el-tag>
          </template>
        </vxe-column>
        <vxe-column key="operateAt" title="发布/下架时间">
          <template #default="{ row }">
            <div>{{dayjs(row.operateAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </vxe-column>
        <vxe-column key="updateTime" title="更新时间">
          <template #default="{ row }">
            <div>{{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </vxe-column>
        <vxe-column key="createTime" title="创建时间">
          <template #default="{ row }">
            <div>{{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </vxe-column>
        <vxe-column key="operate" title="操作" min-width="120">
          <template #default="{ row }">
            <div v-if="row.launch">
              <el-button @click="operateItem(row.id, 0)" text type="warning">下架</el-button>
            </div>
            <div v-else>
              <el-button @click="operateItem(row.id, 1)" text type="success">发布</el-button>
              <el-button @click="editItem(row.id)" text type="primary">编辑</el-button>
              <el-button @click="deleteItem(row.id)" text type="danger">删除</el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
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
  pageSizeList: [20, 50, 100, 200],
  tableTotal: 0,
})
const filterForm = reactive({
  title: '',
  page: 1,
  pageSize: 20
})

getList()

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

async function editItem(id: string) {
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
