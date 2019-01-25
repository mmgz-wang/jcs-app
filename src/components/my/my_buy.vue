<template>
  <div id="my_buy">
    <main-header v-if="!inXCX" :headerData="headerData"></main-header>
    <scroll class="buy-list" :data="articleDataList" :class="{inxcx: inXCX}">
      <div class="scroll-wrap">
        <article-list :topMargin="false" 
          @goarticle="goarticle"
          :articleDataList = "articleDataList"></article-list>
        <!-- <div v-for="item in articleDataList">{{item.author_id}}</div> -->

      </div>
      <div class="loading-container" v-show="!articleDataList.length">
        <loading></loading>
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
import Common from 'common/js/common.js'
import lackPage from 'base/lackpage/lackpage'
export default {
	data() {
    return {
      articleDataList: [],
      types: 0,
      headerData: {
        ele: '我的购买',
        name: 'my_buy',
      },
      unArtLength: false,
      lackPageData:{
          src: require('../../common/img/unbuy.png'),
          titles: '暂无购买文章',
          hint: '快去看看老师的最新爆料吧！',
          button: '前往VIP专区',
          goCallback(){
              this.$router.push({name: 'vip'})
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
    if(window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase())){
      this.inXCX = true
      this.userId = this.$router.currentRoute.query.userId
      this.token = this.shareFn.wxGetUserT(this.userId,this.$router.currentRoute.query.token)
      document.getElementsByTagName("title")[0].innerText = '我的购买'
    }
    this.top = 0;
    
  },
  deactivated () {
    
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
    goarticle(item){
      if (this.inXCX) {
        wx.miniProgram.navigateTo({url: '/pages/art/art?id=' + item.id})
      } else {
        this.$router.push({
          path: `/articledetail/?id=${item.id}`,
          props: {id: item.id}
        })
      }
    },
    getData(id,done) {
      var that = this;
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseURI().host + '/article/list/buy?time=' + Math.random(),
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
    }

  }
}

</script>

<style lang="less">
@import "../../common/less/base.less";
#my_buy{
  width:100%;
  position:absolute;
  left:0;
  top:0;
  bottom:0px;
  color:#fff;
  z-index:99999;
  .loading-container,.container{
    width:100%;
    height:100%;
  }
  .buy-list{
    position:absolute;
    left:0;
    top:44px;
    bottom:0;
    right:0;
    overflow:hidden;
    background:@backcolor;
  }
  .inxcx{
    top: 0;
  }
}
</style>
