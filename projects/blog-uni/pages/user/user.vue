<template>
  <view>
    <UserMain v-if="userId" ref="userMainRef" :user-id="userId" />
    <view v-else class="user-page-empty" />
  </view>
</template>

<script>
import UserMain from './components/user-main.vue'

export default {
  components: {
    UserMain
  },
  data() {
    return {
      userId: ''
    }
  },
  onLoad(params) {
    this.userId = Number(params.id)
  },
  onPullDownRefresh() {
    this.$refs.userMainRef.initPage()
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
