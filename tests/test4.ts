function fetch(ms: number, payload: unknown) {
  console.log(payload)
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 콜백 지옥, 잘못된 패턴! XXX
fetch(1000, '쿠폰목록').then(res1 => {
  fetch(2000, res1).then(res2 => {
    fetch(3000, res2).then(res3 => {
      console.log(res3)
    })
  })
})

// 정상, .then 패턴!
fetch(1000, '쿠폰목록')
  .then(res1 => fetch(2000, res1))
  .then(res2 => fetch(3000, res2))
  .then(res3 => {
    console.log(res3)
  })

// 정상, await 패턴!
const res1 = await fetch(1000, '쿠폰목록')
const res2 = await fetch(2000, res1)
const res3 = await fetch(3000, res2)
const res4 = await fetch(4000, {})
console.log(res3, res4)

// 일부 비동기함수 동시 실행 - Promise.all
// const [res1, res4] = await Promise.all([fetch(1000, '쿠폰목록'), fetch(4000, {})])
// const res2 = await fetch(2000, res1)
// const res3 = await fetch(3000, res2)
// console.log(res3, res4)
