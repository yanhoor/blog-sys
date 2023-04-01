<template>
  <div>
    <PostList url="/user/markBlogList" :search-params="{ type: 2 }" />
  </div>
</template>

<script setup lang="ts">
const myInfo = useUserInfo()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的全部收藏`
  }
})
</script>
