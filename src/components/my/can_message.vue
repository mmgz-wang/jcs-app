<template>
  <div class="can_msg">
   <main-header :headerData="headerData"></main-header>
    <scroll
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingDownFn="pullingDownFn"
      :pullingUpFn="pullingUpFn"
      ref="Scroll"
      class="container" :data="artList">
        <div class="scroll-wrap">
          <p pulldown>{{pullDownText}}</p>
          <div class="loading-container" v-show="artList.length == 0 && noMore">
            <loading></loading>
          </div>
          <div class="no_art" v-if="!noMore">
            <dl class="no_main">
              <dt><img src="../../common/img/nofeedback.png" alt=""></dt>
              <dd>
                <p>您还没有需要打分的文章！</p>
              </dd>
            </dl>
          </div>
           <div class="listcon" v-for="item in artList" v-if="item.otype == 1 || item.otype == undefined" @click="goarticle(item)">
                <div class="txtbox">
                    <span class="list-digest"><i class="vip" v-if="item.tabView == undefined && item.chargeable">VIP</i>{{item.digest}}</span>
                    <div class="artlist-match" v-if="item.matches!=undefined && item.matches.length>0 && matchShow" @click.stop="gomatch(item.matches[0].entry_id)">
                        <span># {{item.matches[0].cup_name}}</span>
                        <span>{{item.matches[0].home_team}} vs {{item.matches[0].away_team}}</span>
                        <span>{{timeformat(item.matches[0].start_time)}} #</span>
                    </div>
                    <dl @click.stop="goauthor(item.author_id)" :author_id="item.author_id">
                        <dt>
                            <img v-lazy="item.authorPic">
                        </dt>
                        <dd class="h38">
                            <span class="name">{{item.authorName}}</span>
                            <p class="tm">{{timeformat(item.last_modified)}}</p>
                            <div class="goLeaveMsg" @click="goLeaveMsg(item)">去打分</div>
                        </dd>
                    </dl>
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
import shareFn from "common/js/sharefn";
import loading from "base/loading/loading";
import mainHeader from "base/header/mainheader";
import Common from "common/js/common";
export default {
  data() {
    return {
      headerData: {
        ele: "待打分",
        name: "can_msg"
      },
      noMore: true,
      matchShow: true,
      stars: ["1", "2", "3", "4", "5"],
      artList: [],
      types: 0,
      lastArticleId: 0,
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
    goLeaveMsg(s) {
        this.$router.push({
            path: `/leavemessage?id=${s.id}&authorId=${s.author_id}`
        })
    },
    pullingDownFn(scroll) {
      this.types = 0;
      this.lastArticleId = 0;
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
          .jsonp(`${Common.baseURI().host}/User/ToFeedback/List`, {
            params: {
              language: "M",
              userId: this.shareFn.getUserId(),
              token: this.shareFn.getSecurityCode(),
              fdId: ""
            }
          })
          .then(function(res) {
            console.log(res.data);

            if (this.types) {
                if(res.data.data.length == 0){
                    this.pullUpText = "已是全部数据！";
                }else{
                    this.artList = this.artList.concat(res.data.data);
                    this.pullUpText = "上拉加载更多！";
                }
            } else {
              if(res.data.data == 0){
                this.noMore = false
              }
              this.artList = res.data.data;
              this.pullDownText = "下拉刷新！";
            }
            if (this.artList.length > 0) {
              this.lastArticleId = this.artList[this.artList.length - 1].id;
            }
          });
      });
    },
    timeformat(s) {
      return shareFn.setTime(s);
    },
    tabView(item) {
      var str = "";
      if (!item.tabView) {
        return "";
      }
      if (item.chargeable) {
        str += '<i class="vip">VIP</i>' + item.tabView;
        if (item.singleUnlock && item.price > 0) {
          str += '<span class="list-Price">' + item.price + "精彩币</span>";
        } else if (!item.singleUnlock) {
          str += '<span class="list-Price">(VIP用户专享)</span>';
        }
        return str;
      } else {
        return item.tabView;
      }
    },
    expertIn() {
      this.$router.push("export");
    }
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
.can_msg {
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
    top: 44px;
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
  .listcon {
    width: 100%;
    overflow: hidden;
    margin-bottom: 8px;
    background: @whites;
    padding-left: 15px;
  }
  .topb img {
    width: 100%;
  }
  .txtbox {
    float: left;
    width: 100%;
    padding: 15px 15px 15px 0;
    overflow: hidden;
    dl {
      float: left;
      width: 100%;
      display: flex;
      font-size: 0;
      align-items: center;
      justify-content: space-between;
      dt {
        height: 25px;
        padding-right: 8px;
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          float: left;
        }
      }
      dd {
        color: #dddddd;
        flex-grow: 1;
        position: relative;
      }
    }
    .name {
      font-size: 15px;
      color: @namecolor;
    }
    .tm {
      display: block;
      font-size: 11px;
      color: @assistcolor;
    }
    dd a {
      color: #514da5;
    }
    dd i {
      float: left;
      width: 16%;
      margin: -14px 5px 0 0;
      img {
        width: 100%;
      }
    }
  }
  .list-digest {
    width: 100%;
    line-height: 0.24rem;
    font-size: 0.15rem;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: @maincolor;
    i {
      float: left;
      line-height: 1;
      padding: 1px 5px;
      margin-right: 10px;
      border-radius: 3px;
      font-style: normal;
      color: @reds;
      border: 1px @reds solid;
      font-size: 10px;
    }
    .vip {
      background: @reds;
      color: @whites;
      border-color: @reds;
    }
  }
  .txt {
    font-size: 0.12rem;
    float: left;
    width: 100%;
    padding-top: 15px;
    line-height: 14px;
    i {
      float: left;
      line-height: 1;
      padding: 1px 5px;
      margin-right: 10px;
      border-radius: 3px;
      font-style: normal;
      color: @reds;
      border: 1px @reds solid;
      font-size: 10px;
    }
    .vip {
      background: @reds;
      color: @whites;
      border-color: @reds;
    }
    label {
      color: @oranges;
      font-size: 0.1rem;
      padding-right: 5px;
    }
  }

  .artlist-match {
    float: left;
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: relative;
    color: @blues;
    font-size: 0.13rem;
    span {
      float: left;
      margin: 0 10px 0 0px;
      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }
  .list-Price {
    font-size: 0.1rem;
    color: @reds;
  }
  .goLeaveMsg{
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
  .no_art{
    width: 100%;
    height: 100%;
    position: absolute;
    background: #ffffff;
    .no_main{
      text-align: center;
      color: #666666;
      padding: 100px;
      font-size: 14px;
      img{
        width: 106px;
        height: 78px;
      }
      dd{
        padding-top: 15px;
      }
    }
  }
  
}
</style>
