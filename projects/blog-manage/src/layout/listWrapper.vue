<template>
  <div class="list-page-wrapper">
    <div class="filter-wrapper">
      <slot name="filter" />
    </div>
    <div class="filter-actions">
      <slot name="actions" />
    </div>
    <div class="list-table-container">
      <div class="vxe-table-container">
        <slot name="table" />
      </div>
      <div class="mt-12 flex justify-end">
        <slot name="tablePagination" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss" scoped>
.list-page-wrapper {
  @apply flex h-full flex-col;
  .filter-actions {
    @apply my-[12px];
  }
  .list-table-container {
    @apply flex flex-1 flex-col overflow-hidden;
    .vxe-table-container {
      @apply flex-1 overflow-hidden;
    }
  }
}
</style>
