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
import CommercialWarDetail from '../components/datacount/CommercialWarDetail'
import MainLinePassDetail from '../components/datacount/MainLinePassDetail'
import PlayerQuery from '../components/player/PlayerQuery'
import OpMainLineTask from '../components/datacount/OpMainLineTask'
import OpPlayerLevel from '../components/datacount/OpPlayerLevel'
import OpNoviceGuide from '../components/datacount/OpNoviceGuide'
import OpRealtime from '../components/datacount/OpRealtime'
import Retained from '../components/datacount/Retained'
import ElementUI, {Message, MessageBox } from 'element-ui'
import LoginServer from '../components/game/LoginList'
import Resource from '../components/datacount/Resource'
import LowPerformance from '../components/game/LowPerformance'
import ServerStarter from '../components/game/ServerStarter'
import PlayerData from '../components/player/PlayerData'
import PlayerAction from '../components/player/PlayerAction'
import DailyTaskBox from '../components/gamedata/DailyTaskBox'
import GameRank from '../components/gamedata/GameRank'
import IdentityLevel from '../components/gamedata/IdentityLevel'
import MainTask from '../components/gamedata/MainTask'
import AroundWorldLevel from '../components/gamedata/AroundWorldLevel'
import AroundWorldTimes from '../components/gamedata/AroundWorldTimes'
import Investment from '../components/gamedata/Investment'
import TradeWarLevel from '../components/gamedata/TradeWarLevel'
import TradeWorldTimes from '../components/gamedata/TradeWorldTimes'
import SuperTech from '../components/gamedata/SuperTech'
import SuperFactory from '../components/gamedata/SuperFactory'
import TalentLevelDistribution from '../components/gamedata/TalentLevelDistribution'
import TalentList from '../components/gamedata/TalentList'
import PlayerResource from '../components/player/PlayerResource'
import DataBaseDiff from '../components/game/DataBaseDiff'
import PlayerSealTalk from '../components/player/PlayerSealTalk'

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
        {path: '/investment', component: InvestmentDetail},
        {path: '/commercialwar', component: CommercialWarDetail},
        {path: '/mainlinepass', component: MainLinePassDetail},
        {path: '/player/find', component: PlayerQuery},
        {path: '/op/mainlinetask' , component: OpMainLineTask},
        {path: '/op/player/level', component: OpPlayerLevel},
        {path: '/op/novice/guide', component: OpNoviceGuide},
        {path: '/op/realtime', component: OpRealtime},
        {path: '/retained', component: Retained},
        {path: '/login/list' , component: LoginServer},
        {path: '/resource' , component: Resource},
        {path: '/low/performance' , component: LowPerformance},
        {path: '/game/starter', component: ServerStarter},
        {path: '/player/data', component: PlayerData},
        {path: '/player/action' , component: PlayerAction},
        {path: '/player/resource', component: PlayerResource},
        {path: '/player/db/diff' , component: DataBaseDiff},
        {path: '/player/seal/talk' , component: PlayerSealTalk},
        {path: '/daily/task' , component: DailyTaskBox},
        {path: '/game/rank' , component: GameRank},
        {path: '/game/identity/level' , component: IdentityLevel},
        {path: '/game/main/task' , component: MainTask},
        {path: '/game/around/world/level', component: AroundWorldLevel},
        {path: '/game/around/world/times', component: AroundWorldTimes},
        {path: '/game/investment', component:  Investment},
        {path: '/game/trade/war/level', component:  TradeWarLevel},
        {path: '/game/trade/war/times', component: TradeWorldTimes},
        {path: '/game/super/tech', component: SuperTech},
        {path: '/game/super/factory' , component: SuperFactory},
        {path: '/game/talent/level', component: TalentLevelDistribution},
        {path: '/game/talent/list' , component: TalentList},
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




