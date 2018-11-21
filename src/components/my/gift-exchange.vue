<template>
  <div id="gift_exchange" v-if="giftData != null">
    <main-header :headerData="headerData"></main-header>
    <div class="gift_top">
        <dl>
            <dt class="giftleft_inner">
                <img :src="giftList.ext"/>
                <img :src="giftData.PicPath" class="gifttou_img"/>
            </dt>
            <dd>
                <p>{{giftList.subName}}</p>
                <span id="gift_top_jifen">{{giftList.value}}积分</span>
            </dd>
        </dl>
    </div>
    <div class="gift_middle">
        <p id="readme"><span>说明</span>在任意聊天室当中您的头像均带有皇冠标识</p>
        <p><span>时间</span>距截止售卖还有<i id="time_hour">{{hours}}</i> 时<i id="time_min">{{min}}</i> 分<i id="time_sec">{{sec}}</i> 秒</p>
        <p><span>账户共</span><i yellow>{{giftData.integral}}</i><span> 积分</span></p>
    </div>
    <div class="gift_bottom">
        总计<span id="needIntegral">{{giftList.value}}积分</span>
        <button @click="buyGift()">确认兑换</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import mainHeader from "base/header/mainheader"
import Common from "common/js/common.js";
export default {
  data() {
    return {
        headerData: {
            ele: "积分兑换",
            name: "exchange"
        },
        id: this.$route.query.id,
        giftData: null,
        giftList: null,
        hours: 0,
        min: 0,
        sec: 0
    };
  },
  components: {
    mainHeader
  },
  mounted: function() {
    this.getGiftData();
  },
  methods: {
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
          res.data.data.forEach(function(v,i){
              if(v.id == that.id){
                  that.giftList = v
              }
          })
          that.getTimeInerval()
        })
      })
    },
    getTimeInerval () {
        var e_time = this.giftList.enddate.split("+")[0].replace(/-/g,"/");
        var date2 = new Date(e_time);
        var date1 = new Date();
        var date3;
        date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数
        if(date3<=0){
           
        }else{
            var t_hours = date3/(1000*60*60);
            this.hours = Math.floor(t_hours);
            var t_min = (t_hours-this.hours)*60;
            this.min = Math.floor(t_min);
            this.sec = parseInt((t_min-this.min)*60);
        }
    },
    buyGift () {
        let that = this;
        this.$http.jsonp(
          Common.baseURI().host + '/assets/change',
            {
                params:{
                    userId:this.shareFn.getUserId(),
                    token:this.shareFn.getSecurityCode(),
                    language: 'M',
                    assetsId: that.id
                }
            }
        ).then(function(res) {
            if(res.data.code == '0000'){
                layer.open({
                    content: '恭喜您兑换成功，您将在聊天室页面看到您的专属头像！',
                    btn: ['确定'], 
                    yes: function(index){
                        layer.close(index);
                    }
                });
            }else{
                layer.open({
                    content: res.data.msg,
                    time: 2,
                    skin: 'msg'
                });
            }
            
        })
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/base.less";
#gift_exchange {
  width: 100%;position: absolute;left: 0;top: 0;font-size: 15px;
  bottom: 0px;color: #333333;z-index: 99;background: #f4f4f4;
  .gift_top{
        padding-top: 40px;
        text-align: center;
        background-color: #FFFFFF;
    }
    .giftleft_inner{
        width: 49px;
        height: 49px;
        position: relative;
        margin:0 auto;
    }

    .giftleft_inner img:nth-child(1){
        width: 24px;
        height: auto;
        position:absolute;
        top: -15px;
        left: 50%;
        transform:translateX(-50%);
        -webkit-transform:translateX(-50%);
    }

    .gifttou_img{
        width: 49px;
        height: 49px;
        padding:1px;
        border: 3px solid #eab73a;
        border-radius: 50%;
        float: left;
    }

    .gift_top dd{
        padding-top: 16px;
        color: white;
        font-size: 16px;
        padding-bottom: 25px;
    }

    .gift_top dd span{
        padding-top: 9px;
        color: #e9311d;
        font-size: 16px;
    }

    .gift_middle{
        background-color: #ffffff;
        margin-top: 10px;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
    }

    .gift_middle p{
        line-height: 49px;
        border-bottom: 1px solid #e0e0e0;
        font-size: 12px;
        color: #333333;
    }

    .gift_middle p:last-child{
        border: none;
    }

    .gift_middle p span{
        color: #999999;
        padding-right: 11px;
    }

    .gift_middle p i{
        color: #4da17c;
        font-style: normal;
    }

    .gift_middle p i[yellow]{
        color: #e9311d;
    }

    .gift_bottom{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 55px;
        font-size: 16px;
        background-color: #ffffff;
        color: #333333;
        line-height: 55px;
        padding-left: 15px;
    }

    .gift_bottom span{
        color: #e9311d;
        font-size: 16px;
    }

    .gift_bottom button{
        float: right;
        height: 100%;
        padding: 0 20px;
        background-color: #e9311d;
        color: #ffffff;
        outline: none;
        border: none;
        font-size: 16px;
    }

    #time_hour, #time_min, #time_sec{
        padding: 0 3px;
    }

    .contains{
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background: #ffffff;
        display: none;
    }
      
}
</style>
