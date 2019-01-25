<template>
  <div id="freelist">
    <publick-header v-if="!inXCX" :headerData="headerData"></publick-header>
    <scroll
      class="basketball-list-wrap"
      :class="{inxcx: inXCX}"
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingDownFn="pullingDownFn"
      :pullingUpFn="pullingUpFn"
      ref="scroll"
      :data="listData"
    >
      <div class="scroll-wrap">
            <p pulldown>{{pullDownText}}</p>
            <div class="tips" v-show="tipsShow">
            <div class="tips-innner" @click="goFeed">
                <img src="./img/tips.png" alt=""> 您有{{unRead}}条新留言，{{unFeedback}}条待评价
                <img src="./img/go.png" alt="">
            </div>
        </div>
        <div class="list-item" v-for="item in listData">
            <div class="user">
            <dl><dt><img :src="item.userPic" alt=""></dt><dd>{{item.userName}}({{item.userId}})</dd></dl>
            <span>{{item.commentDate.substr(5,11)}}</span>
            </div>
            <div class="content-wrap">
                <div class="content">
                    <div class="star">
                        <span v-for="itemstar in stararr" :key="itemstar" :class="{on: itemstar<=item.score}" :id="itemstar"></span>
                    </div>
                    <p>{{item.comment}}</p>
                </div>
                <div class="reply" v-if="item.reply != undefined">
                    <span>老师回复</span>
                    <p>
                        {{item.reply}}
                    </p>
                </div>
                <div class="digest" @click="goarticle(item.targetId)">
                    <p>
                        评论原文：{{item.articleDigest}}
                    </p>
                    <span v-if="item.articlePubDate != undefined">{{item.articleAuthorName}} {{item.articlePubDate.substr(5,11)}}</span>
                </div>
            </div>
        </div>
        
        <div class="loading-container" v-show="!listData.length">
          <loading></loading>
        </div>
        <p pullup>{{pullUpText}}</p>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
var storage=window.localStorage, unFeedback = 0, unRead = 0;
import publickHeader from "base/header/publickheader";
import Scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import articleList from "base/articlelist/articlelist";
import Common from "common/js/common.js";

