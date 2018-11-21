<template>
  <div id="my_wallet" v-if="userInfor != null">
    <div class="w_hd">
      <div name="my_wallet" class="main-header wallet-hd">
        <span class="back" @click="$router.back();"></span> 
        <p>我的钱包</p> 
        <span class="r_ele" @click="consumeList">流水</span>
      </div>
      <p class="jcb-tit">
        精彩币
      </p>
      <p class="balance">
        {{userInfor.Money}}
      </p>
      <div class="go_recharge">
        <button @click="goaRecharge()">去充值</button>
      </div>
    </div>
    <div class="integral">
      <div>我的积分<span>{{userInfor.integral}}</span></div>
      <span class="get-way">如何获取积分</span>
    </div>
    <div class="wallet-tab">
      <span :class="{on: isLeft}" @click="tabClick">兑换解锁劵</span>
      <span :class="{on: !isLeft}" @click="tabClick">兑换权益</span>
    </div>
    <div class="list-wrap" :class="{wrapleft:isLeft,wrapright:!isLeft}">
      <div class="list-wrapa">
        <div class="contnelList" @click="goChange(item.rulesId,item.needIntegral,item.card_value)" v-for="item in couponsList">
          <div class="leftView">
            <span>{{item.card_value}}元文章解锁劵</span><span>{{item.needIntegral}}积分</span>
          </div>
          <div class="rightView" v-if="userInfor.integral>=item.needIntegral">
              <img src="../../common/img/jf.png"><span>去兑换</span>
          </div>
          <div class="rightView gary" v-else>
              <img src="../../common/img/jfb.png"><span>积分不足</span>
          </div>
        </div>
      </div>
      <div class="list-wrapb">
        <div class="detailContent" v-if="giftData != null">
          <div class="giftcontnelList" v-for="item in giftData.data" @click="goGift(item.id,item.purchasedNums)">
            <div class="giftleftView">
              <div class="giftleft_inner">
                <img :src="item.ext">
                <img :src="giftData.PicPath" class="gifttou_img">
              </div>
            </div>
            <div class="giftmiddleView">
              <p class="giftspan_1">{{item.subName}}</p>
              <p class="giftspan_2">截止 {{item.enddate.substr(2, 8)}} 可购买</p>
              <p class="giftspan_3">{{item.value}}积分</p>
            </div>
            <div class="giftrightView gary nochange" v-if="item.purchasedNums>=1">
              <span>已拥有</span>
            </div>
            <div class="giftrightView" v-else>
              <span>去兑换</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view @nickBack="nickBack()"></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
import mainHeader from 'base/header/mainheader'
import loading from 'base/loading/loading'
import Common from 'common/js/common.js'
export default {
	data() {
    return {
      types: 0,
      headerData: {
        ele: '我的钱包',
        name: 'my_wallet',
      },
      giftData: null,
      couponsList: [],
      userInfor: null,
      isLeft: true
    }
  },
	components: {
		loading,mainHeader
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
              userId:this.shareFn.getUserId(),
              token:this.shareFn.getSecurityCode()
            }
          }
        ).then(function(res) {
          that.couponsList = JSON.parse(res.data.OmnipotenceRulesIntegral)
          that.userInfor = res.data
        })
      })
    },
    tabClick () {
      if(this.isLeft){
        this.isLeft = false;
        this.getGiftData();
      }else{
        this.isLeft = true;
      }
    },
    getGiftData () {
      var that = this;
      this.$nextTick(function () {
        this.$http.jsonp(
          Common.baseURI().host + '/assets/list',
          {
            params:{
              userId:this.shareFn.getUserId(),
              token:this.shareFn.getSecurityCode(),
              language: 'M'
            }
          }
        ).then(function(res) {
          that.giftData = res.data
        })
      })
    },
    goChange () {
      if(this.userInfor.integral<arguments[1]){
        layer.open({
          content: '积分余额不足！',
          time: 2,
          skin: 'msg'
        });
        return false;
      }
      this.$router.push({path: `myWallet/exchange?id=${arguments[0]}&integral=${arguments[1]}&money=${arguments[2]}`})
    },
    goGift (id,a) {
      if(a>=1){
        layer.open({
          content: '您已拥有该头像挂件！',
          time: 2,
          skin: 'msg'
        });
        return false;
      }
      this.$router.push({path: `myWallet/giftExchange?id=${arguments[0]}`})
    },
    consumeList () {
      this.$router.push({path: `/ConsumeList`})
    },
    goaRecharge() {
      this.$router.push('../recharge')
    },
  }
}

</script>

