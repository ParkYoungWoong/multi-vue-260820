async function add1(a: number, b: number): Promise<number> {
  return a + b
}
function add2(a: number, b: number): Promise<number> {
  return new Promise(resolve => {
    resolve(a + b)
  })
}

await add1(1, 2)
const res1 = await add2(1, 3)
console.log(res1) // 4
