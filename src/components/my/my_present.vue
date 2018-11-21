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
    <div class="unpresent" v-show="Omnipotence.length==0">
      <dl>
       <dt><img src="../../common/img/unpresent.png"></dt>
       <dd>
         <p>特定积分充值有积分相赠</p>
         <p>快去联系<span>专属客服MM领取吧</span></p>
         <p>没有客服的小伙伴还请联系微信号<span> JCSxiaoyang</span></p>
          <p class="goenter" @click="goPage()">去充值</p>
       </dd>
      </dl>
      <div class="msg_ios">
        <p>&nbsp;充值成功后，请联系您的<i>专属客服MM增加积分。</i></p >
        <p><i>积分可以兑换文章解锁券。</i></p>
        <p>如果您还没有专属客服，<i>快快添加微信号 JCSxiaoyang </i>后期积分可兑换更多神秘大礼，敬请期待~</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
          Common.baseURI().host + '/User/GetUserInfo',
          {
            params:{
              language: 'M',
              userId:this.shareFn.getUserId(),
              token: this.shareFn.getSecurityCode(),
              articleId: '0',
            }
          }
        ).then(function(res) {
          this.Omnipotence=res.data.Omnipotence;//res.data.Omnipotence;
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
  z-index:9999;
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
  .msg_ios{
    font-size: 0.12rem;
    position: absolute;
    bottom: 30px;
    padding: 0 10px;
    text-align: center;
  }
}
</style>
