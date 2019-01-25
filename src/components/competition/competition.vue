<template>
  <div class="competition">
    <publick-header v-if="!inXCX" :headerData="headerData"></publick-header>
    <div class="tab" v-if="!inXCX">
      <span :class="{matchliston:!isAll}" @click="wrapShow('little')">推荐</span>
      <span class="search" :class="{matchliston:isAll}" @click="wrapShow('all')">全部</span>
    </div>
    <div class="tab-wx" v-if="inXCX">
      <div class="wxtab-ball"><span @click="wxBallClick">{{isballText}}</span></div>
      <div class="wxtab-rec"><span @click="wxRecClick">{{isallText}}</span></div>
      <div class="wxtab-search"><span @click="wxSearchClick">筛选</span></div>
    </div>
    <div class="isAllWrap" :class="{matchSelectShow:isAllWrapShow}">
      <ul @click="isAllChose">
        <li id="little" class="on">推荐<span class="line"></span></li>
        <li id="all">全部</li>
      </ul>
    </div>

      <div class="searchwrap" :class="{matchSelectShow:searchWrapShow,inxcx: inXCX}">
          <ul class="searchMain" @click="searchChose">
              <li v-for="item in cupNameArr">
                  <span class="on" v-for="(m,i) in item" :id="i">{{i}}(<i>{{m.length}}</i>)</span>
              </li>
          </ul>
          <div class="searchfoot">
              <p class="all">
                  <span
                      @click="setAllChoose(allChoose)"
                      class="all-chos chos_on"
                      ></span>
                  全选&nbsp;&nbsp;&nbsp;已选择 <span class="num-chos">{{count}}</span>&nbsp;场
              </p>
              <p class="chos-btn" @click="searchSure" id="sure">确定</p>
          </div>
      </div>

    <scroll
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingDownFn="pullingDownFn"
      :pullingUpFn="pullingUpFn"
      ref="Scroll"
      class="com-list-wrap"
      :class="{inxcx: inXCX}"
      :data="matchListData">
      <div class="com-list-inner" style="float:left;padding-bottom:50px;">
        <p pulldown>{{pullDownText}}</p>
        <ul matchlist>
          <li v-if="matchListData.length!=0" v-for="item in matchListData" :id="'s'+item.lottery_entry_id"
              @click="openArticle(item.lottery_entry_id)">
            <div match-item="">
              <p class="cup-times">
                <span class="tim">{{item.startTime}}</span>
                {{item.cupName}}
                {{item.matchId}}
                <span class="art-count"
                      :class="{artnum:item.articleCount==0,on:item.articleCount>0&&item.articleCount<=3,onmore:item.articleCount>3}">{{item.articleCount}}</span>
              </p>
              <div class="match-msg">
                <div class="match-left"
                     :class="{on:item.matchScore.matchStatus>0,over:item.matchScore.matchStatus==-1,savage:item.matchScore.matchStatus==0}"
                     v-html="setMatchStatus(item.matchScore)">
                  {{setMatchStatus(item.matchScore)}}
                </div>
                <div class="match-center">
                  <p><span>{{item.homeTeam}}</span></p>
                  <p><span>{{item.awayTeam}}</span></p>
                </div>
                <div class="match-right on"
                     v-if="item.matchScore.homeTeamScore != undefined && item.matchScore.matchStatus != 0">
                  <p><span>{{item.matchScore.homeTeamScore}} <i>({{item.matchScore.homeTeamHalfScore}})</i></span></p>
                  <p><span>{{item.matchScore.guestTeamScore}} <i>({{item.matchScore.guestTeamHalfScore}})</i></span></p>
                </div>
                <i v-if="item.articleCount>0" class="open"></i>
              </div>
            </div>
            <ul atrlist :id="'list-'+item.lottery_entry_id" v-if="item.articleCount>0">
              <li v-for="artItem in item.articleList" @click.stop="goarticle(artItem)">
                <dl>
                  <dt @click.stop="goauthor(artItem.author_id)">
                    <img :src="artItem.authorPic">
                  </dt>
                  <dd>
                    {{artItem.authorName}}<span v-if="artItem.authorFollowed" class="match-follow"></span><span
                    v-if="artItem.authorRedInfo" class="red">连红</span>
                    <p class="match-time">{{setTime(artItem.last_modified)}}</p>

                    <span class="price">{{setPrice(artItem)}}</span>
                  </dd>
                </dl>
                <p class="match-digest">
                  {{artItem.digest}}
                </p>
              </li>
              <li v-if="item.articleCount>3" @click.stop="gomatch(item.lotteryMatchId)" class="more-art">浏览该赛事全部分析</li>
            </ul>
          </li>
          <li nomatch v-if="matchListData.length == 0">暂无最新赛事</li>
          <p pullup>{{pullUpText}}</p>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Common from 'common/js/common'
  import publickHeader from 'base/header/publickheader'
  export default {
    name: 'competition',
    data() {
      return {
        needRefresh: true,
        pullDownRefresh: {threshold: 50, stop: 50},
        pullUpLoad: {threshold: 0, txt: {more: "", noMore: ""}},
        pullDownText: '下拉加载更多历史赛事',
        pullUpText: '上拉加载更多赛事',
        headerData: {
          ele: '<span class="bo on" id="foot-hd">足球</span><span class="fo" id="basket-hd">篮球</span>',
          name: 'competition',
          isShow: true
        },
        matchListData: [],
        cupList: [],
        cupNameArr: [],
        chooseArr: [],
        isBall: 0,
        isAll: false,
        isAllWrapShow: false,
        searchWrapShow: false,
        allChoose: true,
        isAllText: '推荐',
        D_TYPES: 0,
        IS_PAGEUP: '',
        downTime: '',
        upTime: '',
        scrollToId: '0',
        newScrollH: 0,
        oldScrollH: 0,
        isFirstEnter: true,
        loding: null,
        isOpen: false,
        count: 0,
        inXCX: false,
        isballText: '足球',
        isallText: '推荐'
      }
    },
    components: {
      Scroll, publickHeader
    },
    created() {
      this.isFirstEnter = true;
      this.lodingDom();
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == 'enter') {
        location.reload();
      }
      if (from.name == 'articledetail' || from.name == 'matchdetail') {
        to.meta.iskeep = true;
      }
      if (from.name == 'home') {
        to.meta.iskeep = false;
      }
      next();
    },
    activated() {
      if(window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase())){
        this.inXCX = true
        document.getElementsByTagName("title")[0].innerText = '赛事'
      }
      if (!this.$route.meta.iskeep || this.isFirstEnter) {
        this.lodingDom();
        this.$refs.Scroll.refresh();
        this.matchListData = [];
        this.cupList = [];
        this.cupNameArr = [];
        this.chooseArr = [];
        this.isBall = 0;
        this.isAll = false;
        this.isAllWrapShow = false;
        this.searchWrapShow = false;
        this.IS_PAGEUP = '';
        this.getData();
      }
      this.isFirstEnter = false;
      this.$route.meta.iskeep = false;
    },
    deactivated() {
      if (this.$route.name == 'home') {
        this.matchListData = [];
        this.$refs.Scroll.scrollTo(0, 0, 0);
      }
    },
    mounted() {
      //this.getData();
      if (!this.inXCX) {
        this.isBallClick();
      }
    },

    methods: {
      pullingDownFn(scroll) {
        this.IS_PAGEUP = true;
        this.oldScrollH = this.$refs.Scroll.scroll.maxScrollY;
        this.cupNameArr = [];
        this.pullDownText = '释放加载 ...';
        this.getData();
      },
      pullingUpFn(scroll) {
        this.IS_PAGEUP = false;
        this.oldScrollH = this.$refs.Scroll.scroll.scrollerHeight;
        this.cupNameArr = [];
        this.pullUpText = '努力加载中 ...';
        this.getData();
      },
      getData() {
        var that = this;
        var getTime = this.nowTime();
        if (this.IS_PAGEUP === '') {
          getTime = this.nowTime();
        } else if (this.IS_PAGEUP === true) {
          getTime = this.downTime;
        } else if (this.IS_PAGEUP === false) {
          getTime = this.upTime;
        }
        this.$nextTick(function () {
          this.$http.jsonp(Common.baseURI().host + '/match/listv2',
            {
              params: {
                sportType: this.isBall,
                startTime: getTime,
                isAll: this.isAll,
                isPageUp: this.IS_PAGEUP,
                userId: this.shareFn.getUserId(),
              }
            }
          ).then(function (res) {
            if (res.data.code === '0000') {
              if (this.IS_PAGEUP === true) {
                this.matchListData = res.data.matchList.concat(this.matchListData);
                this.downTime = this.matchListData[0].startTime2;
                this.pullDownText = '下拉加载更多历史赛事';
              } else if (this.IS_PAGEUP === false) {
                this.matchListData = this.matchListData.concat(res.data.matchList);
                this.upTime = this.matchListData[this.matchListData.length - 1].startTime2;
                this.pullUpText = '上拉加载更多赛事';
                if (res.data.matchList == 0) {
                  this.pullUpText = '暂无更多内容！';
                }
              } else if (this.IS_PAGEUP === '') {
                this.matchListData = res.data.matchList;
                if (this.matchListData.length > 0) {
                  this.downTime = this.matchListData[0].startTime2;
                  this.upTime = this.matchListData[this.matchListData.length - 1].startTime2;
                }
                this.$nextTick(function () {
                  if (!this.isOpen) {
                    var firstLi = document.querySelectorAll('ul[matchlist]>li')[0],
                      firstOpen = firstLi.querySelector('.open'),
                      firstUl = firstLi.querySelector('ul');
                    firstOpen.className = 'open ing';
                    firstUl.style.height = 'auto';
                    this.$refs.Scroll.refresh();
                    this.isOpen = true;
                  }
                })
              }
              this.matchListData.forEach(function (v, i) {
                if (that.cupList.hasOwnProperty(v.cupName)) {
                  that.cupList[v.cupName].push(v)
                } else {
                  that.cupList[v.cupName] = [v]
                }
              })
              for (var i in that.cupList) {
                that.count += that.cupList[i].length;
              }
              for (var i in that.cupList) {
                var obj = {};
                obj[i] = that.cupList[i];
                that.cupNameArr.push(obj);
              }
              if (this.IS_PAGEUP === true) {
                this.$nextTick(function () {
                  setTimeout(function () {
                    that.$refs.Scroll.scrollTo(0, that.$refs.Scroll.scroll.maxScrollY - that.oldScrollH, 200)
                  }, 10)
                })

              } else {
                if (this.matchListData.length <= 0) {
                  //bottomTip.innerText = '没有更多赛事啦';
                } else {
                  //bottomTip.innerText = '上拉加载更多赛事';
                }
                this.$refs.Scroll.refresh();
              }
            } else {
              console.log('请求失败');
            }

            layer.close(this.loding);
          })
        })
      },
      nowTime: function () {
        var now = new Date(),
          day = now.getDate(),
          Month = now.getMonth() + 1,
          Year = now.getFullYear(),
          hours = now.getHours(),
          minutes = now.getMinutes();
        if (hours >= 2) {
          hours = hours * 1 - 2;
        } else {
          day = day * 1 - 1;
          hours = 22
        }
        return Year + '-' + Month + '-' + day + ' ' + hours + ':' + minutes;
      },
      wxBallClick () {
        if (this.isballText == '足球') {
          this.isballText = '篮球'
          this.isBall = '1'
          this.IS_PAGEUP = ''
        } else {
          this.isballText = '足球'
          this.isBall = '0'
          this.IS_PAGEUP = ''
        }
        that.cupNameArr = [];
        that.cupList = [];
        this.getData()
      },
      wxRecClick () {
        if (this.isallText == '推荐') {
          this.isAll = true
          this.isallText = '全部'
        } else {
          this.isAll = false
          this.isallText = '推荐'
        }
        this.IS_PAGEUP = ''
        this.getData();
      },
      wxSearchClick () {
        this.searchWrapShow = true;
      },
      isBallClick() {
        var that = this;
        let football = document.querySelector('#foot-hd');
        let basketball = document.querySelector('#basket-hd');
        that.isAll = false;
        football.onclick = function () {
          that.lodingDom();
          that.searchWrapShow = false;
          that.isAllWrapShow = false;
          that.matchListData = [];
          that.IS_PAGEUP = '';
          that.cupNameArr = [];
          that.cupList = [];
          that.isBall = 0;
          that.getData();
          football.className = 'fo on';
          basketball.className = 'bo';
          that.$nextTick(function () {
            that.$refs.Scroll.scrollTo(0, 0, 0, 0)
          })
          that.setMenu();
        };
        basketball.onclick = function () {
          that.lodingDom();
          that.searchWrapShow = false;
          that.isAllWrapShow = false;
          that.matchListData = [];
          that.IS_PAGEUP = '';
          that.cupNameArr = [];
          that.cupList = [];
          that.isBall = 1;
          that.getData();
          football.className = 'fo';
          basketball.className = 'bo on';
          that.$nextTick(function () {
            that.$refs.Scroll.scrollTo(0, 0, 0, 0)
          })
          that.setMenu();
        };
      },
      setMatchStatus(s) {
        var s_time = s.gameStartTime;
        var statu = s.matchStatus;
        var sarr_football = {
          "0": "未开赛", "1": "上半场", "2": "中场", "3": "下半场", "4": "加时", "-11": "待定", "-12": "腰斩",
          "-13": "中断", "-14": "推迟", "-1": "完场", "-10": "取消"
        };
        var sarr_basketball = {
          "0": "未开赛", "1": "一节", "2": "二节", "3": "三节", "4": "四节", "-1": "完场", "-2": "待定",
          "-3": "中断", "-4": "取消", "-5": "推迟", "50": "中场"
        };
        var str = '';
        var oldtime = new Date(s_time).getTime();
        var newtime = new Date().getTime();
        var i = parseInt((newtime - oldtime) / 60000);
        if (oldtime < newtime && statu != '-1' && statu != 0 && statu != '2' && statu != 50) {
          if (this.isBall == 0) {
            return str += sarr_football[statu] + ' ' + i + '<i>\'</i>';
          } else {
            return str += sarr_basketball[statu] + ' ' + i + '<i>\'</i>';
          }
        } else {
          if (this.isBall == 0) {
            return sarr_football[statu];
          } else {
            return sarr_basketball[statu];
          }
        }
      },
      wrapShow(s) {
        if (s == 'all') {
          this.IS_PAGEUP = '';
          //this.matchListData = [];
          this.isAll = true;
          this.isAllText = '全部';
          this.getData();
        } else {
          this.IS_PAGEUP = '';
          //this.matchListData = [];
          this.isAll = false;
          this.isAllText = '推荐';
          this.getData();
        }
      },
      isAllChose(event) {
        var that = this;
        if (event.target.id == 'little') {
          that.IS_PAGEUP = '';
          that.matchListData = [];
          that.cupNameArr = [];
          that.cupList = [];
          that.isAll = false;
          that.isAllText = '推荐';
          this.getData();
        } else if (event.target.id == 'all') {
          that.IS_PAGEUP = '';
          that.matchListData = [];
          that.cupNameArr = [];
          that.cupList = [];
          that.isAll = true;
          that.isAllText = '全部';
          this.getData();
        } else {
          return;
        }
        that.isAllWrapShow = false;
      },
      searchChose(event) {
        if (event.target.id == '' || event.target.id == undefined) {
          return;
        } else {
          if (event.target.className == 'on') {
            event.target.className = ''
            this.count = 0;
          } else {
            event.target.className = 'on';
            this.count = 0;
          }
        }
        ;
        var selectCupName = document.querySelectorAll('.searchMain li .on'),
          selectLi = document.querySelectorAll('.searchMain li'),
          all_chos = document.querySelector('.all-chos');
        if (selectCupName.length == selectLi.length) {
          all_chos.className = "all-chos chos_on";
        } else {
          all_chos.className = "all-chos";
        }
        for (var i = 0; i < selectCupName.length; i++) {
          this.count += selectCupName[i].querySelector('i').innerHTML * 1;
        }
      },
      searchSure() {
        var selectLi = document.querySelectorAll('.searchMain li'),
          selectCupName = document.querySelectorAll('.searchMain li .on');
        this.searchWrapShow = false;
        if (selectCupName.length == selectLi.length || selectCupName.length == 0) {
          return;
        } else {
          for (var k = 0; k < this.cupNameArr.length; k++) {
            for (var key in this.cupNameArr[k]) {
              for (var i = 0; i < selectCupName.length; i++) {
                if (key == selectCupName[i].id) {
                  for (var j = 0; j < this.cupNameArr[k][key].length; j++) {
                    this.chooseArr.push(this.cupNameArr[k][key][j])
                  }
                }
              }
            }
          }
        }
        this.matchListData = this.chooseArr;
      },
      setAllChoose(s) {
        var selectSpan = document.querySelectorAll('.searchMain li span'),
          all_chos = document.querySelector('.all-chos');
        this.count = 0;
        if (all_chos.className == "all-chos") {
          all_chos.className = "all-chos chos_on";
          for (var i = 0; i < selectSpan.length; i++) {
            selectSpan[i].className = 'on';
            this.count += selectSpan[i].querySelector('i').innerHTML * 1;
          }
        } else {
          for (var i = 0; i < selectSpan.length; i++) {
            selectSpan[i].className = '';
            this.count = 0;
          }
          all_chos.className = "all-chos";
        }
      },
      openArticle(id) {
        var that = this;
        var artWrap = document.querySelector('#list-' + id),
          openBtn = document.querySelector('#s' + id).querySelector('.open'),
          allOpenBtn = document.querySelectorAll('.open'),
          atrlistWrap = document.querySelectorAll('ul[atrlist]');
        for (var i = 0; i < atrlistWrap.length; i++) {
          if (atrlistWrap[i].getAttribute('id').indexOf(id) > 0) {
            continue;
          }
          atrlistWrap[i].style.height = 0;
          allOpenBtn[i].className = 'open';
        }
        if (openBtn.className == 'open') {
          artWrap.style.height = 'auto';
          openBtn.className = 'open ing';
          that.$refs.Scroll.scrollToElement(openBtn, 0, 0, -110);
        } else {
          artWrap.style.height = 0;
          openBtn.className = 'open';
        }
      },
      setTime(s) {
        return this.shareFn.setTime(s);
      },
      setPrice(val) {
        if (val.price == 0 && !val.chargeable && (val.authorLevels != undefined && val.authorLevels.length <= 0)) {
          return '查看观点'
        } else if (val.chargeable && (val.authorLevels != undefined && val.authorLevels.length > 0) && (val.price == undefined || val.price == 0)) {
          return 'VIP专属'
        } else {
          return '￥' + val.price + '解锁'
        }
      },
      back: function () {
        this.$router.back();
      },
      setMenu: function (name) {
        var menu = document.querySelector('#menus');
        if (menu.className == 'menus show') {
          menu.className = 'menus';
        }
      },
      lodingDom() {
        this.loding = layer.open({
          type: 2,
          content: '加载中'
        });
      },
      gomatch(Id) {
        if (this.inXCX) {
          wx.miniProgram.navigateTo({url: '/pages/match/matchdetail/matchdetail?id=' + Id})
        } else {
          this.$router.push({
            path: `/matchdetail/?id=${Id}`
          })
        }
      },
      goarticle(item) {
        if (this.inXCX) {
          wx.miniProgram.navigateTo({url: '/pages/art/art?id=' + item.id})
        } else {
          this.$router.push({
            path: `/articledetail/?id=${item.id}`,
            props: {id: item.id}
          })
        }
      }
    },
    watch: {}
  }
