<script setup lang="ts">
import { ref } from 'vue'
import TextField from '@/components/TextField.vue'
import TheButton from '@/components/TheButton.vue'

const idMessage = ref('')

function signIn(event: SubmitEvent) {
  const formData = new FormData(event.target as HTMLFormElement)
  const id = formData.get('id') as string
  const pw = formData.get('pw') as string
  if (id !== null && !id.trim()) idMessage.value = '아이디가 필수입니다!'
  if (id) idMessage.value = ''
  console.log(id, pw)
}
</script>

<template>
  <form @submit.prevent="signIn">
    <TextField
      name="id"
      :message="idMessage" />
    <TextField name="pw" />
    <TheButton>로그인</TheButton>
  </form>
</template>

<style scoped></style>
