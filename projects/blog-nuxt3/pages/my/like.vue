<template>
  <div>
    <PostList url="/user/markBlogList" :search-params="{ type: 1 }"/>
  </div>
</template>

<script setup lang="ts">

const myInfo = useUserInfo()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的全部点赞`
  }
})
</script>
