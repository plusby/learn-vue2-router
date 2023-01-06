import Base from './base'

function ensureSlash () {
  if (window.location.hash) {
    return
  }
  window.location.hash = '/'
}

class H5History extends Base {
  constructor (router) {
    super(router)

    ensureSlash()
  }

  setupListener () {
    // 监听路由的变化
    window.addEventListener('popstate', () => {
      this.transitionTo(window.location.pathname)
    })
  }
  // 获取当前的路径
  getCurrentLocation () {
    return window.location.pathname
  }
  push(location) {
    return this.transitionTo(location, () => {
      // 修改路由
      window.history.pushState({},'',location)
    })
  }
  go (n) {
    window.history.go(n)
  }
}

export default H5History