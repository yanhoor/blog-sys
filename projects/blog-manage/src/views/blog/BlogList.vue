<template>
  <ListWrapper>
    <template #filter>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            placeholder="内容"
            v-model="filterForm.keyword"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="用户名"
            v-model="filterForm.uname"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            class="w-full"
            placeholder="状态"
            v-model="filterForm.status"
            @change="handleSearch"
          >
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="未审核"></el-option>
            <el-option :value="2" label="审核通过"></el-option>
            <el-option :value="3" label="审核不通过"></el-option>
            <el-option :value="4" label="删除"></el-option>
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
            :shortcuts="dateRangeShortcuts"
            :disabled-date="(date) => date.getTime() > Date.now()"
          />
        </el-col>
      </el-row>
    </template>

    <template #actions>
      <el-button @click="handleSearch">查询</el-button>
    </template>

    <template #table>
      <el-table
        border
        stripe
        :data="pageList"
        height="100%"
        v-loading="listLoading"
      >
        <el-table-column
          key="seq"
          type="index"
          width="60"
          label="#"
        ></el-table-column>
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
            <ExpandedContent
              :max-length="120"
              :show-btn="false"
              :content="row.content"
            />
          </template>
        </el-table-column>
        <el-table-column key="status" label="状态">
          <template #default="{ row }">
            <div class="flex gap-[6px]">
              <el-tag v-if="row.deletedAt" type="danger">已删除</el-tag>
              <el-tag v-if="row.auditStatus === 0" type="info">未审核</el-tag>
              <el-tag v-else-if="row.auditStatus === 1" type="success"
                >审核通过</el-tag
              >
              <el-tag v-else-if="row.auditStatus === 2" type="warning"
                >审核不通过</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column key="auditTip" label="审核意见">
          <template #default="{ row }">
            <div>{{ row.auditTip }}</div>
          </template>
        </el-table-column>
        <el-table-column key="auditedAt" label="审核时间">
          <template #default="{ row }">
            <div v-if="row.auditedAt">
              {{ dayjs(row.auditedAt).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column key="createTime" label="创建时间">
          <template #default="{ row }">
            <div>{{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
        </el-table-column>
        <el-table-column key="deletedAt" label="删除时间">
          <template #default="{ row }">
            <div v-if="row.deletedAt">
              {{ dayjs(row.deletedAt).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column key="operate" label="操作" min-width="120">
          <template #default="{ row }">
            <el-button
              @click="handleAudit(row.id, 1)"
              link
              type="success"
              v-if="!row.deletedAt && row.auditStatus !== 1"
              >审核通过</el-button
            >
            <el-button
              @click="handleAudit(row.id, 2)"
              link
              type="warning"
              v-if="!row.deletedAt && row.auditStatus !== 2"
              >审核不通过</el-button
            >
            <el-button @click="viewItem(row.id)" link type="primary"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #tablePagination>
      <el-pagination
        v-model:currentPage="pageFetchParams.page"
        v-model:page-size="pageFetchParams.pageSize"
        :page-sizes="pageState.pageSizeList"
        :background="true"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="(v) => handleChangeFetchParams({ pageSize: v })"
      />
    </template>
  </ListWrapper>

  <el-dialog v-model="showAudit" title="审核" width="300px">
    <el-form label-position="top">
      <el-form-item label="审核意见">
        <el-input v-model="auditForm.auditTip"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-[6px]">
        <el-button @click="showAudit = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirmAudit"
          :loading="auditLoading"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import ListWrapper from '@/layout/listWrapper.vue'
import ExpandedContent from '@/components/expandable_content.vue'
import $http, { urls, IMG_HOST } from '@/http'
import useListFetch from '@/composables/useListFetch'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import dateRangeShortcuts from '@/utils/dateRangeShortcuts'

const router = useRouter()
const pageState = reactive({
  pageSizeList: [20, 50, 100, 200]
})
const dateRange = ref([])
const showAudit = ref(false)
const auditLoading = ref(false)
const auditForm = ref({
  auditTip: '',
  type: 0,
  id: 0
})
const filterForm = reactive({
  keyword: '',
  uname: '',
  startTime: '',
  endTime: '',
  status: 0
})
const {
  pageList,
  pageTotal,
  listLoading,
  pageFetchParams,
  handlePageChange,
  handleChangeFetchParams
} = useListFetch(urls.blog_list, filterForm)

handlePageChange(1)

function handleSearch() {
  ;[filterForm.startTime, filterForm.endTime] = dateRange.value || []
  handleChangeFetchParams(filterForm)
}

async function viewItem(id: string) {
  // window.open(import.meta.env.VITE_BLOG_BASE + '/blog?id=' + id)
  // router.push({
  //   path: '/blogEdit',
  //   query: {
  //     id
  //   }
  // })
}

function handleAudit(id: number, type: number) {
  auditForm.value.id = id
  auditForm.value.type = type
  showAudit.value = true
}

async function handleConfirmAudit() {
  try {
    auditForm.value.auditTip = auditForm.value.auditTip.trim()
    if (auditForm.value.type === 2 && !auditForm.value.auditTip) {
      ElMessage.error('审核意见不能为空')
      return
    }
    auditLoading.value = true
    const { success, msg } = await $http.post(urls.blog_audit, auditForm.value)
    auditLoading.value = false
    if (success) {
      ElMessage.success('操作成功')
      showAudit.value = false
      auditForm.value.auditTip = ''
      handlePageChange(1)
    } else {
      ElMessage.error('操作失败')
    }
  } catch (e) {
    auditLoading.value = false
  }
}
</script>
