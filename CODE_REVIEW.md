# main 브랜치 코드 리뷰

리뷰 대상: `main` (2e04a83)
확인 범위: `src/`, 루트 설정 파일, `index.html`
검증: `npx vue-tsc -b --force` 통과, `npx eslint .` 통과 (둘 다 오류/경고 없음)

이 문서는 리뷰 의견만 담고 있고, 코드는 수정하지 않았습니다.

---

## 높음

### 1. OMDb API 키가 소스에 하드코딩되어 있습니다

`src/stores/movie.ts:62`, `src/stores/movie.ts:68`

```ts
const res = await fetch(`https://omdbapi.com/?apikey=9d38c929&s=${this.searchText}`)
```

공개 저장소에 키 문자열이 그대로 들어가 있어 크롤러가 수집할 수 있습니다.
클라이언트 전용 SPA라 키가 네트워크 요청에는 어차피 노출된다는 점은 감안해야 하지만,
저장소에 평문으로 커밋된 것과는 위험도가 다릅니다.

제안
- `import.meta.env.VITE_OMDB_API_KEY`로 옮기고 `.env.local`은 gitignore 처리
- 이미 노출된 키는 재발급
- 키를 실제로 숨겨야 한다면 프록시 엔드포인트가 필요합니다

### 2. 인증 토큰을 콘솔에 출력하고 있습니다

`src/routes/guards/requiresAuth.ts:8`

```ts
const token = localStorage.getItem('token')
// await isValideToken(token)
console.log(token)
return !!token
```

라우트 이동마다 토큰이 콘솔에 찍힙니다. 제거가 필요합니다.
같은 줄의 주석 `isValideToken`은 오타로 보입니다 (`isValidToken`).

### 3. 두 스토어가 같은 id와 같은 export 이름을 씁니다

`src/stores/count.ts:4`, `src/stores/count-setup.ts:5`

두 파일 모두 `defineStore('count', ...)`에 `useCountStore`라는 이름으로 export합니다.
한쪽만 import하는 지금은 문제가 드러나지 않지만, 두 파일이 같이 로드되면
나중에 등록된 쪽이 Pinia 인스턴스를 덮어씁니다.
현재 `src/pages/count-store.vue:3`은 `count.ts`만 쓰고 있어 `count-setup.ts`는 사실상 사용되지 않습니다.

제안: 비교 학습용으로 둘 다 남긴다면 id와 export 이름을 분리하고, 아니라면 하나만 남깁니다.

### 4. 비밀번호 입력이 평문으로 노출됩니다

`src/components/TextField.vue:16-19`

```vue
<input
  v-model="abc"
  v-bind="$attrs"
  type="text" />
```

`type="text"`가 `v-bind="$attrs"` 뒤에 있어 나중 값이 이깁니다.
따라서 `<TextField name="pw" type="password" />`로 넘겨도 무시됩니다.
게다가 `src/pages/signin.vue:34`는 `type`을 아예 주지 않아 비밀번호가 화면에 그대로 보입니다.

제안: `type`을 prop으로 받아 기본값 `'text'`를 주고, `v-bind="$attrs"`를 마지막에 둡니다.

---

## 중간

### 5. 아이디 검증 메시지가 곧바로 지워집니다

`src/pages/signin.vue:15-16`

```ts
if (id !== null && !id.trim()) idMessage.value = '아이디가 필수입니다!'
if (id) idMessage.value = ''
```

공백만 입력하면 첫 줄에서 메시지를 세팅하지만, 다음 줄의 `if (id)`가 참이라 즉시 비웁니다.
결과적으로 에러 메시지가 화면에 뜨지 않습니다.

제안
```ts
idMessage.value = id.trim() ? '' : '아이디가 필수입니다!'
```

### 6. redirectTo 쿼리를 검증 없이 이동에 사용합니다

`src/pages/signin.vue:20-22`

```ts
const { redirectTo = '' } = route.query || {}
const to = typeof redirectTo === 'string' && redirectTo.trim() ? redirectTo : '/'
router.push(to)
```

`/signin?redirectTo=https://example.com` 같은 값이 그대로 들어갑니다.
내부 경로만 허용하도록 `redirectTo.startsWith('/') && !redirectTo.startsWith('//')` 정도의 확인을 권합니다.

### 7. 스토어 액션이 DOM 이벤트를 인자로 받습니다

`src/stores/movie.ts:60-61`

```ts
async fetchMovies(event: KeyboardEvent | MouseEvent) {
  if (event instanceof KeyboardEvent && event.isComposing) return
```

UI 관심사가 스토어로 넘어와 있습니다. 스토어 단독 테스트도 어려워집니다.
같은 `isComposing` 검사가 `src/pages/movies/index.vue:37`에 이미 있어 중복이기도 합니다.

제안: `fetchMovies(searchText: string)` 형태로 바꾸고, 이벤트 판단은 페이지에 둡니다.

### 8. 검색 결과가 없을 때 movies가 undefined가 됩니다

`src/stores/movie.ts:64`

