<template>
  <view class="list-container">
    <uni-card v-for="i in 20" :key="i" margin="5px">
      <view class="item">
        <view class="item-top">
          <SkeletonBase round size="36" />
          <SkeletonBase width="100" />
        </view>
        <view class="item-mid">
          <SkeletonBase width="100%" />
          <SkeletonBase width="100%" />
          <SkeletonBase width="60%" />
        </view>
        <SkeletonBase width="150" />
      </view>
    </uni-card>
  </view>
</template>

<script>
import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

export default {
  name: 'SkeletonNotificationList',
  components: {
    SkeletonBase
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 20rpx;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .item-top {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .item-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
}
</style>
