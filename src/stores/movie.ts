import { defineStore } from 'pinia'

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
export interface MovieDetails {
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

export const useMovieStore = defineStore('movie', {
  state: () => {
    return {
      currentMovie: null as MovieDetails | null,
      isLoadingForMovie: true,
      movies: [] as Movie[],
      searchText: 'spider'
    }
  },
  getters: {},
  actions: {
    // fetchMovies: async () => {}, // !==
    // fetchMovies: async function () {}, // ===
    async fetchMovies(event: KeyboardEvent | MouseEvent) {
      if (event instanceof KeyboardEvent && event.isComposing) return
      const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&s=${this.searchText}`)
      const data = (await res.json()) as ResponseData
      this.movies = data.Search
    },
    async fetchMovie(movieId: string) {
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&i=${movieId}`)
      const data = (await res.json()) as MovieDetails
      this.currentMovie = data
      this.isLoadingForMovie = false
    }
  }
})
