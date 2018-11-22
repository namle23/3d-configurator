let arr = [
  { key: 'key1', value: 'value1', test: 'friday' },
  { key: 'key1', value: 'value1', test: 'friday' },
  { key: 'key2', value: 'value2', test: 'friday' },
  { key: 'key3', value: 'value3', test: 'friday' }
]
let res = arr.filter((a, _, aa) => {
  // console.log(a)
  console.log(aa)
  return aa.indexOf(a) === aa.lastIndexOf(a)
})

let res1 = arr.reduce(
  (p, c) => {
    let key = [c.key].join('|')
    if (p.temp.indexOf(key) === -1) {
      p.out.push(c)
      p.temp.push(key)
    }
    return p
  },
  { temp: [], out: [] }
).out

console.log(res)