<style lang="less">
@import "../../common/less/base.less";
#my_wallet{
  width:100%;position:absolute;left:0;top:0;bottom:0px;color:#fff;z-index:9999;
  background: #f4f4f4;
  .wallet-hd{
    background: #f56859;width:100%;height:44px;text-align:center;position:relative;
    line-height:44px;padding:0 15px;
    p{
      color: #ffffff !important;
    }
    .back{
        width:50px;height:100%;float:left;position:absolute;left:15px;
        background:url('../../common/img/back.png') no-repeat left center;
        color:transparent;background-size:8px 17px;
    }
    .r_ele{
        position:absolute;right:0;top:0;height:100%;padding-right:15px;
        font-size: 12px;position:absolute;right:0;top:0;
    }
  }
  .w_hd{
    font-size: 15px;line-height: 1;text-align: center;
    background: #f56859 url(../../common/img/w_b.png) no-repeat left bottom;
    background-size: 100% auto;
    .jcb-tit{
      padding: 20px 0 14px 0;font-size: 12px;opacity: 0.6;
    }
    .balance{
      font-size: 20px;
    }
    .go_recharge{
      button{
        width: 75px;height: 24px;font-size: 12px;line-height: 24px;text-align: center;
        color: #ffffff;margin: 15px 0 25px 0;border: 1px solid #ffffff;opacity: 0.6;
        background: transparent;outline: none;border-radius: 12px;
      }
    }
  }
  .integral{
    display: flex;display: -webkit-flex;justify-content: space-between;
    height: 75px;font-size: 12px;color: #333333;line-height: 75px;padding: 0 15px;
    background: #ffffff;
    div{
      display: flex;align-items: center;
      span{
        color: #e9311d;font-size: 25px;padding-left: 10px;
      }
    } 
  }
  .get-way{
    background: url(../../common/img/jf_way.png) no-repeat right center;
    padding-right: 22px;background-size: 18px;background-position: right 28px;
  }
  .gary span{
    color: #b1b1b1 !important;
  }
  .wallet-tab{
    display: flex;display: -webkit-flex;height: 40px;line-height: 40px;color: #333333;
    margin-top: 10px;font-size: 12px;background: #ffffff;justify-content: space-around;
    span{
      width: 40%;text-align: center;
    }
    .on{
      border-bottom: 2px solid #e9311d;color: #e9311d;
    }
  }
  .list-wrap{
    width: 200%;background: #ffffff;display: flex;display: -webkit-flex;height:auto;
    position: absolute;top: 299px;bottom: 0;
    .list-wrapa,.list-wrapb{
      width:50%;height:100%;overflow-y: scroll;
    }
    .list-wrapb{
      width:50%;height:auto;position:absolute;left:50%;top:0;
    }
    .contnelList{
      height: 75px;
      border-bottom: 1px solid #e0e0e0;
      margin-left: 15px;
    }
    .contnelList span{
      display: block;
    }

    .leftView{
      
      float: left;
      height: 75px;
      padding-top: 20px;
    }

    .leftView span:nth-child(1){
      
      color: #333333;
      font-size: 15px;
    }

    .leftView span:nth-child(2){
      
      color: #ff8209;
      font-size: 12px;
    }

    .rightView{
      
      float: right;
      height: 75px;
      padding-top: 25px;
    }

    .rightView span{
      
      font-size: 12px;
      color: #e9311d;
      float: right;
      margin-right: 8px;
    }

    .rightView img{
      
      width: 6px;
      height: 12px;
      display: block;
      float: right;
      margin-right: 15px;
      margin-top: 3px;
    }
  }
  .wrapleft{
		transform:translateX(0);
    transition: all 0.6s ease;
	}
	.wrapright{
    transform:translateX(-50%);
		transition: all 0.6s ease;
  }
  .giftcontnelList{
    width:100%;
    border-bottom: 1px solid #e0e0e0;
    padding-left: 15px;
    display: flex;
    display: -webkit-flex;
    position: relative;
  }

  .giftleftView{
    padding: 25px 0;
  }

  .gifttou_img{
    width: 49px;
    height: 49px;
    padding:1px;
    border: 3px solid #eab73a;
    border-radius: 50%;
    float: left;
  }

  .giftleft_inner{
    width: 49px;
    height: 49px;
    position: relative;
  }
  .giftleftView img:nth-child(1){
    width: 24px;
    height: auto;
    position:absolute;
    top: -15px;
    left: 50%;
    transform:translateX(-50%);
    -webkit-transform:translateX(-50%);
  }
  .giftmiddleView{
    display: flex;
    align-items: left;
    flex-direction: column;
    justify-content: center;
    padding:20px 0 20px 15px;
  }

  .giftspan_1{
    color: #333333;
    font-size: 15px;
  }

  .giftspan_2{
    color: #999999;
    font-size: 10px;
  }

  .giftspan_3{
    color: #ff8209;
    font-size: 12px;
  }

  .giftrightView span{
    background: url('../../common/img/jf.png') no-repeat right center;
    background-size:6px auto;
    padding:15px;
    font-size: 12px;
    color: #e9311d;
    float: right;
    margin-right: 8px;
    position:absolute;
    top:50%;
    right:15px;
    transform:translateY(-50%);
    -webkit-transform:translateY(-50%);
  }

  .nochange span{
    background: url('../../common/img/jfb.png') no-repeat right center;
    background-size:6px auto;
    padding:15px;
    font-size: 12px;
    color: #e9311d;
    float: right;
    margin-right: 8px;
    position:absolute;
    top:50%;
    right:15px;
    transform:translateY(-50%);
    -webkit-transform:translateY(-50%);
  }

}
</style>
