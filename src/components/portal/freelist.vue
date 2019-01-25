<template>
  <div id="freelist">
    <publick-header v-if="!inXCX" :headerData="headerData"></publick-header>
    <scroll class="basketball-list-wrap" :class="{inxcx: inXCX}"
            :needRefresh="needRefresh"
            :pullDownRefresh="pullDownRefresh"
            :pullUpLoad="pullUpLoad"
            :pullingDownFn="pullingDownFn"
            :pullingUpFn="pullingUpFn"
            ref="scroll"
            :data="articleDataList">
      <div class="scroll-wrap">
        <p pulldown>{{pullDownText}}</p>
        <article-list @goarticle="goarticle" :topMargin="false" :articleDataList = "articleDataList"></article-list>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
        <p pullup>{{pullUpText}}</p>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import publickHeader from 'base/header/publickheader'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import articleList from 'base/articlelist/articlelist'

  export default {
    data() {
      return {
        articleDataList: [],
        headerData: {
          ele: '<h1>免费</h1>',
          name: 'freeList',
          isShow: false
        },
        types: 0,
        sportType: 0,
        needRefresh: true,
        pullDownRefresh: {threshold: 50, stop: 50},
        pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
        pullDownText: '下拉刷新！',
        pullUpText: '上拉加载更多！',
        lastArticleId: 0,
        inXCX: false
      }
    },
    components: {
      articleList,Scroll,loading,publickHeader
    },
    mounted: function() {
      this.top = 0;
      //this.getData();
    },
    beforeRouteEnter(to, from, next) {
      if(from.name=='articledetail'){
        to.meta.iskeep=true;
      }
      next();
    },
    activated() {
      if(window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase())){
        this.inXCX = true
      }
      if(!this.$route.meta.iskeep || this.isFirstEnter){
        this.articleDataList = [];// 把数据清空，可以稍微避免让用户看到之前缓存的数据
        this.lastArticleId = 0;
        if(this.$router.currentRoute.query.sportType == '足球'){
          this.sportType = 0
          this.headerData.ele = '<h1>足球</h1>'
          document.getElementsByTagName("title")[0].innerText = '足球'
        }else if(this.$router.currentRoute.query.sportType == '篮球'){
          this.sportType=1
          this.headerData.ele = '<h1>篮球</h1>'
          document.getElementsByTagName("title")[0].innerText = '篮球'
        }else{
          this.sportType=2;
          document.getElementsByTagName("title")[0].innerText = '免费'
        }
        this.getData();
      }
      this.isFirstEnter = false;
      this.$route.meta.iskeep=false;
    },
    deactivated() {
      if(this.$route.name == 'home'){
        this.$refs.scroll.scrollTo(0,0,0);
      }
      document.getElementsByTagName("title")[0].innerText = '精彩说'
    },
    methods: {
      pullingDownFn(scroll){
        this.types = 0;
        this.lastArticleId = 0;
        this.pullDownText = '努力加载中 ...';
        this.getData();

      },
      pullingUpFn(scroll){
        this.types = 1;
        this.pullUpText = '努力加载中 ...';
        this.getData();
      },
      getData() {
        this.$nextTick(function () {
          this.$http.jsonp(
            'http://www.jingcaishuo.com/article/list/freeArticles/?time=' + Math.random(),
            {
              params:{
                language: 'M',
                articleId: this.lastArticleId,
                type:2
              }
            }
          ).then(function(res) {
            if(res.data.code == '0000'){
              if(this.types){
                this.articleDataList = this.articleDataList.concat(res.data.articleList);
                this.pullUpText = '上拉加载更多！';
              }else{
                this.articleDataList = res.data.articleList;
                this.pullDownText = '下拉刷新！';
              }
              this.lastArticleId = this.articleDataList[this.articleDataList.length-1].id;
            }else{
              layer.open({
                content: `网络出错，请稍后再试${res.data.Code}`,
                skin: 'msg',
                time: 2

              })
            }
          })
        })
      },
      goarticle(item){
        this.$router.push({
          path: `/articledetail/?id=${item.id}`,
          props: {id: item.id}
        })
      },

    }
  }
</script>

<style lang="less">
  @import "../../common/less/base.less";
  #freelist{
    width:100%;
    position:absolute;
    left:0;
    top:0;
    bottom:0px;
    color:#fff;
    p[pulldown]{
      width:100%;
      height:50px;
      line-height:50px;
      text-align:center;
      color:@assistcolor;
      font-size:0.12rem;
      position:absolute;
      top:-50px;
      left:0;
    }
    p[pullup]{
      width:100%;
      height:40px;
      line-height:40px;
      text-align:center;
      color:@assistcolor;
      font-size:0.12rem;
    }
    .basketball-list-wrap{
      width:100%;
      position:absolute;
      top:44px;
      bottom:0;
      overflow:hidden;
    }
    .inxcx{
      top: 0;
    }
    header{
      height:50px;
      line-height:50px;
      background:@reds;
      color:#fff;
      font-size:0.12rem;
      text-align:center;
    }
    .basketball{
      float: left;
      padding:0 10px 0 0.25rem;
      margin-left:10px;
      background: url('../../common/img/vip.png') no-repeat left center;
      background-size:0.20rem auto;
    }
    .letter{
      color:transparent;
      float:right;
      padding:0 10px;
      background: url('../../common/img/letter.png') no-repeat center;
      background-size: 0.20rem auto;
    }
    h1{
      display:inline-block;
      font-size:0.18rem;
      font-weight:400;
    }

    .tab{
      width:100%;
      height:44px;
      line-height: 44px;
      background: @whites;
      border-top:1px solid @bordercolor;
      border-bottom:1px solid @bordercolor;
    }
    .tab a{
      display:inline-block;
      width:25%;
      height:100%;
      text-align:center;
      float:left;
      color: @blacks;
      text-decoration:none;
      font-size: 0.15rem;
    }

    .container{
      width:100%;
      position:absolute;
      top:50px;
      bottom:0;
      overflow-y:hidden;
    }
    .scroll-wrap{
      min-height:100%;
      width:100%;
    }
    .loading-container{
      position:absolute;
      width:100%;
      height:100%;
      top:50%;
      transform: translateY(-50%);
    }
  }
</style>
