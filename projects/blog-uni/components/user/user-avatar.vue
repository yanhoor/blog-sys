<template>
  <image
    v-if="user.avatar"
    class="user-avatar"
    :style="{ width: size + 'px', height: size + 'px' }"
    :src="imageHost + user.avatar"
    @click.stop="handleToUserPage"
  />
  <uni-icons
    v-else
    type="contact"
    :size="size"
    color="#8f939c"
    @click.stop="handleToUserPage"
  />
</template>

<script>
import { imageHost } from '@/config/index.js'
import { mapState, mapActions } from 'pinia'
import { useMyInfoStore } from '@/stores/userInfo.js'

export default {
  name: 'UserAvatar',
  props: {
    user: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 52
    }
  },
  data() {
    return {
      imageHost
    }
  },
  computed: {
    ...mapState(useMyInfoStore, ['myInfo'])
  },
  methods: {
    handleToUserPage() {
      if (this.disabled) return

      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]

      // console.log('------32323------------', currentPage.$vm.$data.userId)
      if (currentPage.$vm.$data.userId === this.user.id) return

      uni.navigateTo({
        url: '/pages/user/user?id=' + this.user.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-avatar {
  border-radius: 50%;
}
</style>
