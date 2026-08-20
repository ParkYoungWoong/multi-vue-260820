import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
  state: () => {
    return {
      count: 1 // const count = ref(1)
    }
  },
  getters: {
    double: function (): number {
      return this.count * 2 // const double = computed(() => count.value * 2)
    }
  },
  actions: {
    increase() {
      this.count += 1
    },
    decrease() {
      this.count -= 1
    }
  }
})
