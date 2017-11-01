<template>
  <div class="home">
    <header>
        <router-link to="/vip"><span class="vip">文章</span></router-link>
        <h1 class="jcs-title">精彩说</h1>
        <span class="letter">私信</span>
    </header>  
    <nav class="tab">
      <router-link to="/roomlist">聊天室</router-link>
      <router-link to="/competition">赛事</router-link>
      <router-link to="/attention">关注</router-link>
      <router-link to="/my">我的</router-link>
    </nav>  
    <scroll class="container" :data="articleDataList">
      <div class="scroll-wrap">
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
        <banner :banners = "banners"></banner>
        <portal :portals = "portals"></portal>
        <article-list @goarticle="goarticle" :articleDataList = "articleDataList"></article-list>
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
import articleList from 'base/articlelist/articlelist'

export default {
	data() {
    return {
      banners: [],
      portals: [],
      articleDataList: [],
      types: 0
    }
  },
	components: {
		banner,portal,articleList,Scroll,loading
	},
	mounted: function() {
    this.top = 0;
    var that = this;
    that.$nextTick(function () {
      this.$http.jsonp(
        'http://www.jingcaishuo.com/top-header?time=' + Math.random(),
        { params:{language: 'M',articleId: "0"}}
      ).then(function(res) {
        this.banners = res.data.result.data.Banner;
        this.portals = res.data.result.data.Portal;
        this.articleDataList = res.data.result.artileList.Articles;
        this.bottom = this.articleDataList[this.articleDataList.length-1].id;
      })
    })
	},
  methods: {
    refresh (done) {
      this.getData(this.top,done);
      this.types = 0;
    },
    infinite (done) {
      this.getData(this.bottom,done);
      this.types = 1;
    },
    getData(id,done) {
      this.$nextTick(function () {
        this.$http.jsonp(
          'http://www.jingcaishuo.com/top-header?time=' + Math.random(),
          { params:{language: 'M',articleId: id}}
        ).then(function(res) {
          this.banners = res.data.result.data.Banner;
          this.portals = res.data.result.data.Portal;

          if(this.types){
            this.articleDataList = this.articleDataList.concat(res.data.result.artileList.Articles);
          }else{
            this.articleDataList = res.data.result.artileList.Articles;
          }
          this.bottom = this.articleDataList[this.articleDataList.length-1].id;
          done()
        })
      })
    },
    goarticle(item){
      this.$router.push({
        path: `/home/${item.id}?id=${item.id}`,
        props: {id: item.id}
      })
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
}
header{
  height:50px;
  line-height:50px;
  background:@reds;
  color:#fff;
  font-size:0.12rem;
  text-align:center;
}
header a{
  color:@whites;
}
.vip{
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

</style>
