<template>
  <transition name="slide">
    <div class="roomindex">
      <img style="width: 0;height: 0;opacity: 0;display: none;"
           src="http://www.jingcaishuo.com/mandarin_h5_html/aboutour_mandarin/img/log.png" alt="">
      <main-header v-show="!inXCX" @setMsg="setMsg" @back="back" :headerData="headerData"></main-header>
      <div class="room-nav">
        <ul class="selector">
          <li @click="selector(0)" class="all" :class="{on: range == 0}">查看全部</li>
          <li @click="selector(3)" class="recommend" :class="{on: range == 3}">老师推荐</li>
          <li @click="selector(1)" class="teach" :class="{on: range == 1}">仅看老师</li>
          <li @click="selector(2)" class="own" :class="{on: range == 2}">仅看本人</li>
          <li class="peopleli"><span class="people">{{roomUsers}}</span></li>
        </ul>
      </div>

      <div ref="scrollWraper" class="msg-list" :class="{inwxxcx:inXCX}">
        <div ref="roomMain" class="room-main">
          <p class="load_pc" v-show="loadPcShow">加载中...</p>
          <template v-for="item in msgData">
            <section v-if="item.type != 2" :key="item.messageId" :id="item.messageId"
                     :class="{
                              left:item.isLecturer||userName!=item.userName,
                              right:!item.isLecturer&&userName==item.userName,
                              te_left:item.isLecturer
                          }">
              <div v-if="item.isSystem" class="award-section">
                <span v-html="item.content"></span>
              </div>

              <div v-else>
                <div
                  :class="{
                                  pic:item.isLecturer||userName!=item.userName,
                                  rpic:!item.isLecturer&&userName==item.userName
                              }">
                  <img :src="item.userPic" alt="">
                </div>
                <div
                  :class="{
                              msg:item.isLecturer||userName!=item.userName,
                              rmsg:!item.isLecturer&&userName==item.userName
                          }">
                  <p
                    :class="{
                                  tim:item.isLecturer||userName!=item.userName,
                                  rtim:!item.isLecturer&&userName==item.userName
                              }">{{item.userName}} {{setTime(item.createTime)}}</p>
                  <div v-if="item.content.indexOf('jmsgimg')>0"
                       @click.stop="preview"
                       :class="{
                                      dialog:item.isLecturer || userName != item.userName,
                                      rdialog:!item.isLecturer && userName==item.userName,
                                      imgdialog:item.content.indexOf('jmsgimg')>0
                                  }" v-html="item.content">
                  </div>
                  <div v-else-if="(!item.hasPurchased && !item.payable) || item.hasPurchased"
                       :class="{
                                      dialog:item.isLecturer||userName!=item.userName,
                                      rdialog:!item.isLecturer&&userName==item.userName
                                  }">{{coding(item.content)}}<img v-if="item.payable || item.hasPurchased"
                                                                  class="lock-pic"
                                                                  src="../../common/img/lop.png">
                  </div>
                  <div v-if="item.payable && !item.hasPurchased" @click="openMsg(item.messageId,item.price)"
                       class="dialog dialog-close">
                    <span class="close-lock"></span>
                    <p>推荐锦囊：{{item.price}} 精彩币解锁</p>
                  </div>
                </div>
              </div>

            </section>
            <guess-item v-else-if="item.type == 2" @guessTeamClick="guessTeamClick" :item="item"></guess-item>
          </template>
        </div>
      </div>
      <p class="newmsg_in" @click="newMsgClick()" v-show="newMsg">您有新消息</p>
      <div class="room-foot" @click.stop="visitorFn">

        <dl class="goaward" @click="goAward">
          <dt><img src="../../common/img/g-click.png" alt=""></dt>
          <dd>打赏</dd>
        </dl>
        <p>
          <input ref="msgInput" type="text" placeholder="发送消息..." name="msg" @keyup.enter="sendMsg()">
          <button type="button" id="send" @click="sendMsg()">发送</button>
        </p>

      </div>
      <pay-dialog
        ref="payDialog"
        :btns="dialogData.btns"
        :tit="dialogData.tit"
        :yesFn="dialogData.yesFn"
        :noFn="dialogData.noFn">
      </pay-dialog>
      <div class="award-mask" v-show="awardShow">
        <div class="award-dialog">
          <div class="award-hd">
            <img src="../../common/img/g-award.png" alt="">
            <p class="award-tit">给<span id="lecturerName"></span>打赏精彩币</p>
            <span class="award-hide" @click="awardHide"></span>
          </div>
          <div class="award-num">
            <p><input type="number" placeholder="请输入要打赏的精彩币数额" v-model="awardNum" name="award-num"></p>
          </div>
          <div class="award-btn">
            <button type="button" @click="goPayAward()" :class="{awardgary:awardNum<=0}">确认</button>
          </div>
          <p class="award-balance">您的当前余额：<span id="userMoney">{{userMoney}}</span>精彩币</p>
        </div>
      </div>

      <preview-img ref="previewImg"></preview-img>

      <div class="wx_dialog" v-show="wxDialog">
        <div class="mask-wx">
          <div class="dialog-wx">
            <div class="titles">
              <p>微信支付</p>
            </div>
            <div class="main">
              <vue-q-art v-if="config!=null" :config="config"></vue-q-art>
              <a>微信扫码支付</a>
              <a class="cancle_pay" @click="wxDialog=false" href="javascript:;">取消</a>
            </div>
          </div>
        </div>
      </div>
      <guess-dialog
        :moneyArr="moneyArr"
        @guessSuccess="guessSuccess"
        ref="guessDialog">
      </guess-dialog>
    </div>
  </transition>
