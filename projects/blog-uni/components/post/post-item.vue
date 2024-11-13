<template>
  <uni-card margin="5px" spacing="0" class="card">
    <view class="content-wrapper">
      <view class="post-top">
        <UserAvatar :user="post.createBy" :size="42" />
        <view class="item-user">
          <UserName font-size="18" :user="post.createBy" />
          <YTime class="item-time" :time="post.createdAt" />
        </view>
      </view>
      <YExpandanleContent
        class="post-content"
        :content="post.content"
        @tap="handleClickPost"
      />
      <MediaList
        class="media-list"
        :list="post.medias"
        :max-count="9"
        @space-click="handleClickPost"
      />
      <PostAddress :address="post" />
      <view class="action-container">
        <view class="action-item" @click="handleLike">
          <uni-icons
            v-if="post.isLike"
            class="action-icon"
            type="hand-up-filled"
            size="20"
            color="#18a058"
          />
          <uni-icons
            v-else
            class="action-icon"
            type="hand-up"
            size="20"
            color="#6B7280"
          />
          <view class="action-num">
            {{ post.likedByCount }}
          </view>
        </view>
        <view class="action-item" @click="handleClickPost">
          <uni-icons
            class="action-icon"
            type="chatbubble"
            size="20"
            color="#6B7280"
          />
          <view class="action-num">
            {{ post.commentsCount }}
          </view>
        </view>
        <view class="action-item" @click="handleCollect">
          <uni-icons
            v-if="post.isCollect"
            class="action-icon"
            type="star-filled"
            size="20"
            color="#18a058"
          />
          <uni-icons
            v-else
            class="action-icon"
            type="star"
            size="20"
            color="#6B7280"
          />
          <view class="action-num">
            {{ post.collectedByCount }}
          </view>
        </view>
        <view class="action-item" @click.stop="$emit('action-click')">
          <uni-icons
            class="action-icon"
            type="more-filled"
            size="20"
            color="#6B7280"
          />
        </view>
      </view>
    </view>
  </uni-card>
</template>

<script>
import YTime from '@/components/y-time.vue'
import YExpandanleContent from '@/components/y-expandable-content.vue'
import MediaList from '@/components/media/media-list.vue'
import PostAddress from '@/components/post/post-address.vue'
import Http, { urls } from '@/http'

export default {
  name: 'PostItem',
  components: {
    YTime,
    YExpandanleContent,
    MediaList,
    PostAddress
  },
  props: {
    post: Object
  },
  emits: ['action-click'],
  data() {
    return {}
  },
  created() {
    // console.log('+++++++post-item created++++++++++', getCurrentPages())
  },
  methods: {
    async handleLike() {
      try {
        const { success, result, msg } = await Http.post(urls.blog_like, {
          isLike: this.post.isLike ? 0 : 1,
          id: this.post.id
        })
        if (success) {
          this.post.isLike = !this.post.isLike
          this.post.isLike ? this.post.likedByCount++ : this.post.likedByCount--
        }
      } catch (e) {}
    },
    async handleCollect() {
      try {
        const { success, result, msg } = await Http.post(urls.blog_collect, {
          isCollect: this.post.isCollect ? 0 : 1,
          id: this.post.id
        })
        if (success) {
          this.post.isCollect = !this.post.isCollect
          this.post.isCollect
            ? this.post.collectedByCount++
            : this.post.collectedByCount--
        }
      } catch (e) {}
    },
    handleClickPost() {
      // console.log('=++======handleClickPost==========')
      uni.navigateTo({
        url: '/pages/post/post?id=' + this.post.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  ::v-deep .uni-card {
    padding: 0;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.post-item {
  display: flex;
}

.post-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .item-user {
    margin-left: 20rpx;

    .item-time {
      color: #6b7280;
    }
  }
}

.post-content {
  ::v-deep {
    color: $uni-main-color;
  }
}

.media-list {
  display: flex;
  justify-content: center;
}

.action-container {
  display: flex;

  .action-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .action-icon {
      display: flex;
    }

    .action-num {
      font-size: 18px;
    }
  }
}
</style>
