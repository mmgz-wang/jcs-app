<template>
  <div class="guess-list-wrap">
    <!-- 头部开始 -->
    <div class="topmenu" v-show="topListShow">
      <i>
        <a @click="back()"></a>
      </i>
      <div class="top_my">
        <dl class="myleft">
          <a @click="pageClick('myGuess')">
            <dt><img src="../../common/img/my_ico.png"></dt>
            <dd>我</dd>
          </a>
        </dl>
        <dl>
          <a @click="pageClick('leagueMatch')">
            <dt><img src="../../common/img/l_ico.png"></dt>
            <dd>选</dd>
          </a>
        </dl>
      </div>
      <div class="t_tab">
        <a @click="tabClick('football')" :class="{now:footballTab}">足球</a>
        <a @click="tabClick('basketball')" :class="{now:!footballTab}">篮球</a>
      </div>
    </div>
    <!-- 头部结束 -->

    <!-- 联赛信息头部开始 -->
    <div class="topmenu" v-show="!topListShow">
      <i>
        <a @click="backHide()"></a>
      </i>
      <div class="top_my">
        <dl class="myleft">
          <a @click="pageClick('myGuess')">
            <dt><img src="../../common/img/my_ico.png"></dt>
            <dd>我</dd>
          </a>
        </dl>
      </div>
      <div class="t_tab2">
        <span>{{topMatchMsg}}</span>
      </div>
    </div>
    <!-- 联赛信息头部结束 -->

    <!-- 列表内容开始 -->
    <scroll class="outer-wrap" v-show="listShow">
      <div class="scroll-wrap">
        <p class="noData" v-show="noDataShow">暂无数据</p>
        <div class="concnet" v-for="(guess,index) in guessMatchData">
          <i class="js_ico"></i>
          <div class="name">{{guess.match_league}}
            <span>{{guess.end_time_md}}</span>
            <span class="time">{{guess.end_time_hm}}</span>
            <span class="new_play">了解竞猜新玩法</span>
          </div>
          <div class="vsname">
            <label style="font-weight: bold;margin-top: 0.8rem">{{guess.match_teams}}</label>
            <span class="conduct" v-if="guess.status < 3">进行中</span>
            <span class="conduct" v-if="guess.status >= 3">已结束</span>
          </div>
          <div class="contrast">
            <div class="contc" :class="odd.rightSide ? 'contr' : '' " v-for="(odd,oddIndex) in guess.odds">
              <div class="num">{{odd.handicap_name}}<span>{{odd.handicap_plan}}</span></div>
              <div class="cnt_txt">
                <ul>
                  <li @click="teamClick(odd, odd.value1_name,odd.value1_plan,'up')">
                    <span class="up_name">{{odd.value1_name}}</span><br/>
                    <span>{{odd.value1_plan}}
                      <label class="low_odd">({{odd.value1_refe}})</label>
                    </span>
                  </li>
                  <li @click="teamClick(odd, odd.value2_name,odd.value2_plan,'down')">
                    <span class="up_name">{{odd.value2_name}}</span><br/>
                    <span>{{odd.value2_plan}}
                      <label class="low_odd">({{odd.value2_refe}})</label>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <!-- 列表内容结束 -->
    <!-- 联赛内容开始 -->
    <div v-show="!listShow">
      <div class="choose">
        <ul>
          <li v-for="(league,index) in  leagueMatchData" :class="{now:league.selected}" @click="leagueSingCli(league);">
            <a>{{league.name}}({{league.size}})</a>
          </li>
        </ul>
      </div>

      <div class="guess-foot">
        <p class="all">
          <span @click="allClick()" class="all-chos" :class="{chosOn:allClickCls}"></span>全选&nbsp&nbsp&nbsp&nbsp已选择
          <span
            class="num-chos">{{leagueMatchSize}}</span>&nbsp;场
        </p>
        <button type="button" @click="subLeague()">确认</button>
      </div>
    </div>
    <!-- 联赛内容结束 -->
    <!-- 竞猜成功提示 -->
    <div class="custom cussucc" v-show="jxSuc">
      <div class="pn_566x468">
        <i @click="jxSucClose()"><a>关闭</a></i>
        <span class="txt">竞猜成功</span>
        <div class="txt_btn"><a @click="pageClick('myGuess')">我的竞猜</a><a @click="jxSucClose()" class="jx">继续竞猜</a></div>
      </div>
    </div>
    <div class="loading-container" v-show="loading">
      <loading></loading>
    </div>
    <!--竞猜弹框-->
    <guess-dialog
      :moneyArr="moneyArr"
      @guessSuccess="guessSuccess()"
      ref="guessDialog"></guess-dialog>
  </div>
