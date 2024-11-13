<template>
  <view>
    <YAppendListWrapper
      v-model="userList"
      :page-url="pageUrl"
      :url="url"
      :search-params="searchParams"
    >
      <template #skeleton>
        <SkeletonUserList />
      </template>
      <view class="item-container">
        <view v-for="user in userList" :key="user.id" class="user-item">
          <view class="item-left">
            <UserAvatar :user="user" :size="36" />
            <view class="name-container">
              <UserName font-size="16" :user="user" />
              <YExpandanleContent
                :content="user.introduce"
                :max-length="30"
                :show-btn="false"
              />
              <view class="fans-count"> 粉丝：{{ user.followerCount }} </view>
            </view>
          </view>
          <view class="item-right">
            <UserBtn :user="user" />
          </view>
        </view>
      </view>
    </YAppendListWrapper>
  </view>
</template>

<script>
import YAppendListWrapper from '@/components/y-append-list-wrapper.vue'
import UserBtn from '@/components/user/user-btn.vue'
import YExpandanleContent from '@/components/y-expandable-content.vue'
import SkeletonUserList from '@/components/skeleton/skeleton-user-list.vue'

export default {
  name: 'UserList',
  components: {
    YAppendListWrapper,
    UserBtn,
    YExpandanleContent,
    SkeletonUserList
  },
  props: {
    pageUrl: String,
    url: String,
    searchParams: Object
  },
  data() {
    return {
      userList: []
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.item-container {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 20rpx;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & + .user-item {
    border-top: 1px solid $uni-border-2;
    padding-top: 8rpx;
  }

  .item-left {
    flex: 1;
    display: flex;
    gap: 8rpx;
    align-items: center;

    .name-container {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