export default {
  data() {
    return {
        headerData: {
            ele: "<h1>留言墙</h1>",
            name: "freeList",
            isShow: false
        },
        listData: [],
        stararr: [1,2,3,4,5],
        unRead: '',
        unFeedback: '',
        tipsShow: false,
        types: 0,
        sportType: 0,
        needRefresh: true,
        pullDownRefresh: { threshold: 50, stop: 50 },
        pullUpLoad: { threshold: 0, txt: { more: "", noMore: "" } },
        pullDownText: "下拉刷新！",
        pullUpText: "上拉加载更多！",
        lastArticleId: 0,
        inXCX: false,
        userId: this.shareFn.getUserId(),
        token: this.shareFn.getSecurityCode(),
        reqUrl: '/feedback/list_all'
    };
  },
  components: {
    articleList,
    Scroll,
    loading,
    publickHeader
  },
  mounted: function() {
    this.top = 0;
    this.getData();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "articledetail") {
      to.meta.iskeep = true;
    }
    next();
  },
  activated() {
    let pageName = this.$router.currentRoute.query.name;
    if (window.__wxjs_environment === "miniprogram") {
        this.inXCX = true
        this.userId = this.$router.currentRoute.query.userId
        this.token = this.shareFn.wxGetUserT(this.userId,this.$router.currentRoute.query.token)
    }
    this.isFirstEnter = false;
    this.$route.meta.iskeep = false;
  },
  deactivated() {
    if (this.$route.name == "home") {
      this.$refs.scroll.scrollTo(0, 0, 0);
    }
    document.getElementsByTagName("title")[0].innerText = "精彩说";
  },
  methods: {
    pullingDownFn(scroll) {
      this.types = 0;
      this.lastArticleId = "";
      this.pullDownText = "努力加载中 ...";
      this.getData();
    },
    pullingUpFn(scroll) {
      this.types = 1;
      this.pullUpText = "努力加载中 ...";
      this.getData();
    },
    getData() {
        let that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(
            Common.baseURI().host + this.reqUrl +"?time=" +
              Math.random(),
            {
              params: {
                fdId: that.fdId,
                userId: this.userId,
                token: this.token,
              }
            }
          )
          .then(function(res) {
                if (res.data.code == '0000') {
                    that.unFeedback = res.data.unFeedback;
                    that.unRead = res.data.unRead;
                    if (that.unFeedback > 0 || that.unRead > 0) {
                        that.tipsShow = true
                    }
                    if (storage.readTime === that.setReadTime()) {
                        console.log('已读')
                        that.tipsShow = false
                    }
                    if(!that.types) {
                        that.listData = res.data.data;
                    } else {
                        that.listData = that.listData.concat(res.data.data);
                    }
                    if (that.listData.length>1) {
                        that.fdId = that.listData[that.listData.length-1].id
                    }
                } else {
                    alert(JSON.stringify(data))
                }
          });
      });
    },
    setReadTime () {
        return new Date().getMonth() + 1 + '-' + new Date().getDate()+'-'+this.unRead+'-'+this.unFeedback;
    },
    goFeed () {
        var readTime = this.setReadTime ();
            storage.setItem('readTime', readTime)
            this.tipsShow = false
        this.$router.push({
            path: `my/mymsg`
        });
    },
    goarticle(id) {
      if (this.inXCX) {
        wx.miniProgram.navigateTo({ url: "/pages/art/art?id=" + id });
      } else {
        this.$router.push({
          path: `/articledetail/?id=${id}`,
          props: { id: id }
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/base.less";
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
  .basketball-list-wrap {
    width: 100%;
    position: absolute;
    top: 44px;
    bottom: 0;
    overflow: hidden;
  }
  .container {
    width: 100%;
    position: absolute;
    top: 50px;
    bottom: 0;
    overflow-y: hidden;
  }
  .inxcx{
      top: 0;
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
.container{
    width: 100%;
    height: 100%;
    font-size: 15px;
    color: #333333;
}
.tips{
    margin-top: 9px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #ffffff;
    font-size: 12px;
    padding: 0 15px;
}
.tips-innner{
    display: flex;
    display: -webkit-flex;
    align-items: center;
    padding: 0 10px;
    border-radius: 2px;
    position: relative;
    background: -webkit-linear-gradient(left,rgb(255,123,45) ,rgb(255,93,76));
    background: linear-gradient(to right,rgb(255,123,43) ,rgb(255,93,76));
}
.tips-innner img:nth-child(2){
    width: 6px;
    height: 11px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
}
.tips-innner img{
    width: 16px;
    height: 14px;
    margin-right: 8px;
}
.list-item{
    width: 100%;
    padding: 0 15px;
    margin-top: 9px;
    border-radius: 2px;
}
.user{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    background: #ffd6b7;;
    height: 50px;
    line-height: 50px;
    padding: 0 12px;
    position: relative;
}
.user dl{
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.user dl dt{
    display: inherit;
    align-items: center;
    margin-right: 6px;
}
.user dl img{
    width: 30px;
    height: 30px;
    border-radius: 15px;
}
.user dl dd{
    font-size: 14px;
    color: #f07100;
}
.user span{
    font-size: 11px;
    color: #ffa866;
}
.user::before{
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f4f4f4;
    position: absolute;
    left: -6px;
    bottom: -6px;
}
.user::after{
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f4f4f4;
    position: absolute;
    right: -6px;
    bottom: -6px;
}
.content-wrap{
    padding: 0 12px 12px 12px;
    background: #ffffff;
    font-size: 15px;
    color: #333333;
}
.content .star{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    padding: 12px 0 8px 0;
}
.content .star span{
    width: 11px;height: 10px;
    background: url(./img/s.png) no-repeat center;
    background-size: 11px 10px;
    margin-right: 7px;
}
.content .star .on{
    width: 11px;height: 10px;
    background: url(./img/s_on.png) no-repeat center;
    background-size: 11px 10px;
    margin-right: 7px;
}

.reply{
    background: #f7f7f7;
    font-size: 12px;
    color: #666666;
    padding: 12px;
    margin-top: 9px;
    position: relative;
}
.reply span{
    display: block;
    font-size: 10px;
    color: #e9311d;
    padding-bottom: 10px;
}
.reply::before{
    content: "";
    width: 0;height: 0;
    border: 6px solid transparent;
    border-bottom-color: #f7f7f7;
    position: absolute;
    left: 20px;
    top: -12px;
}

.digest{
    font-size: 12px;
    color: #7a8497;
    padding: 12px;
    margin-top: 10px;
    position: relative;
    border: 1px solid #e0e0e0;
    background: url(./img/c.png) no-repeat left top;
    background-size: 17px 17px;
}
.digest span{
    display: block;
    font-size: 10px;
    color: #bdc4d2;
    padding-top: 10px;
}
</style>
