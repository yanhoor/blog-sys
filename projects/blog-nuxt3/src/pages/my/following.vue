<template>
  <div>
    <el-card>
      <UserList
        url="/user/friends"
        :search-params="{ relateType: 1, uid: myInfo?.id }"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
const myInfo = useUserInfo()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的全部关注`
  }
})
</script>
