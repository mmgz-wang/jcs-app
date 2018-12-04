<template>
  <div id="my_collect">
    <main-header v-if="!inXCX" :headerData="headerData"></main-header>
    <scroll class="container" :data="articleDataList" :class="{inxcx: inXCX}">
      <div class="scroll-wrap">
        <article-list :topMargin="false" @goarticle="goarticle" :articleDataList = "articleDataList"></article-list>
        <div class="loading-container" v-show="!articleDataList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <lack-page
      :src="lackPageData.src"
      :titles="lackPageData.titles"
      :hint="lackPageData.hint"
      :button="lackPageData.button"
      :goCallback="lackPageData.goCallback"
      v-show="unArtLength"></lack-page>
  </div>
</template>

<script type="text/ecmascript-6">
import mainHeader from 'base/header/mainheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import articleList from 'base/articlelist/articlelist'
import lackPage from 'base/lackpage/lackpage'
import Common from 'common/js/common.js'

export default {
	data() {
    return {
      articleDataList: [],
      types: 0,
      headerData: {
          ele: '我的收藏',
          name: 'my_collect'
      },
      unArtLength: false,
      lackPageData:{
          src: require('../../common/img/uncollect.png'),
          titles: '暂无收藏文章',
          hint: '优秀的文章值得收藏起来反复研究',
          button: '去首页看看',
          goCallback(){
              this.$router.push({name: 'home'})
          }
      },
      inXCX: false,
      userId: this.shareFn.getUserId(),
      token: this.shareFn.getSecurityCode()
    }
  },
	components: {
		articleList,Scroll,loading,mainHeader,lackPage
  },
  activated () {
    if(window.__wxjs_environment === 'miniprogram'){
      this.inXCX = true
      this.userId = this.$router.currentRoute.query.userId
      this.token = this.shareFn.wxGetUserT(this.userId,this.$router.currentRoute.query.token)
      document.getElementsByTagName("title")[0].innerText = '我的购买'
    }
    this.top = 0;
  },
	mounted: function() {
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
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseURI().host + '/article/list/collect?time=' + Math.random(),
          {
            params:{
              language: 'M',
              userId:this.userId,
              securityCode:this.token,
              articleId: '0'
            }
          }
        ).then(function(res) {
          if(res.data.Articles.length == 0){
            this.unArtLength = true;
          }
          this.articleDataList = res.data.Articles;
        })
      })
    },
    goarticle(item){
      if (this.inXCX) {
        wx.miniProgram.navigateTo({url: '/pages/art/art?id=' + item.id})
      } else {
        this.$router.push({
          path: `/articledetail/?id=${item.id}`,
          props: {id: item.id}
        })
      }
    }

  }
}

</script>

<style lang="less">
@import "../../common/less/base.less";
#my_collect{
  width:100%;
  position:absolute;
  left:0;
  top:0;
  bottom:0px;
  color:@maincolor;
  background:@backcolor;
  z-index:99;
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
  .inxcx{
    top: 0;
  }
}
</style>
