<template>
  <div class="my">
    <publick-header :headerData="headerData"></publick-header>
    <div class="my-wrap">
      <div class="usebox">
        <dl @click="enterClick()">
          <dt>
            <img v-if="isLogin()" :src="userData.PicPath" alt="" id="usericon">
            <img v-else-if="!isLogin()" src="../../common/img/uyse.png" alt="" id="usericon">
          </dt>
          <dd>
            <p v-show="isLogin() && !showName" class="setName" @click="setName()">设置昵称</p>
            <p v-show="showName" class="mynickname">{{userData.NickName}}</p>
            <p v-show="isLogin()" id="logintel">{{strReplace(userData.PhoneNumber)}} ID: {{userId}}</p>
            <p v-show="!isLogin()" class="enterPlese">请登录</p>
            <div class="sign-in" 
              :class="{'sign-click-already':alreadySign}"
              @click="signIn" v-if="isLogin()">
              {{signText}}
            </div>
          </dd>
        </dl>
      </div>
      <div class="money_box">
        精彩币：<span  id="money">{{userData.Money}}</span>
        <!-- <span v-if="isLogin()" class="add_money" id="recharge" style="display: block;" @click="goaRecharge()">充值</span> -->
      </div>
      <div class="menulist">
        <div class="menu-wrap">
          <ul>
            <li @click="myPageClick('wallet')" id="buy">
              <img src="../../common/img/0.png" alt=""/>
              <span class="my-txt">我的钱包</span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('buy')" id="buy">
              <img src="../../common/img/1.png" alt=""/>
              <span class="my-txt">我的购买</span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('mesasge')" id="mesasge">
              <img src="../../common/img/2.png" alt=""/>
              <span class="my-txt">我的私信</span>
              <span id="mymessagedot" class="messagereddot" style="display:none;"></span>
              <img class="my-rico" src="../../common/img/r_ico.png">
              <span class="l_num" style="display: none;">2</span>
            </li>
            <li @click="myPageClick('collection')" id="collection">
              <img src="../../common/img/3.png" alt=""/>
              <span class="my-txt">我的收藏</span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('present')" id="present">
              <img src="../../common/img/l.png" alt=""/>
              <span class="my-txt">
							我的赠送
							<span id="mycard" class="messagereddot" v-show="userData.Omnipotence.length"></span>
						</span>

              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('myCode')" id="myCode">
              <span class="code">{{userData.InviteCode}}</span>
              <img src="../../common/img/8.png" alt=""/>
              <span class="my-txt">我的邀请码</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="menulist">
        <div class="menu-wrap">
          <ul>
            <li id="msg" @click="myPageClick('feedback')">
              <img class="msg" src="../../common/img/msg.png" alt=""/>
              <span class="my-txt">我的留言</span>
              <span id="onlinedot" class="messagereddot" style="display: none;"></span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('onlineservice')" id="onlineservice">
              <img class="tt" src="../../common/img/4.png" alt=""/>
              <span class="my-txt">在线客服</span>
              <span id="onlinedot" class="messagereddot" style="display: none;"></span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick()" id="onlinehome" style="display:none;">
              <img src="../../common/img/chart.png" alt=""/>

              <span class="my-txt">直播间</span>
              <span id="homedot" class="messagereddot" style="display: none;"></span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('help')" id="help">
              <img src="../../common/img/5.png" alt=""/>
              <span class="my-txt">客服与帮助</span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
            <li @click="myPageClick('setting')" id="setting">
              <img src="../../common/img/6.png" alt=""/>
              <span class="my-txt">设置</span>
              <img class="my-rico" src="../../common/img/r_ico.png">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sign-dialog-mask" v-show="signShow">
      <div class="sign-dialog">
        <span class="sign-close" @click="signShow = false"></span>
        <div class="sign">
          <img src="../../common/img/signdone.png" class="dialog-log" alt="">
          <div class="sign-top">
            恭喜您获得<i>{{userSignInteral}}</i>积分<br>
            <p>您已连续签到 <span id="numsign">{{signNum}}</span>天</p>
          </div>
          <div class="sign-bottom" ref="signB">
            <div class="day-wrap" id="day-wrap">
              <dl v-for="item in signNums" 
                  :ref="'dl'+item.dy"
                  :class="{signon: item.dy<=signNum}">
                <dt>+{{item.ig}}</dt>
                <dd>{{item.dy}}天</dd>
              </dl>
            </div>
            <canvas id="cvs"></canvas>
          </div>
          <div class="sign-btn" @click="signShow = false">
            我知道了
          </div>
        </div>
      </div>
    </div>
    <router-view @nickBack="nickBack()"></router-view>
  </div>
