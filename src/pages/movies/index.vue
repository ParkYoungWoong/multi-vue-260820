<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

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

async function fetchMovies(event: KeyboardEvent | MouseEvent) {
  if (event instanceof KeyboardEvent && event.isComposing) return
  const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&s=${searchText.value}`)
  const data = (await res.json()) as ResponseData
  movies.value = data.Search
}
</script>

<template>
  <div>
    <div>
      <input
        ref="inputRef"
        :value="searchText"
        @input="searchText = ($event.target as HTMLInputElement)?.value"
        @keydown.enter="fetchMovies" />
      <button
        type="submit"
        @click="fetchMovies">
        검색
      </button>
    </div>
    <ul>
      <li
        v-for="(movie, index) in movies"
        :key="movie.imdbID">
        <RouterLink :to="`/movies/${movie.imdbID}`">{{ index + 1 }}: {{ movie.Title }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
