<template>
  <view class="post-list">
    <YAppendListWrapper
      v-model="pageList"
      :page-url="pageUrl"
      :url="url"
      :search-params="searchParams"
      @fetch-end="$emit('fetch-end', $event)"
    >
      <PostItem
        v-for="post in pageList"
        :key="post.id"
        :post="post"
        @action-click="handlePostAction(post)"
      />
      <SkeletonPostList v-if="showSkeleton" #skeleton />
    </YAppendListWrapper>
    <PostActions
      v-model="showAction"
      :post="operationItem"
      @delete="handlePostDelete"
    />
  </view>
</template>

<script>
import PostItem from './post-item.vue'
import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
import SkeletonPostList from '@/components/skeleton/skeleton-post-list.vue'
import PostActions from '@/components/post/post-actions.vue'
import Http, { urls } from '@/http'

export default {
  name: 'PostList',
  components: {
    YAppendListWrapper,
    SkeletonPostList,
    PostItem,
    PostActions
  },
  props: {
    pageUrl: String,
    searchParams: Object,
    showSkeleton: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: urls.blog_list
    }
  },
  emits: ['fetch-end'],
  data() {
    return {
      urls,
      pageList: [],
      showAction: false,
      operationItem: null
    }
  },
  created() {
    // console.log('++++++created+++++++')
  },
  methods: {
    handlePostAction(post) {
      this.operationItem = post
      this.showAction = true
    },
    handlePostDelete() {
      const idx = this.pageList.indexOf(this.operationItem)
      this.pageList.splice(idx, 1)
    }
  }
}
</script>

<style></style>
