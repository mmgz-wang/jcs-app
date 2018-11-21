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
    import myWallet from '../components/my/my_wallet'
        import exchange from '../components/my/integral-exchange'
        import giftExchange from '../components/my/gift-exchange'
    import MyCollect from '../components/my/my_collect'
    import MyBuy from '../components/my/my_buy'
    import MyMsg from '../components/my/my_msg'
    import CanMsg from '../components/my/can_message'
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
import leaveMessage from '../components/leavemessage/leaveMessage'

import PayFor from '../components/consume/payfor'
import Recharge from '../components/consume/recharge'
import ConsumeRecord from '../components/consume/consumerecord'
import ConsumeList from '../components/consume/consume-list'
import Register from '../components/register/register'
import EnterIn from '../components/register/enter'
import Forget from '../components/register/Forget'
import Service from '../components/service/service'
import Download from '../components/download/download'
import Remind from '../components/setting/remind'

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
            { path: 'myCollect', name: 'myCollect', component: MyCollect},
            { path: 'myBuy', name: 'my_buy', component: MyBuy },
            { 
                path: 'myWallet', name: 'my_wallet', component: myWallet,
                children: [
                    { path: 'exchange', name: 'exchange', component: exchange },
                    { path: 'giftExchange', name: 'giftExchange', component: giftExchange }
                ]
            },
            { path: 'mymsg', name: 'mymsg', component: MyMsg },
            { path: 'canmsg', name: 'canmsg', component: CanMsg },
            { path: 'help', name:'help', component: Help },
            { path: 'nickname', name:'nickName', component: NickName},
            { path: 'setting', name:'setting', component: Setting,
                children: [
                    { path: 'modifi', name: 'modifi', component: Modification },
                    { path: 'change', name: 'change', component: Change },
                    { path: 'our', name: 'our', component: Our },
                    { path: 'remind', name: 'remind', component: Remind }
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
    { path: '/leavemessage', name: 'leavemessage', component: leaveMessage},
    { path: '/payfor', name: 'payfor', component: PayFor },
    { path: '/ConsumeList', name: 'ConsumeList', component: ConsumeList },
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
    { path: '/download', name: 'download', component: Download }
  ],
  scrollBehavior(to, from, savedPosition){

    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
