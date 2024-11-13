<template>
  <view>
    <PostList
      :page-url="pageUrl"
      :url="urls.user_markBlogList"
      :search-params="{ type: 1 }"
    />
  </view>
</template>

<script>
import PostList from '@/components/post/post-list.vue'
import scrollMixin from '@/mixins/scrollMixin.js'
import { useScrollStatusStore } from '@/stores/scrollStatus.js'
import Http, { urls } from '@/http'

export default {
  components: {
    PostList
  },
  mixins: [scrollMixin],
  data() {
    return {
      pageUrl: '/pages/my-like',
      urls
    }
  },
  onLoad(params) {
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    const s = useScrollStatusStore()
    s.setPullDownRefresh(this.pageUrl)
  }
}
</script>

<style lang="scss"></style>
