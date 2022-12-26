
import install, { Vue } from './install'
import createMatcher from './create-matcher'
import H5History from './history/history'
import HashHistory from './history/hash'
import routerView from './component/router-view'

class VueRouter {
  constructor (options) {
    // 获取到vue中的路由信息
    let routes = options.routes || []
    // 扁平化处理路由数据，并且返回添加和获取路由信息的方法
    this.matcher = createMatcher(routes)
    // 获取当前的路由模式默认是hash
    const mode = options.mode || 'hash'
    // 存放beforeEach钩子
    this.beforeEachHooks = []
    // 不同模式创建不同的实例
    if (mode === 'history') {
      this.history = new H5History(this)
    } else {
      this.history = new HashHistory(this)
    }
  }
  // 匹配路由并且返回路由的信息
  match (location) {
    return this.matcher.match(location)
  }
  push (location) { // 跳转路由
    return this.history.push(location)
  }
  // 初始化
  init (app) {
    let history = this.history
    // 根据路径匹配对应的组件进行渲染，之后进行监听路由的变化
    history.transitionTo(history.getCurrentLocation(), () => {
      // 监听路由
      history.setupListener()
    }) 

    // 路由变化之后重新给_route设置值
    history.listen((newRoute) => {
      app._route = newRoute
    })
  }
  beforeEach (cb) {
    this.beforeEachHooks.push(cb)
  }
}
// 实现install函数
VueRouter.install = install
// 实现router-link组件
Vue.component('router-link', {
  props: {
    to: {
      type: String
    },
    tag: {
      type: String
    }
  },
  methods: {
    handler () {
      this.$router.push(this.to)
    }
  },
  render () {
    const tag = this.tag
    return <tag onClick={this.handler}>{this.$slots.default}</tag>
  }
})
// 实现router-view组件
Vue.component('router-view', routerView)

export default VueRouter

/**
 * 
 * 路由钩子的实现
 * 路由权限的实现：钩子加动态路由
 * 
 * 前端路由：
 *  hash模式：根据hash的不同渲染不同的组件，可以通过hashchange来监听hash的变化
 *  history模式：是h5的api,好处没有#,通过popstate来监听路径的变化
 *  
 * 导航守卫：从一个路由切换到另一个路由发生了什么？
 *  离开组件 会执行组件的beforeRouteLeave钩子
 *  进入到另一个组件之前会触发全局的beforeEach
 *  路由的参数变化执行组件的beforeRouteUpdate
 *  执行全局路由钩子beforeEnter
 *  执行组件的beforeRouteEnter
 *  再执行全局的beforeResolve
 *  最后执行全局的afterEach
 *  
 * 
 * 路由的大概实现：
 *  1. 获取到路由信息之后，进行扁平化处理
 *  2. 通popState和hashchange来监听路由的变化，当路由变化的时候，获取到对应的路由信息重新赋值给当前组件实例的route属性
 *     此时就会重新渲染router-view函数组件；并且如果是hash就直接改变window.location.hash来修改路由，是history就通过
 *     pushState方法修改路由
 *  3. 执行push等修改路由的方法和第二部是一样的操作
 */