// 设置过期缓存控制
export function expireStore (key, v, ex = 1.8e6) {
  if (v === undefined) {
    let str = window.localStorage.getItem(key)
    if (str === null) return false
    let obj = JSON.parse(str)
    if (obj.t > Date.now()) return obj.v
    else return false
  } else {
    window.localStorage.setItem(key, JSON.stringify({
      v,
      t: Date.now() + ex
    }))
  }
}
