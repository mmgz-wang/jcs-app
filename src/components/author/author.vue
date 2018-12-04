<template>
	<div class="author">
		<div class="ht-back" v-show="!inXCX">
			<span class="back" @click="back()"></span>
			<p>{{authorName}}</p>
		</div>
		<div class="author-tab hd_next_tab" :class="{wxtab:inXCX}" v-show="tabShow">
			<span @click="tabClick('art')" :class="{auton:isart == 1}">文章</span>
			<span @click="tabClick('room')"  :class="{auton:isart == 2}">聊天室</span>
			<span @click="tabClick('msg')"  :class="{auton:isart==3}">精彩留言</span>
		</div>
		<scroll class="outerscroll" ref="scroll"
		:scrollIng="scrollIng"
		:data="scrollData">
			<div>
				<div class="infor-wrap-art">
					<div class="author-infor" v-bind:style="objStyle">
						<div class="scale"></div>
					</div>
					<div class="b-box">
						<dl>
							<dt><img :src="authorInfor.picurl"></dt>
							<dd>
								<h3 name>{{authorInfor.nickname}}</h3>
								<p fans>粉丝: {{authorInfor.follownum}} <i>|</i> 文章: {{authorInfor.allaticlenum}}</p>
								<p brief>简介: {{authorInfor.brief}}</p>
								<p class="brief-open"></p>
							</dd>
						</dl>
					</div>
				</div>
				<div class="author-tab">
					<span @click="tabClick('art')" :class="{auton:isart == 1}">文章</span>
					<span @click="tabClick('room')"  :class="{auton:isart == 2}">聊天室</span>
					<span @click="tabClick('msg')"  :class="{auton:isart == 3}">精彩留言</span>
				</div>
				<div class="aut_tab_wrap" :class="{artActive:isart == 1,roomActive:isart == 2,msgActive:isart == 3}">
					<div class="aut_art_list_wrap">
						<div class="listcon"
						@click.stop="goarticle(item.id)"
						:id="item.id"
						v-for="item in articleList">
							<div class="l_tim">
								<span class="hour">{{setTime(item.last_modified).split(' ')[1]}}</span><br>
								<span class="date">{{setTime(item.last_modified).split(' ')[0]}}</span>
							</div>
							<div class="r_txt">
								<div class="txtbox">
									<span class="txt" v-if="item.tabView" v-html="tabView(item)"></span>
									<span class="aut-list-digest"><i class="vip" v-if="item.tabView == undefined && item.chargeable">VIP</i>{{item.digest}}</span>
								</div>
								<div v-if="item.matches != undefined && item.matches.length" class="match" @click.stop="gomatch(469732)">
									{{item.matches[0].cup_name}}
									{{item.matches[0].home_team}} VS {{item.matches[0].away_team}}
									{{setTime(item.matches[0].start_time)}}
								</div>
							</div>
						</div>
					</div>
					<div class="aut_room_list_wrap">
						<dl class="no_main" v-if="autRoomList.length<=0">
							<dt><img src="../../common/img/nofeedback.png" alt=""></dt>
							<dd>
								<p>暂无直播内容</p>
							</dd>
						</dl>
						<div class="aut-room-list" v-for="item in autRoomList" :id="item.roomId" @click="gooRoom(item)">

							<div infoinner>
								<div class="msg">
									<p class="master">主播: {{item.lecturerName}}</p>
									<p class="roompic">门票: <span :class="{on:item.roomStatus==2 || item.roomStatus==1}" v-html="setPrice(item)"></span></p>
									<p class="time">直播时间:&nbsp;&nbsp; {{formatTime(item.startTime)}} ——  {{formatTime(item.startTime, item.endTime)}}</p>
									<span
									v-if="item.roomStatus == '1'"
									@click.stop="setMsg($event);"
									:roomId = "item.roomId"
									:class="{gary:item.isRoomDscriber}"
									class="setmsg">{{item.isRoomDscriber?'关闭通知':'开启通知'}}</span>
								</div>
								<div class="explain">
									<h4>{{item.roomName}}<i v-html="setRoomStatus(item.roomStatus)"></i></h4>
									<p> {{item.roomMemo}}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="aut_msg_list_wrap">
						<dl class="no_main" v-if="FeedbackList.length<=0">
							<dt><img src="../../common/img/nofeedback.png" alt=""></dt>
							<dd>
								<p>暂无留言内容</p>
							</dd>
						</dl>
						<div class="list" v-for="item in FeedbackList">
							<div class="content">{{item.comment}}</div>
							<div class="reply">
								<div class="re-content" @click="goarticle(item.targetId)">
									{{item.articleDigest}}
								</div>
								<p class="feed-tim">{{item.commentDate.substr(5,11)}}</p>
							</div>
							<dl class="feedback-item">
								<dt>
									<img v-if="item.userPic != '' && item.userPic != 'null'" :src="item.userPic" alt="">
									<img v-else src="../../common/img/uyse.png" alt="">
								</dt>
								<dd>
									<div class="star">
										<p v-if="item.userName != 'null' && item.userName != ''" class="nickname_art">{{item.userName}}</p>
										<p v-if="item.userName == 'null' || item.userName == ''" class="nickname_art">{{item.userId}}</p>
										<span v-for="items in stars" :key="items"
											:class="{on: items<=item.score}"></span>
									</div>
									<p class="feed-tim">{{item.commentDate.substr(5,11)}}</p>
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
		</scroll>
		<div class="aut-foot">
			<div>
				<span class="aut-add-follow"
				:class="{auton:authorFollowed=='false'}"
				@click="goFollow(authorFollowed)">{{followStr}}</span>
			</div>
			<div>
				<span class="aut-letter" @click="goLetter()">发私信</span>
			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Common from "common/js/common";
