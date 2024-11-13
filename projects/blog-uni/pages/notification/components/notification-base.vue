<template>
  <view>
    <YAppendListWrapper
      page-url="pages/notification"
      :url="urls.notification_list"
      :search-params="searchParams"
      :model-value="modelValue"
      @update:model-value="handleListChange"
    >
      <template #skeleton>
        <SkeletonNotificationList />
      </template>
      <slot />
    </YAppendListWrapper>
  </view>
</template>

<script>
import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
import YExpandanleContent from '@/components/y-expandable-content.vue'
import YTime from '@/components/y-time.vue'
import UserAvatar from '@/components/user/user-avatar.vue'
import SkeletonNotificationList from '@/components/skeleton/skeleton-notification-list.vue'
import Http, { urls } from '@/http'
import { useMyInfoStore } from '@/stores/userInfo.js'

export default {
  name: 'NotificationBase',
  components: {
    YAppendListWrapper,
    YExpandanleContent,
    YTime,
    UserAvatar,
    SkeletonNotificationList
  },
  props: {
    modelValue: Array,
    type: Number // 1 -- 评论，2--点赞，3--收藏
  },
  emits: ['update:modelValue'],
  data() {
    return {
      urls
    }
  },
  computed: {
    searchParams() {
      const result = {
        isRead: 3
      }
      if (this.type === 1) {
        result.type = 'comment,comment_reply'
      }
      if (this.type === 2) {
        result.type = 'like_blog'
      }
      if (this.type === 3) {
        result.type = 'collect_blog'
      }
      if (this.type === 4) {
        result.type = 'system_audit'
      }
      return result
    }
  },
  created() {
    this.handleSetAllRead()
  },
  beforeUnmount() {
    console.log('+++++++beforeUnmount+++++++')
  },
  mounted() {
    uni.startPullDownRefresh()
  },
  methods: {
    handleListChange(v) {
      // console.log('++++++++notification-base handleListChange++++++++++++', v)
      this.$emit('update:modelValue', v)
    },
    async handleSetAllRead() {
      try {
        const { success, result, msg } = await Http.post(
          urls.notification_read,
          { isAll: 1, type: this.searchParams.type }
        )
        if (success) {
          const store = useMyInfoStore()
          store.getNotificationCount()
        }
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped></style>
