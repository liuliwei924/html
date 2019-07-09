import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let menus = window.localStorage.getItem('menus')
let routes = null
// 判断是否缓存menus菜单
if (!menus) {
  routes = [
    {path: '/', name: 'Home', component: r => require.ensure([], () => r(require('@/view/Home')), 'default')},
    {path: '/login', name: 'Login', component: r => require.ensure([], () => r(require('@/view/Login')), 'default')},
    {path: '/*', name: 'Error', redirect: '/login'}
  ]
} else {
  menus = JSON.parse(menus)
  let children = []
  menus.map(item => {
    if (item.menuCode === 'main') return children.push({path: 'main', name: 'Contain', component: r => require.ensure([], () => r(require(`@/view/Contain`)), 'default')})
    item.subMenus.map(subItem => {
      if (!subItem.subMenus) return
      subItem.subMenus.map(childItem => {
        // 首字符转化为大写
        let menuCode = childItem.menuCode.replace(/^\w{1}/, L => L.toUpperCase())
        children.push({path: childItem.menuCode, name: menuCode, component: () => import(`@/view/${item.menuCode}/${menuCode}`)})
      })
    })
  })
  // children.push({path: '/notify', name: 'Notify', component: r => require.ensure([], () => r(require('@/view/Notify')), 'default')})
  children.push({path: '/workDetail', name: 'WorkDetail', component: r => require.ensure([], () => r(require('@/view/work/WorkDetail')), 'work')})
  children.push({path: '/knowDetail', name: 'KnowDetail', component: r => require.ensure([], () => r(require('@/view/know/KnowDetail')), 'know')})
  children.push({path: '/configRight', name: 'ConfigRight', component: r => require.ensure([], () => r(require('@/view/config/ConfigRight')), 'config')})
  children.push({path: '/busiDetail', name: 'BusiDetail', component: r => require.ensure([], () => r(require('@/view/business/BusiDetail')), 'business')})
  children.push({path: '/busiVerify', name: 'BusiVerify', component: r => require.ensure([], () => r(require('@/view/business/BusiVerify')), 'business')})
  children.unshift({path: '/', name: 'Home', redirect: children[0].path})
  routes = [
    {path: '/', component: r => require.ensure([], () => r(require('@/view/Home')), 'default'), children},
    {path: '/login', name: 'Login', component: r => require.ensure([], () => r(require('@/view/Login')), 'default')},
    {path: '/*', name: 'Error', component: r => require.ensure([], () => r(require('@/view/Error')), 'default')}
  ]
}

export default new Router({
  base: '/xxcrmpage/',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
