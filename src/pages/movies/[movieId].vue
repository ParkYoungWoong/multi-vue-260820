<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import type { MovieDetails } from '@/stores/movie'
import '@/styles/material3.css'

// http://localhost:5173/movies/tt0068646
const route = useRoute()
const movieStore = useMovieStore()

// 스토어의 isLoadingForMovie는 한 번 false가 되면 유지되므로,
// 다른 영화로 이동했을 때 이전 영화가 보이지 않도록 페이지 로컬 상태로 판단합니다.
const isLoading = ref(true)
movieStore
  .fetchMovie(route.params.movieId as string)
  .catch(() => {})
  .finally(() => {
    isLoading.value = false
  })

const movie = ref<MovieDetails | null>(null)
console.log(movie.value) // null

const detail = computed(() => movieStore.currentMovie)
// 요청이 실패하면 스토어에는 직전 영화가 남아 있으므로 id까지 확인합니다.
const isFound = computed(
  () => detail.value?.Response === 'True' && detail.value?.imdbID === route.params.movieId
)

// OMDb는 값이 없는 항목을 'N/A' 문자열로 내려줍니다.
function has(value?: string) {
  return !!value && value !== 'N/A'
}

const genres = computed(() => (has(detail.value?.Genre) ? detail.value!.Genre.split(', ') : []))

const infoItems = computed(() => {
  const m = detail.value
  if (!m) return []
  return [
    { label: '감독', value: m.Director },
    { label: '각본', value: m.Writer },
    { label: '출연', value: m.Actors },
    { label: '개봉', value: m.Released },
    { label: '언어', value: m.Language },
    { label: '국가', value: m.Country },
    { label: '수상', value: m.Awards },
    { label: '박스오피스', value: m.BoxOffice }
  ].filter(item => has(item.value))
})

// IMDb 평점은 위에서 크게 보여주므로 나머지 출처만 모읍니다.
const otherRatings = computed(() =>
  (detail.value?.Ratings ?? []).filter(rating => rating.Source !== 'Internet Movie Database')
)
</script>

