import Base from './base'


function getHash () {
  return window.location.hash.slice(1)
}
class HashHistory extends Base {
  constructor (router) {
    super(router)
  }
  setupListener () {
    window.addEventListener('hashchange', () => {
      this.transitionTo(getHash())
    })
  }
  // 获取当前的路径
  getCurrentLocation () {
    return getHash()
  }
  push(location) {
    return this.transitionTo(location, () => {
      window.location.hash = location
    })
  }
}

export default HashHistory