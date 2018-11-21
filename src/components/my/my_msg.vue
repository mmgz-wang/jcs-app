<template>
  <div class="my_msg">
   <main-header :headerData="headerData"></main-header>
   <div class="my_msg_hd">
     <img :src="shareFn.getUserPic()" alt="">
     <div class="my_info">
        <span class="name">{{$router.currentRoute.query.NickName}}</span>
        <p>赶紧给已购买文章留言打分，赚积分哦！</p>
        <router-link :to="{path: '/my/canmsg'}">
          <span class="goLeaveMsg">去打分</span>
        </router-link>
     </div>
   </div>
    <scroll
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingDownFn="pullingDownFn"
      :pullingUpFn="pullingUpFn"
      ref="Scroll"
      class="container" :data="msgList">
        <div class="scroll-wrap">
          <p pulldown>{{pullDownText}}</p>
          <div class="loading-container" v-show="!msgList.length">
            <loading></loading>
          </div>
          <div class="list" v-for="item in msgList">
            <dl class="feedback-item" 
              :class="{hide: item.userId != shareFn.getUserId() && ismyMsg}">
                <dt><img :src="item.articleAuthorPic" alt=""></dt>
                <dd>
                    <p class="nickname_msg">{{item.articleAuthorName}}</p>
                    <div class="star">
                        <span v-for="items in stars" :key="items"
                            :class="{on: items<=item.score}"></span>
                    </div>
                    <p class="feed-tim">{{item.commentDate.substr(5,11)}}</p>
                </dd>
            </dl>
            <div class="content">{{item.comment}}</div>
            <div class="reply">
              <div class="re-content" @click="goarticle(item.targetId)">
                  {{item.articleDigest}}
              </div>
              <p class="feed-tim">{{item.commentDate.substr(5,11)}}</p>
            </div>
          </div>
          <p pullup>{{pullUpText}}</p>
        </div>
    </scroll>
    <!--<guessDialog :item="curGuessItem"></guessDialog>-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import mainHeader from "base/header/mainheader";
import Common from "common/js/common";
export default {
  data() {
    return {
      headerData: {
        ele: "我的留言",
        name: "my_msg"
      },
      stars: ["1", "2", "3", "4", "5"],
      msgList: [],
      types: 0,
      lastArticleId: '',
      needRefresh: true,
      pullDownRefresh: { threshold: 50, stop: 50 },
      pullUpLoad: { threshold: 0, txt: { more: "", noMore: "" } },
      pullDownText: "下拉刷新！",
      pullUpText: "上拉加载更多！",
      reloads: false,
      $routerPath: [],
      curGuessItem: null
    };
  },
  components: {
    Scroll,
    loading,
    mainHeader
  },
  created() {},
  mounted: function() {
    this.top = 0;
    this.getData();
    this.$routerPath = this.$router.path;
  },
  methods: {
    goLeaveMsg() {},
    pullingDownFn(scroll) {
      this.types = 0;
      this.lastArticleId = '';
      this.pullDownText = "努力加载中 ...";
      this.getData();
    },
    pullingUpFn(scroll) {
      this.types = 1;
      this.pullUpText = "努力加载中 ...";
      this.getData();
    },
    getData() {
      if (this.reloads) {
        return;
      }
      this.$nextTick(function() {
        this.$http
          .jsonp(`${Common.baseURI().host}/User/Feedback/List`, {
            params: {
              language: "M",
              userId: this.shareFn.getUserId(),
              token: this.shareFn.getSecurityCode(),
              fdId: this.lastArticleId
            }
          })
          .then(function(res) {
            console.log(res.data);

            if (this.types) {
              if(res.data.data.length == 0){
                this.pullUpText = "已是全部留言内容！";
              }else{
                this.msgList = this.msgList.concat(res.data.data);
                this.pullUpText = "上拉加载更多！";
              }
            } else {
              this.msgList = res.data.data;
              this.pullDownText = "下拉刷新！";
            }
            if (this.msgList.length > 0) {
              this.lastArticleId = this.msgList[this.msgList.length - 1].id;
            }
          });
      });
    },
    expertIn() {
      this.$router.push("export");
    },
    goarticle(id){
			this.$router.push({
			  path: `/articledetail/?id=${id}`
			})
    },
    goauthor(id){
      this.$router.push({
        path: `/author/?id=${id}`
      })
    },
  },
  watch: {
    $routerPath: {
      handler: function(news, old) {}
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/base.less";
.my_msg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0px;
  color: #fff;
  z-index: 9999;
  background: #f4f4f4;
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

  .container {
    width: 100%;
    position: absolute;
    top: 104px;
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
  .my_msg_hd {
    height: 60px;
    padding: 0 15px;
    font-size: 14px;
    color: #333333;
    background: #ffffff;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      margin-right: 8px;
    }
    .my_info {
      position: relative;
      flex-grow: 1;
      p {
        font-size: 12px;
        color: #999999;
      }
      .goLeaveMsg {
        width: 60px;
        height: 25px;
        line-height: 25px;
        border: 1px solid #e9311d;
        color: #e9311d;
        border-radius: 15px;
        position: absolute;
        right: 0;
        top: 50%;
        text-align: center;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        font-size: 12px;
      }
    }
  }
  .list {
    background: #ffffff;
    margin-top: 10px;
    padding: 15px;
  }
  .list:nth-child(1) {
    margin: 0;
  }
  .feedback-item {
    display: flex;
    display: -webkit-flex;
    padding: 0;
    margin-top: 12px;
    font-size: 15px;
    padding-bottom: 12px;
    color: #333333;
    align-items: center;
    &:nth-child(1) {
      margin-top: 0;
    }
    dt {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
    }
    dd {
      margin-left: 13px;
      flex-grow: 1;
      position: relative;
      line-height: 1;
      .nickname_msg {
        font-size: 14px;
        color: #999999;
        padding-bottom: 4px;
      }
      .star {
        display: flex;
        display: -webkit-flex;
        span {
          background: url(../../common/img/star.png) no-repeat center;
          width: 13px;
          height: 13px;
          background-size: 13px 13px;
          display: block;
          margin-right: 7px;
        }
      }
      .star .on {
        background: url(../../common/img/staron.png) no-repeat center;
        background-size: 13px 13px;
      }
      .feed-tim {
        font-size: 11px;
        color: #d1d1d1;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
      }
    }
  }
  .content {
    padding: 8px 0;
    font-size: 15px;
    color: #333333;
  }
  .reply {
    width: 100%;
    background: #f4f4f4;
    padding: 12px;
    position: relative;
    margin-top: 10px;
    &::before {
      content: "";
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: #f4f4f4;
      position: absolute;
      left: 18px;
      top: -19px;
    }
    .re-tit {
      font-size: 14px;
      color: #3f84f9;
    }
    .re-content {
      padding: 8px 0;
      font-size: 15px;
      color: #666666;
    }
  }
  .feed-tim {
    font-size: 11px;
    color: #d1d1d1;
  }
  .feedback-item:last-child {
    dd {
      .border-none;
    }
  }
}
</style>