<template>
  <div class="m3 detail">
    <div class="detail__inner">
      <RouterLink
        class="m3-button-text m3-state back"
        to="/movies">
        <span
          class="m3-icon"
          aria-hidden="true">
          arrow_back
        </span>
        목록으로
      </RouterLink>

      <!-- 로딩: 실제 레이아웃과 같은 모양의 스켈레톤 -->
      <div
        v-if="isLoading"
        class="hero"
        aria-hidden="true">
        <div class="m3-skeleton hero__poster"></div>
        <div class="hero__body">
          <div class="m3-skeleton skeleton__title"></div>
          <div class="chips">
            <div
              v-for="n in 3"
              :key="n"
              class="m3-skeleton skeleton__chip"></div>
          </div>
          <div
            v-for="n in 4"
            :key="n"
            class="m3-skeleton skeleton__line"></div>
        </div>
      </div>

      <!-- 영화를 찾지 못함 -->
      <div
        v-else-if="!isFound"
        class="state"
        role="alert">
        <span
          class="m3-icon state__icon"
          aria-hidden="true">
          error
        </span>
        <p class="m3-body-large">영화 정보를 불러오지 못했습니다.</p>
      </div>

      <template v-else-if="detail">
        <article class="hero">
          <div class="hero__poster">
            <img
              v-if="has(detail.Poster)"
              :src="detail.Poster"
              :alt="`${detail.Title} 포스터`" />
            <span
              v-else
              class="m3-icon hero__poster-empty"
              aria-hidden="true">
              movie
            </span>
          </div>

          <div class="hero__body">
            <h1 class="m3-display-small hero__title">{{ detail.Title }}</h1>

            <div class="chips">
              <span
                v-if="has(detail.Year)"
                class="m3-chip">
                <span
                  class="m3-icon"
                  aria-hidden="true">
                  calendar_month
                </span>
                {{ detail.Year }}
              </span>
              <span
                v-if="has(detail.Rated)"
                class="m3-chip">
                <span
                  class="m3-icon"
                  aria-hidden="true">
                  shield
                </span>
                {{ detail.Rated }}
              </span>
              <span
                v-if="has(detail.Runtime)"
                class="m3-chip">
                <span
                  class="m3-icon"
                  aria-hidden="true">
                  schedule
                </span>
                {{ detail.Runtime }}
              </span>
              <span
                v-for="genre in genres"
                :key="genre"
                class="m3-chip m3-chip-tonal">
                {{ genre }}
              </span>
            </div>

            <div
              v-if="has(detail.imdbRating)"
              class="rating">
              <span
                class="m3-icon is-filled rating__star"
                aria-hidden="true">
                star
              </span>
              <strong class="rating__score">{{ detail.imdbRating }}</strong>
              <span class="m3-body-large rating__max">/ 10</span>
              <span
                v-if="has(detail.imdbVotes)"
                class="m3-body-medium rating__votes">
                IMDb 평점, {{ detail.imdbVotes }}명 참여
              </span>
            </div>

            <p
              v-if="has(detail.Plot)"
              class="m3-body-large hero__plot">
              {{ detail.Plot }}
            </p>
          </div>
        </article>

        <section
          v-if="otherRatings.length"
          class="section">
          <h2 class="m3-title-large section__title">다른 사이트 평점</h2>
          <ul class="ratings">
            <li
              v-for="rating in otherRatings"
              :key="rating.Source"
              class="ratings__item">
              <p class="m3-label-medium ratings__source">{{ rating.Source }}</p>
              <p class="ratings__value">{{ rating.Value }}</p>
            </li>
          </ul>
        </section>

        <section
          v-if="infoItems.length"
          class="section">
          <h2 class="m3-title-large section__title">작품 정보</h2>
          <dl class="info">
            <div
              v-for="item in infoItems"
              :key="item.label"
              class="info__item">
              <dt class="m3-label-medium info__label">{{ item.label }}</dt>
              <dd class="m3-body-large info__value">{{ item.value }}</dd>
            </div>
          </dl>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.detail {
  padding: 16px 16px 64px;
}
.detail__inner {
  max-width: 1000px;
  margin: 0 auto;
}
.detail :where(dl, dd) {
  margin: 0;
}
.back {
  margin-bottom: 16px;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  padding: 32px;
  border-radius: var(--md-sys-shape-extra-large);
  background-color: var(--md-sys-color-surface-container-low);
}
.hero__poster {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: var(--md-sys-shape-large);
  background-color: var(--md-sys-color-surface-container-high);
  box-shadow: var(--md-sys-elevation-2);
}
.hero__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero__poster-empty {
  font-size: 56px;
  color: var(--md-sys-color-outline);
}
.hero__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.hero__title {
  word-break: keep-all;
}
.hero__plot {
  max-width: 60ch;
  color: var(--md-sys-color-on-surface-variant);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* IMDb 평점 */
.rating {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.rating__star {
  font-size: 32px;
  color: var(--md-sys-color-tertiary);
  transform: translateY(4px);
}
.rating__score {
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
}
.rating__max,
.rating__votes {
  color: var(--md-sys-color-on-surface-variant);
}
.rating__votes {
  margin-left: 8px;
}

/* Sections */
.section {
  margin-top: 48px;
}
.section__title {
  margin-bottom: 16px;
}

.ratings {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.ratings__item {
  /* 출처 이름 길이와 상관없이 타일 너비를 고르게 */
  flex: 1 1 150px;
  max-width: 260px;
  padding: 16px 20px;
  border-radius: var(--md-sys-shape-medium);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.ratings__source {
  opacity: 0.8;
}
.ratings__value {
  margin-top: 4px;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
}

.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.info__item {
  padding: 16px 20px;
  border-radius: var(--md-sys-shape-medium);
  background-color: var(--md-sys-color-surface-container-low);
}
.info__label {
  color: var(--md-sys-color-on-surface-variant);
}
.info__value {
  margin-top: 4px;
}

/* 스켈레톤 */
.skeleton__title {
  width: 60%;
  height: 40px;
  border-radius: var(--md-sys-shape-small);
}
.skeleton__chip {
  width: 88px;
  height: 32px;
  border-radius: var(--md-sys-shape-small);
}
.skeleton__line {
  width: 100%;
  height: 16px;
  border-radius: var(--md-sys-shape-small);
}
.skeleton__line:last-child {
  width: 70%;
}

/* 오류 */
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
  color: var(--md-sys-color-error);
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding: 20px;
  }
  .hero__poster {
    width: 180px;
    margin: 0 auto;
  }
  .hero__title {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
  .section {
    margin-top: 40px;
  }
}
</style>
