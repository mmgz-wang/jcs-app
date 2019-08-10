<template>
  <div id="my_guess">
    <main-header v-if="!inXCX" :headerData="headerData"></main-header>
    <div class="tab" v-if="!inXCX">
      <span :class="{on:!history}" @click="tabClick('tab_ing')">进行中</span>
      <span class="search" :class="{on:history}" @click="tabClick('tab_history')">历史</span>
    </div>
    <div ref="wrapper" class="wrapper" :class="{inxcx: inXCX}">
      <div class="com-list-inner" style="float:left;padding-bottom:50px;">
        <p pulldown>{{pullDownText}}</p>
        <ul listContent>
          <li v-for="item in history ? historyList :currentList">
            <!--新的数据-->
            <div v-if="item.guessOrderId!=0" class="allView">
              <div class="firstView">
                <span class="cdate">{{item.guessOrder.create_time.substr(5, 11)}}
                  <label class="leagueCls">[{{item.guessingPlan.match_league}}]</label>
                  <label v-if="item.guessOrder.transaction_type ==1" class="leagueCls">允许低返奖竞猜</label>
                  <label v-if="item.guessOrder.transaction_type ==0" class="leagueCls">不允许低返奖竞猜</label>
                </span>
                <span class="teams">{{item.guessingPlan.match_teams}}</span>
                <span class="rqinfo">
                  <label style="font-size: 0.14rem">{{item.guessOrder.invest_target.length>1 ? item.guessOrder.invest_target.slice(0,1) : item.guessOrder.invest_target}}</label>
                  <label class="oddsCls">({{item.guessingPlan.handicap_name}}{{item.guessingPlan.handicap_plan}}) (高: {{item.choosePlanHigh}}) (低: {{item.choosePlanLow}})</label>
                  <label v-if="history" class="retend">返还: {{item.resultCost}}</label>
                </span>
              </div>
              <!--历史-->
              <div class="twoView" v-show="history">
              <span>
              竞猜金额: <label style="font-weight: bold">{{item.guessOrder.cost}}</label>
              <label v-if="item.guessOrder.status==2 || item.guessOrder.status==1">
                <label style="font-size: 0.12rem;color: #A2A2A2">交易成功 </label>
                <label style="font-size: 0.12rem;color: #CA0813">{{item.alreadyCost}}</label>
                <label style="font-size: 0.12rem;color: #A2A2A2">精彩币，</label>
                <label style="font-size: 0.12rem;color: #4284D1" @click="dealClick(item)">交易明细</label>
              </label>
              <label v-if="item.guessOrder.status==0">
                <label style="font-size: 0.12rem;color: #A2A2A2">交易失败 </label>
              </label>
              </span>
              </div>
              <!--进行中-->
              <div class="twoViewIng" v-show="!history">
                <div class="leftIng">
                  <span>竞猜金额:<label style="font-weight: bold;padding-right: 0.1rem">{{item.guessOrder.cost}}</label>
                    <button v-if="item.guessOrder.status==0" class="ingImgCls">等待</button>
                    <button v-if="item.guessOrder.status==1" class="ingImgCls">部分</button>
                    <button v-if="item.guessOrder.status==2" class="ingImgCls">全部</button>
                  </span>
                  <span style="padding-top: 0.04rem" v-if="item.guessOrder.status!=0">
                     <label style="font-size: 0.12rem;color: #A2A2A2">已交易 </label>
                    <label style="font-size: 0.12rem;color: #CA0813">{{item.alreadyCost}}</label>
                    <label style="font-size: 0.12rem;color: #A2A2A2">精彩币，</label>
                    <label style="font-size: 0.12rem;color: #4284D1" @click="dealClick(item)">交易明细</label>
                  </span>
                </div>
                <div class="rightIng">
                  <button class="ztBtn"
                          @click="teamClick(item.guessingPlan, item.guessOrder.invest_target,item.choosePlanHigh,item.upOrDown)">
                    追投
                  </button>
                </div>
              </div>

              <div class="thirdView" v-show="item.detailShow && item.guessOrder.status!=0">
                <span v-for="record in item.guessingPlanSaleAndOdds ">
                  {{record.cdate.substr(5, 11)}} 交易{{record.cost}}精彩币，水位{{record.planMX}}
                </span>
                <!--<span style="color: #4284D1;padding-top: 0.04rem" @click="">收起明细</span>-->
              </div>
            </div>
            <!--旧的数据-->
            <div v-if="item.guessOrderId==0" v-for="oldItem in item.guessingPlanSaleAndOdds" class="allViewOld">
              <div id="one">
                <span class="teams">{{oldItem.match_teams}}</span>
                <span class="rqinfo">{{oldItem.handicap_name}}：
                  <label class="infov">{{oldItem.handicap_plan}}</label>
                </span>
                <p class="betp">竞猜额：<label class="infov">{{oldItem.cost}}</label>
                  ({{oldItem.invest_target.length>1 ? oldItem.invest_target.slice(0,1): oldItem.invest_target}})
                </p>
              </div>
              <div id="two">
                <span v-if="!history" class="guessing">进行中...</span>
                <span v-else class="retend">返还：{{oldItem.result}}</span>
                <span class="cdate">{{oldItem.s_cdate.substr(5, 11)}}</span>
              </div>
            </div>
          </li>
          <li nomatch v-show="dataNone">{{hintText}}</li>
          <p pullup v-show="pullUpShow">{{pullUpText}}</p>
        </ul>
      </div>
      <div class="loading-container" v-show="loading">
        <loading></loading>
      </div>
    </div>

    <!--竞猜弹框-->
    <guess-dialog
      :moneyArr="moneyArr"
      @guessSuccess="guessSuccess()"
      ref="guessDialog"></guess-dialog>

    <!-- 竞猜成功提示 -->
    <div class="custom cussucc" v-show="jxSuc">
      <div class="pn_566x468">
        <i @click="jxSucClose()"><a>关闭</a></i>
        <span class="txt">竞猜成功,下拉刷新即可查看</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import mainHeader from 'base/header/mainheader'
  import loading from 'base/loading/loading'
  import Common from 'common/js/common.js'
  import BScroll from 'better-scroll'
  import guessDialog from 'base/guessdialog/guessdialog2';

  export default {
    data() {
      return {
        scroll: null, //scroll 组件
        pullUpShow: false,
        history: false, //tab切换参数
        dataNone: false,
        hintText: '您当前没有竞猜，快去试试运气吧！',
        loading: true,
        inXCX: false,
        limit: 15,  //接口请求条数
        currentList: [],
        historyList: [],
        maxId: '',
        headerData: {
          ele: '我的竞猜',
          name: 'my_guess',
        },
        pullDownText: '下拉刷新',
        pullUpText: '上拉加载更多',
        type: 0, //区分上拉或者下拉
        userId: this.shareFn.getUserId(),
        token: this.shareFn.getSecurityCode(),
        upTouch: true,
        moneyArr: [],
        jxSuc: false,
        dataComplete: true
      }
    },
    components: {
      loading, mainHeader, guessDialog
    },
    created() {
    },
    activated() {
      // console.log('.........................');
      if (window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase())) {
        this.inXCX = true
        this.userId = this.$router.currentRoute.query.userId
        this.token = this.shareFn.wxGetUserT(this.userId, this.$router.currentRoute.query.token)
        document.getElementsByTagName("title")[0].innerText = '我的竞猜'
      }
      // console.log('activated.....');
      // //初始化 scroll 组件以及监听事件
      // this.initAndListenScroll();
      // this.initMoneyArr();
      // this.history = false;
      // this.dataNone = false;
      // this.loading=true;
      // //获取接口数据
      // this.getData();
    },
    deactivated() {
    },
    beforeRouteLeave(to, from, next) {
      console.log('路由离开了。。。。。');
      this.history = false;
      this.maxId = '';
      this.upTouch = true;
      next();
    },
    mounted: function () {
      console.log('mounted......');
      //初始化 scroll 组件以及监听事件
      this.initAndListenScroll();
      this.initMoneyArr();
      this.history = false;
      this.dataNone = false;
      this.loading = true;
      //获取接口数据
      this.getData();
    },
    methods: {
      initAndListenScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: 3,
          click: true,
          mouseWheel: true,
          scrollbar: {
            fade: true,
            interactive: false
          },
          // 上拉加载配置
          // pullUpLoad: {
          //   // 当上拉距离超过50px时触发 pullingUp 事件
          //   threshold: 100,
          //   txt: {more: "", noMore: ""}
          // },
          // 下拉刷新配置
          pullDownRefresh: {
            // 下拉距离超过50px触发pullingDown事件
            threshold: 50,
            // 回弹停留在距离顶部50px的位置
            stop: 50
          }
        });
        //上拉加载事件
        this.scroll.on('pullingUp', () => {
          if (this.history && this.upTouch && this.maxId != 0) {
            console.log("触发上拉加载了---------------------");
            this.upTouch = false;
            //关闭下拉事件
            this.scroll.closePullDown();
            this.type = 1;
            this.pullUpText = '努力加载中 ...';
            this.pullUpShow = true;
            this.getData();
          }
        });
        //下拉刷新事件
        this.scroll.on('pullingDown', () => {
          console.log("触发下拉刷新了-------------------");
          //关闭上拉事件
          this.scroll.closePullUp();
          this.type = 0;
          this.getData();
          this.pullDownText = '释放加载 ...';
          this.pullUpText = '上拉加载更多';
          this.maxId = '';
        });
        //滚动过程中的事件
        this.scroll.on('scroll', () => {
          // console.log(this.scroll);
        })
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
          console.log('投注额列表', res.data);
        });
      },
      guessSuccess() {
        console.log('竞猜成功!');
        this.jxSuc = true;
      },
      //竞猜成功弹层
      jxSucClose() {
        this.jxSuc = false;
      },
      tabClick(tab) {
        if (!this.dataComplete) {
          this.layerOpen("亲!您切换太快了");
          return false;
        }
        this.maxId = '';
        this.dataNone = false;
        this.loading = true;
        this.upTouch = true;
        switch (tab) {
          case 'tab_ing':
            if (this.currentList.length <= 0) {
              this.pullUpShow = false;
            }
            this.history = false;
            this.currentList = [];
            this.getData();
            break;
          case 'tab_history':
            if (this.historyList.length <= 0) {
              this.pullUpShow = false;
            }
            this.history = true;
            this.historyList = [];
            this.getData();
            break;
        }
      },
      dealClick(item) {
        console.log("点击交易明细::", item);
        if (item.detailShow) {
          item.detailShow = false
        } else {
          item.detailShow = true;
        }
      },
      teamClick() {
        this.$refs.guessDialog.show(arguments, 'list_myguess')
      },
      getData() {
        var that = this;
        this.dataComplete = false;
        this.$nextTick(function () {
          this.$http.jsonp(
            Common.baseURI().host + '/assets/getGuessingPlanOrderSaleByUserId?time=' + Math.random(),
            {
              params: {
                userId: this.userId,
                token: this.token,
                history: this.history,
                maxId: this.history ? this.maxId : '',
                limit: this.limit
              }
            }
          ).then(function (res) {
            this.loading = false;
            console.log("接口返回数据::", res.data);
            this.maxId = res.data.maxSaleId;
            res.data = res.data.list;
            if (res.data != null && res.data.length > 0) {
              for (let k = 0; k < res.data.length; k++) {
                let tempItem = res.data[k];
                //console.log("单条数据::", tempItem);
                //新的高水撮合的需要解析封装
                if (tempItem.guessOrderId != 0) {
                  //用户选择的方向,如大球、大分等
                  if (tempItem.guessingPlan.value1_name == tempItem.guessOrder.invest_target) {
                    tempItem.choosePlanHigh = tempItem.guessingPlan.value1_plan;
                    tempItem.choosePlanLow = tempItem.guessingPlan.value1_refe;
                    tempItem.upOrDown = 'up';
                  } else if (tempItem.guessingPlan.value2_name == tempItem.guessOrder.invest_target) {
                    tempItem.choosePlanHigh = tempItem.guessingPlan.value2_plan;
                    tempItem.choosePlanLow = tempItem.guessingPlan.value2_refe;
                    tempItem.upOrDown = 'down';
                  }
                  //交易明细默认隐藏
                  tempItem.detailShow = false;
                  let detailCost = 0;
                  let resultCost = 0;
                  //交易明细数据解析以及封装
                  if (tempItem.guessingPlanSaleAndOdds) {
                    for (let m = 0; m < tempItem.guessingPlanSaleAndOdds.length; m++) {
                      let tempMx = tempItem.guessingPlanSaleAndOdds[m];
                      if (tempMx.value1_name == tempItem.guessOrder.invest_target) {
                        tempMx.planMX = tempMx.value1_plan;
                      } else if (tempMx.value2_name == tempItem.guessOrder.invest_target) {
                        tempMx.planMX = tempMx.value2_plan;
                      }
                      detailCost += parseInt(tempMx.cost);
                      resultCost += parseInt(tempMx.result);
                      //console.log('明细::', tempMx);
                    }
                    //console.log('明细中所有的成交总额::', detailCost);
                    tempItem.resultCost = resultCost;
                  } else {
                    tempItem.resultCost = tempItem.guessOrder.cost;
                  }
                  //已经成交的数量
                  tempItem.alreadyCost = parseInt(detailCost);
                }
              }
              console.log("新组合数据::", res.data);
              this.pullUpShow = true;
              if (this.history) {
                //历史中的数据
                if (that.type == 0) {
                  this.historyList = res.data;
                } else {
                  this.historyList = this.historyList.concat(res.data);
                }
              } else {
                //进行中的数据,一次性全部拉取
                this.currentList = res.data;
                // if (that.type == 0) {
                //   this.currentList = res.data;
                // } else {
                //   this.currentList = this.currentList.concat(res.data);
                // }
              }
            }
            if (this.history && this.historyList.length <= 0 || !this.history && this.currentList.length <= 0) {
              console.log('隐藏了没数据的显示');
              this.dataNone = true;
            }
            console.log("我是正常情况必然执行的。。。。。" + that.type);
            if (that.type == 0) {
              that.pullDownText = '下拉刷新';
              this.scroll.finishPullDown(); //下拉完毕
              this.scroll.openPullUp(true);//开启上拉
            } else {
              // if (res.data.length == 0) {
              //   that.pullUpText = '所有数据已加载完毕!';
              // } else {
              //   that.pullUpText = '上拉加载更多';
              // }
              this.scroll.finishPullUp();//上拉完毕
              this.scroll.openPullDown(true);//开启下拉
            }
            //如果是进行中的，全部拉取
            if (!this.history) {
              that.pullUpText = '所有数据已加载完毕!';
            }
            if (this.maxId == 0) {
              that.pullUpText = '所有数据已加载完毕!';
            }
            this.scroll.refresh();
            this.upTouch = true;
            this.dataComplete = true;
            setTimeout(() => {
              this.scroll.refresh();
            }, 200);
          }).catch(function (error) {
            this.loading = false;
            this.dataNone = true;
            this.hintText = "数据解析异常，请刷新重试!";
            console.log('数据解析异常');
            console.log(error);
          })
        })
      },
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

