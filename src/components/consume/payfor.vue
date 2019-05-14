<template>
    <transition name="slide">
        <div class="payfor">
            <main-header @setMsg="setMsg()" :headerData="headerData"></main-header>
            <div class="pay-for-main" v-if="msgData!=null">
                <div class="usebox">
                    <h4><span class="name" id="lectrue_name">{{msgData.NickName}}</span> 的精彩说</h4>
                    <p>待支付<span id="price">{{msgData.Price}}</span>精彩币</p>
                </div>
                <div class="menulist">
                    <div class="menu">
                        <ul>
                            <li @click="TrueClick('jcs')" id="jcbplay" class="li1">
                                <img src="../../common/img/log.png" alt="" class="img">
                                <span class="txt" id="countmoney">账户余额</span>
                                <span class="rico"></span>
                                <span v-if="msgData.Price>msgData.Money" class="balance gary_pay">
                                    余额不足
                                    <i></i>
                                </span>
                                <span v-else-if="msgData.Price<=msgData.Money" class="balance">
                                    <i>{{msgData.Money}}</i>精彩币
                                </span>
                            </li>
                            <!-- <li @click="TrueClick('we')" id="weixinpay" 
                                v-if="new Date().getHours() > 9 && new Date().getHours() <21">
                                <img src="../../common/bgs-09c.png" alt="" class="w-img">
                                <span class="txt">哆啦宝支付</span>
                                <span class="rico"></span>
                            </li> -->
                            <li @click="TrueClick('ali')" id="aliplay" style="display:none">
                                <img src="../../common/img/zhi.png" alt="" class="img">
                                <span class="txt">支付宝支付</span>
                                <span class="rico"></span>
                            </li>
                            <li id="card">
                                <img src="../../common/img/card.png" alt="" class="img">
                                <span class="txt">银行转账</span>
                                <p class="payCard">账户名称：北京信盈世纪科技有限责任公司<br>
                                    开户行：<span>平安银行北京金融街支行</span><br>
                                    银行帐户：<span>11014837407009</span></p>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <p class="sm" style="">精彩币主要用于购买比赛分析文章，精彩币购买后不可提现，不可退款。如有问题请咨询<span class="online" id="onlineservice1">在线客服</span>或拨打<span class="tel" id="telphone">客服电话</span></p>
            <div class="mask-wx" @click.stop="setWx" v-show="wxShow">
                <div class="dialog-wx">
                    <div class="titles">
                        <p>微信支付</p>
                    </div>
                    <div class="main">
                        <p class="name">{{authName}}的付费文章</p>
                        <p class="pay_price">￥{{price}}.00</p>
                    </div>
                    <a class="wxGo" :href="wxUrl">立即支付</a>
                    <a class="cancle_pay" href="javascript:;">取消</a>
                </div>
            </div>
          <div class="wx_dialog" v-show="wxDialog">
            <div class="mask-wx">
              <div class="dialog-wx">
                <div class="titles">
                  <p>哆啦宝支付</p>
                </div>
                <div class="main">
                  <vue-q-art v-if="config!=null" :config="config"></vue-q-art>
                  <a>微信或支付宝扫码支付</a>
                  <a class="cancle_pay" @click="wxDialog=false" href="javascript:;">取消</a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </transition>
</template>

