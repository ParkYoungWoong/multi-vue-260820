<script setup lang="ts">
import { ref } from 'vue'

export interface ResponseData {
  Search: Movie[]
  totalResults: string
  Response: string
}
export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

const movies = ref<Movie[]>([])
const searchText = ref('spider')

async function fetchMovies() {
  const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&s=${searchText.value}`)
  const data = (await res.json()) as ResponseData
  movies.value = data.Search
}
</script>

<template>
  <div>
    <form @submit.prevent>
      <input
        ref="inputRef"
        v-model="searchText"
        type="text"
        @keydown.enter="fetchMovies" />
      <button
        type="submit"
        @click="fetchMovies">
        검색
      </button>
    </form>
    <ul>
      <li
        v-for="(movie, index) in movies"
        :key="movie.imdbID">
        {{ index + 1 }}: {{ movie.Title }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
