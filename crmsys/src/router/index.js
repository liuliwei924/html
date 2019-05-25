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
        // if (item.menuCode === 'product') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'product')})
        // else if (item.menuCode === 'risk') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'risk')})
        // else if (item.menuCode === 'count') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'count')})
        // else if (item.menuCode === 'work') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'work')})
        // else if (item.menuCode === 'business') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'business')})
        // else if (item.menuCode === 'finance') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'finance')})
        // else if (item.menuCode === 'loan') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'loan')})
        // else if (item.menuCode === 'statistics') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'statistics')})
        // else if (item.menuCode === 'config') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'config')})
        // else if (item.menuCode === 'know') children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'know')})
        // else children.push({path: childItem.menuCode, name: menuCode, component: r => require.ensure([], () => r(require(`@/view/${item.menuCode}/${menuCode}`)), 'default')})
      })
    })
  })
  // children.push({path: '/notify', name: 'Notify', component: r => require.ensure([], () => r(require('@/view/Notify')), 'default')})
  children.push({path: '/workDetail', name: 'WorkDetail', component: r => require.ensure([], () => r(require('@/view/work/WorkDetail')), 'work')})
  children.push({path: '/knowDetail', name: 'KnowDetail', component: r => require.ensure([], () => r(require('@/view/know/KnowDetail')), 'know')})
  children.push({path: '/configRight', name: 'ConfigRight', component: r => require.ensure([], () => r(require('@/view/config/ConfigRight')), 'config')})
  children.push({path: '/prodAdd', name: 'ProdAdd', component: r => require.ensure([], () => r(require('@/view/product/ProdAdd')), 'product')})
  children.push({path: '/LoanProdApiAdd', name: 'LoanProdApiAdd', component: r => require.ensure([], () => r(require('@/view/product/LoanProdApiAdd')), 'product')})
  children.push({path: '/LoanProdLinkAdd', name: 'LoanProdLinkAdd', component: r => require.ensure([], () => r(require('@/view/loanProd/LoanProdLinkAdd')), 'loanProd')})
  children.push({path: '/LoanProdApiEdit', name: 'LoanProdApiEdit', component: r => require.ensure([], () => r(require('@/view/product/LoanProdApiEdit')), 'product')})
  children.push({path: '/LoanProdLinkEdit', name: 'LoanProdLinkEdit', component: r => require.ensure([], () => r(require('@/view/loanProd/LoanProdLinkEdit')), 'loanProd')})
  children.push({path: '/prodView', name: 'ProdView', component: r => require.ensure([], () => r(require('@/view/product/ProdView')), 'product')})
  children.push({path: '/prodEdit', name: 'ProdEdit', component: r => require.ensure([], () => r(require('@/view/product/ProdEdit')), 'product')})
  children.push({path: '/riskRuleView', name: 'RiskRuleView', component: r => require.ensure([], () => r(require('@/view/risk/RiskRuleView')), 'risk')})
  children.push({path: '/riskRuleEdit', name: 'RiskRuleEdit', component: r => require.ensure([], () => r(require('@/view/risk/RiskRuleEdit')), 'risk')})
  children.push({path: '/busiDetail', name: 'BusiDetail', component: r => require.ensure([], () => r(require('@/view/business/BusiDetail')), 'business')})
  children.push({path: '/busiVerify', name: 'BusiVerify', component: r => require.ensure([], () => r(require('@/view/business/BusiVerify')), 'business')})
  children.push({path: '/ProdLabelAdd', name: 'ProdLabelAdd', component: r => require.ensure([], () => r(require('@/view/loanProd/ProdLabelAdd')), 'loanProd')})
  children.push({path: '/ProdLabelEdit', name: 'ProdLabelEdit', component: r => require.ensure([], () => r(require('@/view/loanProd/ProdLabelEdit')), 'loanProd')})
  children.push({path: '/FxProdAdd', name: 'FxProdAdd', component: r => require.ensure([], () => r(require('@/view/fx/FxProdAdd')), 'fx')})
  children.push({path: '/FxProdEdit', name: 'FxProdEdit', component: r => require.ensure([], () => r(require('@/view/fx/FxProdEdit')), 'fx')})
  children.push({path: '/FxCustDetail', name: 'FxCustDetail', component: r => require.ensure([], () => r(require('@/view/fx/FxCustDetail')), 'fx')})
  children.push({path: '/FxChannelCustDetail', name: 'FxChannelCustDetail', component: r => require.ensure([], () => r(require('@/view/fx/FxChannelCustDetail')), 'fx')})
  children.push({path: '/FxProgressRecord', name: 'FxProgressRecord', component: r => require.ensure([], () => r(require('@/view/fx/FxProgressRecord')), 'fx')})
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
