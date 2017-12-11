<template>
  <div id="my_present">
    <main-header :headerData="headerData"></main-header>
    <div class="pre-main">
      <section class="pre-list" v-for="item in Omnipotence">
       <div class="left">
          <p class="price"><i>{{item.cardValue}}精彩币</i>以下文章</p>
            <p class="vip">请到vip文章列表解锁查看</p>
       </div>
       <div class="right">{{item.count}}篇</div>
      </section>
    </div>
    <div class="unpresent" v-show="unCardLength">
      <dl>
       <dt><img src="../../common/img/unpresent.png"></dt>
       <dd>
          <p>充值满388元，赠送 <span>3</span> 篇文章</p>
          <p>充值满588元，赠送 <span>5</span> 篇文章</p>
          <p>充值满888元，赠送 <span>8</span> 篇文章</p>
          <p class="hint">充值成功后，请联系您的<span>专属客服MM领取赠品</span><br>
          如果您还没有专属客服，快快添加<span>微信号 18613375688</span><br>
          享受更多平台好礼</p>
          <p class="goenter" @click="goPage()">去充值</p>
       </dd> 
      </dl>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import shareFn from 'common/js/sharefn'
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common.js'

export default {
	data() {
    return {
      headerData:{
        name: 'present',
        ele: '我的赠送'
      },
      Omnipotence: [],
      unCardLength: false
    }   
  },
	components: {
		mainHeader
	},
	mounted: function() {
    this.getData();
	},
  methods: {
    getData(id,done) {
      var that = this;
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseUrl.host + '/User/GetUserInfo',
          { 
            params:{
              language: 'M',
              userId:shareFn.getUserId(),
              token: shareFn.getSecurityCode(),
              articleId: '0',
            }
          }
        ).then(function(res) {
          if(res.data.Omnipotence.length==0){
            this.unCardLength = true;
          }
          this.Omnipotence=res.data.Omnipotence;
        })
      })
    }
  }
}

</script>

<style lang="less">
@import "../../common/less/base.less";
#my_present{
  width:100%;
  position:absolute;
  left:0;
  top:0;
  bottom:0px;
  color:@maincolor;
  z-index:99;
  .pre-main{
    width:100%;
    position:absolute;
    top:44px;
    bottom:0;
    background:@backcolor;
    overflow:scroll;
    padding-bottom:20px;
  }
  .pre-list{
    width:90%;
    margin-left:5%;
    margin-top:20px;
    height:90px;
    background:@whites url('../../common/img/pre.png') no-repeat right center;
    background-size:auto 90px;
    font-size:0.15rem;
    display:flex;
    .price{
      font-size:@titsize;
      margin-top:20px;
      i{
        color:@reds;
      }
    }
    .left{
      flex-grow:6;
      padding-left:30px;
      .vip{
        font-size:@assistsize;
        color:@assistcolor;
      }
    }
    .right{
      flex-grow:4;
      text-align:center;
      line-height:90px;
      color:#fde6e4;
    }
    @media screen and (max-width:320px) and (min-width:300px) {
      .left{
        flex-grow:4;
        padding-left:30px;
        .vip{
          font-size:@assistsize;
          color:@assistcolor;
        }
      }
      .right{
        flex-grow:5;
        text-align:center;
        line-height:90px;
        color:#fde6e4;
      }
    } 
  }
  .unpresent{
    width:100%;
    position:absolute;
    left:0;
    top:50px;
    bottom:0px;
    color:#c6c6c6;
    background:@backcolor;
    font-size:@mainsize;
    dl{
      width:100%;
      text-align:center;
      margin-top:20%;
      dt{
        img{
          width:115px;
        }
      }
      dd{
        h4{
          color:@assistcolor;
        }
        p{
          font-size:@mainsize;
          line-height:25px;
          span{
            color: @reds;
          }
        }
        .hint{
          font-size:@assistsize;
          margin-top: 10px;
        }
        .goenter{
          line-height:25px;
          font-size:0.15rem;
          padding:0 10px;
          color:@whites;
          background: @reds;
          display:inline-block;
          border-radius:3px;
          margin-top:15px;
        }
      }
      

    }
  }
}
</style>
