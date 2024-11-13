<template>
  <view>
    <uni-card margin="5px" spacing="0">
      <Userlist
        :page-url="pageUrl"
        :url="urls.user_friends"
        :search-params="{ uid: userId, relateType: 1 }"
      />
    </uni-card>
  </view>
</template>

<script>
import Userlist from '@/components/user/user-list.vue'
import scrollMixin from '@/mixins/scrollMixin.js'
import { useScrollStatusStore } from '@/stores/scrollStatus.js'
import Http, { urls } from '@/http'

export default {
  components: {
    Userlist
  },
  mixins: [scrollMixin],
  data() {
    return {
      pageUrl: '/pages/followings',
      userId: '',
      urls
    }
  },
  onLoad(params) {
    this.userId = params.userId
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    const s = useScrollStatusStore()
    s.setPullDownRefresh(this.pageUrl)
  }
}
</script>

<style lang="scss"></style>
