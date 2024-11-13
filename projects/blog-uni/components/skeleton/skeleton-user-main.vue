<template>
  <view>
    <uni-card margin="5px">
      <view class="top-container">
        <SkeletonBase width="100%" height="200" />
        <view class="user-container">
          <SkeletonBase round size="52" />
          <SkeletonBase width="130" />
        </view>

        <view class="stats-container">
          <view class="stats-item">
            <SkeletonBase width="60" />
            <SkeletonBase width="80" />
          </view>
          <view class="stats-item">
            <SkeletonBase width="60" />
            <SkeletonBase width="80" />
          </view>
          <view class="stats-item">
            <SkeletonBase width="60" />
            <SkeletonBase width="80" />
          </view>
          <view class="stats-item">
            <SkeletonBase width="60" />
            <SkeletonBase width="80" />
          </view>
        </view>
      </view>
    </uni-card>

    <uni-card margin="5px">
      <view class="image-container">
        <SkeletonBase width="60" height="60" />
        <SkeletonBase width="60" height="60" />
        <SkeletonBase width="60" height="60" />
        <SkeletonBase width="60" height="60" />
        <SkeletonBase width="60" height="60" />
      </view>
    </uni-card>
  </view>
</template>

<script>
import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

export default {
  name: 'SkeletonUserMain',
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
.top-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.user-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.stats-container {
  display: flex;
  justify-content: space-between;

  .stats-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }
}

.image-container {
  display: flex;
  justify-content: space-between;
}
</style>
