<template>
  <div id="vip">
    <publick-header :headerData="headerData"></publick-header>
    <scroll class="container" :data="articleDataList">
      <div class="scroll-wrap">
        <article-list :topMargin="true" :articleDataList = "articleDataList"></article-list>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
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
      types: 0,
      headerData: {
          ele: '<h1>VIP文章</h1>',
          name: 'vip',
          isShow: false
      },
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
    refresh (done) {
      this.getData(this.top,done);
      this.types = 0;
    },
    infinite (done) {
      this.getData(this.bottom,done);
      this.types = 1;
    },
    getData(id,done) {
      var that = this;
      this.$nextTick(function () {
        this.$http.jsonp(
          'http://www.jingcaishuo.com/article/list/vip?time=' + Math.random(),
          { params:{language: 'M',articleId: id}}
        ).then(function(res) {
          console.log(res);
            that.articleDataList = res.data.Articles;
        })
      })
    }

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

  header{
    height:50px;
    line-height:50px;
    background:@reds;
    color:#fff;
    font-size:0.12rem;
    text-align:center;
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
