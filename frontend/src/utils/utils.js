import fnvplus from 'fnv-plus'

export const log = console.log.bind(console)

export const isArray = (input) => {
  if (Object.prototype.toString.call(input) === '[object Array]') {
    return true
  } else {
    return false
  }
}

export const isObject = (input) => {
  if (Object.prototype.toString.call(input) === '[object Object]') {
    return true
  } else {
    return false
  }
}
 
export const isString = (input) => {
  if (Object.prototype.toString.call(input) === '[object String]') {
    return true
  } else {
    return false
  }
}

export const randomValue = () => (parseInt(Math.random() * 999, 10))

export const range = (n) => {
    let a = []
    for (let i = 1; i < n + 1; i++) {
        a.push(i)
    }
    return a
}

let nextIndex = 0
let iterationCount = 0

export const rangeIterator = (data=[], step=1) => {
    let l = data.length

    const rangeIterator = {
        next: () => {
            let i = nextIndex % l
            let result = data[i]
            nextIndex += step
            iterationCount++;
            return result
        }
    }
    return rangeIterator
}

export const iteratorObject = (dict) => {
  let step = 1
  let keys = Object.keys(dict)
  let l = keys.length
  const rangeIterator = {
      next: () => {
          let i = nextIndex % l
          let key = keys[i]
          let result = dict[key.toString()]
          nextIndex += step
          iterationCount++;
          return result
      }
  }
  return rangeIterator
}

export const concatDict = (o1={}, o2={}) => {
    let k1 = Object.keys(o1)
    let k2 = Object.keys(o2)
    let l1 = k1.length
    let l2 = k2.length
    if (l1 >= l2) {
        for (let i = 0; i < l1; i++) {
            let key = k1[i]
            if (k2.includes(key)) {
                o1[key] = o1[key].concat(o2[key])
            }
        }
        return o1
    } else {
        for (let i = 0; i < l2; i++) {
            let key = k2[i]
            if (k1.includes(key)) {
                o2[key] = o2[key].concat(o1[key])
            }
        }
        return o2
    }
}

export const e = (selector) => {
    return document.querySelector(selector)
}

export const hashContent = (content) => {
    return fnvplus.hash(content, 64).hex()
}

export const deepClone = (m) => {
    let s = JSON.stringify(m)
    return JSON.parse(s)
}

export const mapDict = (dict, callback) => {
    const keys = Object.keys(dict)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = dict[key.toString()]
      callback(key, value)
    }
}

export const hash = (str) => {
    var v = 5381
    const table = "fdsafdsafjkvjcxzvjhAJKHJKAHKJHJKHJKHjkdhjkashjkdhajkHAHAJKHJKAHk121312312hHJKHJKHKjSKShjshjkKSHJKHSJKHSJKhedoiruiouIOUIOUIOUO".split('')
    let i = str.length - 1

    for (; i > -1; i--) {
        v += (hash << 5) + str[i]
    }

    let value = v & 0x7FFFFFFFF
    var retValue = ''
    do {
        retValue += table[value & 0X3F]
    }
    while (value >> 6)
    return retValue
}


export const deepCopy = (o) => {
  return JSON.parse(JSON.stringify(o));
}

export const print = console.log.bind(console);