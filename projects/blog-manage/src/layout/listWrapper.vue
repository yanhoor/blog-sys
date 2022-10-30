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
      <div class="list-pagination-container">
        <slot name="tablePagination"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.list-page-wrapper{
  display: flex;
  flex-direction: column;
  height: 100%;
  .filter-actions{
    margin: 12px 0;
  }
  .list-table-container{
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    .vxe-table-container{
      flex: 1;
    }
    .list-pagination-container{
      display: flex;
      justify-content: end;
      margin-top: var(--module-spacing);
    }
  }
}
</style>
