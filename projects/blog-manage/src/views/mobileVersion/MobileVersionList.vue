<template>
  <ListWrapper>
    <template #filter> </template>
    <template #actions> </template>
    <template #table> </template>
    <template #tablePagination> </template>
  </ListWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useListFetch from '@/composables/useListFetch'
import { urls } from '@/http'
import ListWrapper from '@/layout/listWrapper.vue'
import ExpandedContent from '@/components/expandable_content.vue'

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
</script>
