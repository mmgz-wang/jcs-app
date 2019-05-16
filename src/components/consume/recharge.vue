<template>
    <transition name="slide">
        <div class="recharge">
            <main-header @setMsg="setMsg()" :headerData="headerData"></main-header>
            <div class="rechargelist">
                <div class="recharge-item">
                    <div :id="'item'+item.id" class="itemdiv" v-for="item in rechargeItemData" @click="choseItem(item)" :class="{div:item.id == 1}">
                        <img v-if="item.cost>168" src="../../common/img/hui.png" alt="">
                        <p>￥{{item.cost}}</p>
                        <span>{{item.cost}}精彩币</span>
                        <!--<span class="present"  v-if="item.cost>168">赠送{{setART(item.cost)}}篇文章</span>-->
                    </div>
                </div>
                <div class="state">
                  <p>特定积分充值有积分相赠，快去联系<span>专属客服MM领取吧~</span></p>
                  <p>没有客服的小伙伴还请联系微信号<span>JCSxiaoyang</span></p>
                </div>
            </div>
           <p class="p">充值方式</p>
           <div class="menulist">
            <div class="menu">
                <ul>
                    <!-- <li id="weixinpay" v-if="new Date().getHours() > 9 && new Date().getHours() <21">
                        <img src="../../common/bgs-09c.png" alt="" class="img" />
                        <span class="txt">哆啦宝支付</span>
                        <span class="rico rico-on"></span>
                    </li> -->
                    <!-- <li v-if="new Date().getHours() < 9 || new Date().getHours() >21">哆啦宝充值时间为（09:00~21:00）</li> -->
                    <li id="aliplay" style="display:none;">
                        <img src="../../common/img/zhi.png" alt="" class="img" />
                        <span class="txt">支付宝支付</span>
                        <span class="rico"></span>
                    </li>
                    <li id="card">
                        <img src="../../common/img/card.png" alt="" class="img">
                        <span class="txt">银行转账</span>
                        <p class="payCard">账户名称：北京信盈世纪科技有限责任公司<br>
                            开户行：<span>平安银行北京丰盛支行</span><br>
                            银行帐户：<span>11014837407009</span></p>
                    </li>
                </ul>
            </div>
           </div>

           <!-- <p class="subbtn" @click="TrueClick()">确认支付<span class="affirm">￥{{price}}</span></p> -->

            <p class="sm" style="">精彩币主要用于购买比赛分析文章，精彩币购买后不可提现，不可退款。如有问题请咨询<span class="online" id="onlineservice1">在线客服</span>或拨打<span class="tel" id="telphone">客服电话</span></p>
            <div class="mask-wx" @click.stop="setWx" v-show="wxShow">
                <div class="dialog-wx">
                    <div class="titles">
                        <p>哆啦宝支付</p>
                    </div>
                    <div class="main">
                        <p class="name">充值金额</p>
                        <p class="pay_price">￥{{price}}.00</p>
                    </div>
                    <vue-q-art v-if="config!=null" :config="config"></vue-q-art>
                    <!-- <a class="wxGo" :href="wxUrl">立即支付</a> -->
                    <p>微信或支付宝扫码支付</p>
                    <a class="cancle_pay" href="javascript:;">取消</a>
                </div>
            </div>
            <router-view></router-view>
        </div>

    </transition>
</template>