</template>

<script type="text/javascript">
  import guessMixin from 'base/mixins/guess_mixin'
  import guessDialog from 'base/guessdialog/guessdialog'
  import mainHeader from 'base/header/mainheader'
  import Common from 'common/js/common'
  import DialogZ from 'common/js/jcs_dialoga.js'
  import payDialog from 'base/paydialog/paydialog'
  import previewImg from 'base/previewimg/preview-img'
  import guessItem from './chatitem/guessitem'

  import VueQArt from 'vue-qart'

  export default {
    name: 'roomindex',
    mixins: [guessMixin],
    props: ['item'],
    data() {
      return {
        headerData: {
          name: 'roomindex',
          ele: '聊天室',
          r_ele: '订阅推荐消息'
        },
        dialogData: {
          tit: '',
          btns: ['确认购买', '返回列表']
        },
        newMsg: false,
        msgData: [],
        IO: null,
        roomUsers: 0,
        isLogin: this.shareFn.isLogin(),
        userName: '',
        range: 0,
        roomPic: '',
        roomId: this.$router.currentRoute.query.roomId,
        roomName: this.$router.currentRoute.query.roomName,
        roomPrice: this.$router.currentRoute.query.roomPrice,
        lecturerName: this.$router.currentRoute.query.lecturerName,
        userId: this.shareFn.getUserId(),
        token: this.shareFn.getSecurityCode(),
        userMoney: 0,
        ackData: {},
        toData: {
          limit: 30,
          userId: '',
          range: 0,
          token: ''
        },
        onData: {
          isAll: true,
          isRec: false,
          isTeach: false,
          isOwn: false
        },
        openRoomWay: null,
        isPullDown: false,
        messageIds: 0,
        awardShow: false,
        awardNum: '',
        config: null,
        wxDialog: false,
        loadPcShow: false,
        newsId: '',
        userIntergral: 0,
        curGuessId: 0,
        curTeam: '',
        gusDialogShow: false,
        roomIntegral: 0,
        inXCX: false,
        chatClosedStatus: false
      }
    },
    created() {
      if ( window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent.toLowerCase()) ) {
        this.inXCX = true
        this.userId = this.$router.currentRoute.query.userId
        this.token = this.shareFn.wxGetUserT(this.userId, this.$router.currentRoute.query.token)
        document.getElementsByTagName("title")[0].innerText = "聊天室";
      }
    },
    activated() {
      if (!this.$route.meta.iskeep) {
        this.msgData = [];
        if (!this.shareFn.isLogin() && !this.inXCX) {
          this.$refs.msgInput.placeholder = '点此登录后方可发言！';
          this.$refs.msgInput.disabled = true;
          this.reseteRoomStatus();
        } else {
          this.$refs.msgInput.placeholder = '发送消息...';
          this.$refs.msgInput.disabled = false;
          this.reseteRoomStatus();
        }

      } else {
        this.$router.push({name: 'enter'})
      }
      let userId = this.shareFn.getUserId()
      let token = this.shareFn.getSecurityCode()
      this.userId = userId
      this.token = token
      this.toData.userId = userId
      this.toData.token = token
    },
    mounted() {
      if (Common.getDeviceinfo().type == 'pc') {
        this.laodPcMsg();
      } else {
        this.loadMsg();
      }
    },
    computed: {},
    methods: {
      coding(str) {
        return unescape(str.replace(/&#x/g, '%u').replace(/;/g, ''));
      },
      reseteRoomStatus() {
        this.IO = io.connect(Common.baseURI().ioUrl);
        this.roomScoket();
        this.roomId = this.$router.currentRoute.query.roomId;
        this.roomName = this.$router.currentRoute.query.roomName;
        this.roomPrice = this.$router.currentRoute.query.roomPrice;
        this.isPullDown = false;
        this.messageIds = 0;
        this.headerData = {
          name: 'roomindex',
          ele: this.roomName,
          r_ele: '订阅推荐消息'
        }
        this.toData = {
          limit: 30,
          userId: this.userId,
          range: 0,
          token: this.token
        };

      },
      roomScoket() {
        var that = this;
        //连接并登陆
        this.IO.on('connect', function () {
          //链接成功
          var jsonObject = {
            roomId: that.roomId,
            userId: that.userId,
            token: that.token
          };
          console.log(jsonObject)
          that.IO.emit('login', jsonObject);
        });
        this.IO.on('ack', function (data) {
          console.log(data)
          that.chatClosedStatus = data.close
          that.chatClosed()
          that.ackData = data;
          that.roomUsers = data.roomUsers;
          that.roomPrice = data.roomPrice;
          that.roomIntegral = data.room_integral;
          that.roomPic = data.userPic;
          that.userMoney = data.userMoney;
          that.userName = data.userName;
          that.lecturerName = that.$router.currentRoute.query.lecturerName || data.roomLecturer;
          that.userIntergral = data.userIntergral == undefined ? 0 : data.userIntergral;
          if (data.code == 999) {
            if (that.shareFn.isLogin() || that.inXCX) {
              that.$refs.payDialog.show()
              var tit = `<p>解锁${that.lecturerName}的聊天室</p><p>需支付<span>${that.roomPrice}</span>精彩币</p>`;
              if (data.roomPrice == 0 && data.room_integral > 0) {
                tit = `<p>解锁${that.lecturerName}的聊天室</p><p>需支付<span>${data.room_integral}</span>积分</p>`;
              }
              that.dialogData = {
                tit: tit,
                btns: ['确认购买', '返回列表'],
                yesFn: that.firstYesFn,
                noFn: that.firstNoFn
              }
            } else {
              layer.open({
                content: `你还没有登录，登录后方可聊天。`,
                btn: ['去登录', '返回列表'],
                shadeClose: false,
                yes: function (index) {

                  layer.close(index);
                  that.$router.push('enter');
                },
                no: function (index) {
                  if (that.inXCX) {
                    wx.miniProgram.navigateBack()
                  } else {
                    that.back();
                  }
                  layer.close(index);
                }
              });
            }
          } else if (data.code == 888) {
            that.$refs.msgInput.placeholder = '直播未开始';
            that.$refs.msgInput.disabled = 'disabled';
            that.isOver = true;
            that.showMeaage('直播未开始');
            layer.open({
              content: `<p class="teach-name">${that.roomName}</p><p>主播：${data.roomLecturer}<span style="width:40px;display: inline-block"></span>门票：${that.setPrice(that.roomPrice)}</p><p>直播时间：${data.startTime.substr(5, 11)} ${data.endTime.substr(5, 11)}</p>`,
              btn: ['返回', '开启后通知我'],
              shadeClose: false,
              yes: function (index) {
                layer.close(index);
                if (that.inXCX) {
                  wx.miniProgram.navigateBack()
                } else {
                  that.back();
                }
              },
              no: function (index) {
                that.custmorJsonp(
                  "http://123.206.88.92:8080/Room/SubscribeRoom",
                  {
                    language: 'M',
                    userId: that.userId,
                    roomId: data.roomId
                  }, function (res) {

                  }, function (err) {
                    that.showMeaage('设置失败请!');
                  }
                );
                layer.close(index);
              }
            });

          } else if (data.code == 887) {
            that.$refs.msgInput.placeholder = '直播已结束';
            that.$refs.msgInput.disabled = "disabled";
            that.isOver = true;
            that.GetRoomMsg();
            that.showMeaage('直播已结束')
          } else if (data.code == 777) {
            that.showMeaage('请求过于频繁，访问受限！');
          } else {
            //登录成功，有权限
            that.userPic = data.userPic;
            that.GetRoomMsg();
          }
        });
        this.IO.on('chatevent', function (data) {

          that.chatClosedStatus = data.close
          if (data.userId != that.userId) {
            if (that.newsId == data.messageId) {
              return;
            }
            that.msgData.push(data);
            that.newsId = data.messageId;
            var mainH = that.$refs.scrollWraper.offsetHeight;
            var innerH = that.$refs.roomMain.offsetHeight;
            var scrollH = innerH - mainH;
            if (that.$refs.scrollWraper.scrollTop <= scrollH - 15) {
              that.newMsg = true;
            } else {
              that.scrollTo();
            }
          }
          if (data.payable) {
            that.GetRoomMsg();
          }
        });
        this.IO.on('rescindevent', function (data) {
          that.GetRoomMsg();
        });
        this.IO.on('roomstatusevent', function (data) {
          if (data.roomStatus == 'opened') {
            that.roomConnect();
            that.$refs.msgInput.disabled = false;
            that.$refs.msgInput.value = "";
            that.isOver = false;
          } else if (data.roomStatus == 'closed') {
            that.$refs.msgInput.placeholder = '直播已结束';
            that.$refs.msgInput.disabled = "disabled";
            that.showMeaage('直播已结束')
          }
        });
      },
      roomConnect: function () {
        var that = this;
        var jsonObject = {
          userId: this.userId,
          roomId: that.roomId,
          token: this.token
        };
        this.IO.emit('login', jsonObject);
      },
      sendMsg() {
        var that = this;
        if (that.$refs.msgInput.value == '') {
          return false;
        }
        this.chatClosed()
        var arr = {
          content: that.$refs.msgInput.value,
          createTime: this.shareFn.setTime('send'),
          isLecturer: false,
          isRecommended: false,
          messageId: '',
          payId: 0,
          payable: false,
          userName: that.userName,
          userPic: that.roomPic
        };
        this.msgData.push(arr);
        //推送给其他人
        var jsonObject = {
          roomId: that.$router.currentRoute.query.roomId,
          userId: that.userId,
          content: that.$refs.msgInput.value
        };
        this.IO.emit('chatevent', jsonObject);
        that.$refs.msgInput.value = '';
        that.scrollTo();
      },
      selector(s) {
        this.isPullDown = false;
        this.toData = {
          limit: 20,
          userId: this.userId,
          range: s,
          token: this.token
        }
        this.GetRoomMsg();
        this.range = s;
        this.scrollTo();
      },
      setMsg(s) {
        if (!this.shareFn.isLogin() && !inXCX) {
          this.$router.push('enter');
          return;
        }
        if (s != '订阅推荐消息') {
          this.headerData.r_ele = '订阅推荐消息';
          this.$nextTick(function () {
            this.$http.jsonp(
              Common.baseURI().roomMsgurls + "/Room/CancleSubscribeMsg",
              {
                params: {
                  language: 'M',
                  userId: this.userId,
                  roomId: this.roomId,
                  subscribeType: '-1'
                }
              }
            )
          })
        } else {
          this.headerData.r_ele = '已订阅推荐消息';
          this.$nextTick(function () {
            this.$http.jsonp(
              Common.baseURI().roomMsgurls + "/Room/SubscribeMsg",
              {
                params: {
                  language: 'M',
                  userId: this.userId,
                  roomId: this.roomId,
                  subscribeType: '0'
                }
              }
            )
          })
        }
      },
      GetRoomMsg() {
        var that = this, wrapEle = document.querySelector('.msg-list');
        this.custmorJsonp(
          Common.baseURI().roomMsgurls + '/Message/GetMsgList?roomId=' + that.$router.currentRoute.query.roomId,
          that.toData,
          function (res) {
            if (res.status == 200) {
              if (that.isPullDown) {
                that.msgData = res.data.messages.concat(that.msgData);
                setTimeout(function () {
                  var hei = document.querySelector('section').offsetHeight;
                  wrapEle.scrollTop = res.data.messages.length * hei;
                }, 20)
              } else {
                that.msgData = res.data.messages;
                that.scrollTo();
              }
              res.data.isMsgDescriber == 0 ? that.headerData.r_ele = '已订阅推荐消息' : that.headerData.r_ele = '订阅推荐消息';
              if (that.isPullDown && res.data.messages.length == 0) {
                layer.open({
                  content: '已无更多历史消息！',
                  time: 2,
                  skin: 'msg'
                });
              }
            } else {
              console.log('请求失败')
            }
            if (that.msgData.length != 0) {
              that.messageIds = that.msgData[0].messageId;
            }
            var downDom = document.querySelector('.custmor-pullDown');
            that.loadPcShow = false;
            if (downDom != null) {
              wrapEle.removeChild(downDom);
              that.isPullDown = false;
            }
          }, function () {
          }
        );
      },
      setTime(s) {
        return this.shareFn.setTime(s);
      },
      openMsg(id, price) {
        var that = this;
        layer.open({
          content: '您确定要支付' + price + '精彩币购买此消息吗？',
          shadeClose: false,
          btn: ['确定', '取消'],
          yes: function (index) {
            if (Common.getDeviceinfo().type == 'pc' && that.ackData.userMoney < price) {
              that.custmorPost(7, id.toString());
              layer.close(index)
            } else {
              that.custmorJsonp(
                Common.baseURI().host + '/Purchase/PurchaseChatRoomMsg',
                {
                  UserId: that.userId,
                  Language: 'M',
                  payable: true,
                  MsgId: id,
                  SecurityCode: that.token
                }, function (res) {
                  var texts = "购买成功！"
                  if (res.data.Code == '3006') {
                    texts = "精彩币余额不足请充值！";
                    layer.open({
                      content: texts,
                      time: 2,
                      skin: 'msg'
                    });
                    return;
                  } else if (res.data.Code == '0000') {
                    that.GetRoomMsg();
                    layer.close(index)
                  }
                }, function () {
                }
              );
            }

          },
          no: function (index) {
            layer.close(index);
          }
        })
      },
      firstYesFn() {
        if (this.ackData.roomPrice == 0 && this.ackData.room_integral > 0) {
          this.integralWay();
        } else {
          this.jcbPay();
        }
      },
      integralWay() {
        var that = this;
        that.custmorJsonp(
          Common.baseURI().host + '/Purchase/PurchaseChatRoom',
          {
            UserId: that.userId,
            Language: 'M',
            RoomId: that.roomId,
            SecurityCode: that.token,
            purchaseType: 15
          }, function (res) {
            var texts = "购买成功！"
            if (res.data.Code == '3006') {
              texts = "余额不足请充值！";
              layer.open({
                content: texts,
                skin: 'msg',
                time: 2
              });
              return;
            } else if (res.data.Code == '0000') {
              that.roomConnect();
              that.isOver = false;
              that.GetRoomMsg();
            } else {
              layer.open({
                content: JSON.stringify(res.data),
                skin: 'msg',
                time: 2
              });
            }
          }, function () {
          }
        );
        that.$refs.payDialog.hide()
      },
      jcbPay() {
        var that = this;
        if (this.ackData.userMoney < this.ackData.roomPrice) {
          if (Common.getDeviceinfo().type == 'pc') {
            that.custmorPost(6, this.roomId);
          } else {
            this.dialogData = {
              tit: '您的精彩币余额不足！',
              btns: ['去充值', '返回列表'],
              yesFn: function () {
                that.$router.push('recharge');
                that.$refs.payDialog.hide()
              },
              noFn: that.firstNoFn
            }
          }
        } else {
          this.dialogData = {
            tit: `<p>您确定要支付<span class="pay-dialog-price">${that.ackData.roomPrice}</span>精彩币购买门票吗？</p>`,
            btns: ['确定', '取消'],
            yesFn: function () {
              that.custmorJsonp(
                Common.baseURI().host + '/Purchase/PurchaseChatRoom',
                {
                  UserId: that.userId,
                  Language: 'M',
                  RoomId: that.roomId,
                  SecurityCode: that.token
                }, function (res) {
                  var texts = "购买成功！"
                  if (res.data.Code == '3006') {
                    texts = "余额不足请充值！";
                    layer.open({
                      content: texts,
                      skin: 'msg',
                      time: 2
                    });
                    return;
                  } else if (res.data.Code == '0000') {
                    that.roomConnect();
                    that.isOver = false;
                    that.GetRoomMsg();
                  }
                }, function () {
                }
              );
            },
            noFn: that.firstNoFn
          }
        }
      },
      firstNoFn() {
        if (this.inXCX) {
          wx.miniProgram.navigateBack()
        } else {
          this.back();
        }
        this.$refs.payDialog.hide()
      },
      loadMsg: function () {
        var that = this;
        var idx = 0, startx, starty, movex, movey, eleH;
        var wrapEle = document.querySelector('.msg-list');
        wrapEle.addEventListener('touchstart', function (e) {
          starty = e.touches[0].pageY;

          var mainH = that.$refs.scrollWraper.offsetHeight;
          var innerH = that.$refs.roomMain.offsetHeight;
          var scrollH = innerH - mainH;
          if (that.$refs.scrollWraper.scrollTop > scrollH - 10) {
            //that.
          }

        })
        wrapEle.addEventListener('touchmove', function (e) {
          var e = event || window.event;
          //e.preventDefault();
          event.stopPropagation();
          eleH = document.querySelectorAll('section')[0].getBoundingClientRect().top;
          movey = e.touches[0].pageY - starty;
          var mainH = that.$refs.scrollWraper.offsetHeight;
          var innerH = that.$refs.roomMain.offsetHeight;
          var scrollH = innerH - mainH;
          if (scrollH == wrapEle.scrollTop && movey <= 0) {
            e.preventDefault();
          }
          document.querySelector(".msg-list").WebKitOverflowScrolling = 'auto';
        })
        wrapEle.addEventListener('touchend', function (e) {
          //var e = event || window.event;
          var downDom = document.querySelector('.custmor-pullDown');
          if (downDom == null) {
            downDom = document.createElement('div');
            downDom.className = 'custmor-pullDown';
            downDom.innerHTML = `<img class="rotate" src="${require('../../common/img/load.png')}" alt="" />`
          }

          if (eleH >= 99 && movey > 50) {
            wrapEle.insertBefore(downDom, document.querySelector('.room-main'));//();
            that.isPullDown = true;
            that.toData = {
              limit: 20,
              messageId: that.messageIds,
              userId: that.userId,
              range: that.range,
              token: that.token
            }
            that.GetRoomMsg();
            movey = 0;
          }
        })
      },
      laodPcMsg: function () {
        var that = this;
        this.$refs.scrollWraper.addEventListener('scroll', function () {
          if (this.scrollTop == 0) {
            that.loadPcShow = true;
            that.isPullDown = true;
            that.toData = {
              limit: 20,
              messageId: that.messageIds,
              userId: that.userId,
              range: that.range,
              token: that.token
            }
            that.GetRoomMsg();
          }
        })
      },
      back() {
        this.$router.back();
        this.IO.emit('leaveroomevent');
      },
      scrollTo() {
        var that = this;
        setTimeout(function () {
          var mainH = that.$refs.scrollWraper.clientHeight;
          var innerH = that.$refs.roomMain.clientHeight;
          var scrollH = innerH - mainH;
          that.$refs.scrollWraper.scrollTop = scrollH;
        }, 20)

      },
      showMeaage: function (msg) {
        layer.open({
          content: msg,
          time: 2,
          skin: 'msg',
          anim: 'scale'
        });
      },
      setPrice: function (data) {
        if (data.periodList != undefined) {
          if (data.roomPrice == 0 && data.periodList.length <= 0) {
            return '免费';
          } else if (data.roomPrice != 0 && data.periodList.length >= 0) {
            return data.roomPrice + '精彩币 ' + this.returnPackage(data.periodList);
          } else if (data.roomPrice != 0 && data.periodList.length <= 0) {
            return data.roomPrice + '精彩币';
          } else {
            return this.returnPackage(data.periodList);
          }
        } else {
          return data.roomPrice == 0 ? '免费' : data.roomPrice + '精彩币';
        }
      },
      goPayAward() {
        if (this.awardNum <= 0) {
          return;
        }
        if (this.userMoney < this.awardNum) {
          this.showMeaage('您的精彩币余额不足，请充值！')
          return;
        }
        this.awardShow = false;
        var that = this;
        var awardListData = {
          msg: '您将打赏老师' + that.awardNum + '精彩币！',
          btn: ['确认', '取消'],
          trueCallback: succFn,
          falseCallback: eorFn
        };
        DialogZ.init(awardListData);

        function succFn() {
          that.custmorJsonp(
            Common.baseURI().host + '/Purchase/PurchaseChatRoom/PlayReward',
            {
              Language: 'M',
              UserId: that.shareFn.getUserId(),
              RoomId: that.roomId,
              SecurityCode: that.token,
              GoldCoin: that.awardNum,
              sign: new Date().getTime()
            }, function (res) {
              if (res.data.Code == '0000') {
                that.userMoney = that.userMoney - that.awardNum;
              } else {
                layerDilog('打赏不成功，请重试！');
                DialogZ.remoDom();
              }
            }, function (err) {
              console.log(err)
            }
          );
          DialogZ.remoDom();
          that.showMeaage('打赏成功！');
        }

        function eorFn() {
        }
      },
      goAward() {
        if (this.shareFn.isLogin()) {
          this.awardShow = true;
        }
      },
      awardHide() {
        this.awardShow = false;
      },
      visitorFn() {
        if (!this.shareFn.isLogin() && !inXCX) {
          this.$router.push('enter')
        }
      },
      preview(e) {
        this.$refs.previewImg.show(e.target.src)
      },
      newMsgClick() {
        this.newMsg = false;
        this.scrollTo();
      },
      custmorJsonp(url, data, sucFn, eorFn) {
        this.$nextTick(function () {
          this.$http.jsonp(
            url,
            {
              params: data
            }
          ).then(function (res) {
            sucFn(res)
          }, function (err) {
            eorFn(err)
          })
        });
      },
      custmorPost(payType, ID) {
        this.$http.post(
          Common.baseURI().host + "/dlb/tradepay",
          {
            "Language": "M",
            "UserId": this.userId,
            "CommodityId": ID,
            "SecurityCode": this.token,
            "CommodityType": payType,
            "source": "1_2_7"
          }, {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        ).then(function (res) {
          if (res.data.Code == '0000') {
            var resultStr = res.data.DLBPara;
            this.config = {
              value: resultStr,
              filter: '#FFFFFF',
              fillType: '',
              background: '#fff',
              imagePath: require('../../common/img/jcslog.png')
            }
            this.wxDialog = true;
          } else if (res.data.Code == 3008) {
            alert("您已经购买过了");
          } else if (res.data.Code == '2006' || res.data.Code == '2005') {
            layer.open({
              content: '<p style="text-align:center;">您已在其他设备登录，确定要重新登录吗？</p >',
              btn: ['确定', '取消'],
              shadeClose: null,
              yes: function (index) {
                $('#PayInit').hide();
                layer.close(index);
                needLogin();
                $.removeCookie('NikeName');
              }
            });
          }
        }, function (err) {
          console.log(err)
        })
      },
      chatClosed() {
        if (this.chatClosedStatus) {
          alert('直播间休息啦，您也快快休息吧！')
          this.showMeaage('直播间休息啦，您也快快休息吧！')
        }
      },
      guessSuccess () {

      }
    },
    watch: {
      msgData: {
        handler: function () {
          var that = this;

        },
        deep: true
      },
      dialogData: {
        handler: function () {

        },
        deep: true
      },
      $route: {
        handler: function (old, news) {
          if (this.$route.name == 'roomlist') {
            this.IO.emit('leaveroomevent');
          }
        }
      }
    },
    components: {
      mainHeader, payDialog, previewImg, VueQArt, guessItem, guessDialog
    }
  }
</script>

<style lang="less" type="text/less">
  @import '../../common/less/base.less';

  * {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }

  @media screen and (min-width: 450px) {
    .roomindex {
      max-height: 90%;
    }
  }

  .roomindex {
    background: @backcolor;
    color: @maincolor;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 90;
    font-size: 0.14rem;

    .main-header {
      .r_ele {
        font-size: 0.12rem;
        color: #444444;
      }

      p {
        width: 60%;
        margin-left: 50px;
        height: 100%;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding-left: 10px;
      }
    }

    .room-main {
      float: left;
      width: 100%;
      min-height: 100%;
    }

    .room-nav {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: @whites;

      .selector {
        width: 100%;
        line-height: 40px;
        font-size: 0.13rem;
        height: 40px;
        overflow: hidden;
        user-select: none;
      }

      .selector-open {
        height: 132px;
        overflow: auto;
      }

      .selector li {
        height: 40px;
        width: 20%;
        border-bottom: 1px solid @bordercolor;
        float: left;
        text-align: center;
      }

      .selector .on {
        color: @reds;
      }

      .selector .on span {
        border-color: #ffd842;
        color: #ffd842;
      }

      .people {
        display: inline-block;
        font-size: 0.14rem;
        color: #d2d2d2;
      }

      .people:before {
        content: "";
        width: 21px;
        height: 18px;
        background: url("../../common/img/pp.png") no-repeat left center;
        background-size: 18px 14px;
        padding-left: 25px;
      }

    }

    .msg-list {
      width: 100%;
      position: absolute;
      left: 0;
      top: 84px;
      right: 0;
      bottom: 52px;
      padding: 0 15px;
      overflow: scroll;

      section {
        width: 100%;
        float: left;
        margin-top: 15px;
        font-size: 0.15rem;
        user-select: none;

        .pic {
          float: left;
          width: 15%;
          padding-top: 5px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .tim {
          color: #b1b1b1;
          font-size: 0.13rem;
          margin-bottom: 5px;
        }

        .msg {
          float: left;
          width: 80%;
        }

        .dialog {
          width: auto;
          background: @whites;
          color: @maincolor;
          padding: 12px;
          border-radius: 10px;
          position: relative;
          float: left;
          word-wrap: break-word;
          word-break: break-all;
          white-space: pre-wrap;
          margin-left: 10px;

          .lock-pic {
            position: absolute;
            right: 0;
            top: 0;
            width: 28px;
          }
        }

        &.te_left {
          .dialog {
            width: auto;
            background: @shallowred;
            color: @whites;
            padding: 12px;
            border-radius: 10px;
            position: relative;
            float: left;
            word-wrap: break-word;
            word-break: break-all;
            white-space: pre-wrap;

            &:before {
              border-left-color: @shallowred;
            }
          }

          .dialog-close {
            background: @shalloworange;
            line-height: 30px;
            font-size: 0;

            .close-lock {
              width: 30px;
              height: 30px;
              background: #f55a3f url(../../common/img/roomlock.png) no-repeat center center;
              border-radius: 50%;
              display: inline-block;
              background-size: 100%;
              float: left;
            }

            &:before {
              border-left-color: @shalloworange;
            }

            p {
              line-height: 30px;
              display: inline-block;
              color: #fff;
              font-size: 0.15rem;
              float: left;
              padding-left: 10px;
            }
          }

          .imgdialog {
            padding: 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;

            img {
              width: 100px;
              height: auto;
              min-height: 100px;
              float: left;
            }
          }
        }

        .imgdialog {
          padding: 5px;

          img {
            width: 100px;
            height: auto;
            min-height: 100px;
          }
        }

        .dialog:before {
          content: "";
          position: absolute;
          left: -5px;
          top: 0px;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-left-color: @whites;
          transform: rotate(-45deg);
        }

        .rpic {
          float: right;
          width: 15%;
          text-align: right;
          padding-top: 5px;
        }

        .rtim {
          text-align: right;
          color: #999;
          font-size: 0.13rem;
          margin-bottom: 5px;
        }

        .rpic img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        @media screen and (min-width: 450px) {
          .rpic, .pic {
            width: 50px;
          }
        }

        .rmsg {
          float: right;
          width: 80%;
        }

        .rdialog {
          float: right;
          background: @whites;
          color: #000;
          padding: 12px;
          border-radius: 10px;
          position: relative;
          word-wrap: break-word;
          word-break: break-all;
          white-space: pre-wrap;
          margin-right: 10px;
        }

        .rdialog:before {
          content: "";
          position: absolute;
          right: -5px;
          top: 0px;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-right-color: @whites;
          transform: rotate(45deg);
        }
      }

      .award-section {
        height: 24px;
        line-height: 24px;
        color: @maincolor;
        font-size: 13px;
        position: relative;
        margin: 20px 0;
      }

      .award-section span {
        background: @whites url("../../common/img/g.png") no-repeat;
        background-size: 17px 16px;
        background-position: 10px 4px;
        border-radius: 12px;
        position: absolute;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        padding: 0 10px 0 37px;
        word-break: keep-all;
        white-space: nowrap;
      }

      .award-section i {
        color: #f97757;
        font-style: normal;
      }
    }

    .inwxxcx {
      top: 40px;
    }

    .newmsg_in {
      background: @reds;
      height: 30px;
      line-height: 30px;
      position: absolute;
      right: 0;
      bottom: 65px;
      color: #fff;
      border-radius: 15px 0 0 15px;
      padding: 0 8px 0 20px;
      font-size: 14px;
      z-index: 9;
    }

    .newmsg_in:after {
      content: "";
      position: absolute;
      left: 8px;
      top: 9px;
      width: 8px;
      height: 12px;
      background: url('../../common/img/n.png') no-repeat;
      background-size: cover;
    }

    .room-foot {
      height: 50px;
      width: 100%;
      border-top: 1px solid @bordercolor;
      display: flex;
      align-items: center;
      background: #f8f8f8;
      justify-content: space-around;
      position: absolute;
      left: 0;
      bottom: 0;
      padding-right: 15px;
      z-index: 99;
      p {
        flex-grow: 1;
        height: 100%;
        border-radius: 17px;
        border: 1px solid @bordercolor;
        overflow: hidden;
        height: 31px;
        display: flex;

        input {
          outline: none;
          border: none;
          flex-grow: 1;
          height: 100%;
          padding-left: 8px;
          font-size: 0.14rem;
        }

        ::-webkit-input-placeholder { /* WebKit browsers */
          font-size: 14px;
          color: #999999;
        }

        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          font-size: 14px;
          color: #999999;
        }

        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          font-size: 14px;
          color: #999999;
        }

        :-ms-input-placeholder { /* Internet Explorer 10+ */
          font-size: 14px;
          color: #999999;
        }

        button {
          height: 29px;
          width: 64px;
          border: none;
          outline: none;
          background: @reds;
          color: @whites;
          text-align: center;
          line-height: 29px;
          font-size: 0.15rem;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
          border-radius: 15px;
        }
      }

      .goaward {
        font-size: 9px;
        color: @reds;
        display: inline-block;
        text-align: center;
        padding: 0 12px;
      }

      .goaward dt {
        font-size: 0;
      }

      .goaward img {
        width: 19px;
      }
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .custmor-pullDown {
    width: 100%;
    background: @backcolor;
    text-align: center;
    height: 45px;
    line-height: 30px;
  }

  .rotate {
    animation: 1s rotate linear infinite;
    width: 20px;
    opacity: 0.7;
    margin-top: 8px;
  }

  @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .award-mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 888;
    display: block;
  }

  .award-dialog {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: @whites;
    text-align: center;
    -webkit-border-radius: 15px 15px 0 0;
    -moz-border-radius: 15px 15px 0 0;
    border-radius: 15px 15px 0 0;
  }

  .award-hide {
    background: url("../../common/img/g-close.png") no-repeat center;
    -webkit-background-size: 18px;
    background-size: 18px;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 9px;
    top: 9px;
  }

  .award-hd {
    background: @backcolor;
    position: relative;
    -webkit-border-radius: 15px 15px 0 0;
    -moz-border-radius: 15px 15px 0 0;
    border-radius: 15px 15px 0 0;
  }

  .award-tit {
    font-size: 0.15rem;
    color: @maincolor;
    padding-bottom: 25px;
  }

  .award-hd img {
    width: 79px;
    margin-top: -20px;
  }

  .awardgary {
    opacity: 0.3;
  }

  .award-num {
    margin-top: 15px;
  }

  .award-num p {
    width: 205px;
    margin: 0 auto;
    position: relative;
  }

  .award-num p:after {
    height: 1px;
    content: '';
    border-top: 1px solid @bordercolor;
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 10;
  }

  .award-num input {
    line-height: 45px;
    width: 205px;
    border: none;
    text-align: center;
    outline: none;
    color: #ddd;
    font-size: 0.15rem;
    background: transparent;
    color: @maincolor;
    font-size: 0.25rem;
  }

  .award-num input::-webkit-input-placeholder { /* WebKit browsers */
    color: #b1b1b1;
    font-size: 0.15rem;
  }

  .award-num input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #b1b1b1;
    font-size: 0.15rem;
  }

  .award-num input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #b1b1b1;
    font-size: 0.15rem;
  }

  .award-num input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #b1b1b1;
    font-size: 0.15rem;
  }

  .award-btn {
    width: 100%;
    margin-top: 30px;
  }

  .award-btn button {
    width: 241px;
    height: 40px;
    list-height: 40px;
    background: @reds;
    font-size: 0.16rem;
    outline: none;
    border: none;
    color: @whites;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
  }

  .award-balance {
    font-size: 0.1rem;
    margin: 10px 0 30px 0;
  }

  .wx_dialog {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999999;

    .mask-wx {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.3);
      color: @maincolor;
      font-size: 0.15rem;
      z-index: 111;

      .dialog-wx {
        width: 80%;
        position: absolute;
        left: 10%;
        top: 50%;
        transform: translateY(-50%);
        background: @whites;
        border-radius: 20px;
        text-align: center;
        overflow: hidden;

        .wxGo {
          width: 90%;
          height: 45px;
          margin: 0;
          display: inline-block;
          background: #1aad19;
          color: @whites;
          line-height: 45px;
          text-align: center;
          border-radius: 3px;
          font-size: 0.16rem;
        }

        .titles {
          height: 70px;
          width: 100%;
          background: @backcolor;
          line-height: 70px;
          color: @maincolor;
          font-size: @titsize;

          p {
            display: inline-block;
            background-image: url('../../common/img/wp.png');
            background-position: left center;
            background-size: 27px auto;
            background-repeat: no-repeat;
            padding-left: 35px;
          }
        }

        .main {
          padding: 15px;

          .name {
            font-size: 0.14rem;
            color: #999999;
          }

          .pay_price {
            font-size: 0.3rem;
            color: @maincolor;
            line-height: 45px;
            height: 45px;
          }
        }

        a {
          color: #999;
          text-decoration: none;
          font-size: 0.14rem;
          display: block;
          line-height: 1;
          margin: 15px 0 20px 0;
        }
      }

    }
  }
  .load_pc {
    text-align: center;
    font-size: 0.12rem;
    line-height: 30px;
    color: @assistcolor;
  }
</style>
