import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup Store 방식
export const useCountStore = defineStore('count', () => {
  const count = ref(1)
  const double = computed(() => count.value * 2)
  function increase() {
    count.value += 1
  }
  function decrease() {
    count.value -= 1
  }
  return {
    count,
    double,
    increase,
    decrease
  }
})
