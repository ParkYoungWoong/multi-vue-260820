<script setup lang="ts">
import { ref, watch } from 'vue'

const count = ref(1) // 금액
const double = ref(0)
// const double = computed(async () => count.value * 2) // 항상 count의 2배!

const user = ref({
  name: 'HEROPY',
  age: 22,
  address: {
    emails: ['abc@gmail.com']
  }
})

// async function fetchUsers() {
//   const res = await fetch('')
//   const data = await res.json()
//   user.value = data
//   userEmails.value = data.map(user => user.address.emails[0])
// }

const unwatch = watch(
  [user],
  () => {
    console.log('user가 변경되었습니다.', user.value)
  },
  {
    deep: true
  }
)
</script>

<template>
  <h1>{{ count }} / {{ double }}</h1>
  <button @click="count += 1">증가</button>
  <button @click="count -= 1">감소</button>

  <button @click="user.address.emails[0] = 'xyz@gmail.com'">변경</button>
  <button @click="unwatch">감시 종료!</button>
</template>

<style scoped></style>
