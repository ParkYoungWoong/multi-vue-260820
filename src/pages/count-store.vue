<script setup lang="ts">
// import { ref } from 'vue'
import { useCountStore } from '@/stores/count'

const countStore = useCountStore()
</script>

<template>
  <h1>{{ countStore.count }}</h1>
  <h2>{{ countStore.double }}</h2>
  <button @click="countStore.increase">증가</button>
  <button @click="countStore.decrease">감소</button>
</template>

<style scoped></style>
