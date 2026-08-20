<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import TheLoader from '@/components/TheLoader.vue'

export interface Movie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Rating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}
export interface Rating {
  Source: string
  Value: string
}

// http://localhost:5173/movies/tt0068646
const route = useRoute()
const movie = ref<Movie | null>(null)
const isLoading = ref(true)

async function fetchMovie() {
  // await new Promise(resolve => setTimeout(resolve, 3000))
  const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&i=${route.params.movieId}`)
  const data = (await res.json()) as Movie
  movie.value = data
  isLoading.value = false
}
fetchMovie()
</script>

<template>
  <TheLoader v-if="isLoading" />
  <template v-if="movie">
    <h1>{{ movie.Title }}</h1>
    <p>{{ movie.Plot }}</p>
    <img
      :src="movie.Poster"
      :alt="movie.Title" />
  </template>
</template>

<style scoped></style>
