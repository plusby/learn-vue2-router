// 根据用户传递进来的路由信息进行扁平化处理
export default function createRouteMap (routes) {
  let pathMap = pathMap || {}
  routes.forEach(element => {
    addRouteRecord(element, pathMap)
  })
  return pathMap
}

function addRouteRecord (route, pathMap, parentRecord) {
  let path = parentRecord ? `${parentRecord.path === '/' ? '/' : parentRecord.path + '/'}` : parentRecord.path
  let record = {
    ...route,
    parent: parentRecord,
    path
  }
  if (!pathMap[path]) {
    pathMap[path] = record
  }
  route.children && route.children.forEach(childRoute => {
    addRouteRecord(childRoute, pathMap, record)
  })
}