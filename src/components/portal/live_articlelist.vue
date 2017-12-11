<template>
  <div id="live_articlelist">
    <publick-header :headerData="headerData"></publick-header>
    <scroll class="container" 
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
          ele: '<h1>直播</h1>',
          name: 'live_articlelist',
          isShow: false
      },
      types: 0,
      needRefresh: true,
      pullDownRefresh: {threshold: 50, stop: 50},
      pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
      pullDownText: '下拉刷新！',
      pullUpText: '上拉加载更多！',
      lastArticleId: 0
    }   
  },
	components: {
		articleList,Scroll,loading,publickHeader
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
          'http://www.jingcaishuo.com/portal/article/list?time=' + Math.random(),
          { 
            params:{
              language: 'M',
              articleId: this.lastArticleId,
              portalIds:'8'
            }
          }
        ).then(function(res) {
          console.log(res.data);
          if(res.data.code == '0000'){
            if(this.types){
              this.articleDataList = this.articleDataList.concat(res.data.data);
              this.pullUpText = '上拉加载更多！';
            }else{
              this.articleDataList = res.data.data;
              this.pullDownText = '下拉刷新！';
            }
            this.lastArticleId = this.articleDataList[this.articleDataList.length-1].id;
            console.log(this.lastArticleId)
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
#live_articlelist{
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
  .live_articlelist{
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
    top:44px;
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
