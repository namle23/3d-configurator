// function dedupe(arr) {
//   return arr.reduce(
//     function(p, c) {
//       var key = [c.sound].join('|')
//       if (p.temp.indexOf(key) === -1) {
//         p.out.push(c)
//         p.temp.push(key)
//       }
//       return p
//     },
//     { temp: [], out: [] }
//   ).out
// }

// var animal = []
// // Add keys to the hashmap
// animal.push({ sound: 1, age: 8 })
// animal.push({ sound: 1, age: 10 })
// animal.push({ sound: 2, age: 2 })

// dedupe(animal)

// console.log(dedupe(animal))

var array1 = new Array('a', 'b', 'c', 'd', 'e', 'f')
var array2 = new Array('c', 'e')

array1 = array1.filter(val => !array2.includes(val))
console.log(array1)
