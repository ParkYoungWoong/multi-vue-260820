let user = null
console.log(user)

const res = await fetch('https://~~~')
const data = await res.json()
user = data

if (user) {
  console.log(user.name)
}

console.log(typeof {}) // 'object'
console.log(typeof null) // 'object'
