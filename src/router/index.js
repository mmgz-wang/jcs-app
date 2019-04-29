import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    //首页
    { path: '/', name: 'Home', component: resolve => require(['../components/home/home'],resolve) },
    { path: '/home', name: 'Home', component: resolve => require(['../components/home/home'],resolve) },
    //首页子页面
    { path: '/vip', name: 'vip', component: resolve => require(['../components/vip/vip'],resolve) },
    { path: '/letterlist', name: 'letterlist', component: resolve => require(['../components/letter/letterlist'],resolve),
        children: [
            {path:'/letterindex', name: 'letterindex', component: resolve => require(['../components/letter/letterindex'],resolve)}
        ]
    },
    { path: '/basketball', name: 'basketball', component: resolve => require(['../components/portal/basketball'],resolve),
        meta: {
            iskeep:false
        }
    },
    { path: '/worldcup', name: 'worldcup', component: resolve => require(['../components/portal/worldcup'],resolve),
      meta: {
        iskeep:false
      }
    },
    { path: '/freelist', name: 'freelist', component: resolve => require(['../components/portal/freelist'],resolve),
      meta: {
        iskeep:false
      }
    },
    { path: '/PublicPage', name: 'PublicPage', component: resolve => require(['../components/portal/publicpage'],resolve),
      meta: {
        iskeep:false
      }
    },
    { path: '/e-sports', name: 'e-sports', component: resolve => require(['../components/portal/e-sports'],resolve),
      meta: {
        iskeep:false
      }
    },
    { path: '/live_articlelist', name: 'live_articlelist', component: resolve => require(['../components/portal/live_articlelist'],resolve)},//portal直播
    { path: '/recordlist', name: 'recordlist', component: resolve => require(['../components/portal/recordlist'],resolve)},//portal红人榜
    { path: '/portal_feed', name: 'portal_feed', 
        component: resolve => require(['../components/portal/poratl-feed'], resolve)},//portal留言墙

    //首页TAB
        //聊天室
    { path: '/roomlist', name: 'roomlist', component: resolve => require(['../components/room/roomlist'],resolve),
      meta: {
        iskeep: false
      }
    },
    {path:'/roomindex', name: 'roomindex', component: resolve => require(['../components/room/roomindex'],resolve),
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },
    //赛事
    { path: '/competition', name: 'competition', component: resolve => require(['../components/competition/competition'],resolve),
        meta: {
            iskeep: true,
            isback: false
        }
    },
    { path: '/matchdetail', name: 'matchdetail', component: resolve => require(['../components/competition/matchdetail'],resolve),
        meta: {
            iskeep: false,
            isback: true
        }
    },

    //关注
    { path: '/attention', name: 'attention', component: resolve => require(['../components/attention/attention'],resolve),
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },
    { path: '/author', name: 'author', component: resolve => require(['../components/author/author'],resolve),
        meta: {
            iskeep: false,
            isback: false
        }
    },
    { path: '/export', name: 'export', component: resolve => require(['../components/author/export'],resolve),
        meta: {
            iskeep: true,
            isback: false
        }
    },
    { path: '/result', name: 'result', component: resolve => require(['../components/author/result'],resolve),
        meta: {
            iskeep: false,
            isback: false
        }
    },
    //我的
    { path: '/my', name: 'my', component: resolve => require(['../components/my/my'],resolve),
        children: [
            { path: 'mypresent', name: 'mypresent', component: resolve => require(['../components/my/my_present'],resolve) },
            { path: 'myCollect', name: 'myCollect', component: resolve => require(['../components/my/my_collect'],resolve) },
            { path: 'myBuy', name: 'my_buy', component: resolve => require(['../components/my/my_buy'],resolve) },
            { 
                path: 'myWallet', name: 'my_wallet', component: resolve => require(['../components/my/my_wallet'],resolve),
                children: [
                    { path: 'exchange', name: 'exchange', component: resolve => require(['../components/my/integral-exchange'],resolve) },
                    { path: 'giftExchange', name: 'giftExchange', component: resolve => require(['../components/my/gift-exchange'],resolve) }
                ]
            },
            { path: 'mymsg', name: 'mymsg', component: resolve => require(['../components/my/my_msg'],resolve) },
            { path: 'canmsg', name: 'canmsg', component: resolve => require(['../components/my/can_message'],resolve) },
            { path: 'help', name:'help', component: resolve => require(['../components/my/help'],resolve) },
            { path: 'nickname', name:'nickName', component: resolve => require(['../components/setting/nickname'],resolve)},
            { path: 'setting', name:'setting', component: resolve => require(['../components/setting/setting'],resolve),
                children: [
                    { path: 'modifi', name: 'modifi', component: resolve => require(['../components/setting/modification'],resolve) },
                    { path: 'change', name: 'change', component: resolve => require(['../components/setting/change'],resolve) },
                    { path: 'our', name: 'our', component: resolve => require(['../components/setting/our'],resolve) },
                    { path: 'remind', name: 'remind', component: resolve => require(['../components/setting/remind'],resolve) }
                ]
            }
        ],
        meta: {
            requiresAuth: true,
            iskeep: false
        }
    },

    //在线客服
    { path: '/service', name:'service', component: resolve => require(['../components/service/service'],resolve)},

    //公用文章详情
    { path: '/articledetail', name: 'articledetail', component: resolve => require(['../components/articledetail/articledetail'],resolve),
        meta: {
            requiresAuth: true,
            iskeep: false,
            isback: false
        }
    },
    { path: '/leavemessage', name: 'leavemessage', component: resolve => require(['../components/leavemessage/leaveMessage'],resolve)},
    { path: '/payfor', name: 'payfor', component: resolve => require(['../components/consume/payfor'],resolve) },
    { path: '/ConsumeList', name: 'ConsumeList', component: resolve => require(['../components/consume/consume-list'],resolve) },
    { path: '/recharge', name: 'recharge', component: resolve => require(['../components/consume/recharge'],resolve),
        children: [
            {path: 'consumerecord', name: 'consumerecord' ,component: resolve => require(['../components/consume/consumerecord'],resolve)}
        ],
        meta: {
            iskeep: false,
            isback: false
        }
    },

    //登录
    { path: '/register', name: 'register', component: resolve => require(['../components/register/register'],resolve) },
    { path: '/enter', name: 'enter', component: resolve => require(['../components/register/enter'],resolve) },
    { path: '/forget', name: 'forget', component: resolve => require(['../components/register/Forget'],resolve) },
    { path: '/download', name: 'download', component: resolve => require(['../components/download/download'],resolve) }
  ],
  scrollBehavior(to, from, savedPosition){

    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
