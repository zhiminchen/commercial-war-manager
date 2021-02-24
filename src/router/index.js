import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import ConfigTableClassify from '../components/table/ConfigTableClassify'
import BrowseTable from '../components/table/BrowseTable'
import ImportTable from '../components/table/ImportTable'
import AllServerMail from '../components/game/AllServerMail'
import HotPatch from '../components/game/HotPatch'
import AllServer from '../components/game/AllServer'
import Permissions from '../components/power/Permissions'
import Character from '../components/power/Character'
import Customer from '../components/user/Customer'
import DAU from '../components/datacount/DAU'
import ADD from '../components/datacount/ADD'
import PlayerParticipation from '../components/datacount/PlayerParticipation'
import PlayerRange from '../components/datacount/PlayerRange'
import InvestmentDetail from '../components/datacount/InvestmentDetail'

import ElementUI, {Message, MessageBox } from 'element-ui'

Vue.use(Router)
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox


const router = new Router({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login', component: Login
    },
    {
      path: '/home', component: Home,
      redirect: '/welcome',
      children : [
        {path : '/welcome' , component: Welcome},
        {path: '/users', component: Users},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/categories', component: Cate},
        {path: '/classifytable', component: ConfigTableClassify},
        {path: '/browsetable', component: BrowseTable},
        {path: '/importtable', component: ImportTable},
        {path: '/allservermail', component: AllServerMail},
        {path: '/hotfix', component: HotPatch},
        {path: '/allserver', component: AllServer},
        {path: '/permissions', component: Permissions},
        {path: '/character', component: Character},
        {path: '/customer', component: Customer},
        {path: '/dau', component: DAU},
        {path: '/add', component: ADD},
        {path: '/participation', component: PlayerParticipation},
        {path: '/range' , component: PlayerRange},
        {path: '/investment', component: InvestmentDetail}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径挑战过来
  // next是一个函数, 表示放行
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }

  next()

})

export default router




