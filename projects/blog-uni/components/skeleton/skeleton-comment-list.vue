<template>
  <view class="list-container">
    <view v-for="i in 20" :key="i" class="item">
      <SkeletonBase round size="52" />
      <view class="item-mid">
        <SkeletonBase width="100%" />
        <SkeletonBase width="100%" />
        <SkeletonBase width="60%" />
      </view>
    </view>
  </view>
</template>

<script>
import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

export default {
  name: 'SkeletonCommentList',
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
  align-items: center;
  gap: 20rpx;

  .item-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
}
</style>
