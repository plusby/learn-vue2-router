

function createRoute (record, location) {
  const matched = []
  while (record) {
    matched.unshift(record)
    record = record.parent
  }
  
  return {
    ...location,
    matched,
  }
}

function runQueue(queue, from ,to, cb){
  function next (index) {
    if (index >= queue.length) {
      return cb()
    }
    let hook = queue[index]
    hook(from, to, () => next(index+1))
  }
  next(0)
}

export default class Base {
  constructor (router) {
    this.router = router
    // 当前路由的全部路径
    this.current = createRoute(null, {
      path: '/'
    })
  }
  // 
  transitionTo (location, listener) {
    let record = this.router.match(location)
    // 根据路由地址获取到当前路由的全部的路由路径信息放
    const route = createRoute(record, { path: location })
    // 判断是否重复进入同一个路由
    if (location === this.current.path && route.matched.length === this.current.matched.length) {
      return
    }

    let queue = [].concat(this.router.beforeEachHooks)
    runQueue(queue, this.current, route, () => {
      this.current = route
      this.cb && this.cb(route)
      listener && listener()
    })
  }

  listen (cb) {
    this.cb = cb
  }
}