/**
 * 
 * route： {
 *  path: 'XXX',
 *  matched: ['父级路由信息','当前路由信息']
 * }
 * 
 * 当前push或者监听到路由变化的时候就会获取到当前路由的信息，重新赋值给$route,
 * 从而就会重新执行此函数组件
 * 
 */

export default {
  functional: true, // 函数组件
  render (h, { parent, data }) {
    // 标记当前组件为routerView
    data.routerView = true
    // 获取到父级的路由信息
    let route = parent.$route
    // 当前路由的索引
    let depth = 0
    // 循环遍历获取父级
    while(parent){
      // 判断父级上是否有routerView，有索引就加1
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }
    //  通过索引获取到当前的路由信息
    let record = route.matched[depth]
    if (!record) {
      return h()
    }
    // 渲染组件
    return h(record.component, data)
  },
}