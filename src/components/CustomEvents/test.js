let arr = [
  { key: 'key1', value: 'value1' },
  { key: 'key1', value: 'value2' },
  { key: 'key2', value: 'value2' },
  { key: 'key1', value: 'value2' },
  { key: 'key2', value: 'value2' },
  { key: 'key3', value: 'value3' }
]
let res = arr.filter((a, x, b) => {
  return b.indexOf(a) === b.lastIndexOf(a)
})

let res1 = arr.reduce(
  (p, c) => {
    let key = [c.key].join('|')
    let value = [c.value].join('|')

    if (p.tempKey.indexOf(key) === -1 || p.tempValues.indexOf(value) === -1) {
      p.out.push(c)
      p.tempKey.push(key)
      p.tempValues.push(value)
    }

    return p
  },
  { tempKey: [], out: [], tempValues: [] }
).out

console.log(res1)