</script>

<style lang="less">
  @import "../../common/less/base.less";

  .competition {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0px;
    bottom: 0px;
    color: @whites;
    background: @backcolor;
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
    .header {
      div {
        width: 50%;
        .fo, .bo {
          margin: 0 15px;
          color: #f4f4f4;
          display: inline-block;
          position: relative;
          color: rgba(255, 255, 255, 0.5);
          display: inline-block;
          position: relative;
        }
        .on {
          color: @whites;
          &:after {
            content: '';
            width: 0.32rem;
            height: 2px;
            background: #ffffff;
            border-radius: 2px;
            position: absolute;
            bottom: 8px;
            left: 50%;
            margin-left: -0.16rem;
          }
        }
      }
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
      .matchliston {
        color: @reds;
      }
      .search {
        .border-left;
      }
      .open {
        &:after {
          border-bottom-color: @reds;
          border-top-color: transparent;
          margin-top: -6px;
        }
      }
      .garyun {
        color: @maincolor;
        &:after {
          border-bottom-color: @maincolor;
          border-top-color: transparent;
          margin-top: -6px;
        }
      }
      .garyopen {
        color: @maincolor;
        &:after {
          border-top-color: @maincolor;
        }
      }
    }
    .tab-wx{
      font-size: 15px;
      width: 100%;
      height: 44px;
      background: @whites;
      padding: 10px 0;
      position: relative;
      color: #666666;
      .border-bottom;
      display: flex;
      text-align: center;
      .wxtab-ball,.wxtab-rec{
        width: 45%;
        span{
          display: inline-block;
          background: url('../../common/img/cut2.png') no-repeat right center;
          background-size: 14px;
          padding-right: 19px;
        }
      }
      .wxtab-rec,.wxtab-search{
        .border-left;position: relative;
      }
      .wxtab-search{
        width: 30%;
        span{
          display: inline-block;
          background: url('../../common/img/choose2.png') no-repeat left center;
          background-size: 13px 14px;
          padding-left: 18px;
        }
      }
    }
    .isAllWrap, .searchwrap {
      width: 100%;
      font-size: 0.15rem;
      background: rgba(0, 0, 0, 0.3);
      color: @maincolor;
      position: absolute;
      top: 88px;
      bottom: 0;
      z-index: 99;
      height: 0;
      overflow: hidden;
    }
    .isAllWrap {
      ul {
        line-height: 50px;
        text-align: center;
        z-index: 9;
        background: @whites;
        padding: 0 15px;
        li {
          .border-bottom;
          background: @whites;
          position: relative;
          &:last-child {
            .border-none;
          }
        }
        .on {
          color: @reds;
        }
      }
    }
    .searchwrap {
      .searchMain {
        padding: 0 15px;
        background: @whites;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around flex-start;
        align-content: flex-start;
        padding-bottom: 25px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 50px;
        overflow: scroll;
        li {
          width: 30%;
          height: 32px;
          text-align: center;
          line-height: 32px;
          margin-top: 20px;
          margin-right: 5%;
          &:nth-child(3n+3) {
            margin-right: 0;
          }
          span {
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #999999;
            border: 1px solid #b8b8b8;
            border-radius: 3px;
            line-height: 30px;
          }
          .on {
            color: @reds;
            border: 1px solid @reds;
            background: @shallowred2;
            line-height: 30px;
          }
        }
      }
      .searchfoot {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: @whites;
        padding: 0 15px;
        left: 0;
        bottom: 0;
        .border-top;
        position: absolute;
        .all {
          float: left;
          font-size: 0.14rem;
          .all-chos {
            width: 18px;
            height: 18px;
            background: url(../../common/img/unselect.png) no-repeat center;
            background-size: 17px;
            display: inline-block;
            margin-right: 5px;
            transform: translateY(0.02rem);
          }
          .chos_on {
            background: url(../../common/img/selected.png) no-repeat center;
            background-size: 17px;
          }
          .num-chos {
            color: @reds;
            font-weight: 600;
          }
        }
        .chos-btn {
          width: 120px;
          text-align: center;
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          background: @reds;
          color: @whites;
        }
      }
    }
    .matchSelectShow {
      height: auto;
    }
    .com-list-wrap {
      width: 100%;
      position: absolute;
      left: 0;
      top: 88px;
      bottom: 0;
      right: 0;
      overflow: hidden;
    }
    .inxcx{
      top: 44px;
    }
    .com-list-inner {
      min-height: 100%;
      width: 100%;
      box-sizing: content-box;
    }
    ul[matchlist] {
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
        .cup-times {
          line-height: 25px;
          font-size: 0.11rem;
          color: @namecolor;
          .tim {
            color: @maincolor;
            padding-right: 5px;
          }

          .art-count {
            display: inline-block;
            padding-left: 15px;
            position: relative;
            margin-left: 5px;
            font-size: 0.1rem;
            &:before {
              width: 12px;
              height: 10px;
              content: '';
              background: url(../../common/img/num.png) no-repeat left center;
              background-size: 36px 10px;
              overflow: hidden;
              background-position: 0px 0;
              position: absolute;
              left: 0px;
              top: 7px;
            }
          }
          .artnum {
            color: #999999;
            &:before {
              background-position: 0px 0;
            }
          }
          .on {
            color: #ff8209;
            &:before {
              background-position: -12px 0;
            }
          }
          .onmore {
            color: @reds;
            &:before {
              background-position: -24px 0;
            }
          }
        }
        .match-msg {
          width: 100%;
          color: @maincolor;
          float: left;
          padding: 5px 0;
          position: relative;
          div {
            float: left;
          }
          .match-left {
            width: 25%;
            line-height: 40px;
            text-align: center;
          }
          .match-center {
            text-align: left;
            width: 45%;
            .border-left;
            padding-left: 15px;
            p {
              line-height: 20px;
              span {
                line-height: 1;
                display: inline-block;
                vertical-align: top;
              }
              &:nth-child(2) {
                span {
                  vertical-align: bottom;
                }
              }
            }
          }
          .match-right {
            width: 30%;
            position: relative;
            p {
              color: @shallowred;
              font-size: 0.15rem;
              height: 20px;
              line-height: 20px;
              span {
                line-height: 1;
                display: inline-block;
                vertical-align: top;
                i {
                  line-height: 1;
                  display: inline-block;
                  font-size: 0.14rem;
                  vertical-align: top;
                }
              }
              &:nth-child(2) {
                vertical-align: baseline;
                span {
                  line-height: 1;
                  display: inline-block;
                  vertical-align: bottom;
                  i {
                    line-height: 1;
                    display: inline-block;
                    font-size: 0.14rem;
                    vertical-align: bottom;
                  }
                }
              }
            }
          }
          .on {
            color: @reds;
          }
          .over {
            color: #999999;
          }
          .savage {
            color: @oranges;
          }
        }
        .open {
          width: 100px;
          height: 40px;
          position: absolute;
          right: 0;
          bottom: 0px;
          transform: rotate(180deg);
          transform-origin: center center;
          background: url(../../common/img/open.png) no-repeat top center;
          background-position: 0px 6px;
          background-size: 15px 6px;
        }
        .ing {
          background: url(../../common/img/open.png) no-repeat bottom center;
          transform: rotate(0deg);
          transform-origin: center center;
          background-position: 84px 25px;
          background-size: 15px 6px;
        }
        div[match-item] {
          width: 100%;
          float: left;
          padding: 15px;
        }

        ul[atrlist] {
          width: 100%;
          height: 0;
          overflow: hidden;
          transition: all 0.6s;
          li {
            margin-bottom: 0;
            background: #fbfbfb;
            padding: 20px 0 20px 15px;
            position: relative;
            .border-bottom;
            &:last-child {
              .border-none;
            }
            &:nth-child(3) {
              .border-none;
            }
          }
          .more-art {
            color: @garycolor;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: @whites;
            font-size: 0.12rem;
            .border-none;
            padding: 0;
          }
          dl {
            width: 100%;
            padding-right: 15px;
            float: left;
            dt {
              float: left;
              width: 38px;
              transform: translateY(-2px);
              img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
              }
            }
            dd {
              font-size: 0.12rem;
              color: @namecolor;
              line-height: 1;
              position: relative;
            }
            .match-time {
              font-size: 0.09rem;
              color: #949494;
              padding-top: 5px;
            }
          }
          .price {
            height: 46px;
            box-sizing: content-box;
            padding: 0 20px;
            line-height: 46px;
            color: @reds;
            border: 1px solid @reds;
            border-radius: 4px;
            position: absolute;
            right: 0;
            top: 2px;
            font-size: 0.24rem;
            transform: scale(0.5);
            transform-origin: top right;
          }
        }
        .art-time {
          padding-top: 5px;
        }
        .match-digest {
          width: 100%;
          word-break: break-all;
          font-size: 0.14rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-right: 15px;
          line-height: 25px;
          padding-top: 10px;
        }
        .match-follow {
          width: 39px;
          height: 13px;
          display: inline-block;
          margin-left: 5px;
          background: url('../../common/img/match-follow.png') no-repeat center;
          background-size: 100%;
          transform: translateY(2px);
        }
        .red {
          background: url('../../common/img/redall.png') no-repeat left center;
          padding-left: 14px;
          background-size: 10px 12px;
          margin-left: 5px;
          font-size: 0.1rem;
          color: #e83102;
          line-height: 12px;
        }
        &[nomatch] {
          text-align: center;
          padding: 15px;
          color: @assistcolor;
        }
      }
    }
  }
</style>
