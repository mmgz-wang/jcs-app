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
      ref="Scroll"
      class="container" :data="articleDataList">
      <div class="scroll-wrap">
        <p pulldown>{{pullDownText}}</p>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
        <div>
          <banner v-if="banners.length>0" :bannerData="banners" @bannerClick="bannerClick"></banner>
          <portal @portalClick="portalClick" :portals="portals"></portal>
          <template v-for="(item,index) in articleDataList">
            <article-list
              v-if="item.otype == 1 || item.otype == undefined"
              @goarticle="goarticle"
              :topMargin='true'
              :item="item">
            </article-list>
            <!--<guess-item-->
            <!--v-else-if="item.otype == 4"-->
            <!--@guessTeamClick="guessTeamClick"-->
            <!--:item="item">-->
            <!--</guess-item>-->
            <template v-else-if="item.otype == 4 && index==articleDataList.guessIndex"
                      v-for="guessItem in articleDataList.guessItems">
              <guess-item
                :guess="guessItem"
                :moneyArr="moneyArr"
                @showDiag="showDiag"
                @hideDiag="hideDiag">
              </guess-item>
            </template>
            <room-list
              :item="item"
              v-if="item.otype == 3"></room-list>
          </template>
        </div>
        <p pullup>{{pullUpText}}</p>
      </div>
    </scroll>
    <guess-dialog
      :moneyArr="moneyArr"
      ref="guessDialog"></guess-dialog>
    <router-view></router-view>
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
        pullDownRefresh: {threshold: 50, stop: 50},
        pullUpLoad: {threshold: 0, txt: {more: "", noMore: ""}},
        pullDownText: '下拉刷新！',
        pullUpText: '上拉加载更多！',
        reloads: false,
        $routerPath: [],
        curGuessItem: null,
        moneyArr: [],
        isDiag: false
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
          console.log('投注额列表', this.moneyArr);
        });
      },
      pullingDownFn(scroll) {
        this.types = 0;
        this.lastArticleId = 0;
        this.pullDownText = '努力加载中 ...';
        this.getData();
        console.log('------------------');
      },
      pullingUpFn(scroll) {
        if (this.isDiag) {
          return false;
        }
        this.types = 1;
        this.pullUpText = '努力加载中 ...';
        this.getData();
        console.log('+++++++++++++++++++');
      },
      showDiag() {
        console.log('diag 展开了，不能下拉取数据');
        this.isDiag = true;
      },
      hideDiag() {
        console.log('diag 隐藏了，可以下拉取数据');
        this.isDiag = false;
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
            console.log('返回数据:', res.data);
            console.log('首页返回JSON数据:',JSON.stringify(res.data));
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
            console.log('竞猜消息', article);
            guessItems.push(article);
          }
        }
        //console.log('竞猜消息集合', guessItems);
        let newGuessItems = this.packGuessItems(guessItems);
        console.log('竞猜数据数据组合', newGuessItems);
        console.log('首次出现竞猜', guessIndex);
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
        console.log("球探ID集合", stIds);
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
          console.log(news)
          console.log(old)
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
      position: absolute;
      top: 88px;
      bottom: 0;
      overflow-y: hidden;
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
