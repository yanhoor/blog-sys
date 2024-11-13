<template>
  <view>
    <YAppendListWrapper
      v-model="pageList"
      :page-url="pageUrl"
      :url="urls.user_myCommentList"
    >
      <uni-card
        v-for="comment in pageList"
        :key="comment.id"
        margin="5px"
        spacing="0"
      >
        <view class="item-container">
          <view class="item-top">
            <template v-if="comment.replyTo">
              我回复了
              <UserName
                :user="comment.replyTo"
                :text="'@' + comment.replyTo.name"
              />的评论:
            </template>
            <template v-else> 我评论了: </template>
          </view>
          <YExpandanleContent class="item-content" :content="comment.content" />
          <view
            v-if="comment.blog.deletedAt"
            class="reply-content blog-is-delete"
          >
            博客已经被删除
          </view>
          <YExpandanleContent
            v-else
            class="reply-content"
            :max-length="80"
            :show-btn="false"
            :content="comment.blog.content"
            @tap="handleClickPost(comment.blog)"
          />
          <view class="item-bottom">
            <YTime class="item-time" :time="comment.createdAt" />
            <uni-icons
              type="trash"
              size="20"
              color="#909399"
              @click="handleDeleteComment(comment.id)"
            />
          </view>
        </view>
      </uni-card>
      <SkeletonNotificationList #skeleton />
    </YAppendListWrapper>
  </view>
</template>

<script>
import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
import YExpandanleContent from '@/components/y-expandable-content.vue'
import SkeletonNotificationList from '@/components/skeleton/skeleton-notification-list.vue'
import YTime from '@/components/y-time.vue'
import scrollMixin from '@/mixins/scrollMixin.js'
import Http, { urls } from '@/http'
import { useScrollStatusStore } from '@/stores/scrollStatus.js'

export default {
  components: {
    YAppendListWrapper,
    YExpandanleContent,
    SkeletonNotificationList,
    YTime
  },
  mixins: [scrollMixin],
  data() {
    return {
      pageUrl: '/pages/my-comment',
      pageList: [],
      urls
    }
  },
  onLoad(params) {
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    const s = useScrollStatusStore()
    s.setPullDownRefresh(this.pageUrl)
  },
  methods: {
    handleClickPost(post) {
      uni.navigateTo({
        url: '/pages/post/post?id=' + post.id
      })
    },
    handleDeleteComment(id) {
      uni.showModal({
        title: '提示',
        confirmColor: '#e43d33',
        content: '确定删除该评论吗，评论下的所有回复也会被删除',
        success: async (res) => {
          if (res.confirm) {
            try {
              const { success, result, msg } = await Http.post(
                urls.comment_delete,
                {
                  id
                }
              )
              if (success) {
                uni.showToast({
                  title: '已删除'
                })
                setTimeout(() => {
                  uni.startPullDownRefresh()
                }, 1000)
              }
            } catch (e) {}
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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

.item-bottom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .item-time {
    font-size: 14px;
    color: $uni-secondary-color;
  }
}
</style>
