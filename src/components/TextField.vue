<script setup lang="ts">
// import { ref } from 'vue'

interface Props {
  message?: string
}

const { message = '' } = defineProps<Props>()
// const emit = defineEmits(['update:modelValue'])
const abc = defineModel<string>()
</script>

<template>
  <label>
    <input
      v-model="abc"
      type="text" />
    <span>{{ message }}</span>
  </label>
</template>

<style scoped></style>
