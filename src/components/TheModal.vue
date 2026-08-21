<script setup lang="ts">
// import { ref } from 'vue'
</script>

<template>
  <ul>
    <slot
      name="one"
      :abc="123"></slot>
    <slot name="two"></slot>
    <slot name="three"></slot>
  </ul>
</template>

<style scoped></style>
