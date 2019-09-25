<template>
  <div class="home">
    <header>
      <router-link to="/vip"><span class="hd-vip">文章</span></router-link>
      <img src="../../common/img/jcs.png">
      <span class="letter" @click="goLetter()">私信</span>
      <span class="expert-in" @click="expertIn">专家</span>
    </header>
    <nav class="tab">
      <router-link to="/roomlist">聊天室</router-link>
      <router-link to="/competition">赛事</router-link>
      <router-link to="/attention">关注</router-link>
      <router-link to="/my">我的</router-link>
    </nav>
    <scroll
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingDownFn="pullingDownFn"
      :pullingUpFn="pullingUpFn"
      :istrue = istrue
      :isback = isback
      ref="Scroll"
      class="container" :data="articleDataList">
      <div class="scroll-wrap">
        <p pulldown>{{pullDownText}}</p>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
        <div>
            <banner v-if="banners.length>0" :bannerData="banners" @bannerClick="bannerClick"></banner>
            <!-- 菜单 -->
            <portal @portalClick="portalClick" :portals="portals"></portal>  
              <template v-for="(item,index) in articleDataList">
                <!-- 列表 -->
                <article-list
                  v-if="item.otype == 1 || item.otype == undefined"
                  @goarticle="goarticle"
                  :topMargin='true'
                  :item="item">
                </article-list>
                <!-- <guess-item
                v-else-if="item.otype == 4"
                @guessTeamClick="guessTeamClick"
                :item="item">
                </guess-item> -->
                  <template v-else-if="item.otype == 4 && index==articleDataList.guessIndex"
                            v-for="guessItem in articleDataList.guessItems" >
                    <!-- 竞猜 -->
                    <!-- <div style="fontSize:12px">{{articleDataList.guessItems}}</div> -->
                    <guess-item
                      
                      :guess="guessItem"
                      :moneyArr="moneyArr"
                      @showDiag="showDiag(index)"
                      @hideDiag="hideDiag(guessItem)">
                    </guess-item>
                  </template>
                <room-list
                  :item="item"
                  v-if="item.otype == 3"></room-list>
              </template>
              <div style='height:50px'></div>
          </div>
        </div>
        <p pullup>{{pullUpText}}</p>
      
    </scroll>
    
    <!-- <router-view></router-view> -->
    <guess-dialog
      :moneyArr="moneyArr"
      ref="guessDialog"></guess-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import banner from 'base/banner/banner'
  import portal from './portal'
  import Common from 'common/js/common'
  import articleList from 'base/articlelist/articlelist'
  import guessItem from 'base/guessitem/guessitem2'
  import guessMixin from 'base/mixins/guess_mixin'
  import guessDialog from 'base/guessdialog/guessdialog'
  import roomList from 'base/roomlist-item/roomlist-item'
  import query from 'querystring'
  import wxApi from 'common/js/wxapi'
  import menu from  '../menu/menu'
   

  export default {
    mixins: [guessMixin],
    data() {
      return {
        banners: [],
        portals: [],
        articleDataList: [],
        types: 0,
        lastArticleId: 0,
        needRefresh: true,
        pullDownRefresh: {threshold: 50, stop: 20},
        pullUpLoad: {threshold: 0},
        pullDownText: '下拉刷新！',
        pullUpText: '上拉加载更多！',
        reloads: false,
        $routerPath: [],
        curGuessItem: null,
        moneyArr: [],
        isDiag: false,
        istrue: true,
        isback:true,
        clientHeight:document.documentElement.clientHeight,
      }
    },
    components: {
      banner,
      portal,
      articleList,
      Scroll,
      loading,
      guessDialog,
      guessItem,
      roomList
    },
    created() {
     
    },
    mounted: function () {
      this.top = 0;
      this.getData();
      this.initMoneyArr();
      this.$routerPath = this.$router.path;
      this.wxInit();
    },
    methods: {
      //微信初始化
      wxInit() {
        wxApi.wxRegister();
        let that = this;
        wx.ready(function () {
          that.wxShareAppMessage();
          that.wxShareTimeline();
        });
      },
      //分享到朋友圈
      wxShareTimeline() {
        let option = {
          title: '精彩说',
          link: location.href,
          imgUrl: 'http://www.jingcaishuo.com/favicon.ico',
          success: () => {
          }
        };
        wxApi.ShareTimeline(option);
      },
      //分享给朋友
      wxShareAppMessage() {
        let option = {
          title: '精彩说',
          desc: '专家秘籍,独家策略',
          link: location.href,
          imgUrl: 'http://www.jingcaishuo.com/favicon.ico',
          success: () => {
          }
        };
        wxApi.ShareAppMessage(option);
      },
      initMoneyArr() {
        //获取投注额度列表
        this.$http.jsonp(
          Common.baseURI().host + '/assets/getGuessMoneyConfig?time=' + Math.random(),
          {
            params: {}
          }
        ).then(function (res) {
          this.moneyArr = res.data;
          // console.log('投注额列表', this.moneyArr);
        });
      },
      pullingDownFn(scroll) {
        this.types = 0;
        this.lastArticleId = 0;
        this.pullDownText = '努力加载中 ...';
        this.getData();
        // console.log('------------------');
      },
      pullingUpFn(scroll) {
        if (this.isDiag || this.tool) {
          return false;
        }
        this.types = 1;
        this.pullUpText = '努力加载中 ...';
        this.getData();
        // console.log('+++++++++++++++++++');
      },
      showDiag() {
        this.isDiag = true;
        this.istrue = false;
        this.isback = true
        // console.log(this.istrue,this.isback)
        
      },
      hideDiag() {
        this.isDiag = false;
        this.isback = false;
        this.istrue = true
        // console.log(this.istrue,this.isback)
      },
      getData() {
        if (this.reloads) {
          return;
        }
        this.$nextTick(function () {
          this.$http.jsonp(
            `${Common.baseURI().host}/top-header/?time=${Math.random()}`,
            {
              params: {
                language: 'M',
                articleId: this.lastArticleId,
                userId: this.shareFn.getUserId(),
                ver: 2
              }
            }
          ).then(function (res) {
            // console.log(`${Common.baseURI().host}/top-header/?time=${Math.random()}`)
            // console.log('返回数据:', res.data);
            // console.log('首页返回JSON数据:',JSON.stringify(res.data));
           res.data = {
              "msg": "请求成功！", "result": {
                "data": {
                  "Banner": [{
                    "h5Url": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180612_095018635000_143.jpg",
                    "target_type": "article",
                    "target_id": "1233",
                    "id": 49
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/jc/wap/index.html?r=2&amp;header=1#/sportHome",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180612_100349438380_552.jpg",
                    "target_type": "h5",
                    "target_id": "1",
                    "id": 51
                  }, {
                    "h5Url": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180612_101046079263_897.png",
                    "target_type": "article",
                    "target_id": "1234",
                    "id": 52
                  }, {
                    "h5Url": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180612_115656765000_914.jpg",
                    "target_type": "article",
                    "target_id": "2222",
                    "id": 53
                  }, {
                    "h5Url": "https://www.baidu.com/",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1d6a7bcb8a37e789/20180725_174812195000_57.jpg",
                    "target_type": "article",
                    "target_id": "137771",
                    "id": 54
                  }, {
                    "h5Url": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20190228_233430356497_372.jpg",
                    "target_type": "article",
                    "target_id": "111",
                    "id": 55
                  }],
                  "Portal": [{
                    "h5Url": "https://www.jingcaishuo.com/mandarin_h5_html_test/portal-feedback",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180529_150751436740_707.png",
                    "target_url": "https://www.jingcaishuo.com/mandarin_h5_html_test/portal-feedback",
                    "name": "留言墙",
                    "showChannelFlag": false,
                    "id": 121,
                    "showUserFlag": false
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/mandarin_h5_html_test/lecture_mandarin/index.html?id=801",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20190228_233403512281_476.jpg",
                    "target_url": "http://www.jingcaishuo.com/mandarin_h5_html_test/lecture_mandarin/index.html?id=801",
                    "name": "精选文章",
                    "showChannelFlag": false,
                    "id": 137,
                    "showUserFlag": false
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/mandarin_h5_html/allart_list/",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20181031_141446009108_332.png",
                    "target_url": "http://www.jingcaishuo.com/mandarin_h5_html/allart_list/",
                    "name": "全部文章",
                    "showChannelFlag": false,
                    "id": 136,
                    "showUserFlag": false
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/mandarin_h5_html_test/guessList/index.html",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20190402_115911390718_652.jpg",
                    "target_url": "http://www.jingcaishuo.com/mandarin_h5_html_test/guessList/index.html",
                    "name": "竞猜",
                    "showChannelFlag": false,
                    "id": 138,
                    "showUserFlag": false
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/mandarin_h5_html_test/guessList/index.html",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20190810_183309303209_826.png",
                    "target_url": "http://www.jingcaishuo.com/mandarin_h5_html_test/guessList/index.html",
                    "name": "晒战绩",
                    "showChannelFlag": false,
                    "id": 139,
                    "showUserFlag": false
                  }, {
                    "h5Url": "http://www.jingcaishuo.com/mandarin_h5_html_test/chartroom/list.html",
                    "showChannelValue": "",
                    "showUserValue": "",
                    "img_url": "https://api.jingcaishuo.com//static/upfiles/analyst/1101f42a64606aed/20180907_183131686702_262.jpg",
                    "target_url": "http://www.jingcaishuo.com/mandarin_h5_html_test/chartroom/list.html",
                    "name": "聊天室",
                    "showChannelFlag": false,
                    "id": 135,
                    "showUserFlag": false
                  }],
                  "Code": "0000"
                },
                "integral": "666",
                "bet.prices.list": ["10", "20", "50", "100", "400", "800"],
                "artileList": [{
                  "articleCount": 1,
                  "articleList": [],
                  "awayTeam": "马兰",
                  "cupName": "印尼冠",
                  "homeTeam": "帕尔斯卡麦特罗",
                  "isRollball": 0,
                  "lotteryMatchId": 582452,
                  "lottery_entry_id": 582286,
                  "manualdata": "0,0:0",
                  "matchId": "",
                  "matchScore": {
                    "guestTeamCoreNode1": "0",
                    "guestTeamCoreNode2": "0",
                    "guestTeamCoreNode3": "0",
                    "guestTeamCoreNode4": "0",
                    "guestTeamHalfScore": "0",
                    "guestTeamOt1": "0",
                    "guestTeamOt2": "0",
                    "guestTeamOt3": "0",
                    "guestTeamScore": "0",
                    "homeTeamCoreNode1": "0",
                    "homeTeamCoreNode2": "0",
                    "homeTeamCoreNode3": "0",
                    "homeTeamCoreNode4": "0",
                    "homeTeamHalfScore": "0",
                    "homeTeamOt1": "0",
                    "homeTeamOt2": "0",
                    "homeTeamOt3": "0",
                    "homeTeamScore": "0",
                    "matchStatus": "0"
                  },
                  "otype": "2",
                  "scoutMatchId": 1642563,
                  "sportType": "0",
                  "startTime": "11-20 16:00",
                  "startTime2": "2018-11-20 16:00:00+08",
                  "week": 3,
                  "weight": 10
                },
                  {
                    "alreadyPay": false,
                    "articleMatchList": [{
                      "dishAnalysis": "",
                      "fundamentalAnalysis": "",
                      "matchId": 832860,
                      "playList": [{
                        "articleId": 138942,
                        "id": 3927,
                        "matchId": 832860,
                        "playDetailList": [],
                        "recommendReason": "",
                        "type": 11
                      }],
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "articlePraised": false,
                    "authorFollowed": false,
                    "authorLevels": [],
                    "authorName": "CS老师",
                    "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                    "authorScore": "3.9",
                    "authorWin": {
                      "tc_redblack_30": {
                        "black": "0",
                        "continuous_black_3": "0",
                        "continuous_red_3": "0",
                        "max_continuous_black": "0",
                        "max_continuous_red": "0",
                        "red": "0",
                        "red_black_status": []
                      }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                    },
                    "author_id": "281",
                    "certificationinfo": "",
                    "chargeable": false,
                    "date_added": "2019-05-10 14:53:11.962506+08",
                    "digest": "222222222222222222222",
                    "id": "138942",
                    "includeBb": false,
                    "includeFb": true,
                    "isNewest": "1",
                    "last_modified": "2019-05-10 14:53:11.962506+08",
                    "matches": [{
                      "away_team": "乌拉尔",
                      "cup_name": "俄超",
                      "dishAnalysis": "",
                      "entry_id": "832694",
                      "fundamentalAnalysis": "",
                      "home_team": "奥伦堡加索维克",
                      "id": 832860,
                      "matchFlag": "",
                      "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "playNum": 1,
                    "portal_list": [],
                    "price": "0",
                    "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                    "singleUnlock": true,
                    "sourceText": "",
                    "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                    "text": "",
                    "type": "20"
                  },{
                    "alreadyPay": false,
                    "articleMatchList": [{
                      "dishAnalysis": "",
                      "fundamentalAnalysis": "",
                      "matchId": 832860,
                      "playList": [{
                        "articleId": 138942,
                        "id": 3927,
                        "matchId": 832860,
                        "playDetailList": [],
                        "recommendReason": "",
                        "type": 11
                      }],
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "articlePraised": false,
                    "authorFollowed": false,
                    "authorLevels": [],
                    "authorName": "CS老师",
                    "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                    "authorScore": "3.9",
                    "authorWin": {
                      "tc_redblack_30": {
                        "black": "0",
                        "continuous_black_3": "0",
                        "continuous_red_3": "0",
                        "max_continuous_black": "0",
                        "max_continuous_red": "0",
                        "red": "0",
                        "red_black_status": []
                      }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                    },
                    "author_id": "281",
                    "certificationinfo": "",
                    "chargeable": false,
                    "date_added": "2019-05-10 14:53:11.962506+08",
                    "digest": "222222222222222222222",
                    "id": "138942",
                    "includeBb": false,
                    "includeFb": true,
                    "isNewest": "1",
                    "last_modified": "2019-05-10 14:53:11.962506+08",
                    "matches": [{
                      "away_team": "乌拉尔",
                      "cup_name": "俄超",
                      "dishAnalysis": "",
                      "entry_id": "832694",
                      "fundamentalAnalysis": "",
                      "home_team": "奥伦堡加索维克",
                      "id": 832860,
                      "matchFlag": "",
                      "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "playNum": 1,
                    "portal_list": [],
                    "price": "0",
                    "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                    "singleUnlock": true,
                    "sourceText": "",
                    "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                    "text": "",
                    "type": "20"
                  },
                  {
                    "alreadyPay": false,
                    "articleMatchList": [{
                      "dishAnalysis": "",
                      "fundamentalAnalysis": "",
                      "matchId": 832860,
                      "playList": [{
                        "articleId": 138942,
                        "id": 3927,
                        "matchId": 832860,
                        "playDetailList": [],
                        "recommendReason": "",
                        "type": 11
                      }],
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "articlePraised": false,
                    "authorFollowed": false,
                    "authorLevels": [],
                    "authorName": "CS老师",
                    "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                    "authorScore": "3.9",
                    "authorWin": {
                      "tc_redblack_30": {
                        "black": "0",
                        "continuous_black_3": "0",
                        "continuous_red_3": "0",
                        "max_continuous_black": "0",
                        "max_continuous_red": "0",
                        "red": "0",
                        "red_black_status": []
                      }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                    },
                    "author_id": "281",
                    "certificationinfo": "",
                    "chargeable": false,
                    "date_added": "2019-05-10 14:53:11.962506+08",
                    "digest": "222222222222222222222",
                    "id": "138942",
                    "includeBb": false,
                    "includeFb": true,
                    "isNewest": "1",
                    "last_modified": "2019-05-10 14:53:11.962506+08",
                    "matches": [{
                      "away_team": "乌拉尔",
                      "cup_name": "俄超",
                      "dishAnalysis": "",
                      "entry_id": "832694",
                      "fundamentalAnalysis": "",
                      "home_team": "奥伦堡加索维克",
                      "id": 832860,
                      "matchFlag": "",
                      "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "playNum": 1,
                    "portal_list": [],
                    "price": "0",
                    "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                    "singleUnlock": true,
                    "sourceText": "",
                    "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                    "text": "",
                    "type": "20"
                  },
                  {
                    "alreadyPay": false,
                    "articleMatchList": [{
                      "dishAnalysis": "",
                      "fundamentalAnalysis": "",
                      "matchId": 832860,
                      "playList": [{
                        "articleId": 138942,
                        "id": 3927,
                        "matchId": 832860,
                        "playDetailList": [],
                        "recommendReason": "",
                        "type": 11
                      }],
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "articlePraised": false,
                    "authorFollowed": false,
                    "authorLevels": [],
                    "authorName": "CS老师",
                    "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                    "authorScore": "3.9",
                    "authorWin": {
                      "tc_redblack_30": {
                        "black": "0",
                        "continuous_black_3": "0",
                        "continuous_red_3": "0",
                        "max_continuous_black": "0",
                        "max_continuous_red": "0",
                        "red": "0",
                        "red_black_status": []
                      }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                    },
                    "author_id": "281",
                    "certificationinfo": "",
                    "chargeable": false,
                    "date_added": "2019-05-10 14:53:11.962506+08",
                    "digest": "222222222222222222222",
                    "id": "138942",
                    "includeBb": false,
                    "includeFb": true,
                    "isNewest": "1",
                    "last_modified": "2019-05-10 14:53:11.962506+08",
                    "matches": [{
                      "away_team": "乌拉尔",
                      "cup_name": "俄超",
                      "dishAnalysis": "",
                      "entry_id": "832694",
                      "fundamentalAnalysis": "",
                      "home_team": "奥伦堡加索维克",
                      "id": 832860,
                      "matchFlag": "",
                      "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "playNum": 1,
                    "portal_list": [],
                    "price": "0",
                    "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                    "singleUnlock": true,
                    "sourceText": "",
                    "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                    "text": "",
                    "type": "20"
                  },
                  {
                    "alreadyPay": false,
                    "articleMatchList": [{
                      "dishAnalysis": "",
                      "fundamentalAnalysis": "",
                      "matchId": 832860,
                      "playList": [{
                        "articleId": 138942,
                        "id": 3927,
                        "matchId": 832860,
                        "playDetailList": [],
                        "recommendReason": "",
                        "type": 11
                      }],
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "articlePraised": false,
                    "authorFollowed": false,
                    "authorLevels": [],
                    "authorName": "CS老师",
                    "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                    "authorScore": "3.9",
                    "authorWin": {
                      "tc_redblack_30": {
                        "black": "0",
                        "continuous_black_3": "0",
                        "continuous_red_3": "0",
                        "max_continuous_black": "0",
                        "max_continuous_red": "0",
                        "red": "0",
                        "red_black_status": []
                      }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                    },
                    "author_id": "281",
                    "certificationinfo": "",
                    "chargeable": false,
                    "date_added": "2019-05-10 14:53:11.962506+08",
                    "digest": "222222222222222222222",
                    "id": "138942",
                    "includeBb": false,
                    "includeFb": true,
                    "isNewest": "1",
                    "last_modified": "2019-05-10 14:53:11.962506+08",
                    "matches": [{
                      "away_team": "乌拉尔",
                      "cup_name": "俄超",
                      "dishAnalysis": "",
                      "entry_id": "832694",
                      "fundamentalAnalysis": "",
                      "home_team": "奥伦堡加索维克",
                      "id": 832860,
                      "matchFlag": "",
                      "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                      "sportType": "0",
                      "start_time": "2019-05-10 16:30:00+08"
                    }],
                    "playNum": 1,
                    "portal_list": [],
                    "price": "0",
                    "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                    "singleUnlock": true,
                    "sourceText": "",
                    "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                    "text": "",
                    "type": "20"
                  },{
                  "comment": "发布高水",
                  "end_time": "2019-08-17 23:59:00+08",
                  "handicap_name": "全场进球：",
                  "handicap_plan": "2/2.5",
                  "handicap_refe": "2/2.5",
                  "id": 444978,
                  "initiator_id": 0,
                  "invest_max": 0,
                  "match_league": "西乙",
                  "match_result": "",
                  "match_st_id": 1742687,
                  "match_teams": "卢高 VS 艾斯马度华",
                  "odd_id": 5351113,
                  "odd_type": 1,
                  "otype": "4",
                  "source": 2,
                  "sportType": 0,
                  "start_time": "2019-08-16 02:31:27+08",
                  "status": 1,
                  "type": 2,
                  "value1_name": "大球",
                  "value1_plan": "1.08",
                  "value1_purnum": 96,
                  "value1_purper": "46.0",
                  "value1_refe": "1.01",
                  "value2_name": "小球",
                  "value2_plan": "0.92",
                  "value2_purnum": 111,
                  "value2_purper": "54",
                  "value2_refe": "0.86",
                  "weight": 9
                },{
                  "comment": "发布高水",
                  "end_time": "2019-08-17 23:59:00+08",
                  "handicap_name": "全场让球：",
                  "handicap_plan": "0/0.5",
                  "handicap_refe": "0/0.5",
                  "id": 444977,
                  "initiator_id": 0,
                  "invest_max": 0,
                  "match_league": "西乙",
                  "match_result": "",
                  "match_st_id": 1742687,
                  "match_teams": "卢高 VS 艾斯马度华",
                  "odd_id": 5359286,
                  "odd_type": 1,
                  "otype": "4",
                  "source": 2,
                  "sportType": 0,
                  "start_time": "2019-08-16 02:31:27+08",
                  "status": 1,
                  "type": 2,
                  "value1_name": "主队",
                  "value1_plan": "1.01",
                  "value1_purnum": 162,
                  "value1_purper": "57.0",
                  "value1_refe": "0.96",
                  "value2_name": "客队",
                  "value2_plan": "0.98",
                  "value2_purnum": 122,
                  "value2_purper": "43",
                  "value2_refe": "0.94",
                  "weight": 8
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 954460,
                    "playList": [{
                      "articleId": 139044,
                      "id": 4008,
                      "matchId": 954460,
                      "playDetailList": [],
                      "recommendReason": "",
                      "type": 26
                    }],
                    "sportType": "0",
                    "start_time": "2019-08-08 20:30:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [{"app_show": true, "id": 100728, "termmonths": 0}, {
                    "app_show": true,
                    "id": 100727,
                    "termmonths": 0
                  }, {"app_show": true, "id": 100726, "termmonths": 1}, {
                    "app_show": true,
                    "id": 100725,
                    "termmonths": 3
                  }, {"app_show": true, "id": 100724, "termmonths": 6}, {
                    "app_show": true,
                    "id": 100723,
                    "termmonths": 12
                  }],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-08-08 20:08:42.108131+08",
                  "digest": "测试新的sdk",
                  "id": "139044",
                  "includeBb": false,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-08-08 20:08:42.108131+08",
                  "matches": [{
                    "away_team": "培坎U23",
                    "cup_name": "伊U23",
                    "dishAnalysis": "",
                    "entry_id": "954294",
                    "fundamentalAnalysis": "",
                    "home_team": "莫格哈维特德黑兰U23",
                    "id": 954460,
                    "matchFlag": "",
                    "remark": "{\"big\":\"伊U23\",\"color\":\"#9933FF\",\"createTime\":1565266080141,\"en\":\"IRN U23 \",\"gameStartTime\":null,\"gameTime\":\"2019/8/8 20:30:00\",\"gb\":\"伊U23\",\"guessEndTime\":-1,\"guestTeamBig\":\"培坎U23\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Paykan U23\",\"guestTeamGb\":\"培坎U23\",\"guestTeamHalfScore\":null,\"guestTeamId\":39859,\"guestTeamRank\":null,\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"莫格哈維特德黑蘭U23\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Moghavemat Tehran U23\",\"homeTeamGb\":\"莫格哈维特德黑兰U23\",\"homeTeamHalfScore\":null,\"homeTeamId\":39880,\"homeTeamRank\":null,\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":1221,\"level\":\"0\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1769078,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":null,\"subLeagueId\":null}",
                    "sportType": "0",
                    "start_time": "2019-08-08 20:30:00+08"
                  }],
                  "playNum": 1,
                  "portal_list": [],
                  "price": "18",
                  "sign_key": "796697AABBE54D05AAC0027C9E8F249C",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>初始指数大小分</i>",
                  "text": "",
                  "type": "10"
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 860974,
                    "playList": [{
                      "articleId": 139035,
                      "id": 3999,
                      "matchId": 860974,
                      "playDetailList": [],
                      "recommendReason": "",
                      "type": 21
                    }],
                    "sportType": "0",
                    "start_time": "2019-05-21 17:00:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [{"app_show": true, "id": 100728, "termmonths": 0}, {
                    "app_show": true,
                    "id": 100727,
                    "termmonths": 0
                  }, {"app_show": true, "id": 100726, "termmonths": 1}, {
                    "app_show": true,
                    "id": 100725,
                    "termmonths": 3
                  }, {"app_show": true, "id": 100724, "termmonths": 6}, {
                    "app_show": true,
                    "id": 100723,
                    "termmonths": 12
                  }],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-05-21 16:27:57.473069+08",
                  "digest": "水电费所发生的发",
                  "id": "139035",
                  "includeBb": false,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-05-21 16:27:57.473069+08",
                  "matches": [{
                    "away_team": "林同",
                    "cup_name": "越南乙",
                    "dishAnalysis": "",
                    "entry_id": "860808",
                    "fundamentalAnalysis": "",
                    "home_team": "昆嵩",
                    "id": 860974,
                    "matchFlag": "",
                    "remark": "{\"big\":\"越南乙\",\"color\":\"#255A4F\",\"createTime\":1558427220183,\"en\":\"VIE D3 \",\"gameStartTime\":null,\"gameTime\":\"2019/5/21 17:00:00\",\"gb\":\"越南乙\",\"guestTeamBig\":\"林同\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Lam Dong\",\"guestTeamGb\":\"林同\",\"guestTeamHalfScore\":null,\"guestTeamId\":20034,\"guestTeamRank\":null,\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"昆嵩\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Kon Tum\",\"homeTeamGb\":\"昆嵩\",\"homeTeamHalfScore\":null,\"homeTeamId\":31120,\"homeTeamRank\":null,\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":1394,\"level\":\"0\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1714383,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":null,\"subLeagueId\":null}",
                    "sportType": "0",
                    "start_time": "2019-05-21 17:00:00+08"
                  }],
                  "playNum": 1,
                  "portal_list": [],
                  "price": "40",
                  "sign_key": "A5DE841B65064D189F7FB55E750960CC",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>初始指数欧洲指数</i>",
                  "text": "",
                  "type": "10"
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 860974,
                    "playList": [{
                      "articleId": 139033,
                      "id": 3997,
                      "matchId": 860974,
                      "playDetailList": [],
                      "recommendReason": "",
                      "type": 21
                    }],
                    "sportType": "0",
                    "start_time": "2019-05-21 17:00:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [{"app_show": true, "id": 100728, "termmonths": 0}, {
                    "app_show": true,
                    "id": 100727,
                    "termmonths": 0
                  }, {"app_show": true, "id": 100726, "termmonths": 1}, {
                    "app_show": true,
                    "id": 100725,
                    "termmonths": 3
                  }, {"app_show": true, "id": 100724, "termmonths": 6}, {
                    "app_show": true,
                    "id": 100723,
                    "termmonths": 12
                  }],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-05-21 16:26:47.69251+08",
                  "digest": "法第三方士大夫",
                  "id": "139033",
                  "includeBb": false,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-05-21 16:26:47.69251+08",
                  "matches": [{
                    "away_team": "林同",
                    "cup_name": "越南乙",
                    "dishAnalysis": "",
                    "entry_id": "860808",
                    "fundamentalAnalysis": "",
                    "home_team": "昆嵩",
                    "id": 860974,
                    "matchFlag": "",
                    "remark": "{\"big\":\"越南乙\",\"color\":\"#255A4F\",\"createTime\":1558427040115,\"en\":\"VIE D3 \",\"gameStartTime\":null,\"gameTime\":\"2019/5/21 17:00:00\",\"gb\":\"越南乙\",\"guestTeamBig\":\"林同\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Lam Dong\",\"guestTeamGb\":\"林同\",\"guestTeamHalfScore\":null,\"guestTeamId\":20034,\"guestTeamRank\":null,\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"昆嵩\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Kon Tum\",\"homeTeamGb\":\"昆嵩\",\"homeTeamHalfScore\":null,\"homeTeamId\":31120,\"homeTeamRank\":null,\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":1394,\"level\":\"0\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1714383,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":null,\"subLeagueId\":null}",
                    "sportType": "0",
                    "start_time": "2019-05-21 17:00:00+08"
                  }],
                  "playNum": 1,
                  "portal_list": [],
                  "price": "20",
                  "sign_key": "2BF3993B255B4891892A2E8CE2FBDCE6",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>初始指数欧洲指数</i>",
                  "text": "",
                  "type": "10"
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 832860,
                    "playList": [{
                      "articleId": 138942,
                      "id": 3927,
                      "matchId": 832860,
                      "playDetailList": [],
                      "recommendReason": "",
                      "type": 11
                    }],
                    "sportType": "0",
                    "start_time": "2019-05-10 16:30:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": false,
                  "date_added": "2019-05-10 14:53:11.962506+08",
                  "digest": "222222222222222222222",
                  "id": "138942",
                  "includeBb": false,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-05-10 14:53:11.962506+08",
                  "matches": [{
                    "away_team": "乌拉尔",
                    "cup_name": "俄超",
                    "dishAnalysis": "",
                    "entry_id": "832694",
                    "fundamentalAnalysis": "",
                    "home_team": "奥伦堡加索维克",
                    "id": 832860,
                    "matchFlag": "",
                    "remark": "{\"big\":\"俄超\",\"color\":\"#006699\",\"createTime\":1557471060250,\"en\":\"RUS PR \",\"gameStartTime\":null,\"gameTime\":\"2019/5/10 16:30:00\",\"gb\":\"俄超\",\"guestTeamBig\":\"烏拉爾\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Ural Sverdlovsk Oblast\",\"guestTeamGb\":\"乌拉尔\",\"guestTeamHalfScore\":null,\"guestTeamId\":2450,\"guestTeamRank\":\"11\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奧倫堡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Gazovik Orenburg\",\"homeTeamGb\":\"奥伦堡加索维克\",\"homeTeamHalfScore\":null,\"homeTeamId\":5755,\"homeTeamRank\":\"8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"1\",\"leagueId\":10,\"level\":\"1\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1559170,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":\"联赛\",\"subLeagueId\":\"591\"}",
                    "sportType": "0",
                    "start_time": "2019-05-10 16:30:00+08"
                  }],
                  "playNum": 1,
                  "portal_list": [],
                  "price": "0",
                  "sign_key": "7489F7E97D8D40A1B56BB9310BA3DA32",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>竞彩方案胜平负/让球胜平负</i>",
                  "text": "",
                  "type": "20"
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 723243,
                    "playList": [{
                      "articleId": 138326,
                      "id": 3312,
                      "matchId": 723243,
                      "playDetailList": [],
                      "type": 26
                    }],
                    "sportType": "0",
                    "start_time": "2019-02-26 14:00:00+08"
                  }, {
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 720849,
                    "playList": [{
                      "articleId": 138326,
                      "id": 3313,
                      "matchId": 720849,
                      "playDetailList": [],
                      "type": 132
                    }],
                    "sportType": "1",
                    "start_time": "2019-02-26 11:30:00+08"
                  }, {
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 716142,
                    "playList": [{
                      "articleId": 138326,
                      "id": 3311,
                      "matchId": 716142,
                      "playDetailList": [],
                      "type": 21
                    }],
                    "sportType": "0",
                    "start_time": "2019-02-26 11:00:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-02-26 10:34:10.573597+08",
                  "digest": "新文章发布测试001",
                  "id": "138326",
                  "includeBb": true,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-02-26 10:34:10.573597+08",
                  "matches": [{
                    "away_team": "伊斯塔拉夫山足球俱乐部",
                    "cup_name": "塔吉克杯",
                    "dishAnalysis": "",
                    "entry_id": "723077",
                    "fundamentalAnalysis": "",
                    "home_team": "伊提洛尔-83",
                    "id": 723243,
                    "matchFlag": "",
                    "remark": "null",
                    "sportType": "0",
                    "start_time": "2019-02-26 14:00:00+08"
                  }, {
                    "away_team": "达拉斯独行侠",
                    "cup_name": "NBA",
                    "dishAnalysis": "",
                    "entry_id": "720683",
                    "fundamentalAnalysis": "",
                    "home_team": "洛杉矶快船",
                    "id": 720849,
                    "matchFlag": "",
                    "remark": "{\"color\":\"#FF0000\",\"createTime\":1551148380053,\"guestTeamBig\":\"達拉斯獨行俠\",\"guestTeamCoreNode1\":\"\",\"guestTeamCoreNode2\":\"\",\"guestTeamCoreNode3\":\"\",\"guestTeamCoreNode4\":\"\",\"guestTeamGb\":\"达拉斯独行侠\",\"guestTeamId\":17,\"guestTeamOt1\":\"\",\"guestTeamOt2\":\"\",\"guestTeamOt3\":\"\",\"guestTeamRank\":\"西13\",\"guestTeamScore\":\"\",\"homeTeamBig\":\"洛杉磯快艇\",\"homeTeamCoreNode1\":\"\",\"homeTeamCoreNode2\":\"\",\"homeTeamCoreNode3\":\"\",\"homeTeamCoreNode4\":\"\",\"homeTeamGb\":\"洛杉矶快船\",\"homeTeamId\":29,\"homeTeamOt1\":\"\",\"homeTeamOt2\":\"\",\"homeTeamOt3\":\"\",\"homeTeamRank\":\"西8\",\"homeTeamScore\":\"\",\"id\":326477,\"leagueCupId\":1,\"leagueCupNameBig\":\"NBA\",\"leagueCupNameGb\":\"NBA\",\"leagueCupType\":\"1\",\"liveTv\":\"广东体育\",\"liveTvRemark\":\"\",\"matchMode\":\"4\",\"matchStatus\":\"0\",\"nodeRemainTime\":\"\",\"overtimeCount\":\"0\",\"positionFlag\":\"0\",\"startTime\":\"2019/2/26 11:30:00\",\"technicalStatisticalFlag\":\"\"}",
                    "sportType": "1",
                    "start_time": "2019-02-26 11:30:00+08"
                  }, {
                    "away_team": "惠灵顿",
                    "cup_name": "大冠杯",
                    "dishAnalysis": "",
                    "entry_id": "715976",
                    "fundamentalAnalysis": "",
                    "home_team": "奇維",
                    "id": 716142,
                    "matchFlag": "",
                    "remark": "{\"big\":\"大冠盃\",\"color\":\"#43990a\",\"createTime\":1551148380086,\"en\":\"Oce CL \",\"gameStartTime\":null,\"gameTime\":\"2019/2/26 11:00:00\",\"gb\":\"大冠杯\",\"guestTeamBig\":\"惠靈頓\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"Team Wellington\",\"guestTeamGb\":\"惠灵顿\",\"guestTeamHalfScore\":null,\"guestTeamId\":3812,\"guestTeamRank\":\"新西兰联3\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"奇維\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"Kiwi FC\",\"homeTeamGb\":\"奇維\",\"homeTeamHalfScore\":null,\"homeTeamId\":22845,\"homeTeamRank\":null,\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"2\",\"leagueId\":543,\"level\":\"0\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1667887,\"matchStatus\":\"0\",\"positionFlag\":\"True\",\"subLeague\":null,\"subLeagueId\":null}",
                    "sportType": "0",
                    "start_time": "2019-02-26 11:00:00+08"
                  }],
                  "playNum": 3,
                  "portal_list": [],
                  "price": "0",
                  "sign_key": "D788B902C7B644DFBCB11D1BD35564CD",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>篮球</i><i>初始指数组合包</i><label>3场比赛</label><label class='gg'>|</label><label>3种玩法</label>",
                  "text": "",
                  "type": "10"
                },{
                  "alreadyPay": false,
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-02-22 17:17:21.055959+08",
                  "digest": "文章价格为0文章价格为0",
                  "id": "138315",
                  "includeBb": false,
                  "includeFb": false,
                  "last_modified": "2019-02-22 17:17:21.055959+08",
                  "playNum": 0,
                  "price": "0",
                  "singleUnlock": true,
                  "sourceText": "",
                  "text": ""
                },{
                  "alreadyPay": false,
                  "articleMatchList": [{
                    "dishAnalysis": "",
                    "fundamentalAnalysis": "",
                    "matchId": 656526,
                    "playList": [{
                      "articleId": 138188,
                      "id": 3082,
                      "matchId": 656526,
                      "playDetailList": [],
                      "recommendReason": "",
                      "type": 28
                    }],
                    "sportType": "0",
                    "start_time": "2019-01-21 18:00:00+08"
                  }],
                  "articlePraised": false,
                  "authorFollowed": false,
                  "authorLevels": [{"app_show": true, "id": 100004, "termmonths": 0}, {
                    "app_show": true,
                    "id": 100005,
                    "termmonths": 0
                  }, {"app_show": true, "id": 100003, "termmonths": 1}, {
                    "app_show": true,
                    "id": 100002,
                    "termmonths": 3
                  }, {"app_show": true, "id": 100001, "termmonths": 6}, {
                    "app_show": true,
                    "id": 100000,
                    "termmonths": 12
                  }],
                  "authorName": "CS老师",
                  "authorPic": "https://api.jingcaishuo.com/static/upfiles/analyst/6a63b20ce89968e1/20170525_143818232004_615_avatar.jpg",
                  "authorScore": "3.9",
                  "authorWin": {
                    "tc_redblack_30": {
                      "black": "0",
                      "continuous_black_3": "0",
                      "continuous_red_3": "0",
                      "max_continuous_black": "0",
                      "max_continuous_red": "0",
                      "red": "0",
                      "red_black_status": []
                    }, "tc_winrate_15": "16", "tc_winrate_3": "100", "tc_winrate_7": "33"
                  },
                  "author_id": "281",
                  "certificationinfo": "",
                  "chargeable": true,
                  "date_added": "2019-01-21 15:39:32.397225+08",
                  "digest": "测试翻译超时文章英语版本印尼语版本",
                  "id": "138188",
                  "includeBb": false,
                  "includeFb": true,
                  "isNewest": "1",
                  "last_modified": "2019-01-21 15:39:32.397225+08",
                  "matches": [{
                    "away_team": "普罗斯捷约夫",
                    "cup_name": "球会友谊",
                    "dishAnalysis": "",
                    "entry_id": "656360",
                    "fundamentalAnalysis": "",
                    "home_team": "杜布尼卡",
                    "id": 656526,
                    "matchFlag": "",
                    "remark": "{\"big\":\"球會友誼\",\"color\":\"#00A8A8\",\"createTime\":1548056340335,\"en\":\"INT CF \",\"gameStartTime\":null,\"gameTime\":\"2019/1/21 18:00:00\",\"gb\":\"球会友谊\",\"guestTeamBig\":\"普羅斯捷約夫\",\"guestTeamCorner\":\"0\",\"guestTeamEn\":\"SK Prostejov\",\"guestTeamGb\":\"普罗斯捷约夫\",\"guestTeamHalfScore\":null,\"guestTeamId\":20041,\"guestTeamRank\":\"捷乙12\",\"guestTeamRedCard\":\"0\",\"guestTeamScore\":\"0\",\"guestTeamYellowCard\":null,\"homeTeamBig\":\"杜比尼卡\",\"homeTeamCorner\":\"0\",\"homeTeamEn\":\"MFK Dubnica nad Vahom\",\"homeTeamGb\":\"杜布尼卡\",\"homeTeamHalfScore\":null,\"homeTeamId\":941,\"homeTeamRank\":\"斯伐甲8\",\"homeTeamRedCard\":\"0\",\"homeTeamScore\":\"0\",\"homeTeamYellowCard\":null,\"kind\":\"2\",\"leagueId\":41,\"level\":\"0\",\"lineup\":null,\"live\":\"\",\"matchExplain\":\"\",\"matchExplain2\":\"\",\"matchId\":1658638,\"matchStatus\":\"0\",\"positionFlag\":\"False\",\"subLeague\":null,\"subLeagueId\":null}",
                    "sportType": "0",
                    "start_time": "2019-01-21 18:00:00+08"
                  }],
                  "playNum": 1,
                  "portal_list": [],
                  "price": "12",
                  "sign_key": "96D0C67EF54C4DA59B8B2EAB3B6C1BF4",
                  "singleUnlock": true,
                  "sourceText": "",
                  "tabView": "<i>足球</i><i>初始指数亚洲让分指数</i>",
                  "text": "",
                  "type": "10"
                },{
                  "comment": "发布高水",
                  "end_time": "2019-08-17 23:59:00+08",
                  "handicap_name": "全场进球：",
                  "handicap_plan": "2/2.5",
                  "handicap_refe": "2/2.5",
                  "id": 444978,
                  "initiator_id": 0,
                  "invest_max": 0,
                  "match_league": "西乙",
                  "match_result": "",
                  "match_st_id": 1742698,
                  "match_teams": "卢高 VS 艾斯马度华",
                  "odd_id": 5351113,
                  "odd_type": 1,
                  "otype": "4",
                  "source": 2,
                  "sportType": 0,
                  "start_time": "2019-08-16 02:31:27+08",
                  "status": 1,
                  "type": 2,
                  "value1_name": "大球",
                  "value1_plan": "1.08",
                  "value1_purnum": 96,
                  "value1_purper": "46.0",
                  "value1_refe": "1.01",
                  "value2_name": "小球",
                  "value2_plan": "0.92",
                  "value2_purnum": 111,
                  "value2_purper": "54",
                  "value2_refe": "0.86",
                  "weight": 9
                },{
                  "comment": "发布高水",
                  "end_time": "2019-08-17 23:59:00+08",
                  "handicap_name": "全场让球：",
                  "handicap_plan": "0/0.5",
                  "handicap_refe": "0/0.5",
                  "id": 444977,
                  "initiator_id": 0,
                  "invest_max": 0,
                  "match_league": "西乙",
                  "match_result": "",
                  "match_st_id": 1742698,
                  "match_teams": "卢高 VS 艾斯马度华",
                  "odd_id": 5359286,
                  "odd_type": 1,
                  "otype": "4",
                  "source": 2,
                  "sportType": 0,
                  "start_time": "2019-08-16 02:31:27+08",
                  "status": 1,
                  "type": 2,
                  "value1_name": "主队",
                  "value1_plan": "1.01",
                  "value1_purnum": 162,
                  "value1_purper": "57.0",
                  "value1_refe": "0.96",
                  "value2_name": "客队",
                  "value2_plan": "0.98",
                  "value2_purnum": 122,
                  "value2_purper": "43",
                  "value2_refe": "0.94",
                  "weight": 8
                }]
              }, "code": "0000"
            };


            if (res.data.result.data.Banner != undefined) {
              this.banners = res.data.result.data.Banner;
            }
            if (res.data.result.data.Portal != undefined) {
              this.portals = res.data.result.data.Portal;
            }
            if (this.types) {
              this.articleDataList = this.articleDataList.concat(res.data.result.artileList.Articles);
              this.pullUpText = '上拉加载更多！';
            } else {
              this.articleDataList = res.data.result.artileList;
              this.pullDownText = '下拉刷新！';
            }
            this.packData(this.articleDataList);
            this.lastArticleId = this.articleDataList[this.articleDataList.length - 1].id;
          
          
          
          
          })
        })
      },
      packData(resData) {
        let guessItems = [];
        let guessIndex = 0;
        for (let i = 0; i < resData.length; i++) {
          let article = resData[i];
          if (article.otype == 4) {
            if (guessIndex == 0) {
              guessIndex = i;
            }
            // console.log('竞猜消息', article);
            guessItems.push(article);
          }
        }
        //console.log('竞猜消息集合', guessItems);
        let newGuessItems = this.packGuessItems(guessItems);
        // console.log('竞猜数据数据组合', newGuessItems);
        // console.log('首次出现竞猜', guessIndex);
        resData.guessIndex = guessIndex;
        resData.guessItems = newGuessItems;
      },
      //组合竞猜消息(2个或者多个竞猜根据球探ID合并为一个竞猜多个盘口)
      packGuessItems(oldItems) {
        let newGuessItems = [];
        let stIds = [];
        for (let i = 0; i < oldItems.length; i++) {
          let item = oldItems[i];
          if (stIds.indexOf(item.match_st_id) == -1) {
            stIds.push(item.match_st_id);
          }
        }
        // console.log("球探ID集合", stIds);
        for (let j = 0; j < stIds.length; j++) {
          let guessItem = {};
          let odds = [];
          for (let m = 0; m < oldItems.length; m++) {
            let dataItem = oldItems[m];
            if (stIds[j] == dataItem.match_st_id) {
              let odd = dataItem;
              //让球左边,进球右边
              if (odd.handicap_name.indexOf("让球") != -1 || odd.handicap_name.indexOf("让分") != -1) {
                odd.rightSide = false;
              } else if (odd.handicap_name.indexOf("进球") != -1 || odd.handicap_name.indexOf("总分") != -1) {
                odd.rightSide = true;
              } else {
                odd.rightSide = false;
              }
              //console.log("盘口 ", odd.handicap_name + "，，" + odd.rightSide);
              odds.push(odd);
            }
          }
          guessItem.match_st_id = stIds[j];
          guessItem.match_league = odds[0].match_league;
          guessItem.match_teams = odds[0].match_teams;
          guessItem.status = odds[0].status;
          guessItem.end_time = odds[0].end_time.substr(5, 11);
          guessItem.end_time_md = guessItem.end_time.trim().split(/\s+/)[0];
          guessItem.end_time_hm = guessItem.end_time.trim().split(/\s+/)[1];
          guessItem.odds = odds;
          newGuessItems.push(guessItem);
        }
        return newGuessItems;
      },
      portalClick(item) {
        if (item.name == "筛价格") {
          this.$router.push({
            path: `/articledetail/?id=${item.id}`,
            props: {id: item.id}
          })
        } else if (item.name == "篮球") {
          this.$router.push({
            path: `basketball?sportType=篮球`
          })
        } else if (item.name == "足球") {
          this.$router.push({
            path: `basketball?sportType=足球`
          })
        } else if (item.name == "直播") {
          this.$router.push({
            path: `/live_articlelist`,
          })
        } else if (item.name == "聊天室") {
          this.$router.push({
            path: `/roomlist`
          })
        } else if (item.name == "红人榜") {
          this.$router.push({
            path: `/recordlist`
          })
        } else if (item.name == "电子竞技") {
          this.$router.push({
            path: `/e-sports`
          })
        } else if (item.name == "免费") {
          this.$router.push({
            path: `freelist?sportType=免费`
          })
        } else if (item.name == "世界杯") {
          this.$router.push({
            path: `worldcup?sportType=世界杯`
          })
        } else if (item.name == "看战绩") {
          this.$router.push({
            path: `worldcup`
          })
        } else if (item.name == "晒战绩") {
          this.$router.push({
            path: `basketball?sportType=晒战绩`
          })
        } else if (item.name == "全部") {
          this.$router.push({
            path: `PublicPage/?name=全部`
          })
        } else if (item.name == "留言墙") {
          this.$router.push({
            path: `portal_feed`
          })
        } else if (item.name == "专家说") {
          var arr = item.h5Url.split('?')
          this.$router.push({
            path: `author/?id=${query.parse(arr[1]).id}`
          })
        } else if (item.name == "竞猜") {
          var arr = item.h5Url.split('?')
          this.$router.push({
            path: `guesslist`
          })
        } else if (item.name == "椰子分") {
          this.$router.push({
            path: `/articledetail/?id=889804`,
            props: {id: 889804}
          })
        }
      },
      goarticle(item) {
        this.$router.push({
          path: `/articledetail/?id=${item.id}`
        })
      },
      bannerClick(item) {
        if (item.target_type == 'article') {
          this.$router.push({
            path: `/articledetail/?id=${item.target_id}`,
            query: {id: item.target_id}
          })
        } else if (item.target_type == 'analyst') {
          this.$router.push({
            path: `/author/?id=${item.target_id}`
          })
        } else if (item.target_type == 'h5') {
          if (item.h5Url.indexOf('chartroom')) {
            var roomId = '';
            item.h5Url.replace(/roomId=([0-9]{0,})/g, function ($1, $2) {
              roomId = $2;
              return $2;
            });

            this.$router.push({
              path: `/roomindex?roomId=${roomId}`
            })
          } else {

          }
        }
      },
      goLetter() {
        var that = this;
        if (this.shareFn.isLogin()) {
          this.$router.push('letterlist')
        } else {
          layer.open({
            content: '您还没有登录！',
            btn: ['登录', '取消'],
            yes: function (index) {
              that.$router.push('enter')
              layer.close(index);
            },
            no: function (index) {
              layer.close(index);
            }
          })
        }
      },
      expertIn() {
        this.$router.push('export')
      }
    },
    watch: {
      $route: {
        handler: function (news, old) {
          this.$refs.Scroll.refresh();
          console.log(news,'新的')
          console.log(old,'旧的')
          }
      }
    }
  }

</script>

<style lang="less">
  @import "../../common/less/base.less";

  .home {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0px;
    color: #fff;

    p[pulldown] {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @assistcolor;
      font-size: 0.12rem;
      position: absolute;
      top: -50px;
      left: 0;
    }

    p[pullup] {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: @assistcolor;
      font-size: 0.12rem;
    }

    header {
      height: 44px;
      line-height: 44px;
      background: @reds;
      color: #fff;
      font-size: 0.12rem;
      text-align: center;
      overflow: hidden;
      position: relative;

      a {
        color: @whites;
      }

      .hd-vip {
        float: left;
        line-height: 44px;
        padding: 0 10px 0 0.25rem;
        margin-left: 10px;
        background: url('../../common/img/vip.png') no-repeat left center;
        background-size: 0.20rem auto;
        background-position: left 11px;
      }

      .letter {
        color: transparent;
        float: right;
        padding: 0 10px;
        background: url('../../common/img/letter.png') no-repeat center;
        background-size: 0.20rem auto;
      }

      img {
        width: 67px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }

      .expert-in {
        float: right;
        background: url("../../common/img/expert-search.png") no-repeat center;
        background-size: auto 20px;
        color: transparent;
        margin-right: 5px;
      }
    }

    .tab {
      width: 100%;
      height: 44px;
      line-height: 44px;
      background: @whites;
      position: relative;
      .border-top;
      .border-bottom;
    }

    .tab a {
      display: inline-block;
      width: 25%;
      height: 100%;
      text-align: center;
      float: left;
      color: @blacks;
      text-decoration: none;
      font-size: 0.15rem;
    }

    .container {
      width: 100%;
      height: calc(100vh);
      position: fixed;
      top: 88px;
      bottom: 0;
      overflow: hidden;
      z-index:999;
    }

    .scroll-wrap {
      min-height: 100%;
      width: 100%;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    
  }
</style>
