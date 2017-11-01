import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home/home'
import Competition from '../components/competition/competition'
import Attention from '../components/attention/attention'
import My from '../components/my/my'
import Menu from '../components/menu/menu'
import Vip from '../components/vip/vip'
import Basketball from '../components/portal/basketball'
import Live_articlelist from '../components/portal/live_articlelist'
import RecordList from '../components/portal/recordlist'
import RoomList from '../components/room/roomlist'
import RoomIndex from '../components/room/roomindex'
import Article from '../components/articledetail/articledetail'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/home', name: 'home', component: Home,
        children:[
            { path:':id', component: Article}
        ]
    },
    { path: '/roomlist', name: 'roomlist', component: RoomList,
     children:[
            {path:'/roomindex', name: 'roomindex', component: RoomIndex}
        ]
    },
    { path: '/vip', name: 'vip', component: Vip},
    { path: '/basketball', name: 'basketball', component: Basketball},
    { path: '/recordlist', name: 'recordlist', component: RecordList},
    { path: '/live_articlelist', name: 'live_articlelist', component: Live_articlelist},
    { path: '/competition', name: 'competition', component: Competition },
    { path: '/attention', name: 'attention', component: Attention },
    { path: '/my', name: 'my', component: My }
  ]
})
