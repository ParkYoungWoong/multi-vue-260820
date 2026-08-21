<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/movies">Movies</RouterLink>
    <RouterLink to="/count-store">Count</RouterLink>
  </header>
  <RouterView />
</template>
