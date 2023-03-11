<template>
  <div class="list-page-wrapper">
    <div class="filter-wrapper">
      <slot name="filter"></slot>
    </div>
    <div class="filter-actions">
      <slot name="actions"></slot>
    </div>
    <div class="list-table-container">
      <div class="vxe-table-container">
        <slot name="table"></slot>
      </div>
      <div class="flex justify-end mt-12">
        <slot name="tablePagination"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.list-page-wrapper{
  @apply flex flex-col h-full;
  .filter-actions{
    @apply my-[12px];
  }
  .list-table-container{
    @apply flex flex-col flex-1 overflow-hidden;
    .vxe-table-container{
      @apply flex-1 overflow-hidden;
    }
  }
}
</style>
