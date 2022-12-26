import createRouteMap from './create-match-map'

export default function createMatcher (routes) {
  const pathMap = createRouteMap(routes)
  function addRoutes (routes) {
    createRouteMap(routes, pathMap)
  }
  function addRoute (routes) {
    createRouteMap([routes], pathMap)
  }
  function match (location) {
    return pathMap[location]
  }

  return {
    addRoutes,
    addRoute,
    match,
  }
}