export default {
  data() {
    return {
      articleList: [],
      autRoomList: [],
      authorInfor: [],
      scrollData: [],
      isart: 1,
      show: false,
      url: Common.baseURI().host + "/Author/GetAuhorInfo",
      start_articleid: 0,
      authorFollowed: "false",
      objStyle: null,
      isFirstEnter: false,
      loding: null,
      authorId: "",
      authorName: "",
      followStr: "加关注",
      tabShow: false,
      fdId: "",
      FeedbackList: [],
      stars: ["1", "2", "3", "4", "5"],
      userId: this.shareFn.getUserId(),
      token: this.shareFn.getSecurityCode(),
      wxLogin: false,
      inXCX: false
    };
  },
  created() {
    var that = this;
    this.isFirstEnter = true;
    this.$nextTick(function() {
      var touchWrap = document.querySelector(".aut_tab_wrap");
      touchWrap.addEventListener("transitionend", function() {
        var artH = document.querySelector(".aut_art_list_wrap").offsetHeight,
          roomH = document.querySelector(".aut_room_list_wrap").offsetHeight;
        artH == 0 ? (artH = 50) : artH;
        roomH == 0 ? (roomH = 50) : roomH;
        if (that.show) {
          if (artH > roomH) {
            touchWrap.style.height = roomH + "px";
          } else {
            touchWrap.style.height = artH + "px";
          }
        } else {
          touchWrap.style.height = artH + "px";
        }
        that.$refs.scroll.refresh();
      });
    });
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "home") {
      to.meta.isback = false;
    } else if (from.name == "articledetail") {
      to.meta.isback = true;
    } else if (from.name == "roomindex") {
      to.meta.isback = true;
    }
    next();
  },
  activated() {
    if(window.__wxjs_environment === 'miniprogram'){
      this.inXCX = true
      if(this.$router.currentRoute.query.userId == '' || this.$router.currentRoute.query.userId == undefined 
      || this.$router.currentRoute.query.code == '' || this.$router.currentRoute.query.code == undefined){
        this.wxLogin = false
      }else{
        this.wxLogin = true
      }
      this.userId = this.$router.currentRoute.query.userId
      this.token = this.shareFn.wxGetUserT(this.userId,this.$router.currentRoute.query.code)
    }
    if (!this.$route.meta.isback || this.isFirstEnter) {
      this.loding = layer.open({
        type: 2,
        content: "加载中"
      });
      this.url = Common.baseURI().host + "/Author/GetAuhorInfo";
      this.isart = 1;
      this.$refs.scroll.scrollTo(0, 0, 0);
      this.getData(this.url, {
        language: "M",
        userId: this.userId,
        token: this.token,
        authorId: this.$router.currentRoute.query.id,
        articleId: this.start_articleid
      });
    }
    this.isFirstEnter = false;
    this.$route.meta.isback = false;
  },
  deactivated() {
    //console.log("我是第export个页面的 deactivated 方法");
  },
  methods: {
    scrollIng(opt) {
      var header = document.querySelector(".ht-back");
      var tab = document.querySelector(".author-tab");
      if (Math.abs(opt.y) <= 0.1) {
        header.className = "ht-back";
        header.style.opacity = 1;
      } else if (Math.abs(opt.y) > 0) {
        header.className = "ht-back ht-on";
        header.style.opacity = Math.abs(opt.y / 10) * 0.3;
      }
      if (Math.abs(opt.y) >= 220 && this.inXCX) {
        this.tabShow = true
      } else if (Math.abs(opt.y) >= 180 && !this.inXCX) {
        this.tabShow = true
      } else if (Math.abs(opt.y) <= 180) {
        this.tabShow = false
      }
    },
    tabClick(s) {
      if (s == "art") {
        this.url = Common.baseURI().host + "/Author/GetAuhorInfo";
        this.isart = 1;
        this.show = false;
        if (this.articleList.length > 0) {
          return;
        }
        this.getData(this.url, {
          language: "M",
          userId: this.userId,
          token: this.token,
          authorId: this.$router.currentRoute.query.id,
          articleId: this.start_articleid
        });
        this.scrollData = this.articleList;
      } else if (s == "room") {
        this.url = Common.baseURI().roomMsgurls + "/Room/GetRoomList";
        this.isart = 2;
        this.show = true;
        if (this.autRoomList.length > 0) {
          return;
        }
        this.getData(this.url, {
          language: "M",
          userId: this.userId,
          token: this.token,
          authorId: this.$router.currentRoute.query.id,
          articleId: this.start_articleid
        });
        this.scrollData = this.autRoomList;
      } else {
        this.url = Common.baseURI().host + "/Author/Feedback";
        this.isart = 3;
        this.getData(this.url, {
          language: "M",
          authorId: this.$router.currentRoute.query.id,
          fdId: this.fdId
        });
      }
      this.$nextTick(function() {
        //this.$refs.scroll.scrollTo(0,0,0);
        this.$refs.scroll.refresh();
      });
      console.log(this.show);
    },
    getData(url, data) {
      let that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(url, {
            params: data
          })
          .then(function(res) {
            console.log(res.data);
            if (this.url.indexOf("GetRoomList") > 0) {
              this.autRoomList = res.data;
              this.scrollData = this.autRoomList;
            } else if (this.url.indexOf("GetAuhorInfo") > 0) {
              this.authorInfor = res.data.Author;
              this.articleList = res.data.Articles;
              this.authorId = this.authorInfor.id;
              this.authorFollowed = this.authorInfor.authorFollowed;
              this.authorName = this.authorInfor.nickname;
              this.authorInfor.authorFollowed == "true"
                ? (this.followStr = "已关注")
                : (this.followStr = "加关注");
              this.scrollData = this.articleList;
              if(that.inXCX){
                document.getElementsByTagName("title")[0].innerText = this.authorName
              }
            } else if (this.url.indexOf("Feedback") > 0) {
              this.FeedbackList = res.data.data;
              this.scrollData = this.FeedbackList;
            }
            layer.close(this.loding);
          });
      });
    },
    setTime(s) {
      return this.shareFn.setTime(s);
    },
    setRoomStatus: function(s) {
      var statues = {
        "2": '<span class="ing">直播中</span>',
        "1": "<span>未开播</span>",
        "3": '<span class="finish">已结束</span>'
      };
      return statues[s];
    },
    setOnHeigh: function(s) {
      return s == "2" ? "on-tit" : "";
    },
    setPrice: function(data) {
      if (data.periodList != undefined) {
        if (data.roomPrice == 0 && data.periodList.length <= 0) {
          return "免费";
        } else if (data.roomPrice != 0 && data.periodList.length >= 0) {
          return (
            data.roomPrice + "精彩币 " + this.returnPackage(data.periodList)
          );
        } else if (data.roomPrice != 0 && data.periodList.length <= 0) {
          return data.roomPrice + "精彩币";
        } else {
          return this.returnPackage(data.periodList);
        }
      } else {
        return data.roomPrice == 0 ? "免费" : data.roomPrice + "精彩币";
      }
    },
    tabView(item) {
      var str = "";
      if (!item.tabView) {
        return "";
      }
      if (item.chargeable) {
        str += '<i class="vip">VIP</i>' + item.tabView;
        if (item.singleUnlock && item.price > 0) {
          str += '<span class="list-Price">' + item.price + "精彩币</span>";
        } else if (!item.singleUnlock) {
          str += '<span class="list-Price">(VIP用户专享)</span>';
        }
        return str;
      } else {
        return item.tabView;
      }
    },
    formatTime: function(t1, t2) {
      var str = "";
      var star = new Date(arguments[0].replace(/-/g, "/")),
        starYear = star.getFullYear(),
        starMonth = star.getMonth() + 1,
        starDay = star.getDate(),
        starHour = star.getHours(),
        starMinute = star.getMinutes();
      starMonth < 9 ? (starMonth = "0" + starMonth) : starMonth;
      starDay < 9 ? (starDay = "0" + starDay) : starDay;
      starHour < 9 ? (starHour = "0" + starHour) : starHour;
      starMinute < 9 ? (starMinute = "0" + starMinute) : starMinute;
      if (arguments.length > 1) {
        var ends = new Date(arguments[1].replace(/-/g, "/")),
          endsYear = ends.getFullYear(),
          endsMonth = ends.getMonth() + 1,
          endsDay = ends.getDate(),
          endsHour = ends.getHours(),
          endsMinute = ends.getMinutes();
        endsMonth < 9 ? (endsMonth = "0" + endsMonth) : endsMonth;
        endsDay < 9 ? (endsDay = "0" + endsDay) : endsDay;
        endsHour < 9 ? (endsHour = "0" + endsHour) : endsHour;
        endsMinute < 9 ? (endsMinute = "0" + endsMinute) : endsMinute;
        if (starDay < endsDay) {
          return endsMonth + "-" + endsDay + " " + endsHour + ":" + endsMinute;
        } else {
          return endsHour + ":" + endsMinute;
        }
      } else {
        return starMonth + "-" + starDay + " " + starHour + ":" + starMinute;
      }
    },
    setMsg: function(e) {
      console.log(e.target.className);
      var setmsgBtn = e.target;
      if (this.shareFn.isLogin()) {
        var roomId = setmsgBtn.attributes["roomId"].nodeValue;
        console.log(roomId);
        if (setmsgBtn.className.indexOf("gary") > -1) {
          setmsgBtn.className = "setmsg";
          this.$http
            .jsonp("https://chat.jingcaishuo.com/Room/CancleSubscribeRoom", {
              params: {
                language: "M",
                userId: this.shareFn.getUserId(),
                roomId: roomId
              }
            })
            .then(function(res) {
              setmsgBtn.innerHTML = "开启通知";
            });
        } else {
          setmsgBtn.className = "setmsg gary";
          this.$http
            .jsonp("https://chat.jingcaishuo.com/Room/SubscribeRoom", {
              params: {
                language: "M",
                userId: this.shareFn.getUserId(),
                roomId: roomId
              }
            })
            .then(function(res) {
              setmsgBtn.innerHTML = "关闭通知";
            });
        }
      } else {
        app.pushLoginView();
      }
    },
    setMsgText: function(s) {
      if (s) {
        return "关闭通知";
      } else {
        return "开启通知";
      }
    },
    returnPackage: function(v) {
      var packageArr = {
        "1": " 可包月",
        "3": " 可包季",
        "6": " 可包半年",
        "12": " 可包年"
      };
      var str = "";
      v.forEach(function(v, i) {
        str += packageArr[v.termmonths];
      });
      return str;
    },
    goarticle(id) {
      if (this.inXCX) {
        wx.miniProgram.navigateTo({url: '/pages/art/art?id=' + id})
      } else {
        this.$router.push({
          path: `/articledetail/?id=${id}`,
          props: {id: id}
        })
      }
    },
    gooRoom: function(item) {
      if (this.inXCX) {
        let url = ''
        if (this.wxLogin) {
          url = `/pages/chartroom/chartroom?roomId=${item.roomId}&lecturerName=${encodeURI(
              item.lecturerName)}&roomName=${encodeURI(item.roomName)}&roomPrice=${
                encodeURI(item.roomPrice)}&startTime=${item.startTime}`
                wx.miniProgram.navigateTo({url: url})
        } else {
          url = `/pages/settings/log-in/log-in`
          layer.open({
            content: '<p style="text-align:center;">您还没有登录，请登录。</p >',
            btn: ['去登录','取消'],
            shadeClose:null,
            yes: function (index) {
              wx.miniProgram.redirectTo({url: url})
              layer.close(index)
            }
          });
        }
      } else if (!this.inXCX) {
        if (this.shareFn.isLogin()) {
          this.$router.push({
            path: `/roomindex?roomId=${item.roomId}&lecturerName=${encodeURI(
              item.lecturerName
            )}&roomName=${encodeURI(item.roomName)}&roomPrice=${encodeURI(
              item.roomPrice
            )}&startTime=${item.startTime}`
          });
        } else {
          this.$router.push({ name: "enter" });
        }
      }
      
    },
    goFollow(s) {
      var that = this;
      if (!this.shareFn.isLogin()) {
        this.bunceIn("您还没有登录！");
      } else {
        if (s == "false") {
          //关注
          follow("add");
        } else {
          //未关注
          follow("cancel");
        }
      }
      function follow(flag) {
        console.log(flag);
        that.$nextTick(function() {
          that.$http
            .jsonp(Common.baseURI().host + "/follow/" + flag, {
              params: {
                language: "M",
                analystId: that.authorId,
                userId: this.shareFn.getUserId(),
                securityCode: this.shareFn.getSecurityCode()
              }
            })
            .then(function(res) {
              console.log(res.data);
              showFollow();
            });
        });
      }
      function showFollow() {
        if (that.authorFollowed == "true") {
          that.authorFollowed = "false";
          that.followStr = "加关注";
          that.bunceIn("取消成功");
        } else {
          that.authorFollowed = "true";
          that.followStr = "已关注";
          that.bunceIn("关注成功");
        }
      }
      //return false;
    },
    goLetter() {
      if (!this.shareFn.isLogin()) {
        this.bunceIn("您还没有登录！");
        return;
      }
      this.$router.push({
        path: `/letterindex?id=${this.authorId}&name=${encodeURI(
          this.authorName
        )}`
      });
    },
    bunceIn(s) {
      layer.open({
        content: s,
        time: 2,
        skin: "msg"
      });
    },
    back() {
      this.$router.back();
    }
  },
  components: {
    Scroll
  },
  watch: {
    articleList: {
      handler: function(val, oldval) {
        console.log("change");
        this.objStyle = {
          backgroundImage: `url(${this.authorInfor.picurl})`
        };
      }
    }
  }
};
</script>
<style type="text/css" lang="less">
@import "../../common/less/base.less";
.author {
  .outerscroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  width: 100%;
  height: 100%;
  background: @backcolor;
  .ht-back {
    width: 100%;
    height: 44px;
    background: url("../../common/img/hd_back.png") no-repeat center;
    background-size: 100% 44px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999999;
    font-size: @titsize;
    color: transparent;
    text-align: center;
    line-height: 44px;
    .back {
      width: 50px;
      height: 44px;
      position: absolute;
      left: 0px;
      background: url("../../common/img/wback.png") no-repeat center;
      color: transparent;
      background-size: 11px auto;
      z-index: 999;
      background-position: 15px center;
    }
  }
  .ht-on {
    background: @mainheadercolor;
    font-size: @titsize;
    color: @maincolor;
    opacity: 0.3;
    .back {
      width: 50px;
      height: 44px;
      position: absolute;
      left: 0px;
      background: url("../../common/img/deepback.png") no-repeat center;
      color: transparent;
      background-size: 11px 20px;
      z-index: 999;
      background-position: 15px center;
    }
  }
  .infor-wrap-art {
    box-sizing: border-box;
    width: 110%;
    height: auto;
    position: relative;
    margin-left: -5%;
    .author-infor {
      height: 125px;
      width: 100%;
      filter: blur(2px);
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center -100px;
      overflow: hidden;
      position: relative;
      .scale {
        width: 110%;
        height: 50%;
        border-radius: 50%;
        background: @whites;
        position: absolute;
        top: 75%;
        left: -5%;
      }
    }
    .b-box {
      width: 100%;
      height: auto;
      background: transparent;
      position: relative;
      z-index: 33;
      dl {
        width: 100%;
        text-align: center;
        font-size: @assistsize;
        dt {
          width: 100%;
          height: 73px;
          margin-top: -80px;
          img {
            width: 73px;
            border-radius: 50%;
            border: 1px solid @whites;
            padding: 0;
          }
        }
        dd {
          padding: 0 30px;
          clear: both;
          padding-top: 10px;
          color: @garycolor;
          background: @whites;
          h3 {
            color: @maincolor;
            font-weight: 400;
            font-size: 0.17rem;
          }
          p[brief] {
            width: 100%;
            text-align: left;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .brief-open {
            height: 16px;
            background: url("../../common/img/open-t.png") no-repeat center;
            background-size: 13px 6px;
          }
          p[fans] {
            margin: 5px 0;
          }
        }
      }
    }
  }
  .author-tab {
    width: 100%;
    height: 40px;
    background: @whites;
    border-bottom: 1px solid @bordercolor;
    display: flex;
    justify-content: space-around;
    line-height: 40px;
    text-align: center;
    margin-top: 10px;
    span {
      width: 25%;
      font-size: @mainsize;
      border-bottom: 3px solid transparent;
    }
    .auton {
      color: @reds;
      border-color: @reds;
    }
  }
  .hd_next_tab {
    position: absolute;
    left: 0;
    top: 44px;
    margin: 0;
    z-index: 66666;
  }
  .wxtab{
    top: 0;
  }
  .aut_tab_wrap {
    width: 300%;
    height: auto;
    .aut_art_list_wrap {
      width: 33.33333%;
      height: auto;
      padding-bottom: 48px;
      .listcon {
        width: 100%;
        background: @whites;
        margin-bottom: 10px;
        padding: 15px 0 0px 15px;
        color: @maincolor;
        display: flex;
        font-size: @mainsize;
        .l_tim {
          color: #888;
          width: 15%;
          text-align: right;
          padding-right: 15px;
          .date {
            font-size: @assistsize;
            color: @garycolor;
          }
          .hour {
            color: @namecolor;
            display: inline-block;
            padding-bottom: 7px;
          }
        }
        .r_txt {
          width: 85%;
          padding-right: 4px;
        }
        .txtbox {
          float: left;
          .border-bottom;
          padding-bottom: 15px;
          .aut-list-digest {
            float: left;
            width: 100%;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: @maincolor;
          }
          .txt {
            padding-bottom: 15px;
            display: inline-block;
            font-size: 10px;
            i {
              float: left;
              line-height: 1;
              padding: 1px 5px;
              margin-right: 8px;
              border-radius: 3px;
              font-style: normal;
              color: @reds;
              font-size: 10px;
              border: 1px @reds solid;
            }
            .vip {
              background: @reds;
              color: @whites;
              border-color: @reds;
            }
            .list-Price {
              color: @reds;
            }
          }
        }
        .none {
          border: none;
          padding: 0;
        }
        .match {
          float: left;
          width: 100%;
          font-size: @assistsize;
          color: @blues;
          height: 40px;
          line-height: 40px;
        }
        .titbox span {
          margin: 0 8px 0 0px;
        }
        .titbox span:last-child {
          display: inline-block;
          margin: 0;
        }
        .titbox span:last-child:after {
          content: "";
          width: 0px;
          height: 0px;
          float: right;
          border: 0.05rem solid transparent;
          border-left-color: #8b7a39;
          -webkit-transform: translate3d(6px, 0.03rem, 0);
          -moz-transform: translate3d(6px, 0.03rem, 0);
          -ms-transform: translate3d(6px, 0.03rem, 0);
          -o-transform: translate3d(6px, 0.03rem, 0);
          transform: translate3d(6px, 0.03rem, 0);
        }
        label {
          color: @oranges;
          font-size: @assistsize;
          padding: 0 5px;
        }
        .txtbox .txt .gg {
          padding: 0px;
        }
      }
    }
    .aut_room_list_wrap {
      width: 33.333333%;
      height: auto;
      position: absolute;
      left: 33.333333%;
      top: 0;
      padding-bottom: 48px;
      .aut-room-list {
        display: flex;
        width: 100%;
        background: @whites;
        padding-left: 15px;
        &:last-child {
          div[infoinner] {
            .border-none;
          }
        }
      }
      .msg {
        position: relative;
        width: 100%;
        color: @garycolor;
        line-height: 1;
      }
      .msg p {
        font-size: 0.12rem;
      }
      .roompic {
        padding: 8px 0;
        .on {
          color: @reds;
        }
      }
      h4 {
        color: @maincolor;
        font-weight: normal;
        font-size: 0.15rem;
        vertical-align: center;
      }
      .on-tit {
        color: #ffd842;
      }
      i {
        box-sizing: content-box;
        display: inline-block;
      }
      i span {
        font-size: 0.1rem;
        height: 14px;
        padding: 0 3px;
        line-height: 14px;
        display: inline-block;
        line-height: 14px;
        margin-left: 10px;
        color: @oranges;
        background: #fff2e6;
      }
      i .ing {
        color: @whites;
        background: @reds;
      }
      i .finish {
        color: @whites;
        background: #cecece;
      }
      .master {
        padding: 0px 0;
      }
      .explain {
        padding-top: 15px;
        font-size: 0.12rem;
      }
      .explain p {
        line-height: 0.24rem;
      }
      .setmsg {
        height: 22px;
        text-align: right;
        color: @reds;
        line-height: 22px;
        font-size: 0.12rem;
        padding-right: 10px;
        border: 1px solid @reds;
        border-radius: 10px;
        background: url(../../common/img/timeon.png) no-repeat left center;
        background-size: 14px;
        padding-left: 25px;
        background-position: 6px 3px;
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .gary {
        color: #cecece;
        border-color: #cecece;
        background: url(../../common/img/timegary.png) no-repeat left center;
        background-size: 14px;
        background-position: 6px 3px;
      }
      div[infoinner] {
        width: 100%;
        cursor: pointer;
        .border-bottom;
        height: 100%;
        padding: 20px 15px 20px 0;
      }
      p[noRoom] {
        font-size: @mainsize;
        color: @maincolor;
        text-align: center;
        line-height: 50px;
      }
    }
    .aut_msg_list_wrap {
      width: 33.33333%;
      height: auto;
      min-height: 100%;
      font-size: 15px;
      position: absolute;
      left: 66.666666%;
      top: 0;
      padding-bottom: 48px;
      .list {
        background: #ffffff;
        margin-top: 10px;
        padding: 15px;
      }
      .list:nth-child(1) {
        margin: 0;
      }
      .feedback-item {
        display: flex;
        display: -webkit-flex;
        padding: 0;
        margin-top: 12px;
        font-size: 15px;
        color: #333333;
        &:nth-child(1) {
          margin-top: 0;
        }
        dt {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            border-radius: 15px;
          }
        }
        dd {
          margin-left: 6px;
          flex-grow: 1;
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;
          .nickname_art {
            font-size: 12px;
            color: #999999;
            padding-right: 10px;
          }
          .star {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            span {
              background: url(../../common/img/star.png) no-repeat center;
              width: 11px;
              height: 10px;
              background-size: 11px 10px;
              display: block;
              margin-right: 7px;
            }
          }
          .star .on {
            background: url(../../common/img/staron.png) no-repeat center;
            background-size: 11px 10px;
          }
          .feed-tim {
            font-size: 11px;
            color: #d1d1d1;
          }
        }
      }
      .content {
        padding: 8px 0;
        font-size: 15px;
        color: #333333;
      }
      .reply {
        width: 100%;
        background: #f4f4f4;
        padding: 12px;
        position: relative;
        margin-top: 10px;
        &::before {
          content: "";
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-bottom-color: #f4f4f4;
          position: absolute;
          left: 18px;
          top: -19px;
        }
        .re-tit {
          font-size: 14px;
          color: #3f84f9;
        }
        .re-content {
          padding: 8px 0;
          font-size: 15px;
          color: #666666;
        }
      }
      .feed-tim {
        font-size: 11px;
        color: #d1d1d1;
      }
      .feedback-item:last-child {
        dd {
          .border-none;
        }
      }
    }
    .no_main {
      text-align: center;
      color: #666666;
      padding: 100px;
      font-size: 14px;
      img {
        width: 106px;
        height: 78px;
      }
    }
  }
  .roomActive {
    transform: translateX(-33.33333%);
    transition: all 0.6s ease;
  }
  .msgActive {
    transform: translateX(-66.6666666%);
    transition: all 0.6s ease;
  }
  .artActive {
    transform: translateX(0);
    transition: all 0.6s ease;
  }
  .aut-foot {
    height: 48px;
    width: 100%;
    .border-top;
    line-height: 48px;
    background: rgba(251, 251, 251, 0.95);
    display: flex;
    justify-content: space-around;
    font-size: 13px;
    color: @maincolor;
    position: absolute;
    bottom: 0;
    div {
      flex-grow: 1;
      text-align: center;
      span {
        background: url(../../common/img/teach-follow.png) no-repeat left center;
        background-size: 17px;
        padding-left: 20px;
        color: @garycolor;
      }
      .auton {
        background: url(../../common/img/teach-unfollow.png) no-repeat left
          center;
        background-size: 17px;
        padding-left: 20px;
        color: @maincolor;
      }
      &:nth-child(2) {
        span {
          background: url(../../common/img/teach-letter.png) no-repeat left
            center;
          background-size: 17px;
          padding-left: 20px;
          color: @maincolor;
        }
      }
    }
  }
}
</style>
