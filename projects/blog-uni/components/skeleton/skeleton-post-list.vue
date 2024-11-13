<template>
  <view>
    <uni-card v-for="i in 20" :key="i" margin="5">
      <view class="post-top">
        <SkeletonBase round size="48" />
        <view class="post-user">
          <SkeletonBase width="130" />
          <SkeletonBase width="180" />
        </view>
      </view>
      <view class="content">
        <SkeletonBase />
        <SkeletonBase />
        <SkeletonBase />
        <SkeletonBase width="80%" />
      </view>
    </uni-card>
  </view>
</template>

<script>
import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

export default {
  name: 'SkeletonPostList',
  components: {
    SkeletonBase
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.post-top {
  display: flex;
  align-items: center;
  gap: 20rpx;

  .post-user {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}
</style>
