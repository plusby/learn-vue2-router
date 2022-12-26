export let Vue

export default function install (_Vue) {
  Vue = _Vue

  // 所有的组件都会执行mixin方法  
  // 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。
  Vue.mixin({
    beforeCreate () {
      // 父级
      if (this.$options.router) {
        // 创建一个属性存储当前实例
        this._routerRoot = this
        // 把当前的路由实例存储到当前实例的属性上
        this._router = this.$options.router
        // 进行初始化
        this._router.init()
        // 把当前的路由信息存储到route上  响应式定义_route属性，保证_route发生变化时，组件(router-view)会重新渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else { // 子级
        // 把父级的实例存储到子级的属性上
        this._routerRoot = this.$parent && this.$parent._routerRoot 
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () {
      return this._routerRoot?._router
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () {
      return this._routerRoot?._route
    }
  })
}