</template>

<script>
  import publickHeader from 'base/header/publickheader'
  import Common from 'common/js/common.js'
  export default {
    name: 'my',
    data() {
      return {
        headerData: {
          ele: '我的',
          name: 'my',
          isShow: false
        },
        userData: {
          PhoneNumber: '请登录',
          Money: '',
          Omnipotence: [],
          InviteCode: ''
        },
        userId: '',
        showName: false,
        signShow: false,
        signText: '签到领积分',
        alreadySign: false,
        signNum: 1,
        userSignInteral: 10,
        signNums: [
          {dy: "1",ig: "10"},
          {dy: "2",ig: "10"},
          {dy: "3",ig: "10"},
          {dy: "4",ig: "20"},
          {dy: "5",ig: "20"},
          {dy: "6",ig: "30"},
          {dy: "7",ig: "50"}
        ]
      }

    },
    created() {
      this.$nextTick(function () {
        if (this.shareFn.isLogin()) {
          //this.getData()
        }
      })
    },
    activated() {
      if (this.shareFn.isLogin()) {
        this.getData();
      }
    },
    methods: {
      getData() {
        this.$nextTick(function () {
          this.$http.jsonp(Common.baseURI().host + '/User/GetUserInfo',
            {
              params: {
                userId: this.shareFn.getUserId(),
                token: this.shareFn.getSecurityCode(),
                language: 'M'
              }
            }
          ).then(function (res) {
            if (res.data.code == '0000') {
              this.userData = res.data;
              this.userId =  this.shareFn.getUserId();
              if(this.userData.NickName != '' && this.userData.NickName != null && this.userData.NickName != undefined && this.userData.NickName != this.userData.PhoneNumber){
                this.showName = true;
              }
              if(res.data.userSignMsg.indexOf('已签到') > -1){
                this.signText = res.data.userSignMsg
                this.alreadySign = true
              }
              setCookie(
                'telephone',
                this.userData.PhoneNumber == this.userData.NickName?this.strReplace(this.userData.PhoneNumber):this.userData.NickName,
                1
              );
              function setCookie(c_name, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = c_name + "=" + escape(value) +
                  ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
              }
            } else if (res.data.code == '2004') {
              location.reload();
              setCookie('jsonLog', null, 1);

              function setCookie(c_name, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = c_name + "=" + escape(value) +
                  ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
              }
            }
          }, function (res) {
            alert('请求失败！')
          })
        })

      },
      goaRecharge() {
        this.$router.push('recharge')
      },
      strReplace(str) {
        if (this.shareFn.isLogin()) {
          var newStr = str.substr(3, 5);
          return str.replace(newStr, '******');
        } else {
          return str;
        }
      },
      signIn () {
        let that = this;
        if (this.alreadySign) {
          layer.open({
            content: '您今天已签过到了！',
            time: 2,
            skin: 'msg'
          });
          return false;
        }
        this.signShow = true;
        this.$http.post(
					Common.baseURI().nativeHost,
					{
            UserId: this.shareFn.getUserId(),
            SecurityCode: this.shareFn.getSecurityCode(),
            language: 'M'
          },
					{
						headers: {
              "x-target": "TrentService.SignIn"
            }
					}

				).then(function(res){
          if (res.data.Code == '0000') {
            that.signText = res.data.msg
            that.signNum = res.data.userSignMsgCounts
            that.userSignInteral = res.data.userSignInteral
            that.alreadySign = true
            that.drowTimeLine(res.data.userSignMsgCounts)
          } else {
            layer.open({
              content: res.data.Code,
              time: 2,
              skin: 'msg'
            });
            return false;
          }
          
				},function(){
					this.bunceIn('请求失败请检查网络')
				})
      },
      drowTimeLine (s) {
        
        var cvs = document.querySelector('#cvs');
        var ctx = cvs.getContext('2d');
        var steep1 = this.$refs.dl1[0].offsetLeft,
            steep2 = this.$refs.dl2[0].offsetLeft,
            steep = steep2 - steep1;

        cvs.width = this.$refs.signB.clientWidth;
        cvs.height = this.$refs.signB.clientHeight
        
        ctx.moveTo(12, 11);
        ctx.lineTo(this.$refs.signB.clientWidth, 11);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ebebeb";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(12, 11);
        ctx.lineTo(steep * (s - 1), 11);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffd842";
        ctx.stroke();
      },
      nickBack(){
        this.getData();
      },
      isLogin() {
        return this.shareFn.isLogin();
      },
      myPageClick(s) {
        if (s == 'wallet') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({name: 'my_wallet'})
        } else if (s == 'buy') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({name: 'my_buy'})
        } else if (s == 'collection') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({name: 'myCollect'})
        } else if (s == 'present') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({name: 'mypresent'})
        }  else if (s == 'feedback') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({path: '/my/mymsg?NickName='+this.userData.NickName})
        } else if (s == 'mesasge') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({name: 'letterlist'})
        } else if (s == 'help') {
          this.$router.push({name: 'help'})
        } else if (s == 'setting') {
          this.$router.push({name: 'setting'})
        } else if (s == 'onlineservice') {
          if (!this.isLogin()) {
            this.$router.push({name: 'enter'});
            return;
          }
          this.$router.push({path: 'service?id=234'})
        }
      },
      enterClick() {
        if (!this.isLogin()) {
          this.$router.push({name: 'enter'});
          return false;
        }
      },
      setName(){
        if (this.isLogin()) {
          this.$router.push({name: 'nickName'});
          return false;
        }
      }
    },
    components: {
      publickHeader
    },
    watch: {

    }
  }
