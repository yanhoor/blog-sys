<template>
  <ListWrapper>
    <template #filter>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input placeholder="内容" v-model="filterForm.keyword" clearable @keyup.enter="handleSearch" @clear="handleSearch"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="用户名" v-model="filterForm.uname" clearable @keyup.enter="handleSearch" @clear="handleSearch"></el-input>
          <!--<el-select placeholder="创建用户" v-model="filterForm.createById" clearable @change="getList">
            <el-option :key="item.id" :value="item.id" :label="item.name" v-for="item of pageState.userList"></el-option>
          </el-select>-->
        </el-col>
        <el-col :span="6">
          <el-select class="w-full" placeholder="状态" v-model="filterForm.status" @change="handleSearch">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="已删除"></el-option>
            <el-option :value="2" label="发布"></el-option>
            <el-option :value="3" label="下架"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            class="max-w-full"
            v-model="dateRange"
            type="daterange"
            unlink-panels
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="rangeShortcuts"
          />
        </el-col>
      </el-row>
    </template>

    <template #actions>
      <el-button @click="handleSearch">查询</el-button>
    </template>

    <template #table>
      <el-table border stripe :data="pageState.tableList" height="100%" v-loading="pageState.loading">
        <el-table-column key="seq" type="index" width="60" label="#"></el-table-column>
        <el-table-column key="createBy" label="作者">
          <template #default="{ row }">
            <div class="flex items-center">
              <!--<image :src="IMG_HOST + row.avatar" class="w-[60px] h-[60px] mr-8" />-->
              <el-avatar :src="IMG_HOST + row.createBy?.avatar"></el-avatar>
              <span class="truncate flex-1 ml-3">{{ row.createBy?.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="content" prop="content" label="内容">
          <template #default="{ row }">
            <ExpandedContent :max-length="120" :show-btn="false" :content="row.content"/>
          </template>
        </el-table-column>
        <el-table-column key="launch" label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.deletedAt" type="danger">已删除</el-tag>
            <el-tag v-else-if="row.launch" type="success">已发布</el-tag>
            <el-tag v-else type="info">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="operateAt" label="发布/下架时间">
          <template #default="{ row }">
            <div>{{dayjs(row.operateAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <!--<el-table-column key="updateTime" label="更新时间">
          <template #default="{ row }">
            <div>{{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>-->
        <el-table-column key="createTime" label="创建时间">
          <template #default="{ row }">
            <div>{{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column key="deletedAt" label="删除时间">
          <template #default="{ row }">
            <div v-if="row.deletedAt">{{dayjs(row.deletedAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column key="operate" label="操作" min-width="120">
          <template #default="{ row }">
            <el-button @click="operateItem(row.id, 0)" link type="warning" v-if="row.launch && !row.deletedAt">下架</el-button>
            <!--<el-button @click="operateItem(row.id, 1)" link type="success" v-else>发布</el-button>-->
            <el-button @click="viewItem(row.id)" link type="primary">查看</el-button>
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
import ExpandedContent from '@/components/expandable_content.vue'
import $http, { urls, IMG_HOST } from "@/http";
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
const dateRange = ref([])
const filterForm = reactive({
  keyword: '',
  uname: '',
  startTime: '',
  endTime: '',
  status: 0,
  page: 1,
  pageSize: 20
})
const rangeShortcuts = [
  {
    text: '昨天',
    value: () => {
      const start = dayjs().subtract(1, 'd').startOf('date').valueOf()
      const end = dayjs().startOf('date').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上周',
    value: () => {
      const start = dayjs().subtract(1, 'w').startOf('w').valueOf()
      const end = dayjs().subtract(1, 'w').endOf('w').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上个月',
    value: () => {
      const start = dayjs().subtract(1, 'M').startOf('M').valueOf()
      const end = dayjs().subtract(1, 'M').endOf('M').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '今年',
    value: () => {
      const start = dayjs().startOf('y').valueOf()
      const end = dayjs().valueOf()
      return [start, end] as const
    }
  }
]

getList()
getAllUser()

function handleSearch(){
  [filterForm.startTime, filterForm.endTime] = dateRange.value
  getList()
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
