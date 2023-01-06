

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
// 执行生命周期钩子数组
function runQueue(queue, from ,to, cb){
  function next (index) {
    // 如果钩子数组执行完毕就执行cb回调
    if (index >= queue.length) {
      return cb()
    }
    // 获取到钩子
    let hook = queue[index]
    // 执行钩子，传递上个路由当前路由和next回调
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
    // 通过路径获取到对应的路由信息
    let record = this.router.match(location)
    // 把当前路由转成{matched:[父级路由信息，当前路由信息],path:'/a/b'}的形式
    const route = createRoute(record, { path: location })
    // 判断是否重复进入同一个路由
    if (location === this.current.path && route.matched.length === this.current.matched.length) {
      return
    }
    // 存储对应的生命周期钩子
    let queue = [].concat(this.router.beforeEachHooks)
    // 执行钩子
    runQueue(queue, this.current, route, () => {
      // 保存当前路由信息
      this.current = route
      // 执行修改vue上route的方法进行修改
      this.cb && this.cb(route)
      listener && listener()
    })
  }
  // 保存cb
  listen (cb) {
    this.cb = cb
  }
}