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
            <div class="allView">
              <div class="leftView">
                <span class="teams">{{item.match_teams}}</span>
                <span class="rqinfo">{{item.handicap_name}}：<label class="infov">{{item.handicap_plan}}</label></span>
                <p class="betp">竞猜额：<label class="infov">{{item.cost}}</label> ({{item.invest_target}})</p>
              </div>
              <div class="rightView">
                <span v-if="!history" class="guessing">进行中...</span>
                <span v-else class="retend">返还：{{item.result}}</span>
                <span class="cdate">{{item.s_cdate.substr(5, 11)}}</span>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import mainHeader from 'base/header/mainheader'
  import loading from 'base/loading/loading'
  import Common from 'common/js/common.js'
  import BScroll from 'better-scroll'

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
        limit: '',  //接口请求条数
        curMaxId: '',
        currentList: [],
        historyList: [],
        historyMaxId: '',
        headerData: {
          ele: '我的竞猜',
          name: 'my_guess',
        },
        pullDownText: '下拉刷新',
        pullUpText: '上拉加载更多',
        type: 0, //区分上拉或者下拉
        userId: this.shareFn.getUserId(),
        token: this.shareFn.getSecurityCode()
      }
    },
    components: {
      loading, mainHeader
    },
    created() {
    },
    activated() {
      if (window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase())) {
        this.inXCX = true
        this.userId = this.$router.currentRoute.query.userId
        this.token = this.shareFn.wxGetUserT(this.userId, this.$router.currentRoute.query.token)
        document.getElementsByTagName("title")[0].innerText = '我的竞猜'
      }
      console.log('activated.....')
      //初始化 scroll 组件以及监听事件
      this.initAndListenScroll();
      //获取接口数据
      this.getData();
    },
    deactivated() {
    },
    mounted: function () {
      console.log('mounted......');
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
          pullUpLoad: {
            // 当上拉距离超过50px时触发 pullingUp 事件
            threshold: 100,
            txt: {more: "", noMore: ""}
          },
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
          // console.log("触发上拉加载了---------------------");
          //关闭下拉事件
          this.scroll.closePullDown();
          this.type = 1;
          this.pullUpText = '努力加载中 ...';
          this.pullUpShow = true;
          this.getData();
        });
        //下拉刷新事件
        this.scroll.on('pullingDown', () => {
          //console.log("触发下拉刷新了-------------------");
          //关闭上拉事件
          this.scroll.closePullUp();
          this.type = 0;
          this.history ? this.historyMaxId = '' : this.curMaxId = '';
          this.getData();
          this.pullDownText = '释放加载 ...';
          this.pullUpText = '上拉加载更多';
        });
        //滚动过程中的事件
        this.scroll.on('scroll', () => {
          //console.log(this.scroll);
        })
      },
      tabClick(tab) {
        switch (tab) {
          case 'tab_ing':
            if (this.currentList.length <= 0) {
              this.pullUpShow = false;
            }
            this.dataNone = false;
            this.history = false;
            this.curMaxId = '';
            this.currentList = [];
            this.loading = true;
            this.getData();
            break;
          case 'tab_history':
            if (this.historyList.length <= 0) {
              this.pullUpShow = false;
            }
            this.dataNone = false;
            this.history = true;
            this.historyMaxId = '';
            this.historyList = [];
            this.loading = true;
            this.getData();
            break;
        }
      },
      getData() {
        var that = this;
        this.$nextTick(function () {
          this.$http.jsonp(
            Common.baseURI().host + '/assets/getGuessingPlanSaleByUserId?time=' + Math.random(),
            {
              params: {
                userId: this.userId,
                token: this.token,
                history: this.history,
                maxId: this.history ? this.historyMaxId : this.curMaxId,
                limit: this.limit
              }
            }
          ).then(function (res) {
           //  console.log('数据: ' + JSON.stringify(res.data));
            this.loading = false;
            if (res.data != null && res.data.length > 0) {
              this.pullUpShow = true;
              if (this.history) {
                //历史中的数据
                if (that.type == 0) {
                  this.historyList = res.data;
                } else {
                  this.historyList = this.historyList.concat(res.data);
                }
                this.historyMaxId = res.data[res.data.length - 1].id;
              } else {
                //进行中的数据
                if (that.type == 0) {
                  this.currentList = res.data;
                } else {
                  this.currentList = this.currentList.concat(res.data);
                }
                this.curMaxId = res.data[res.data.length - 1].id;
              }
            }
            if (this.history && this.historyList.length <= 0 || !this.history && this.currentList.length <= 0) {
              this.dataNone = true;
            }
            // console.log("我是正常情况必然执行的。。。。。" + that.type);
            if (that.type == 0) {
              that.pullDownText = '下拉刷新';
              this.scroll.finishPullDown(); //下拉完毕
              this.scroll.openPullUp(true);//开启上拉
            } else {
              if (res.data.length == 0) {
                that.pullUpText = '所有数据已加载完毕!';
              } else {
                that.pullUpText = '上拉加载更多';
              }
              this.scroll.finishPullUp();//上拉完毕
              this.scroll.openPullDown(true);//开启下拉
            }
            this.scroll.refresh();
            setTimeout(() => {
              this.scroll.refresh();
            }, 200);
          }).catch(function (error) {
            this.loading = false;
            this.dataNone = true;
            this.hintText = "接口数据异常，请联系管理员";
            console.log('接口服务异常');
          })
        })
      },
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
          width: calc(90%);
          margin-left: 15px;
          border-bottom: 1px solid #444444;
          display: flex;
        }

        .allView div {
          display: flex;
          padding: 10px 0;
        }

        .leftView {
          display: flex;
          width: 60%;
          text-align: left;
          flex-direction: column;
        }

        .rightView {
          width: 40%;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .teams {
          font-size: 0.14rem;
          color: #333333;
          display: block;
          padding-bottom: 0.06rem;
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
  }
</style>
