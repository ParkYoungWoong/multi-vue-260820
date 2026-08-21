<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  message?: string
}
const { variant = 'secondary', message = '' } = defineProps<Props>()
const emit = defineEmits(['xyz', 'hello'])
</script>

<template>
  <button
    v-bind="$attrs"
    :class="{ [variant]: true }"
    @click="emit('xyz')">
    <slot></slot>
  </button>
  <div
    v-if="message"
    @click="emit('hello')">
    {{ message }}
  </div>
</template>

<style scoped>
button {
  outline: none;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
}
button.primary {
  background-color: #007bff;
  color: #fff;
}
button.secondary {
  background-color: #a5a5a5;
  color: #000;
}
button.danger {
  background-color: #dc3545;
  color: #fff;
}
</style>
