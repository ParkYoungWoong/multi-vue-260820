<script setup lang="ts">
import TheButton from '@/components/TheButton.vue'
import TextField from '@/components/TextField.vue'
import TheModal from '@/components/TheModal.vue'
import { ref } from 'vue'

const inputText = ref('ABC!')
</script>

<template>
  <h1>Home Page! ({{ inputText }})</h1>
  <TextField v-model="inputText" />
  <TheButton
    variant="secondary"
    message="취소 버튼입니다!"
    @xyz="console.log('취소!')"
    @hello="console.log('Hello!')">
    취소
  </TheButton>
  <TheButton variant="primary">확인</TheButton>
  <TheButton variant="danger">삭제</TheButton>
  <TheModal>
    <template #two>
      <li>2</li>
    </template>
    <template #three>
      <li>3</li>
    </template>
    <template #one="{ abc }">
      <li>1 ({{ abc }})</li>
    </template>
  </TheModal>
</template>
