<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import '@/styles/material3.css'

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

definePage({
  meta: {
    auth: true
  }
})

const movieStore = useMovieStore()

// 스토어를 건드리지 않고 페이지 안에서만 쓰는 상태
const isSearching = ref(false)
const hasSearched = ref(false)
const errorMessage = ref('')

const movies = computed(() => movieStore.movies ?? [])

async function search(event: KeyboardEvent | MouseEvent) {
  // 한글 입력 조합 중 Enter는 무시(스토어 액션과 동일한 조건)
  if (event instanceof KeyboardEvent && event.isComposing) return
  if (!movieStore.searchText.trim()) return
  // Enter는 keydown 핸들러와 form 기본 제출이 함께 걸릴 수 있어 중복 요청을 막습니다.
  if (isSearching.value) return
  isSearching.value = true
  errorMessage.value = ''
  try {
    await movieStore.fetchMovies(event)
  } catch {
    errorMessage.value = '영화를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSearching.value = false
    hasSearched.value = true
  }
}
</script>

<template>
  <div class="m3 movies">
    <div class="movies__inner">
      <h1 class="m3-headline-medium movies__title">영화 검색</h1>

      <form
        class="search"
        @submit.prevent>
        <label
          class="m3-visually-hidden"
          for="movie-search">
          영화 제목
        </label>
        <div class="search__field">
          <span
            class="m3-icon search__leading"
            aria-hidden="true">
            search
          </span>
          <input
            id="movie-search"
            ref="inputRef"
            class="search__input"
            type="search"
            placeholder="제목으로 검색"
            autocomplete="off"
            :value="movieStore.searchText"
            @input="movieStore.searchText = ($event.target as HTMLInputElement)?.value"
            @keydown.enter="search" />
          <button
            v-if="movieStore.searchText"
            class="m3-icon-button m3-state"
            type="button"
            aria-label="검색어 지우기"
            @click="movieStore.searchText = ''">
            <span
              class="m3-icon"
              aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <button
          class="m3-button m3-state"
          type="submit"
          :disabled="!movieStore.searchText.trim() || isSearching"
          @click="search">
          검색
        </button>
      </form>

      <!-- 로딩: 결과 카드와 같은 모양의 스켈레톤 -->
      <ul
        v-if="isSearching"
        class="grid"
        aria-hidden="true">
        <li
          v-for="n in 10"
          :key="n">
          <div class="m3-skeleton skeleton__poster"></div>
          <div class="m3-skeleton skeleton__line"></div>
          <div class="m3-skeleton skeleton__line skeleton__line--short"></div>
        </li>
      </ul>

      <!-- 오류 -->
      <div
        v-else-if="errorMessage"
        class="state state--error"
        role="alert">
        <span
          class="m3-icon state__icon"
          aria-hidden="true">
          error
        </span>
        <p class="m3-body-large">{{ errorMessage }}</p>
      </div>

      <!-- 결과 -->
      <template v-else-if="movies.length">
        <p class="m3-body-medium movies__count">{{ movies.length }}개의 영화</p>
        <ul class="grid">
          <li
            v-for="movie in movies"
            :key="movie.imdbID">
            <RouterLink
              class="card"
              :to="`/movies/${movie.imdbID}`">
              <div class="card__poster m3-state">
                <img
                  v-if="movie.Poster !== 'N/A'"
                  :src="movie.Poster"
                  :alt="`${movie.Title} 포스터`"
                  loading="lazy"
                  decoding="async" />
                <span
                  v-else
                  class="m3-icon card__poster-empty"
                  aria-hidden="true">
                  movie
                </span>
              </div>
              <div class="card__body">
                <h2 class="m3-title-medium card__name">{{ movie.Title }}</h2>
                <p class="m3-body-medium card__meta">
                  <span>{{ movie.Year }}</span>
                  <span
                    v-if="movie.Type !== 'movie'"
                    class="card__type">
                    {{ movie.Type === 'series' ? '시리즈' : '게임' }}
                  </span>
                </p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </template>

      <!-- 검색 결과 없음 -->
      <div
        v-else-if="hasSearched"
        class="state">
        <span
          class="m3-icon state__icon"
          aria-hidden="true">
          search_off
        </span>
        <p class="m3-body-large">"{{ movieStore.searchText }}"에 대한 검색 결과가 없습니다.</p>
      </div>

      <!-- 최초 진입 -->
      <div
        v-else
        class="state">
        <span
          class="m3-icon state__icon"
          aria-hidden="true">
          movie
        </span>
        <p class="m3-body-large">보고 싶은 영화의 제목을 검색해 보세요.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movies {
  padding: 32px 16px 64px;
}
.movies__inner {
  max-width: 1200px;
  margin: 0 auto;
}
.movies__title {
  margin-bottom: 24px;
}
.movies__count {
  margin-bottom: 16px;
  color: var(--md-sys-color-on-surface-variant);
}

/* Search bar (M3 search bar 패턴: 풀 라운드 + 리딩 아이콘) */
.search {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  margin-bottom: 40px;
}
.search__field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 8px 0 16px;
  border-radius: var(--md-sys-shape-extra-large);
  background-color: var(--md-sys-color-surface-container-high);
}
.search__field:focus-within {
  outline: 2px solid var(--md-sys-color-primary);
}
.search__leading {
  color: var(--md-sys-color-on-surface-variant);
}
.search__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background: none;
  color: var(--md-sys-color-on-surface);
  font-family: inherit;
  font-size: 1rem;
  letter-spacing: 0.031em;
}
.search__input:focus-visible {
  outline: none;
}
.search__input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
}
.search__input::-webkit-search-cancel-button {
  display: none;
}

/* Result grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px 20px;
}

.card {
  display: block;
  color: inherit;
  text-decoration: none;
  border-radius: var(--md-sys-shape-large);
  transition: transform 200ms var(--md-sys-motion-emphasized);
}
.card:hover {
  transform: translateY(-4px);
}
.card:active {
  transform: scale(0.98);
}
.card__poster {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2 / 3;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: var(--md-sys-shape-large);
  background-color: var(--md-sys-color-surface-container-high);
  box-shadow: var(--md-sys-elevation-1);
}
.card:hover .card__poster {
  box-shadow: var(--md-sys-elevation-3);
}
.card__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card__poster-empty {
  font-size: 40px;
  color: var(--md-sys-color-outline);
}
.card__body {
  padding: 0 4px;
}
.card__name {
  /* 제목이 1줄이어도 아래 연도 줄이 카드마다 어긋나지 않도록 2줄 높이를 확보 */
  min-height: 3rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
.card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  margin-top: 4px;
  color: var(--md-sys-color-on-surface-variant);
}
.card__type {
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-small);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Skeleton */
.skeleton__poster {
  aspect-ratio: 2 / 3;
  margin-bottom: 12px;
  border-radius: var(--md-sys-shape-large);
}
.skeleton__line {
  height: 16px;
  margin: 0 4px 8px;
  border-radius: var(--md-sys-shape-small);
}
.skeleton__line--short {
  width: 40%;
}

/* Empty / error */
.state {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 72px 24px;
  border-radius: var(--md-sys-shape-extra-large);
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface-variant);
  text-align: center;
}
.state__icon {
  font-size: 48px;
  color: var(--md-sys-color-outline);
}
.state--error .state__icon {
  color: var(--md-sys-color-error);
}

@media (max-width: 600px) {
  .movies {
    padding: 24px 16px 48px;
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px 16px;
  }
  .search {
    grid-template-columns: minmax(0, 1fr);
  }
  .search .m3-button {
    width: 100%;
  }
}
</style>