</script>

<style lang="less">
  @import '../../common/less/base.less';

  .my {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0px;
    bottom: 0px;
    right: 0;
    color: #fff;
    .my-wrap {
      position: absolute;
      left: 0;
      top: 44px;
      right: 0;
      bottom: 0;
      overflow-y: scroll;
      padding-bottom: 20px;
      input {
        -webkit-user-select: auto;
      }
      img {
        border: 0;
      }
      a {
        text-decoration: none;
      }
      li {
        list-style: none;
      }
      .usebox {
        width: 100%;
        background: @whites;
        height: 105px;
        position: relative;
        color: @maincolor;
        padding-left: 15px;
        dl {
          font-size: 0.14rem;
          display: flex;
          width: 100%;
          height: 100%;
          color: @maincolor;
          align-items: center;
          justify-content: flex-star;
          dd {
            padding-left: 10px;
            letter-spacing: 1px;
            margin-top: -3px;
            font-size: 0.11rem;
            color: @garycolor;
            flex-grow: 1;
            .setName{
              width: 73px;
              height: 20px;
              color: @namecolor;
              border: 1px solid @bordercolor;
              border-radius: 10px;
              font-size: 0.12rem;
              text-align: center;
              line-height: 18px;
              margin-bottom: 5px;
            }
            .toenter{
              font-size: 15px;
              color: @namecolor;
            }
            .mynickname{
              font-size: 17px;
              color: @maincolor;
            }
            .enterPlese{
              font-size: 15px;
              color: @namecolor;
            }
            .sign-in{
              position: absolute;right: 10px;top: 50%;line-height: 27px;
              background: #fe8300;border-radius: 14px;transform: translateY(-50%);
              -webkit-transform: translateY(-50%);color: #ffffff;font-size: 14px;
              padding: 0 8px;background: linear-gradient(to right,#fe8300 , #ff6845); 
            }
            .sign-click-already{
              background: transparent;border: 1px solid #e9311d;color: #e9311d;
            }
          }
        }
        img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
        }
      }
      .money_box{
        font-size: 0.14rem;
        color: @namecolor;
        position: relative;
        width: 100%;
        height: 55px;
        background: @whites;
        line-height: 55px;
        .border-top;
        padding-left: 15px;
        #money{
          color: @reds;
        }
        .add_money {
          float: right;
          height: 24px;
          font-size: 0.14rem;
          background: @reds;
          line-height: 24px;
          color: @whites;
          border-radius: 4px;
          padding: 0 20px;
          position: absolute;
          right: 15px;
          top: 50%;
          margin-top: -12px;
        }
      }
      .userico {
        float: left;
        width: 0.5rem;
        height: 0.5rem;
      }
      .userico img {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
      }

      .menulist {
        float: left;
        width: 100%;
        margin-top: 10px;
        background: @whites;
        color: @maincolor;
        .menu-wrap {
          float: left;
          width: 100%;
          padding-left: 15px;
          ul {
            li {
              width: 100%;
              height: 50px;
              line-height: 50px;
              font-size: 0.16rem;
              .border-bottom;
              &:last-child {
                .border-none;
              }
              .code {
                float: right;
                padding-right: 15px;
                font-size: 0.14rem;
                color: @garycolor;
              }
              img {
                width: 17px;
                height: 17px;
                float: left;
                margin: 16px 10px 0 0;
              }
              .msg{
                height: 15px;
                margin-top: 18px;
              }
              .my-txt {
                font-size: 0.14rem;
                color: @maincolor;
                position: relative;
                .messagereddot {
                  width: 0.5em;
                  height: 0.5em;
                  background: @reds;
                  float: left;
                  margin-top: 10px;
                  margin-left: 0px;
                  border-radius: 5px;
                  opacity: 0.8;
                  position: absolute;
                  right: -8px;
                  top: -11px;
                }
              }
              .my-rico {
                width: 5px;
                height: 10px;
                position: absolute;
                right: 15px;
                top: 20px;
                margin: 0;
              }
            }
            a{
              .border-bottom;
              position: relative;
              display: block;
            }
          }
        }
      }

      .l_num {
        width: 0.18rem;
        height: 0.18rem;
        background: #f43531;
        color: #ffffff;
        line-height: 0.18rem;
        font-size: 0.14rem;
        text-align: center;
        display: inline-block;
        border-radius: 50%;
        float: right;
        margin: 0.1rem 0.1rem 0 0;
      }
      .menu-wrap .txt {
        float: left;
        font-size: 0.15rem;
      }
      .menu-wrap .rico {
        float: right;
        width: 0.1rem;
      }
      .menu-wrap .rico img {
        width: 50%;
      }
      .img {
        width: 0.21rem;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        -moz-transform: translate3d(-50%, -50%, 0);
        -ms-transform: translate3d(-50%, -50%, 0);
        -o-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
      }

      .menu-wrap ul li:nth-last-child(1) {
        border-bottom: 0 none;
      }
      .tb {
        display: inline-block;
        width: 0.28rem;
        height: 0.28rem;
        background: url('../../common/img/xb.png') no-repeat center center;
        float: left;
        background-position: 0;
        margin-top: 8px;
      }
      .tb:nth-child(2) {
        color: #fff;
        background-position: -20px 0;
      }
    }
    .sign-dialog-mask{
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      background: rgba(0,0,0,0.3);
    }
    .sign-dialog{
      width: 90%;
      height: auto;
      position: fixed;
      left: 5%;
      top: 50%;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      background: #ffffff;
      border-radius: 10px;
    }
    .sign{
      width: 100%;
      height: auto;
      font-size: 0.14rem;
    }
    .dialog-log{
      width: 134px;
      height: 101px;
      position: absolute;
      left: 50%;
      top: -40px;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
    }
    .sign-top{
      color: #333333;
      font-size: 18px;
      text-align: center;
      padding: 20px 15px 0px 22px;
      margin-top: 61px;
    }
    .sign-top i{
      font-style: normal;
      color: #e9311d;
    }
    .sign-top p{
      font-size: 14px;
      color: #999999;
    }
    .my-integral span{
      color: #ffd842;
    }


    .sign-bottom{
      display: -webkit-box;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      margin: 20px;
      position: relative;
    }
    .day-wrap{
        width: 100%;
        display: -webkit-box;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
    }

    .sign-bottom dl{
      text-align: center;
      z-index: 9;
    }
    .sign-bottom dl dt{
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      word-spacing: 0;
      font-size: 10px;
      background: #ebebeb;
      color: #bbbbbb;
      margin: 0 auto;
    }

    .sign-bottom dl dt:after{
      content: '';

    }

    .sign-bottom dl dd{
      font-size: 9px;
      color: #bbbbbb;
      line-height: 1;
      padding-top: 5px;
    }
    #cvs{
      position: absolute;
        left: 0;
        top: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
    }

    .sign-btn{
      height: 37px;
      width: 80%;
      background: #ffd842;
      line-height: 37px;
      text-align: center;
      border-radius: 2px;
      margin: 20px 0 20px 10%;
    }

    .sign-close{
      width: 14px;
      height: 14px;
      position: absolute;
      right: 15px;
      top: 15px;
      background: url("../../common/img/close2.png") no-repeat;
      background-size: 14px;
    }

    .signon dt{
      background: url("../../common/img/signb.png") no-repeat !important;
      background-size: 24px !important;
      color: #ff7e00 !important;
    }
    .signon dd{
      color: ;
    }

    .picaudit{
      font-size: 10px;
      color: #666666 !important;
      padding-top: 5px;
      display: none;
      text-align: left !important;
    }

  }
</style>
