<template>
  <ListWrapper>
    <template #filter>
      <el-input placeholder="分类名" v-model="filterForm.name"></el-input>
    </template>

    <template #actions>
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button @click="getList">查询</el-button>
    </template>

    <template #table>
      <vxe-table border :data="pageState.tableList" height="auto" v-loading="pageState.loading">
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="名称"></vxe-column>
        <vxe-column title="更新时间">
          <template #default="{ row }">
            <div>{{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </vxe-column>
        <vxe-column title="创建时间">
          <template #default="{ row }">
            <div>{{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button @click="editItem(row.id)" text type="primary">编辑</el-button>
            <el-button @click="deleteItem(row.id)" text type="primary">删除</el-button>
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

    <el-drawer v-model="pageState.showEdit" size="500px">
      <template #default>
        <BlogCateEdit :post-form="editForm" @complete="handleSaveComplete"/>
      </template>
    </el-drawer>
  </ListWrapper>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BlogCateEdit from './BlogCateEdit.vue'
import ListWrapper from '@/layout/listWrapper.vue'
import { BlogCate } from '@/types/blogCate'
import $http, { urls } from "@/http";
import { ElMessage, ElMessageBox } from "element-plus"
import dayjs from "dayjs"

let editForm = ref<BlogCate>({
  name: ''
})
const pageState = reactive({
  showEdit: false,
  loading: false,
  tableList: [],
  pageSizeList: [20, 50, 100, 200],
  tableTotal: 0,
})
const filterForm = reactive({
  name: '',
  page: 1,
  pageSize: 20
})

getList()

function handleAdd() {
  pageState.showEdit = true
  editForm.value = {
    name: ''
  }
}

async function getList(){
  try{
    pageState.loading = true
    const {success, result, msg} = await $http.post(urls.blog_cate_list, filterForm)
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
  try{
    const {success, result, msg} = await $http.post(urls.blog_cate_info, { id })
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      editForm.value = result
      pageState.showEdit = true
    }
  }catch (e) {

  }
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
      const {success, result, msg} = await $http.post(urls.blog_cate_delete, {id})
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

function handleSaveComplete(){
  pageState.showEdit = false
  getList()
}

</script>