OMDb는 결과가 없으면 `Response: "False"`와 함께 `Search` 필드를 아예 내려주지 않습니다.
`this.movies = data.Search`는 이때 `undefined`가 되어 타입 선언(`Movie[]`)과 런타임 값이 어긋납니다.
`src/pages/movies/index.vue:33`이 `?? []`로 막고 있지만, 방어 위치가 스토어여야 합니다.

제안: `this.movies = data.Search ?? []`

### 9. isLoadingForMovie가 다시 true로 돌아오지 않습니다

`src/stores/movie.ts:51`, `src/stores/movie.ts:71`

초기값만 `true`이고 `fetchMovie` 성공 시 `false`가 된 뒤로는 계속 `false`입니다.
실제로 `src/pages/movies/[movieId].vue:12-14`는 이 상태를 신뢰하지 못해 페이지 로컬 `isLoading`을 따로 두고 있고,
주석에도 그 이유가 적혀 있습니다.

제안: `fetchMovie` 진입 시 `true`로 초기화하고 `finally`에서 `false`로 내리거나, 쓰이지 않는 상태이므로 제거합니다.

### 10. 타입 정의가 중복되고 사용되지 않습니다

`src/pages/movies/index.vue:7-18`

`ResponseData`, `Movie` 인터페이스가 `src/stores/movie.ts:3-14`와 똑같이 다시 선언되어 있고,
이 파일 안에서는 쓰이지도 않습니다. 삭제하고 필요하면 스토어에서 import 하는 편이 낫습니다.

### 11. 사용되지 않는 ref와 디버그 로그가 남아 있습니다

`src/pages/movies/[movieId].vue:22-23`

```ts
const movie = ref<MovieDetails | null>(null)
console.log(movie.value) // null
```

`movie`는 템플릿에서 쓰이지 않습니다. 실제 데이터는 `detail` computed가 담당합니다.

### 12. inheritAttrs 설정 없이 $attrs를 수동 바인딩합니다

`src/components/TextField.vue`, `src/components/TheButton.vue`

`v-bind="$attrs"`를 자식 요소에 직접 걸면서 `inheritAttrs: false`를 지정하지 않았습니다.
TextField는 루트가 `<label>` 하나라 `name` 같은 속성이 label과 input 양쪽에 중복으로 붙습니다.

제안: `defineOptions({ inheritAttrs: false })`를 추가합니다.

---

## 낮음

### 13. lint, format 스크립트가 없습니다

`package.json:6-10`

eslint와 prettier가 devDependencies에 있는데 실행 스크립트는 `dev`, `build`, `preview` 뿐입니다.
팀 공유와 CI를 생각하면 `"lint": "eslint ."`, `"format": "prettier --write ."` 정도는 있는 편이 좋습니다.

### 14. 이벤트 이름이 의미를 담고 있지 않습니다

`src/components/TheButton.vue:7`

`defineEmits(['xyz', 'hello'])`는 학습용 이름으로 보입니다.
`click`, `message-click`처럼 의도가 드러나는 이름을 권합니다.

### 15. 학습용 스캐폴딩 파일이 남아 있습니다

`src/Template.vue`, `src/components/Parent.vue`, `src/components/Child.vue`,
`src/components/TheLoader.vue`, `src/pages/computed.vue`, `tests/test1.ts` ~ `tests/test5.ts`

번들에는 대부분 포함되지 않지만 저장소 정리 대상입니다.
특히 `src/pages/computed.vue`는 파일 기반 라우팅 때문에 `/computed` 경로로 실제 접근이 가능합니다.
`tests/` 디렉터리는 테스트 코드가 아니라 JS 문법 연습 파일이라, 이름과 내용이 어긋납니다.

### 16. 문서와 메타 정보가 템플릿 기본값입니다

- `index.html:31`: `<title>multi1</title>`
- `README.md`: Vite 기본 템플릿 내용 그대로. 실행 방법과 환경변수 안내가 없습니다.
- `package.json:2`: `"name": "multi1"`

### 17. 쓰이지 않는 alias가 있습니다

`vite.config.ts:11`, `tsconfig.app.json:13`

`node_modules` alias를 양쪽에 선언했지만 `src/` 안에서 이를 통한 import는 없습니다.

---

## 좋았던 점

- `vue-router/auto-routes`와 `definePage` 기반 파일 라우팅에 `typed-router.d.ts`까지 갖춰 경로 타입 안전성이 확보되어 있습니다.
- `src/pages/movies/index.vue`가 로딩, 오류, 결과 없음, 최초 진입 네 가지 상태를 모두 분기합니다. 로딩은 실제 카드와 같은 모양의 스켈레톤이라 레이아웃이 흔들리지 않습니다.
- 접근성 처리가 꼼꼼합니다. `aria-hidden`, `aria-label`, `role="alert"`, visually hidden label, `loading="lazy"`가 적절히 쓰였습니다.
- `src/pages/movies/[movieId].vue`의 `isFound` 판정이 `Response`뿐 아니라 `imdbID`까지 대조해, 요청 실패 시 이전 영화가 남아 보이는 문제를 막고 있습니다.
- Prettier를 eslint에 통합해 포맷과 린트 규칙이 충돌하지 않습니다.
- 판단 근거가 필요한 지점마다 이유를 적은 주석이 달려 있어 의도를 읽기 쉽습니다.