<script type="text/javascript">
import Common from 'common/js/common'
import mainHeader from 'base/header/mainheader'
import 'common/js/layer'
import 'common/less/layer.css'
import VueQArt from 'vue-qart'
export default {
	name: 'recharge',
    data(){
        return {
            headerData:{
                name: 'recharge',
                ele: '充值',
                r_ele: '账户明细'
            },
            rechargeItemData: [],
            wxShow: false,
            wxUrl: '',
            price: 0,
            id: 0,
            config: null
        }
    },
    created(){
        this.getData();
        //console.log(this.$route.params)
    },
    mounted(){

    },
    methods: {
        getData(){
            this.$nextTick(function(){
                this.$http.jsonp(
                    Common.baseURI().host + "/purchase/recharge",
                    {
                        params: {
                            userId: this.shareFn.getUserId(),
                            securityCode: this.shareFn.getSecurityCode(),
                            language: 'M'
                        }
                    }
                ).then(function(res){
                    this.rechargeItemData = res.data.PriceType;
                    this.price = this.rechargeItemData[0].cost;
                    this.id = this.rechargeItemData[0].id;
                    console.log(this.rechargeItemData)
                },function(){
                    console.log('网络出错，请重试')
                })
            })
        },
        choseItem(item){
            var itemDom = document.querySelector('#item'+item.id);
            var allItem = document.querySelectorAll('.itemdiv');
            for(var i=0;i<allItem.length;i++){
                allItem[i].className='itemdiv'
            }
            itemDom.className = 'itemdiv div';
            this.price = item.cost;
            this.id = item.id;
        },
        setART(S){
            if(S==388){
                return 3;
            }else if(S==588){
                return 5;
            }else if(S==888){
                return 8;
            }
        },
        TrueClick(s){
            console.log(s)
            var that = this;
            const PAY_TYPE_WX = 1;
            const PAY_TYPE_ALIPAY = 2;
            const PAY_TYPE_GOLD = 3;
            const PAY_TYPE_CARD = 6;
            const PAY_TYPE_SIX=7;
            var payType = 9;
            if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
              //payType = 12;
            }
            var godata = {
                    "language": "M",
                    "chargeType": payType,
                    "money": this.price.toString(),
                    "priceType": this.id.toString(),
                    "userId": this.shareFn.getUserId()*1,
                    "securityCode": this.shareFn.getSecurityCode()
                };
            this.$nextTick(function(){
                that.$http.jsonp(
                    Common.baseURI().host + "/charge/chargeRealMoney",
                    {
                        params: godata
                    }
                ).then(function(res){
                    if(res.data.Code == "0000"){
                      var data = res.data.WxPara;

                      if (payType == 13) {
                        this.wxShow = true;
                        this.wxUrl = data.code_url+`&redirect_url=${location.href}`
                      } else if (payType == 9) {
                          var resultStr = res.data.DLBPara;
                          if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                              window.location.href = resultStr;
                          } else {
                              that.config = {
                                rander: 'img',
                                value: resultStr,
                                filter: '#FFFFFF',
                                fillType: 'image/png',
                                background: '#fff',
                                imagePath: require('../../common/img/jcslog.png')
                            }
                            that.wxShow=true;
                          }
                            
                      } else {
                        if (typeof WeixinJSBridge == "undefined"){
                          if( document.addEventListener ){
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                          }else if ( document.attachEvent ){
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                          }
                        }else{
                          onBridgeReady();
                        }
                        function onBridgeReady(e){
                          console.log(e)
                          WeixinJSBridge.invoke(
                            'getBrandWCPayRequest',
                            JSON.parse(data.code_url),
                            function(res){
                              showMessage(res.err_msg);
                            });
                        }
                      }
                    }
                },function(res){
                    console.log(res.data)
                })
            })
        },
        setMsg(){
            //console.log(999)
            this.$router.push({name: 'consumerecord'});
        },
        setWx(){
            this.wxShow = false;
        }
    },
    components:{
        mainHeader, VueQArt
    }
}
</script>

