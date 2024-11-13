<template>
  <view class="post-address">
    <view
      v-if="address.addressName"
      class="address-container"
      @click="handleToMapPage"
    >
      <uni-icons type="location" />
      <view class="address-name text-ellipsis">
        {{ address.addressName }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PostAddress',
  props: {
    address: Object
  },
  data() {
    return {}
  },
  methods: {
    handleToMapPage() {
      uni.navigateTo({
        url: `/pages/map/map?latitude=${this.address.latitude}&longitude=${this.address.longitude}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-address {
  max-width: 60%;
  box-sizing: border-box;
  display: flex;
}
.address-container {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 2rpx 16rpx;
  border-radius: 20rpx;
  background-color: #f0f0f0;

  .address-name {
    font-size: 12px;
    color: $uni-base-color;
  }
}
</style>
