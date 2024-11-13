<template>
  <view>
    <uni-popup
      ref="menuPopupRef"
      type="bottom"
      background-color="#fff"
      :safe-area="safeArea"
      @mask-click="$emit('update:modelValue', false)"
    >
      <uni-list v-if="modelValue" class="menu-list">
        <uni-list-item
          v-if="post && post.createById === myInfo?.id"
          clickable
          @click.stop="handleDelete"
        >
          <template #body>
            <view class="action-sheet-text red">删除</view>
          </template>
        </uni-list-item>
        <uni-list-item clickable @click.stop="handleCopyContent">
          <template #body>
            <view class="action-sheet-text">复制内容</view>
          </template>
        </uni-list-item>
        <uni-list-item clickable @click.stop="handleCopyLink">
          <template #body>
            <view class="action-sheet-text">复制链接</view>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-popup>
  </view>
</template>

<script>
import Http, { urls } from '@/http'
import { mapState, mapActions } from 'pinia'
import { useMyInfoStore } from '@/stores/userInfo.js'

export default {
  props: {
    modelValue: Boolean,
    // safeArea: {
    // 	type: Boolean,
    // 	default: true
    // },
    post: Object
  },
  emits: ['update:modelValue', 'delete'],
  data() {
    return {
      urls,
      safeArea: false
    }
  },
  computed: {
    ...mapState(useMyInfoStore, ['myInfo'])
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.handleShowMenu()
      } else {
        this.$refs.menuPopupRef.close()
      }
    }
  },
  created() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const isTabarPage = [
      '/index',
      '/search',
      '/new-post',
      '/notification',
      '/me'
    ].some((i) => currentPage.route.includes(i))
    this.safeArea = !isTabarPage
  },
  methods: {
    handleShowMenu() {
      this.$refs.menuPopupRef.open()
    },
    handleCopyLink() {
      uni.setClipboardData({
        data: 'https://niubility.website/blog/post/' + this.post.id,
        success: () => {
          uni.showToast({
            title: '已复制'
          })
        },
        complete: () => {
          this.$emit('update:modelValue', false)
        }
      })
    },
    handleCopyContent() {
      uni.setClipboardData({
        data: this.post.content,
        success: () => {
          uni.showToast({
            title: '已复制'
          })
        },
        complete: () => {
          this.$emit('update:modelValue', false)
        }
      })
    },
    handleDelete() {
      uni.showModal({
        title: '提示',
        confirmColor: '#e43d33',
        content: '确定删除吗',
        success: async (res) => {
          if (res.confirm) {
            try {
              const { success, result, msg } = await Http.post(
                urls.blog_delete,
                {
                  id: this.post.id
                }
              )
              if (success) {
                this.$emit('update:modelValue', false)
                uni.showToast({
                  title: '已删除'
                })
                this.$emit('delete')
              }
            } catch (e) {}
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
