import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movie', {
  state: () => {
    return {
      movies: [],
      searchText: 'spider'
    }
  },
  getters: {},
  actions: {
    fetchMovies() {}
  }
})
