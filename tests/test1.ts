function a() {
  console.log(this) // 호출할 때!
  return 1
}
const b = () => {
  console.log(this) // 선언할 때!
  return 1
}
const c = () => 1

console.log(a, b, c)

const user = {
  name: 'HEROPY',
  age: 22,
  getName: function () {
    setTimeout(() => {
      console.log(this.age)
    }, 1000)
  }
}

user.getName() // 22