<script type="text/javascript">
import Common from 'common/js/common'
import mainHeader from 'base/header/mainheader'
import VueQArt from 'vue-qart'
export default {
	name: 'payfor',
	props: {
        id: {
            type: String,
            default: ''
        }
    },
    data(){
      return {
        headerData:{
            name: 'payfor',
            ele: '支付',
            r_ele: ''//'充值'
        },
        msgData: null,
        CommodityType: 0,
        articleId: 0,
        wxShow: false,
        wxUrl: '',
        price: 0,
        authName: '',
        wxDialog: false,
        config: null
      }
    },
    created(){
        //this.getData();
        //console.log(this.$route.params)
      console.log(Common.getDeviceinfo())
    },
    activated() {
        this.$nextTick(function(){
            this.msgData = null;
            this.getData();
        })

    },
    methods: {
        getData(){
            console.log(this.$router.currentRoute.query)
            if(this.$router.currentRoute.query.proType == 'jcs'){
                this.articleId = this.$router.currentRoute.query.id;
                this.CommodityType = 0;
            }else if(this.$router.currentRoute.query.proType == 'package'){
                this.articleId = '-'+this.$router.currentRoute.query.id;
                this.CommodityType = 8;
            }
            this.$nextTick(function(){
                this.$http.jsonp(
                    Common.baseURI().host + "/User/GetUserFortuneAndArticlePrice",
                    {
                        params: {
                            userId: this.shareFn.getUserId(),
                            token: this.shareFn.getSecurityCode(),
                            articleId: this.articleId,
                            language: 'M'
                        }
                    }
                ).then(function(res){
                    console.log(res.data)
                    this.msgData = res.data;
                    this.authName =this.msgData.NickName;
                    this.price = this.msgData.Price;
                },function(){
                    console.log('网络出错，请重试')
                })
            })
        },
        TrueClick(s){
            var that = this;
            const PAY_TYPE_WX = 1;
            const PAY_TYPE_ALIPAY = 2;
            const PAY_TYPE_GOLD = 3;
            const PAY_TYPE_CARD = 6;
            const PAY_TYPE_SIX=7;
            var payType = 13;
            if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                payType = 12;
            }
            if(s == 'jcs'){
                if (this.msgData.Price>this.msgData.Money) {
                    layer.open({
                        content: '你的精彩币余额不足！网页版暂只支持一种支付方式，请下载<span style="color: #e9311d"> 精彩说官方APP</span> 。<p>查看更多<span style="color:#e9311d">精彩推荐！</span></p>',
                        btn: ['确定','取消'],
                        yes: function (index) {
                            layer.close(index);
                            //that.$router.push('download');
                            window.location.href = 'http://www.jingcaishuo.com/activity/download/'
                        },
                        no: function () {

                        }
                    })
                    return false
                }
                layer.open({
                    content: '您确认要余额支付'+this.msgData.Price+'精彩币吗？',
                    btn: ['确定','取消'],
                    yes: function(index){
                        that.$nextTick(function(){
                            that.$http.jsonp(
                                Common.baseURI().host + "/Purchase/PurchaseArticleByOmnCard",
                                {
                                    params: {
                                        Language: "M",
                                        Type: PAY_TYPE_GOLD,
                                        ArticleId: this.articleId,
                                        AuthorId: '',
                                        Id: '',
                                        price: that.msgData.price,
                                        UserId: this.shareFn.getUserId(),
                                        SecurityCode: this.shareFn.getSecurityCode()
                                    }
                                }
                            ).then(function(res){
                                if(res.data.Code == "0000"){
                                    layer.close(index);
                                    that.$router.back();
                                }else{
                                    layer.open({
                                        content: '网络超时，请返回重试！',
                                        skin: 'msg',
                                        time: 2
                                    })
                                }
                            })
                        })
                    },
                    no: function(){

                    }
                })
            } else if(s == 'we') {
              if(Common.getDeviceinfo().type == 'pc'){
                that.custmorPost(0,this.articleId.toString(),'PC');
              } else if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                  that.custmorPost(0,this.articleId.toString(),'WEIXIN');
              } else if(Common.getDeviceinfo().type == 'ios' || Common.getDeviceinfo().type == 'android'){
                that.custmorPost(0,this.articleId.toString(),'H5');
              }

            }else if(s == 'ali'){

            }
        },
        custmorPost(payType,ID,source){
            this.$http.post(
            Common.baseURI().host + "/dlb/tradepay",
            {
                "Language":"M",
                "UserId":this.shareFn.getUserId(),
                "CommodityId":ID,
                "SecurityCode":this.shareFn.getSecurityCode(),
                "CommodityType":payType,
                "source": source
            },{
                headers: {
                "Content-Type": "application/json;charset=UTF-8",
                }
            }
            ).then(function (res) {
            if(res.data.Code == '0000'){
                var resultStr = res.data.DLBPara;
                if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                    window.location.href = resultStr;
                } else {
                    this.config = {
                        value: resultStr,
                        filter: '#FFFFFF',
                        fillType: '',
                        background: '#fff',
                        imagePath: require('../../common/img/jcslog.png')
                    }
                    this.wxDialog=true;
                }
                
            }else if(res.data.Code == 3008){
                alert("您已经购买过了");
            }else if(res.data.Code == '2006'||res.data.Code == '2005'){
                layer.open({
                    content: '<p style="text-align:center;">您已在其他设备登录，确定要重新登录吗？</p >',
                    btn: ['确定','取消'],
                    shadeClose:null,
                    yes: function (index) {
                        $('#PayInit').hide();
                        layer.close(index);
                        needLogin();
                        $.removeCookie('NikeName');
                    }
                });
            }
            },function (err) {
                console.log(err)
            })
        },
        setWx(){
            this.wxShow = false;
        },
        setMsg(){
            this.$router.push('recharge');
        },
        DLBpay () {
            var godata = {
                    "language": "M",
                    "chargeType": payType,
                    "money": this.price.toString(),
                    "priceType": this.id.toString(),
                    "userId": this.shareFn.getUserId()*1,
                    "securityCode": this.shareFn.getSecurityCode(),
                    "CommodityId":ID,
                };
                that.$http.jsonp(
                    Common.baseURI().host + "/charge/chargeRealMoney",
                    {
                        params: godata
                    }
                ).then(function(res){
            
                })
        },
        jiudaima () {//微信支付
            //h5
            var godata = {
                  "Language": "M",
                  "CommodityId": this.articleId.toString(),
                  "CommodityType": this.CommodityType,
                  "price": this.msgData.Price.toString(),
                  "AuthorId": this.msgData.AuthorId.toString(),
                  "source": "1_2_7",
                  "loginfrom": "H5",
                  "paytype": payType,
                  "UserId": this.shareFn.getUserId(),
                  "SecurityCode": this.shareFn.getSecurityCode()
                };
                console.log(JSON.stringify(godata))
                that.$http.post(
                  Common.baseURI().host + "/weixin/tradepay",
                  JSON.stringify(godata)
                ).then(function(res){
                  console.log(res.data);
                  if(res.data.Code == "0000"){
                    var data = JSON.parse(res.data.WxPara);
                    if(payType == 13){
                      this.wxShow = true;
                      this.wxUrl = data.code_url+`&redirect_url=http://www.jingcaishuo.com/chinese/jcs-app/dist/#/articledetail/?id=${this.articleId.toString()}`
                      console.log(this.wxUrl)
                    } else {
                      if (typeof WeixinJSBridge == "undefined"){
                        if( document.addEventListener ){
                          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        }else if (document.attachEvent){
                          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                      }else{
                        onBridgeReady();
                      }
                      function onBridgeReady(){
                        console.log(data.code_url)
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
            //pc
            console.log(Common.getDeviceinfo().type)
            that.custmorPost(9,this.articleId.toString());
            console.log(99999999)
        }
    },
    components:{
        mainHeader, VueQArt
    }
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.payfor{
    background:@backcolor;
    color:@maincolor;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index:90;
    font-size:0.14rem;
    .pay-for-main{
        width:92%;
        margin-left:4%;
        background:@whites;
        border-radius:10px 10px 0 0;
        overflow:hidden;
        margin-top:20px;
    }
    /* 个人中心 */

    .usebox{
        height:120px;
        float:left;
        width:100%;
        text-align: center;
        background:@shallowred;
        color:@whites;
        h4{
            font-size: 15px;
            font-weight: normal;
            margin-top:30px;
            color:@whites;
        }
        p{
            padding-top: 10px;
            font-size:12px;
            color:#fcd9d6;
        }
        p span{
            color:@whites;
            font-size:36px;
            padding:0 5px;
        }
    }
    .userico{
      float:left;
      width:50px;
      height:50px
    }
    .userico img{
      width:50px;height:50px;border-radius:50%}
    .regbox{float:left;height:24px;line-height:24px;padding:0 5px;margin:15px 0 0 15px;font-size:.875em;color:#ff8200;border:1px #ff8200 solid; border-radius:4px; overflow:hidden}
    .regbox a{color:#ff8200}
    .loginbox{float:left;width:50%;}
    .loginbox ul li{
        float:left;
        width:100%;
        line-height:16px;
        margin:6px 0 0 10px;
        font-size:.875em;
        color:#fff
    }
    .loginbox .num{
        color:#ffdf1b;
    }
    .recharge{
        float:right;
        height:22px;
        line-height:22px;
        padding:0 10px;
        margin-top:15px;
        background:#ffdf1b;
        border-radius:4px;
        font-size:.813em;
    }
    .recharge a{
        display:block;
        color:#371910
    }
    .menulist{
        float:left;
        width:100%;
        background:@whites;
    }
    .menu{
        float:left;
        width:100%;
        padding-left:15px;
    }
    .menu ul li{
        float:left;
        width:100%;
        height:50px;
        line-height:50px;
        font-size: 15px;
        .border-bottom;
        &:last-child{
            .border-none;
            .txt{
                line-height:53px;
            }
        }
      &:after{
        right:15px;
      }
    }
    .menu ul li:last-child{
        border:none;
    }
    .th{position: absolute;right:0;top:-7px;width:60px;height:17px;}
    .li1{position: relative;}
    .p{color: #c6c6c6;background: #282828;float:left;width:96%; height:50px; line-height:50px;font-size: 1em;padding-left: 3%;}
    .menu .txt{
        float:left;
        font-size:15px;
        color:@maincolor;
    }
    .menu .rico{
        float:right;
        width:5px;
        height:100%;
        background:url('../../common/img/r_ico.png') no-repeat center;
        background-size:5px 10px;
        margin-right: 15px;
    }
    .img{
        width:22px;
        height:22px;
        float:left;
        margin-top:14px;
        margin-right:10px;
    }
    .w-img{
        width:25px;
        height:30px;
        float:left;
        margin-top:5px;
        margin-right:14px;
    }
    .balance{color:@reds;font-size: 12px;padding-left:0.5em;float:right;padding-right: 10px}
    .balance i{font-size:@assistsize;}
    .gary_pay{
        color:@namecolor;
        font-size:@assistsize;
        i{
            width:49px;
            height:13px;
            display:inline-block;
            background:url('../../common/img/recharge-little.png') no-repeat center;
            background-size:100%;
            transform:translateY(2px);
        }
    }
    .hint{color: #c6c6c6;position: absolute;bottom: 2.8em;text-align: center;width: 100%;font-size: 0.9em;}
    .service{color:#ffdf1b;}
    .sm{height:3em;float:left;line-height:18px;padding: 0 3%;color:#999999;font-size:@assistsize;
        margin-top:10px;position:absolute;bottom:10px;}
    .sm span{color:@reds;}
    i{font-style: normal;}
    .payCard{padding:0 10px;color:#ddd;font-size:14px;margin-left:20px;}
    .payCard span{color:@reds;}
    .paytit{width:100%;color:#ddd;padding-left:10px;padding-top:20px;overflow:hidden;}
    @media (device-height:480px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone4/4s */
    .txtbox dd{width:84%}
    }

    @media (device-height:568px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone5 */
    .txtbox dd{width:84%}
    }
    .menu ul #card{
        height:auto;
        line-height:45px;
        p{
            clear:both;
            line-height:24px;
            color:@namecolor;
            padding-bottom:25px;
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
        z-index:111;
        .dialog-wx{
            width:80%;
            position:absolute;
            left:10%;
            top:50%;
            transform: translateY(-50%);
            background: @whites;
            border-radius:20px;
            text-align:center;
            overflow:hidden;
            .wxGo{
                width:90%;
                height:45px;
                margin:0;
                display:inline-block;
                background:#1aad19;
                color:@whites;
                line-height:45px;
                text-align:center;
                border-radius:3px;
                font-size:0.16rem;
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
                    font-size:0.14rem;
                    color:#999999;
                }
                .pay_price{
                    font-size:0.3rem;
                    color:@maincolor;
                    line-height:45px;
                    height:45px;
                }
            }
            a{
                color:#999;
                text-decoration:none;
                font-size:0.14rem;
                display:block;
                line-height:1;
                margin:15px 0 20px 0;
            }
        }

    }

}
</style>
