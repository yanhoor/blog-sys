<template>
  <view>
    <NotificationBase v-model="pageList" :type="1">
      <uni-card
        v-for="notification in pageList"
        :key="notification.id"
        margin="5px"
      >
        <view class="item-container">
          <view class="item-top">
            <UserAvatar :user="notification.createBy" :size="32" />
            <UserName font-size="16" :user="notification.createBy" />
            <view>评论了您：</view>
          </view>
          <YExpandanleContent
            class="item-content"
            :content="notification.comment.content"
          />

          <YExpandanleContent
            v-if="notification.blog"
            class="reply-content"
            :max-length="80"
            :show-btn="false"
            :content="notification.blog.content"
            @tap="handleClickPost(notification.blog)"
          />
          <view v-else class="reply-content blog-is-delete">
            博客已经被删除
          </view>
          <YTime class="item-time" :time="notification.createdAt" />
        </view>
      </uni-card>
    </NotificationBase>
  </view>
</template>

<script>
import NotificationBase from './notification-base.vue'
import YExpandanleContent from '@/components/y-expandable-content.vue'
import YTime from '@/components/y-time.vue'

export default {
  name: 'NotificationComment',
  components: {
    YExpandanleContent,
    YTime,
    NotificationBase
  },
  data() {
    return {
      pageList: []
    }
  },
  created() {
    // console.log('++++++++notification-comment created++++++++++++', getCurrentPages())
  },
  methods: {
    handleClickPost(post) {
      uni.navigateTo({
        url: '/pages/post/post?id=' + post.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.item-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-content {
  color: $uni-main-color;
  width: 100%;
}

.reply-content {
  width: 100%;
  box-sizing: border-box;
  background-color: #f3f4f6;
  padding: 10px;
  border-radius: 5px;
  &.blog-is-delete {
    color: $uni-error;
  }
}

.item-time {
  font-size: 14px;
  color: $uni-secondary-color;
}
</style>
