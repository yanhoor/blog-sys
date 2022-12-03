<template>
  <h3>{{ $route.params.fr }} - {{ $route.params.id }}</h3>
</template>

<script setup>
const route = useRoute()
console.log('=============', route.params) // 这样可以获取到路由参数 fr 和 id
</script>
