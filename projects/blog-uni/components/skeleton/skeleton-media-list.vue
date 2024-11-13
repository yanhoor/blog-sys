<template>
  <view class="list-container">
    <view v-for="i in 20" :key="i" class="item">
      <view class="item-container">
        <SkeletonBase class="media" size="100%" />
      </view>
    </view>
  </view>
</template>

<script>
import SkeletonBase from '@/components/skeleton/skeleton-base.vue'

export default {
  name: 'SkeletonMediaList',
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
  flex-wrap: wrap;
  padding-bottom: 20rpx;
  margin-top: -8rpx;
  margin-left: -8rpx;
}

.item {
  width: calc(100% / 3);
  padding-top: 8rpx;
  padding-left: 8rpx;
  box-sizing: border-box;

  .item-container {
    position: relative;
    width: 100%;
    padding-top: 100%;

    .media {
      border-radius: 10rpx;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