</template>

<script>
  import Common from 'common/js/common';
  import shareFn from '../../common/js/sharefn';
  import Scroll from 'base/scroll/scroll';
  import guessDialog from 'base/guessdialog/guessdialog2';
  import wxApi from 'common/js/wxapi'
  import loading from 'base/loading/loading'

  export default {
    data() {
      return {
        firstReq: true,    //首次请求接口数据
        topListShow: true, //top显示竞猜列表还是联赛
        listShow: true,    //显示列表数据或者联赛数据
        footballTab: true,  //当前选择的是足球还是篮球
        jxSuc: false,      //竞猜成功弹层
        allClickCls: false,     //联赛全选按钮变化
        leagueMatchSize: 0,     //选了多少场联赛
        topMatchMsg: '',        //足球联赛还是篮球联赛筛选
        noDataShow: false,      //接口无数据是否显示
        guessMatchData: [],     //竞猜列表数据
        leagueMatchData: [],    //联赛数据
        leagueSelectedStr: '',   //用户选择的联赛
        moneyArr: [], //竞猜投注额列表
        loading: false
      }
    },
    components: {Scroll, guessDialog, loading},
    created() {
      this.$nextTick(function () {
        if (this.shareFn.isLogin()) {
        }
      })
    },
    activated() {
      this.getDataList();
      this.wxInit();
    },
    //路由离开数据全部初始化为默认值
    deactivated() {
      this.firstReq = true;
      this.topListShow = true;
      this.listShow = true;
      this.footballTab = true;
      this.jxSuc = false;
      this.allClickCls = false;
      this.leagueMatchSize = 0;
      this.topMatchMsg = '';
      this.noDataShow = false;
      this.guessMatchData = [];
      this.leagueMatchData = [];
      this.leagueSelectedStr = ''
    },
    mounted() {

    },
    watch: {
      leagueMatchData: {
        handler: function (newVal, oldVal) {
          // console.log('联赛数据发生变化..');
          this.statLeagueSelected();
        },
        deep: true
      }
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
          title: '足蓝竞猜，高奖回报等你拿！！！',
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
          desc: '足蓝竞猜，高奖回报等你拿！！！',
          link: location.href,
          imgUrl: 'http://www.jingcaishuo.com/favicon.ico',
          success: () => {
          }
        };
        wxApi.ShareAppMessage(option);
      },

      //竞猜成功弹层
      jxSucClose() {
        this.jxSuc = false;
      },
      back() {
        this.$router.back();
      },
      //联赛弹层隐藏
      backHide() {
        this.topListShow = true;
        this.listShow = true;
      },
      //联赛单个点击
      leagueSingCli(league) {
        if (league.selected) {
          league.selected = false;
        } else {
          league.selected = true;
        }
      },
      //联赛全选点击
      allClick() {
        if (this.allClickCls) {
          this.allSelectedCancel();
        } else {
          this.allSelected();
        }
      },
      //联赛全选操作
      allSelected() {
        console.log('全选....');
        for (let k = 0; k < this.leagueMatchData.length; k++) {
          this.leagueMatchData[k].selected = true;
        }
      },
      //联赛取消全选操作
      allSelectedCancel() {
        console.log('取消全选....');
        for (let k = 0; k < this.leagueMatchData.length; k++) {
          this.leagueMatchData[k].selected = false;
        }
      },
      //统计选了多少赛事
      statLeagueSelected() {
        let selectedSize = 0;
        for (let k = 0; k < this.leagueMatchData.length; k++) {
          if (this.leagueMatchData[k].selected) {
            selectedSize++;
          }
        }
        if (selectedSize == this.leagueMatchData.length) {
          this.allClickCls = true;
        } else {
          this.allClickCls = false;
        }
        this.leagueMatchSize = selectedSize;
      },
      //top图标点击
      pageClick(target) {
        switch (target) {
          case 'myGuess':
            if (!this.shareFn.isLogin()) {
              this.$router.push({name: 'enter'});
              return;
            }
            this.$router.push({name: 'my_guess'});
            break;
          case 'leagueMatch':
            this.topListShow = false;
            this.listShow = false;
            if (this.footballTab) {
              this.topMatchMsg = "足球赛事筛选";
            } else {
              this.topMatchMsg = "篮球赛事筛选";
            }
            break;
        }
      },
      //足球篮球tab点击
      tabClick(tab) {
        this.firstReq = true;
        this.guessMatchData = [];
        this.leagueMatchData = [];
        this.leagueSelectedStr = '';
        switch (tab) {
          case 'football':
            console.log('足球...');
            this.footballTab = true;
            this.getDataList();
            break;
          case 'basketball':
            console.log('篮球...');
            this.footballTab = false;
            this.getDataList();
            break;
        }
      },
      //获取数据
      getDataList() {
        let that = this;
        this.loading = true;
        that.$http.jsonp(
          Common.baseURI().host + "/assets/getGuessingPlanListByMatchLeague",
          {
            params: {
              userId: this.shareFn.getUserId(),
              token: this.shareFn.getSecurityCode(),
              limit: 200,
              sportType: this.footballTab ? 0 : 1,
              matchLeague: this.leagueSelectedStr
            }
          }).then(res => {
          this.loading = false;
          if (typeof (res.data.list) != "undefined") {
            console.log(res.data);
            this.moneyArr = res.data['bet.prices.list'];
            this.noDataShow = false;
            this.packGuessData(res);
            console.log('最终数据组装......');
            console.log(this.guessMatchData);
          } else {
            console.log('无数据');
            this.noDataShow = true;
          }
        })
      },
      //数据组装
      packGuessData(res) {
        //足球篮球联赛
        if (this.leagueMatchData.length == 0) {
          if (this.footballTab && typeof (res.data.data_0) != "undefined") {
            console.log('足球联赛数据组装');
            for (let p in res.data.data_0) {
              let leagueItem = {};
              leagueItem.name = p;
              leagueItem.size = res.data.data_0[p];
              leagueItem.selected = false;
              this.leagueMatchData.push(leagueItem);
            }
          }
          //篮球联赛
          if (!this.footballTab && typeof (res.data.data_1) != "undefined") {
            console.log('蓝球联赛数据组装');
            for (let p in res.data.data_1) {
              let leagueItem = {};
              leagueItem.name = p;
              leagueItem.size = res.data.data_1[p];
              leagueItem.selected = false;
              this.leagueMatchData.push(leagueItem);
            }
          }
        }
        console.log(this.leagueMatchData);
        //列表
        if (typeof (res.data.list) != "undefined") {
          let stIds = [];
          for (let i = 0; i < res.data.list.length; i++) {
            let item = res.data.list[i];
            if (stIds.indexOf(item.match_st_id) == -1) {
              stIds.push(item.match_st_id);
            }
          }
          //  console.log(stIds);
          for (let j = 0; j < stIds.length; j++) {
            let guessItem = {};
            let odds = [];
            for (let m = 0; m < res.data.list.length; m++) {
              let dataItem = res.data.list[m];
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
                console.log("盘口 ", odd.handicap_name + "，，" + odd.rightSide);
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
            this.guessMatchData.push(guessItem);
          }
        }
        //首次进入默认联赛全选
        if (this.firstReq) {
          this.allSelected()
        }
      },
      //联赛选择确认按钮
      subLeague() {
        let str = '';
        for (let k = 0; k < this.leagueMatchData.length; k++) {
          if (this.leagueMatchData[k].selected) {
            str += this.leagueMatchData[k].name + ",";
          }
        }
        var reg = /,$/gi;
        str = str.replace(reg, "");
        if (str.trim() == '') {
          this.layerOpen('请选择至少一个联赛');
          return
        }
        this.firstReq = false;
        this.leagueSelectedStr = str;
        console.log('用户选择的联赛: ' + this.leagueSelectedStr);
        this.backHide();
        this.guessMatchData = [];
        // this.leagueMatchData = [];
        // this.allClickCls = false;
        // this.leagueMatchSize = 0;
        this.getDataList();
      },
      //玩法赔率点击
      teamClick() {
        if (this.shareFn.isLogin()) {
          this.$refs.guessDialog.show(arguments, 'list')
        } else {
          layer.open({
            content: '您还没有登录请先登录！',
            btn: ['确定', '取消'],
            yes: (index) => {
              this.$router.push('/enter');
              layer.close(index)
            },
            no: index => layer.close(index)
          });
        }
      },
      guessSuccess() {
        console.log('竞猜成功!');
        this.jxSuc = true;
      },
      //提示组件
      layerOpen(msg) {
        layer.open({
          content: msg,
          time: 2,
          skin: 'msg',
          anim: 'scale'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/base.less";

  .guess-list-wrap {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;

    .loading-container, .container {
      width: 100%;
      height: 100%;
    }

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

    .outer-wrap {
      width: 100%;
      position: absolute;
      top: 45px;
      bottom: 0;
      overflow: hidden;
    }

    .scroll-wrap {
      min-height: 100%;
      width: 100%;
    }
  }

  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  img {
    border: 0
  }

  a {
    text-decoration: none
  }

  input {
    border: 0;
    outline: 0
  }

  .topmenu {
    position: relative;
    width: 100%;
    height: 0.45rem;
    line-height: 0.45rem;
    padding: 0 4%;
    background: #e9311d;
    text-align: center;
  }

  .topmenu i {
    position: absolute;
    left: 4%;
    top: 0.14rem;
    width: 0.08rem;
    height: 0.17rem;
    background: url(../../common/img/left_ico.png);
    background-size: 0.08rem 0.17rem
  }

  .topmenu i a {
    display: block;
    width: 0.08rem;
    height: 0.17rem
  }


  .t_tab2 {
    display: inline-block;
    width: 1.82rem;
    margin-bottom: 0.19rem;
  }

  .t_tab2 span {
    float: left;
    width: 100%;
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.16rem;
    color: #fff;
    font-weight: bold;
  }

  .t_tab {
    display: inline-block;
    width: 1.62rem;
    border: 1px #fff solid;
    border-radius: 0.25rem;
    margin-bottom: 0.21rem;
  }

  .t_tab a {
    float: left;
    width: 50%;
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.16rem;
    color: #fff
  }

  .t_tab .now {
    background: #fff;
    color: #e9311d;
    border-radius: 0.25rem
  }

  .top_my {
    position: absolute;
    right: 0.17rem;
    top: 0.06rem;
  }

  .top_my dl {
    float: left;
    width: 0.17rem
  }

  .top_my dt, .top_my dt img {
    float: left;
    width: 100%
  }

  .top_my dd {
    float: left;
    width: 100%;
    height: 0.15rem;
    line-height: 0.15rem;
    font-size: 0.14rem;
    color: #fff
  }

  .top_my .myleft {
    margin-right: 0.27rem;
  }

  /* 内容 */

  .box_bd {
    width: 100%;
    overflow: hidden;
  }

  .box_list {
    display: none;
    float: left;
    width: 100%
  }

  .concnet {
    position: relative;
    margin-bottom: 0.06rem;
    width: 100%;
    padding: 5px 4%;
    overflow: hidden;
    border-bottom: 5px #d1d1d1 solid;
    background: url(../../common/img/conbg.jpg) repeat-x left top #eee;
  }

  .concnet .js_ico {
    position: absolute;
    right: 0.23rem;
    top: 0;
    width: 0.25rem;
    height: 0.25rem;
    background: url(../../common/img/jc_ico.png);
    background-size: 0.26rem 0.25rem
  }

  .concnet .name {
    float: left;
    width: 100%;
    margin-top: 0.1rem;
    font-size: 0.14rem;
    color: #666
  }

  .concnet .name span {
    color: #333;
    margin-left: 0.07rem
  }

  .concnet .name .time {
    color: #cc0000
  }

  .concnet .name .new_play {
    color: #798CDA;
  }

  .vsname {
    position: relative;
    float: left;
    width: 100%;
    line-height: 0.46rem;
    font-size: 0.18rem;
    color: #333;
    text-align: center;
  }

  .vsname span {
    margin: 0 0.2rem;
    font-size: 0.11rem;
    color: #999
  }

  .conduct {
    position: absolute;
    right: -0.15rem;
    top: 0.15rem;
    width: 0.41rem;
    height: 0.16rem;
    line-height: 0.16rem;
    border: 1px #e9311d solid;
    color: #e9311d !important;
    border-radius: 0.15rem
  }

  .contrast {
    float: left;
    width: 100%;
    background: url(../../common/img/line.png) no-repeat center center;
    margin-top: 0.1rem
  }

  .contc {
    float: left;
    width: 1.62rem
  }

  .contc .num {
    float: left;
    width: 100%;
    font-size: 0.14rem;
    text-align: center;
  }

  .contc .num span {
    color: #cc0000
  }

  .cnt_txt {
    float: left;
    width: 100%;
    margin: 0.08rem 0;
    border: 1px #bfbfbf solid;
    background: #fff;
    border-left: 0;
  }

  .cnt_txt ul li {
    float: left;
    width: 50%;
    height: 0.4rem;
    /*line-height: 0.23rem;*/
    text-align: center;
    font-size: 0.12rem;
    border-left: 1px #bfbfbf solid;
  }

  .cnt_txt .now {
    background: #ed9187;
    border: 1px #e9311d solid;
    color: #fff
  }

  .contr {
    float: right;
  }

  .custom {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
  }

  .pn_566x468 {
    display: inline-block;
    width: 2.87rem;
    height: 2.37rem;
    margin-top: 1.37rem;
    background: url(../../common/img/succ.png);
    background-size: 2.87rem 2.37rem
  }

  .cussucc {
    text-align: center;
  }

  .pn_566x468 i {
    float: right;
    width: 0.24rem;
    height: 0.24rem;
    margin: 0.3rem 0.1rem 0 0;
    background: url(../../common/img/closeSuc.png);
    background-size: 0.24rem 0.24rem;
    text-indent: -9999px
  }

  .pn_566x468 i a {
    display: block;
  }

  .pn_566x468 .txt {
    float: left;
    width: 100%;
    margin-top: 0.9rem;
    font-size: 0.17rem;
    color: #333
  }

  .txt_btn {
    float: left;
    width: 100%;
    height: 0.44rem;
    line-height: 0.44rem;
    margin-top: 0.27rem;
  }

  .txt_btn a {
    display: inline-block;
    width: 50%;
    text-align: center;
    font-size: 0.14rem;
    color: #333;
    float: left;
  }

  .txt_btn .jx {
    color: #cc0000
  }

  .choose {
    width: 100%;
    margin: auto;
    overflow-y: scroll;
    height: fill-available;
    height: -webkit-fill-available;
    height: fill-available;
  }

  .choose ul li {
    float: left;
    width: 0.9rem;
    height: 0.31rem;
    line-height: 0.31rem;
    margin: 0.1rem 0 0 0.15rem;
    border: 1px #b8b8b8 solid;
    border-radius: 0.03rem;
    font-size: 0.13rem;
    color: #999;
    text-align: center;
  }

  .choose ul li a {
    display: block;
    color: #999
  }

  .choose .now {
    background: #fdeae8;
    border: 1px #e9311d solid;
  }

  .choose .now a {
    color: #e9311d
  }


  .guess-foot {
    width: 100%;
    height: 0.5rem;
    background: #ffffff;
    font-size: 0.14rem;
    color: #000000;
    clear: both;
    line-height: 0.5rem;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .guess-foot button {
    width: 105px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    color: #ffffff;
    background: #e9311d;
    font-size: 16px;
    outline: none;
    border: none;
  }

  .guess-foot .all {
    float: left;
  }

  .guess-foot .chos-btn {
    float: right;
  }

  .guess-foot .all-chos {
    width: 0.18rem;
    height: 0.18rem;
    border: 1px solid #aeaeae;
    border-radius: 888px;
    display: inline-block;
    margin: 0rem 0.05rem 0 0.1rem;
    -webkit-transform: translateY(0.02rem);
    -moz-transform: translateY(0.02rem);
    -ms-transform: translateY(0.02rem);
    -o-transform: translateY(0.02rem);
    transform: translateY(0.02rem);
    position: relative;
  }

  .guess-foot .chosOn {
    background: red;
    border-color: #ffd842;
  }

  .guess-foot .chosOn:after {
    content: "";
    width: 0.10rem;
    height: 0.05rem;
    display: inline-block;
    border: 2px solid transparent;
    border-left-color: #313131;
    border-bottom-color: #313131;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -0.07rem;
    margin-top: -0.06rem;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .guess-foot .num-chos {
    color: red;
    font-weight: 600;
  }

  .noData {
    font-size: 0.18rem;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 0.5rem;
  }

  .up_name {
    line-height: 0.2rem;
  }

  .low_odd {
    font-size: 0.10rem;
    color: #666666;
  }

</style>
