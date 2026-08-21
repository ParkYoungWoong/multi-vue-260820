<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TextField from '@/components/TextField.vue'
import TheButton from '@/components/TheButton.vue'

const router = useRouter()
const route = useRoute()
const idMessage = ref('')

function signIn(event: SubmitEvent) {
  const formData = new FormData(event.target as HTMLFormElement)
  const id = formData.get('id') as string
  const pw = formData.get('pw') as string
  if (id !== null && !id.trim()) idMessage.value = '아이디가 필수입니다!'
  if (id) idMessage.value = ''
  if (id.trim() && pw.trim()) {
    // 로그인 완료 가정!
    localStorage.setItem('token', 'qwer1234!')
    const { redirectTo = '' } = route.query || {}
    const to = typeof redirectTo === 'string' && redirectTo.trim() ? redirectTo : '/'
    router.push(to)
  }
}

const currentComponent = ref(TheButton)
</script>

<template>
  <form @submit.prevent="signIn">
    <TextField
      name="id"
      :message="idMessage" />
    <TextField name="pw" />
    <TheButton type="submit">로그인</TheButton>
  </form>
  <!-- <TheButton>테스트 버튼</TheButton> -->
  <Component
    :is="currentComponent"
    type="submit" />
</template>

<style scoped></style>
