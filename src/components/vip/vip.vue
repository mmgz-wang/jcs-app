<template>
  <div id="vip">
    <main-header :headerData="headerData"></main-header>
    <scroll class="container"

    :needRefresh="needRefresh"
    :pullDownRefresh="pullDownRefresh"
    :pullUpLoad="pullUpLoad"
    :pullingDownFn="pullingDownFn"
    :pullingUpFn="pullingUpFn"
    ref="Scroll"
    :data="articleDataList">
      <div class="scroll-wrap">
        <p pulldown>{{pullDownText}}</p>
        <template v-for="item in articleDataList">
          <article-list 
            @goarticle="goarticle" 
            :topMargin="false" 
            :item = "item">
          </article-list>
        </template>
        <p pullup>{{pullUpText}}</p>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import mainHeader from 'base/header/mainheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import Common from 'common/js/common.js'
import articleList from 'base/articlelist/articlelist'
export default {
	data() {
    return {
      articleDataList: [],
      types: 0,
      headerData: {
          ele: 'VIP文章',
          name: 'vip'
      },
      needRefresh: true,
      pullDownRefresh: {threshold: 50, stop: 50},
      pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
      pullDownText: '下拉刷新！',
      pullUpText: '上拉加载更多！',
      lastArticleId: 0
    }
  },
	components: {
		articleList,Scroll,loading,mainHeader
	},
	mounted: function() {
    this.top = 0;
    this.getData();
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
    getData(id,done) {
      var that = this;
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseURI().host + '/article/list/vip?time=' + Math.random(),
          { params:{language: 'M',articleId: this.lastArticleId}}
        ).then(function(res) {
          /*console.log(res);
            that.articleDataList = res.data.Articles;*/
          if(this.types){
            this.articleDataList = this.articleDataList.concat(res.data.Articles);
            this.pullUpText = '上拉加载更多！';
          }else{
            this.articleDataList = res.data.Articles;
            this.pullDownText = '下拉刷新！';
          }
          this.lastArticleId = this.articleDataList[this.articleDataList.length-1].id;
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
#vip{
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