<style lang="less" type="text/less">
@import '../../common/less/base.less';
.recharge{
    background:@backcolor;
    color:@maincolor;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index:90;
    font-size:0.14rem;
    .rechargelist{
        width:100%;
        background:@whites;
        padding: 0 15px;
        .recharge-item{
            width:100%;
            display:flex;
            flex-wrap:wrap;
            justify-content:space-between;
            position:relative;
            div {
                min-height: 60px;
                width: 30%;
                text-align: center;
                border: 0.005rem solid @reds;
                border-radius: 3px;
                position: relative;
                overflow: hidden;
                margin-top: 15px;
                font-size:0.16rem;
                display:flex;
                flex-direction:column;
                justify-content:center;
                color:@maincolor;
                p{
                    line-height:1;
                }
                img{
                    width: 22px;
                    height: 25px;
                    position: absolute;
                    left: -1px;
                    top: -1px;
                }
                span{
                    font-size:0.1rem;
                    color:@namecolor;
                }
                .present{
                    color:@reds;
                }

            }
            .div{
                background:@shallowred2;
                color:@reds;
                border-color:@reds;
                span{
                    color:@reds;
                }
            }
        }

        .state {
            width: 100%;
            color: @assistcolor;
            font-size: @assistsize;
            line-height: 24px;
            padding: 15px 0 10px 0;
            clear: both;
            span {
                color: @reds;
            }
        }
    }

    .menulist{
        float:left;
        width:100%;
        background: @whites;
        .menu{
            float:left;
            width:97%;
            margin-left:3%;

            ul li{
                float:left;
                width:100%;
                height:55px;
                line-height:55px;
                border-bottom:1px @bordercolor solid;
                border:none;
                font-size: 15px;
                .border-bottom;
                &:last-child{
                    border:none;
                }
                .li1{
                    position: relative;
                }
                .txt{
                    float:left;
                    font-size:17px;
                    color: @maincolor;
                }
                .rico{
                    float:right;
                    width:17px;
                    height:17px;
                    margin:17px 16px 0 0;
                    background:url('../../common/img/unselect.png') no-repeat center;
                    background-size:17px;
                }
                .rico-on{
                    float:right;
                    width:17px;
                    height:17px;
                    margin:17px 16px 0 0;
                    background:url('../../common/img/selected.png') no-repeat center;
                    background-size:17px;
                }
                 .img{
                    width:35px;
                    height:39px;
                    float: left;
                    margin-top:10px;
                    margin-right:10px;
                }
            }
            .th{
                position: absolute;
                right:0;top:-7px;
                width:60px;
                height:17px;
            }

        }
    }
    .subbtn {
        width: 90%;
        height: 45px;
        background: @reds;
        color: @whites;
        clear: both;
        font-size: 0.15rem;
        line-height: 45px;
        text-align: center;
        border-radius: 3px;
        margin: 30px 0 0 5%;
        float: left;
    }
    .p{
        color: @garycolor;
        float:left;
        width:100%;
        padding:15px 0 8px 3%;
        font-size: 0.13rem;
    }
    .sm{
        height:3em;
        float:left;
        line-height:18px;
        padding: 0 3%;
        color: @assistcolor;
        font-size:@assistsize;
        margin-top:10px;
        position:absolute;
        bottom:10px;
        span{
            color:@reds;
        }
    }
    .mask-wx{
        position:fixed;
        left:0;
        top:0;
        bottom:0;
        right:0;
        background: rgba(0,0,0,0.3);
        color:@maincolor;
        font-size:0.15rem;
        .dialog-wx{
            width:80%;
            position:absolute;
            left:10%;
            top:50%;
            transform: translateY(-50%);
            background: @whites;
            border-radius:18px;
            text-align:center;
            overflow:hidden;
            .wxGo{
                width:90%;
                height:45px;
                margin-left:5%;
                display:inline-block;
                background:#60b946;
                color:@whites;
                line-height:45px;
                text-align:center;
                border-radius:3px;
                font-size:@mainsize;
            }
            .titles{
                height:70px;
                width:100%;
                background:@backcolor;
                line-height:70px;
                color:@maincolor;
                font-size:@titsize;
                p{
                    display:inline-block;
                    background-image:url('../../common/bgs-09c.png');
                    background-position:left center;
                    background-size:27px auto;
                    background-repeat:no-repeat;
                    padding-left:35px;
                }
            }
            .main{
                padding:15px;
                .name{
                    font-size:@assistsize;
                    color:@assistcolor;
                }
                .pay_price{
                    font-size:0.18rem;
                    color:@maincolor;
                    line-height:45px;
                    height:45px;
                }
            }
            a{
                color:@assistcolor;
                text-decoration:none;
                font-size:@assistsize;
                display:block;
                height:45px;
                line-height:45px;
            }
        }

    }
    .menu ul #card{
        height:auto;
        line-height:45px;
        color: @maincolor;
        .border-none;
        p{
            clear:both;
            line-height:24px;
            color:@namecolor;
            padding-bottom:25px;
        }
        .txt{
            line-height: 53px;
        }
        .payCard{
            padding: 10px;font-size:14px;margin-left:20px;
        }
        .payCard span{color:@reds;}
    }
}
</style>
