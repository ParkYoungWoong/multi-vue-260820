// const numbers1 = [7, 8, 9, 10]
// const numbers2 = [2, 4, 6, 8]

// const new1 = numbers1.concat(numbers1)
// const new2 = [...numbers1, ...numbers2]
// 모두 => [7, 8, 9, 10, 2, 4, 6, 8]

// const new3 = [0, ...numbers2] // [0, 2, 4, 6, 8]
// const new4 = [...numbers2, 0] // [2, 4, 6, 8, 0]

interface User {
  name: string
  age: number
  email: string
}
const user0 = {
  name: 'HEROPY',
  age: 22,
  email: 'abc@gmail.com'
}
const user1: User = {
  // name: user0.name,
  // age: user0.age,
  ...user0,
  email: 'xyz@gmail.com'
}
// 타입1|타입2[] <==== 배열 타입
// [타입1, 타입2] <==== 튜플 타입(고정 길이 배열)
function getUser(name: string, ...rest: string[]): User {
  return {
    name,
    age: Number(rest[0]),
    email: rest[1]
  }
}
const user2 = getUser('HEROPY', '22', 'thesecon@gmail.com', '123', 'sdfjj1', 'skdjfnsk')
console.log(user1, user2)
