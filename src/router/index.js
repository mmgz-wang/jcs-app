import Vue from 'vue'
import Router from 'vue-router'
//首页
import Home from '../components/home/home'
import Vip from '../components/vip/vip'
import Basketball from '../components/portal/basketball'
import Worldcup from '../components/portal/worldcup'

import Live_articlelist from '../components/portal/live_articlelist'
import RecordList from '../components/portal/recordlist'
import Letterlist from '../components/letter/letterlist'
import Letterindex from '../components/letter/letterindex'
import FreeList from '../components/portal/freelist'

//TAB
import RoomList from '../components/room/roomlist'
    import RoomIndex from '../components/room/roomindex'
import Competition from '../components/competition/competition'
import MatchDetail from '../components/competition/matchdetail'
import Attention from '../components/attention/attention'

import My from '../components/my/my'
    import MyPresent from '../components/my/my_present'
    import MyCollect from '../components/my/my_collect'
    import MyBuy from '../components/my/my_buy'
    import Help from '../components/my/help'
    import Setting from '../components/setting/setting'
        import Change from '../components/setting/change'
        import Modification from '../components/setting/modification'
        import Our from '../components/setting/our'
        import NickName from '../components/setting/nickname'

import Author from '../components/author/author'
import Export from '../components/author/export'
import Result from '../components/author/result'

import Esports from '../components/portal/e-sports'
import Article from '../components/articledetail/articledetail'

import PayFor from '../components/consume/payfor'
import Recharge from '../components/consume/recharge'
import ConsumeRecord from '../components/consume/consumerecord'
import Register from '../components/register/register'
import EnterIn from '../components/register/enter'
import Forget from '../components/register/Forget'
import Service from '../components/service/service'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    //首页
    { path: '/', name: 'Home', component: Home },
    { path: '/home', name: 'Home', component: Home },
    //首页子页面
    { path: '/vip', name: 'vip', component: Vip },
    { path: '/letterlist', name: 'letterlist', component: Letterlist,
        children: [
            {path:'/letterindex', name: 'letterindex', component: Letterindex}
        ]
    },
    { path: '/basketball', name: 'basketball', component: Basketball,
        meta: {
            iskeep:false
        }
    },
    { path: '/worldcup', name: 'worldcup', component: Worldcup,
      meta: {
        iskeep:false
      }
    },
    { path: '/freelist', name: 'freelist', component: FreeList,
      meta: {
        iskeep:false
      }
    },
    { path: '/e-sports', name: 'e-sports', component: Esports,
      meta: {
        iskeep:false
      }
    },
    { path: '/live_articlelist', name: 'live_articlelist', component: Live_articlelist},//portal直播
    { path: '/recordlist', name: 'recordlist', component: RecordList},//portal红人榜

    //首页TAB
        //聊天室
    { path: '/roomlist', name: 'roomlist', component: RoomList,
      meta: {
        iskeep: false
      }
    },
    {path:'/roomindex', name: 'roomindex', component: RoomIndex,
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },
    //赛事
    { path: '/competition', name: 'competition', component: Competition,
        meta: {
            iskeep: true,
            isback: false
        }
    },
    { path: '/matchdetail', name: 'matchdetail', component: MatchDetail,
        meta: {
            iskeep: false,
            isback: true
        }
    },

    //关注
    { path: '/attention', name: 'attention', component: Attention,
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },
    { path: '/author', name: 'author', component: Author,
        meta: {
            iskeep: false,
            isback: false
        }
    },
    { path: '/export', name: 'export', component: Export,
        meta: {
            iskeep: true,
            isback: false
        }
    },
    { path: '/result', name: 'result', component: Result,
        meta: {
            iskeep: false,
            isback: false
        }
    },
    //我的
    { path: '/my', name: 'my', component: My,
        children: [
            { path: 'mypresent', name: 'mypresent', component: MyPresent },
            { path: 'myCollect', name: 'myCollect', component: MyCollect },
            { path: 'myBuy', name: 'my_buy', component: MyBuy },
            { path: 'help', name:'help', component: Help },
            { path: 'nickname', name:'nickName', component: NickName},
            { path: 'setting', name:'setting', component: Setting,
                children: [
                    { path: 'modifi', name: 'modifi', component: Modification },
                    { path: 'change', name: 'change', component: Change },
                    { path: 'our', name: 'our', component: Our }
                ]
            }
        ],
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },

    //在线客服
    { path: '/service', name:'service', component: Service},

    //公用文章详情
    { path: '/articledetail', name: 'articledetail', component: Article,
        meta: {
            requiresAuth: true,
            iskeep: false,
            isback: false
        }
    },
    { path: '/payfor', name: 'payfor', component: PayFor },
    { path: '/recharge', name: 'recharge', component: Recharge,
        children: [
            {path: 'consumerecord', name: 'consumerecord' ,component: ConsumeRecord}
        ],
        meta: {
            iskeep: false,
            isback: false
        }
    },

    //登录
    { path: '/register', name: 'register', component: Register },
    { path: '/enter', name: 'enter', component: EnterIn },
    { path: '/forget', name: 'forget', component: Forget },
  ],
  scrollBehavior(to, from, savedPosition){

    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
