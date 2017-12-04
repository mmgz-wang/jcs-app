<template>
  <div class="home">
    <header>
        <router-link to="/vip"><span class="hd-vip">文章</span></router-link>
        <h1 class="jcs-title">精彩说</h1>
        <span class="letter" @click="goLetter()">私信</span>
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
          
            <banner :banners = "banners" @bannerClick="bannerClick"></banner>
            <portal @portalClick="portalClick" :portals = "portals"></portal>
            <article-list 
              @goarticle="goarticle"
              :topMargin='true' 
              :articleDataList="articleDataList">
                
            </article-list>
          <p pullup>{{pullUpText}}</p>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import banner from 'base/banner/banner'
import portal from '../home/portal'
import Common from 'common/js/common'
import shareFn from 'common/js/shareFn'
import articleList from 'base/articlelist/articlelist'
export default {
	data() {
    return {
      banners: [],
      portals: [],
      articleDataList: [],
      types: 0,
      lastArticleId: 0,
      needRefresh: true,
      pullDownRefresh: {threshold: 50, stop: 50},
      pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
      pullDownText: '下拉刷新！',
      pullUpText: '上拉加载更多！',
      reloads: false,
      $routerPath: []
    }
  },
	components: {
		banner,portal,articleList,Scroll,loading
	},
  created(){

  },
	mounted: function() {
    this.top = 0;
    this.getData();
    this.$routerPath = this.$router.path
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
      if(this.reloads){
        return ;
      }
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseUrl.host + '/top-header?time=' + Math.random(),
          { 
            params:{
              language: 'M',
              articleId: this.lastArticleId,
              userId: shareFn.getUserId()
            }
          }
        ).then(function(res) {
          console.log(res.data)
          if(res.data.result.data.Banner != undefined){
            this.banners = res.data.result.data.Banner;
          }
          if(res.data.result.data.Portal != undefined){
            this.portals = res.data.result.data.Portal;
          }
          
          if(this.types){
            this.articleDataList = this.articleDataList.concat(res.data.result.artileList.Articles);
            this.pullUpText = '上拉加载更多！';
          }else{
            this.articleDataList = res.data.result.artileList.Articles;
            this.pullDownText = '下拉刷新！';
          }
          this.lastArticleId = this.articleDataList[this.articleDataList.length-1].id;
        })
      })
    },
    portalClick(item){
      if(item.name=="筛价格"){
        this.$router.push({
          path: `/articledetail/?id=${item.id}`,
          props: {id: item.id}
        })
      }else if(item.name=="篮球"){
        this.$router.push({
          path: `/basketball`
        })
      }else if(item.name=="直播"){
        this.$router.push({
          path: `/live_articlelist`,
        })
      }else if(item.name=="聊天室"){
        this.$router.push({
          path: `/roomlist`
        })
      }else if(item.name=="红人榜"){
        this.$router.push({
          path: `/recordlist`
        })
      }
    },
    goarticle(item){
        this.$router.push({
            path: `/articledetail/?id=${item.id}`
        })
    },
    bannerClick(item){
      if(item.target_type == 'article'){
        this.$router.push({
          path: `/articledetail/?id=${item.target_id}`,
          query: {id: item.target_id}
        })
      }else if(item.target_type == 'analyst'){
        this.$router.push({
          path: `/author/?id=${item.target_id}`
        })
      }else if(item.target_type == 'h5'){
        if(h5Url.indexOf('chartroom')){
          this.$router.push({
              path: `/author/?id=${item.target_id}`
          })
        }else{
          
        }
      }
    },
    goLetter(){
      var that = this;
      if(shareFn.isLogin()){
        this.$router.push('letterlist')
      }else{
        layer.open({
          content: '您还没有登录！',
          btn: ['登录','取消'],
          yes:function(index){
            that.$router.push('enter')
            layer.close(index);
          },
          no: function(index){
            layer.close(index);
          }
        })
      }
    }

  },
  watch: {
    $routerPath :{
      handler: function(news,old) {
        console.log(news)
      }
    } 
  }
}

</script>

<style lang="less">
@import "../../common/less/base.less";
.home{
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
  header{
    height:50px;
    line-height:50px;
    background:@reds;
    color:#fff;
    font-size:0.12rem;
    text-align:center;
    a{
      color:@whites;
    }
    .hd-vip{
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
      position:absolute;
      left:50%;
      transform:translateX(-50%);
    }
  }
  .tab{
    width:100%;
    height:44px;
    line-height: 44px;
    background: @whites;
    position:relative;
    .border-top;
    .border-bottom;
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
    top:94px;
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
