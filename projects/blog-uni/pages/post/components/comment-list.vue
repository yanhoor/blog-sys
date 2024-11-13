<template>
  <view>
    <YAppendListWrapper
      v-model="commentList"
      page-url="pages/post/post/2"
      :url="urls.comment_list"
      :search-params="{ blogId }"
    >
      <template #skeleton>
        <SkeletonCommentList />
      </template>

      <view class="list-wrapper">
        <CommentItem
          v-for="comment in commentList"
          :key="comment.id"
          class="comment-item"
          :comment="comment"
          @show-reply="handleShowReply"
        />
      </view>
    </YAppendListWrapper>
    <CommentReplyForm
      v-model:show="showReply"
      :current-reply-item="currentReplyItem"
    />
  </view>
</template>

<script>
import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
import CommentItem from './comment-item.vue'
import CommentReplyForm from '@/components/comment-reply-form.vue'
import SkeletonCommentList from '@/components/skeleton/skeleton-comment-list.vue'
import Http, { urls } from '@/http'

export default {
  name: 'CommentList',
  components: {
    YAppendListWrapper,
    CommentItem,
    CommentReplyForm,
    SkeletonCommentList
  },
  props: {
    blogId: Number
  },
  data() {
    return {
      commentList: [],
      urls,
      currentReplyItem: null,
      showReply: false
    }
  },
  created() {
    console.log('======created======')
  },
  beforeUnmount() {
    console.log('======beforeDestroy======')
  },
  methods: {
    handleShowReply(comment) {
      this.currentReplyItem = comment
      this.showReply = true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.comment-item {
  & + .comment-item {
    border-top: 1px solid $uni-border-2;
    padding-top: 16rpx;
  }
}
</style>