<style lang="less">
  @import "../../common/less/base.less";

  #my_guess {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0px;
    color: #fff;
    z-index: 99999;

    .loading-container, .container {
      width: 100%;
      height: 100%;
    }

    .tab {
      font-size: 0.16rem;
      width: 100%;
      height: 44px;
      background: @whites;
      padding: 10px 0;
      position: relative;
      .border-bottom;

      span {
        width: 50%;
        float: left;
        font-size: 0.14rem;
        color: @maincolor;
        text-align: center;
        position: relative;
      }

      .on {
        color: @reds;
      }

      .search {
        .border-left;
      }
    }

    .wrapper {
      width: 100%;
      position: absolute;
      left: 0;
      top: 88px;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background: @backcolor;
    }

    .com-list-inner {
      min-height: 100%;
      width: 100%;
      box-sizing: content-box;
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
      float: left;
    }

    ul[listContent] {
      width: 100%;
      font-size: 0.14rem;
      float: left;
      min-height: 100%;

      li {
        width: 100%;
        margin-bottom: 10px;
        background: @whites;
        color: @maincolor;
        float: left;

        .allView {
          width: calc(100%);
          margin-left: 15px;
          /*border-bottom: 1px solid #444444;*/
          display: flex;
          flex-direction: column;
        }

        .allView div {
          display: flex;
          padding: 5px 0;
        }

        .firstView {
          display: flex;
          width: 100%;
          flex-direction: column;
        }

        .twoView {
          display: flex;
          width: 100%;
          flex-direction: column;
          border-top: 1px solid #F4F4F4;
        }

        .twoViewIng {
          display: flex;
          width: 100%;
          border-top: 1px solid #F4F4F4;
        }

        .leftIng {
          display: flex;
          width: 65%;
          flex-direction: column;
        }

        .rightIng {
          display: flex;
          width: 35%;
        }

        .thirdView {
          display: flex;
          width: 85%;
          flex-direction: column;
          margin-left: 0.15rem;
          background-color: #FBFBFB;
          font-size: 0.12rem;
          margin-bottom: 0.1rem;
        }

        .thirdView span {
          padding-left: 0.1rem;
          color: #A2A2A2;
        }

        .teams {
          font-size: 0.14rem;
          color: #333333;
          display: block;
          padding: 0.06rem 0;
        }

        .infov {
          color: #e9311d;
        }

        .rqinfo, .betp {
          font-size: 0.12rem;
          padding-top: 0.01rem;
          color: #333333;
          display: block;
        }

        .guessing, .retend {
          color: #1ba479 !important;
          font-size: 0.14rem !important;
          padding-left: 0.1rem;
        }

        .cdate {
          font-size: 0.12rem;
          padding-top: 0.01rem;
          color: #333333;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &[nomatch] {
          text-align: center;
          padding: 15px;
          color: @assistcolor;
        }
      }
    }

    .inxcx {
      top: 44px;
    }

    .leagueCls {
      margin-left: 0.2rem;
      color: #A2A2A2;
    }

    .oddsCls {
      font-size: 0.12rem;
      color: #A2A2A2;
      margin-left: 0.1rem;
    }

    .ztBtn {
      background-color: #E63329;
      width: 0.9rem;
      height: 0.3rem;
      color: white;
      font-size: 0.16rem;
      border-style: none; //无边框
      outline: none; //获得焦点也无边框
    }

    .allViewOld {
      width: calc(100%);
      margin-left: 15px;
      border-bottom: 0.1rem solid #F4F4F4;
      display: flex;
    }

    #one {
      width: 50%;
    }

    #two {
      width: 50%;
      padding-top: 0.2rem;
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

    .pn_566x468 .txt {
      float: left;
      width: 100%;
      margin-top: 0.9rem;
      font-size: 0.17rem;
      color: #333;
      padding-bottom: 0.2rem;
    }

    .ingImgCls {
      width: 0.6rem;
      /*margin-left: 0.3rem;*/
      background: #219D44;
      font-size: 0.16rem;
      border-style: none; //无边框
      outline: none; //获得焦点也无边框
      border-radius: 0.8rem;
      color: white;
    }

  }
</style>
