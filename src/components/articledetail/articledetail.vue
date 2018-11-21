<template>
    <div class="article-detail" v-if="articleData!=null">
    	<header class="art-header">
    		<span class="back" @click="art_back()">返回</span>
    		<h1>详情</h1>
    		<span @click="goService()" class="art-service">联系客服</span>
    	</header>
    	<div class="art-wrap-outer">
			<div class="hd">
				<dl>
					<dt><img :src="articleData.authorPic" alt="" id="authod_pic"></dt>
					<dd>
						<span class="name" id="authod_name">{{articleData.authorName}}</span><br>
						粉丝:<span id="flllow_num">{{articleData.follownum}}</span>文章:<span id="atticle_num">{{articleData.allaticlenum}}</span>
					</dd>
				</dl>
				<span class="follow"
				:class="{follow_on:!authorFollowed}"
				@click="goFollow(authorFollowed)"
				 id="is_follow" v-html="followStr">{{followStr}}</span>
			</div>
			<div class="feedback-hd">
					<span>留言（{{articleData.articleFdnum}}）</span>
					<span class="sub_tim">发布于：{{setTime(articleData.last_modified)}}</span>
				</div>
			<div class="article-wrap">
				
				<div class="free_txt">
					<!-- <p class="show_tim">发布于：<span class="day" id="publish_day">{{setTime(articleData.last_modified)}}</span></p> -->
					<p v-if="articleData.tabView" class="text" id="zhaiyao" v-html="articleData.tabView"></p>
					<div class="digest">
						{{articleData.digest}}
					</div>
				</div>
				<div class="article-main" v-if="articleData.chargeable && !articleData.articlePurchased">
					<div class="match-items">
						<span class="lock-pic"></span>
						<div class="item" v-if="articleData.matches.length<=0">
							<p class="nonematch">购买后可查看全文</p>
						</div>
						<div class="item" v-for="item in articleData.matches">
							<p cupname>
								<span class="home_team">{{item.home_team}}</span>
								<i>VS</i>
								<span class="vis_team">{{item.away_team}}</span>
							</p>
							<p class="tim">
								<span class="ball">{{sportType(item.sportType)}}</span>
								<span class="week"></span>
								<span class="com">{{item.cup_name}}</span>
								<span class="day">{{setTime(item.start_time)}}</span>
							</p>
						</div>
					</div>
					<div class="package-wrap">
						<p class="main-num">{{productExplain(articleData)}}</p>
						<div class="memberPackage"
						v-html="payForWaystr"
						v-if="articleData.chargeable && !articleData.articlePurchased" id="aaa" @click="PayForPackage">
							<div class="package-item">
								<p>
									<span>单篇购买 <i>￥18</i></span>
									<span class="open-explain">仅解锁当前文章</span>
								</p>
								<button class="open-btn">解锁</button>
							</div>
						</div>
					</div>
				</div>

				<div class="unlock" v-if="!articleData.chargeable || articleData.articlePurchased" v-html="articleData.text">
				</div>
				<p class="hoge" v-if="articleData.matches != undefined && articleData.matches.length>0">温馨提醒：本平台所有赛事皆为主队在前，客队在后。</p>

				<p class="price1" v-if="articleData.chargeable && articleData.singleUnlock && articleData.price>0 && articleData.articlePurchased">(VIP文章：{{articleData.price}} 精彩币 )</p>

				<p class="price1" v-if="articleData.chargeable && !articleData.singleUnlock && articleData.articlePurchased">(VIP用户专享)</p>


	    	</div>
	    	<div v-if="recommendData.length>0" class="recommendList" style="">
				<div class="tit-wrap">
					<span class="r-tit">精彩推荐</span>
				</div>
				<div class="r-list">
					<div class="listcon" v-for="item in recommendData" @click="goarticle(item)">
						<div class="bott">
							<i class="r-vip" v-if="item.chargeable">VIP</i>
							<span class="txt" v-if="item.tabView" v-html="item.tabView">
								<i>足球</i><i>初盘大小球</i>
							</span>

						</div>
						<span class="digest">
							{{item.authorName}}: {{ item.digest}}
						</span>

						<div class="art-match" v-if="item.matches != undefined && item.matches.length>0">
							<span>{{item.matches[0].cup_name}}</span>
							<span>{{item.matches[0].home_team}} vs {{item.matches[0].away_team}}</span>
							<span>{{  setTime(item.last_modified)}}</span>
						</div>
					</div>
				</div>
			</div>
			<feedback :authorId="authorId" :canMessage="canMessage" :chargeable="chargeable"></feedback>
			<div style="display:none;" v-if="articleData.vedioshow" class="banner">
				<img :src="articleData.vedioshow" alt="" id="adver">
			</div>
			<p class="art-hint">观点建议仅供参考，据此投注，风险自负，购彩仅为娱乐，请量力而行！<span id="wanrn">点击查看风险提示及免责声明</span></p>
		</div>
		<div class="footer-art">
			<div @click="ArtFootClick('like')">
				<span class="like" :class="{arton:isLike}">点赞</span>
			</div>
			<div @click="ArtFootClick('collect')">
				<span class="collect-art" :class="{arton:isCollect}">收藏</span>
			</div>
			<div @click="ArtFootClick('letter')">
				<span class="send-letter">发私信</span>
			</div>
			<div @click="ArtFootClick('share')" style="display:none;">
				<span class="share-art">分享</span>
			</div>
		</div>
		<router-view></router-view>
		<pay-dialog v-show="dialogShow"
		:btns="dialogData.btns"
        :tit="dialogData.tit"
        :yesFn="dialogData.yesFn"
        :noFn="dialogData.noFn"></pay-dialog>
        <div class="loading-container" v-show="loadingShow">
            <loading></loading>
        </div>
    </div>

</template>
<script type="text/ecmascript-6">
import Common from "common/js/common";
import feedback from "base/feedback/feedback";
import loading from "base/loading/loading";
import payDialog from "base/paydialog/paydialog";
import { isLong } from "long";
export default {
  name: "articleDetail",
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      articleData: null,
      recommendData: [],
      payForWaystr: "",
      authorFollowed: true,
      authorId: "",
      followStr: "<i>＋</i>关注",
      authorName: "",
      price: "",
      isCollect: false,
      isLike: false,
      dialogShow: false,
      loadingShow: true,
      cardId: 0,
      canMessage: false, //可否留言
      chargeable: false,
      dialogData: {
        btns: ["确定", "取消"],
        tit: "您确认要是用赠送机会解锁此文章吗？",
        yesFn: null,
        noFn: null
      }
    };
  },
  created() {},
  mounted() {},
  activated() {
    this.articleData = null;
    this.getData();
  },
  deactivated() {},
  components: {
    payDialog,
    loading,
    feedback
  },
  methods: {
    getData() {
      var that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(
            Common.baseURI().host + "/article/detail?time=" + Math.random(),
            {
              params: {
                language: "M",
                userId: this.shareFn.getUserId(),
                securityCode: this.shareFn.getSecurityCode(),
                articleId: this.$router.currentRoute.query.id
              }
            }
          )
          .then(function(res) {
            if (res.data.Code == "0000") {
              this.articleData = res.data.Articles;
              this.recommendData = res.data.recommendList;
              this.authorFollowed = this.articleData.authorFollowed;
              this.authorId = this.articleData.author_id;
              this.authorFollowed
                ? (this.followStr = "已关注")
                : (this.followStr = "<i>＋</i>关注");
              this.authorName = this.articleData.authorName;
              this.isCollect = this.articleData.articleCollected;
              this.isLike = this.articleData.articlePraised;
              this.cardId = this.articleData.omnCardId;
              this.loadingShow = false;
              this.payForWay(res.data);
              document.querySelector(
                "title"
              ).innerHTML = this.articleData.digest;
              if (
                this.articleData.alreadyPay &&
                this.articleData.chargeable &&
                this.shareFn.isLogin()
              ) {
                this.canMessage = true
              }
            } else if (res.data.code == "0003") {
              layer.open({
                content: "登录过期，请重新登录！",
                btn: ["确定", "取消"],
                yes: function(index) {
                  that.$router.push({ name: "enter" });
                  layer.close(index);
                },
                no: function(index) {
                  setCookie("jsonLog", null, 1);
                  function setCookie(c_name, value, expiredays) {
                    var exdate = new Date();
                    exdate.setDate(exdate.getDate() + expiredays);
                    document.cookie =
                      c_name +
                      "=" +
                      escape(value) +
                      (expiredays == null
                        ? ""
                        : ";expires=" + exdate.toGMTString());
                  }
                  that.$router.back();
                }
              });
            } else {
              console.log("请求失败");
            }
            this.chargeable = this.articleData.chargeable
          });
      });
    },
    ArtFootClick(s) {
      var that = this;
      if (!this.shareFn.isLogin()) {
        this.bunceIn("您还没有登录！");
        return;
      }
      if (s == "like") {
        this.AddArticleWhat("ArentService.AddArticlePraise", function(data) {
          if (data.Code == "0000") {
            that.bunceIn("点赞成功");
            that.isLike = true;
          } else if (data.Code == "3009") {
            that.bunceIn("您已经点过赞了");
          }
        });
      } else if (s == "collect") {
        var str = "";
        this.isCollect
          ? (str = "CrentService.ReleaseCollection")
          : (str = "CrentService.AddCollection");
        this.AddArticleWhat(str, function(data) {
          if (data.Code == "0000") {
            if (that.isCollect) {
              that.bunceIn("取消收藏成功");
              that.isCollect = false;
            } else {
              that.bunceIn("收藏成功");
              that.isCollect = true;
            }
          }
        });
      } else if (s == "letter") {
        this.$router.push({
          path: `/letterindex?id=${this.authorId}&name=${encodeURI(
            this.authorName
          )}`
        });
      } else if (s == "share") {
      }
    },
    setTime(s) {
      return this.shareFn.setTime(s);
    },
    sportType(s) {
      if (s == 0) {
        return "足球";
      } else if (s == 1) {
        return "篮球";
      } else {
        return "";
      }
    },
    productExplain(data) {
      var packages = data.authorLevels,
        needPackages = data.authorLevelList;
      var productExplainJson = {
        jdp: "VIP内容共" + data.textLength + "字，解锁后方可查看。",
        jby: "VIP内容共" + data.textLength + "字，包月用户可见。",
        jbbn: "VIP内容共" + data.textLength + "字，包半年用户可见。",
        jbn: "VIP内容共" + data.textLength + "字，包年用户可见。",
        by: "此文章包月用户可见，但可单篇解锁。",
        bbn: "此文章包半年用户可见，但可单篇解锁。",
        bn: "此文章包年用户可见，但可单篇解锁。"
      };
      if (
        data.chargeable &&
        !data.articlePurchased &&
        !data.singleUnlock &&
        data.periods != undefined
      ) {
        if (needPackages.length < 1) {
          return productExplainJson.jdp;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "12"
        ) {
          return productExplainJson.jbn;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "6"
        ) {
          return productExplainJson.jbbn;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "1"
        ) {
          return productExplainJson.jby;
        } else if (needPackages.length > 1) {
          return (
            "VIP内容共" +
            data.textLength +
            "字，包" +
            this.returnYears(needPackages[needPackages.length - 1].termmonths) +
            "更优惠。"
          );
        } else {
          return productExplainJson.jdp;
        }
      } else if (
        data.chargeable &&
        !data.articlePurchased &&
        data.singleUnlock &&
        data.periods != undefined
      ) {
        if (needPackages.length < 1) {
          return productExplainJson.jdp;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "12"
        ) {
          return productExplainJson.bn;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "6"
        ) {
          return productExplainJson.bbn;
        } else if (
          needPackages.length == 1 &&
          needPackages[0].termmonths == "1"
        ) {
          return productExplainJson.by;
        } else if (needPackages.length > 1) {
          return (
            "VIP内容共" +
            data.textLength +
            "字，包" +
            this.returnYears(needPackages[needPackages.length - 1].termmonths) +
            "更优惠。"
          );
        } else {
          return productExplainJson.jdp;
        }
      } else {
        return productExplainJson.jdp;
      }
    },
    returnYears(s) {
      var packageArr = { "1": "月", "3": "季", "6": "半年", "12": "年" };
      return packageArr[s];
    },
    payForWay(data) {
      var articles = data.Articles,
        authorLevelList = data.Articles.authorLevelList,
        authorLevels = data.Articles.authorLevels;
      var payForWaystr = "";
      if (
        articles.chargeable &&
        !articles.articlePurchased &&
        articles.singleUnlock &&
        !articles.isNba
      ) {
        payForWaystr += `<div class="package-item"><p><span>单篇购买 <i>￥${
          articles.price
        }</i></span><span class="open-explain">
				仅解锁当前文章</span></p><button class="open-btn" types="money">解锁</button></div>`;
      } else {
        payForWaystr += `<div class="package-item"><p><span>NBA包天解锁 <i>￥${
          articles.price
        }</i></span><span class="open-explain">
				可查看该老师当天所有NBA文章</span></p><button class="open-btn" types="money">解锁</button></div>`;
      }
      if (
        "" != articles.omnCardId &&
        "" != articles.omnCardValue &&
        articles.omnCardId != 0 &&
        articles.omnCardValue != 0 &&
        undefined != articles.omnCardId &&
        undefined != articles.omnCardValue &&
        articles.singleUnlock
      ) {
        payForWaystr += `<div class="package-item"><p><span>赠送机会 <i>${
          articles.omnCardValue
        }精彩币以下</i></span><span class="open-explain">
				仅解锁当前文章</span></p><button class="open-btn" types="card">解锁</button></div>`;
      }

      if (authorLevelList != undefined && authorLevels != undefined) {
        authorLevels.forEach(function(v, i) {
          authorLevelList.forEach(function(val, key) {
            if (val.termmonths == 0) {
              return;
            }
            if (v.termmonths == val.termmonths) {
              payForWaystr += returnPackage(val);
            }
          });
        });
        authorLevelList.forEach(function(v, i) {
          if (v.termmonths == 0 && v.termdays == 1) {
            payForWaystr += returnPackage(v);
          } else if (v.termmonths == 0 && v.termdays != 1) {
            payForWaystr += returnPackage("zhou", v);
          }
        });
        function returnPackage(v) {
          var packageArr = {
            "0": "天",
            "1": "月",
            "3": "季",
            "6": "半年",
            "12": "年"
          };
          var packageExplain = {
            "0": "看老师一整天产品",
            "1": "包月更优惠，看老师正月产品",
            "3": "看老师一季度产品",
            "6": "看老师半年产品",
            "12": "看老师全年产品"
          };
          if (arguments.length > 1) {
            if (arguments[1].price == 0 || arguments[1].price == undefined) {
              return "";
            }
            return `<div class="package-item"><p><span>包周产品 <i>￥${
              arguments[1].price
            }
						</i></span><span class="open-explain">看老师一星期产品</span></p><button months="${
              arguments[1].termmonths
            }" id="${arguments[1].id}" price="${
              arguments[1].price
            }" class="open-btn" types="packages">解锁</button></div>`;
          } else {
            if (v.price == 0 || v.price == undefined) {
              return "";
            }
            return `<div class="package-item"><p><span>包${
              packageArr[v.termmonths]
            }产品
						<i>￥${v.price}</i></span><span class="open-explain">
						${
              packageExplain[v.termmonths]
            }</span></p><button types="packages" class="open-btn"
						months="${v.termmonths}" id="${v.id}" price="${v.price}">
						解锁</button></div>`;
          }
        }
      }
      this.payForWaystr = payForWaystr;
    },
    PayForPackage() {
      var that = this;
      if (!this.shareFn.isLogin()) {
        this.$router.push({ name: "enter" });
        return false;
      }
      var trg = event.target;
      if (trg.nodeName != "BUTTON" && trg.nodeName == "SPAN") {
        trg = trg.parentNode;
      }
      var types = trg.getAttribute("types");
      if (types == "money") {
        this.$router.push({
          path: `/payfor?id=${this.$router.currentRoute.query.id}&proType=jcs`
        });
      } else if (types == "card") {
        this.dialogShow = true;
        this.dialogData.yesFn = function() {
          that.cardPay();
          that.dialogShow = false;
        };
        this.dialogData.noFn = function() {
          that.dialogShow = false;
        };
      } else if (types == "packages") {
        this.$router.push({
          name: "payfor",
          query: {
            id: trg.getAttribute("id"),
            months: trg.getAttribute("months"),
            authorName: this.authorName,
            price: trg.getAttribute("price"),
            proType: "package"
          }
        });
      }
    },
    goFollow(s) {
      var that = this;
      if (!this.shareFn.isLogin()) {
        this.bunceIn("您还没有登录！");
      } else {
        if (!s) {
          //关注
          follow("add");
        } else {
          //未关注
          follow("cancel");
        }
      }
      function follow(flag) {
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
              that.authorFollowed = !that.authorFollowed;
              showFollow(2);
            });
        });
      }
      function showFollow(type) {
        if (that.authorFollowed) {
          that.followStr = "已关注";
          that.bunceIn("关注成功");
        } else {
          that.followStr = "<i>＋</i>关注";
          that.bunceIn("取消成功");
        }
      }
      return false;
    },
    art_back() {
      this.$router.back();
    },
    bunceIn(s) {
      layer.open({
        content: s,
        time: 2,
        skin: "msg"
      });
    },
    AddArticleWhat(str, Fn) {
      var that = this;
      var opt = {
        url: Common.baseURI().nativeHost,
        data: {
          SecurityCode: this.shareFn.getSecurityCode(),
          UserId: this.shareFn.getUserId(),
          ArticleId: this.$router.currentRoute.query.id
        },
        headers: { "X-Target": str },
        callback: function(data) {
          Fn(data);
        }
      };
      this.custmorAjax(opt);
    },
    cardPay() {
      this.$nextTick(function() {
        this.$http
          .jsonp(Common.baseURI().host + "/Purchase/PurchaseArticleByOmnCard", {
            params: {
              Language: "M",
              Type: 6,
              ArticleId: this.$router.currentRoute.query.id,
              AuthorId: this.authorId,
              Id: this.cardId,
              UserId: this.shareFn.getUserId(),
              SecurityCode: this.shareFn.getSecurityCode()
            }
          })
          .then(function(res) {
            if (res.data.Code == "0000") {
              this.getData();
            }
          });
      });
    },
    custmorAjax(opt) {
      var data = null;
      this.$http
        .post(opt.url, opt.data, {
          headers: opt.headers
        })
        .then(
          function(res) {
            opt.callback(res.data);
          },
          function() {
            this.bunceIn("请求失败请检查网络");
          }
        );
    },
    goService() {
      this.$router.push({ path: "/service?id=234" });
    },
    goarticle(item) {
      this.$router.push({
        path: `/articledetail/?id=${item.id}`
      });
      //location.reload();
    }
  },
  watch: {
    $route() {
      //alert('变化')
      //this.getData();
      this.loadingShow = true;
    }
  }
};
</script>
<style lang="less" type="text/less">
@import "../../common/less/base.less";
.article-detail {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 9999999;
  background: @backcolor;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 44px;
  .art-header {
    height: 44px;
    line-height: 44px;
    width: 100%;
    font-size: 0.14rem;
    color: @headercolor;
    text-align: center;
    position: fixed;
    background: @backcolor;
    top: 0;
    z-index: 9999999;
    padding: 0 15px;
    h1 {
      font-size: 0.18rem;
      font-weight: 400;
    }
    .back {
      width: 44px;
      height: 100%;
      float: left;
      position: absolute;
      left: 0;
      background: url("../../common/img/deepback.png") no-repeat center;
      color: transparent;
      background-size: 8px 17px;
    }
    .art-service {
      display: inline-block;
      height: 100%;
      position: absolute;
      right: 15px;
      top: 0;
      background: url("../../common/img/art-service.png") no-repeat right center;
      background-size: 21px 19px;
      color: transparent;
    }
  }
  .hd {
    font-size: 0.16rem;
    color: @namecolor;
    background: @whites;
    height: 0.55rem;
    width: 100%;
    position: relative;
    padding: 0 15px;
    dl {
      float: left;
      height: 100%;
      display: flex;
      align-items: center;
      dt {
        height: 0.34rem;
        width: 0.34rem;
        img {
          width: 0.34rem;
          height: 0.34rem;
          border-radius: 50%;
        }
      }
      dd {
        padding-left: 10px;
        font-size: 0.11rem;
        color: #999;
        span {
          padding: 0 10px 0 5px;
          line-height: 1;
          color: @garycolor;
        }
        #authod_name {
          padding: 0;
          font-size: 0.13rem;
          color: @namecolor;
        }
      }
    }
    .follow {
      box-sizing: content-box;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #b1b1b1;
      height: 23px;
      width: 60px;
      border: 1px solid @bordercolor;
      border-radius: 4px;
      display: flex;
      align-items: center;
      line-height: 23px;
      justify-content: center;
      i {
        line-height: 23px;
        font-size: 0.14rem;
      }
    }
    .follow_on {
      color: @reds;
      border-color: @reds;
    }
  }
  .article-wrap {
    width: 100%;
    background: @whites;
    padding: 15px;
    .free_txt {
      width: 100%;
      padding-bottom: 15px;
      .show_tim {
        font-size: 0.1rem;
        color: @assistcolor;
        clear: both;
        line-height: 1;
      }
      .digest {
        width: 100%;
        font-size: @mainsize;
        color: @maincolor;
        line-height: 0.25rem;
      }
      .label {
        padding-bottom: 5px;
      }
      .text {
        width: 100%;
        height: 45px;
        line-height: 45px;
        i {
          float: left;
          line-height: 1;
          padding: 1px 5px;
          margin-right: 10px;
          border-radius: 3px;
          color: @reds;
          border: 1px @reds solid;
          font-size: 10px;
          margin-top: 14px;
        }
        .vip {
          background: #ffd842;
          color: #404040;
        }
        label {
          color: @oranges;
          font-size: 10px;
          float: left;
        }
        .gg {
          padding: 0px 3px;
        }
      }
    }
    .article-main {
      width: 100%;
      font-size: @mainsize;
      color: @maincolor;
      .match-items {
        width: 100%;
        position: relative;
        border: 1px solid @bordercolor;
        background: #fbfbfb;
        .item {
          width: 90%;
          margin-left: 5%;
          text-align: center;
          padding: 15px 0;
          border-bottom: 1px dotted @bordercolor;
          p[cupname] {
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              color: @oranges;
              padding: 0 5px;
            }
          }
          .tim {
            font-size: 0.1rem;
            color: @garycolor;
            padding-top: 8px;
            span {
              padding: 0 3px;
            }
          }
          &:last-child {
            border: none;
          }
          .nonematch {
            color: @garycolor;
            font-size: 0.12rem;
            padding: 10px 0 15px 0;
          }
        }
        .lock-pic {
          width: 0.25rem;
          height: 0.25rem;
          background: url("../../common/img/lock.png") no-repeat center;
          background-size: 25px 25px;
          position: absolute;
          left: 50%;
          bottom: -0.16rem;
          margin-left: -17px;
        }
        .lock {
          width: 100%;
          height: 0.6rem;
          text-align: center;
          font-size: @assistsize;
          color: @shallowred;
          position: relative;
          line-height: 40px;
        }
      }
    }
    .unlock {
      font-size: 0.15rem;
      color: @maincolor;
      width: 100%;
      border-top: 1px solid @bordercolor;
      .compition {
        width: 100%;
        border: 1px solid @bordercolor;
        background: #fbfbfb;
        font-size: @mainsize;
        color: @maincolor;
        border-top: none;
        .teamz {
          width: 100%;
          text-align: center;
          padding: 12px 0 8px 0;
          border-bottom: 1px dotted @bordercolor;
          &:last-child {
            border: none;
          }
          p {
            text-align: center;
            width: 100%;
            &:nth-child(1) {
              color: @oranges;
              display: flex;
              justify-content: center;
              align-items: center;
              span {
                color: @maincolor;
                padding: 0 5px;
              }
            }
            &:nth-child(2) {
              font-size: @assistsize;
              color: @assistcolor;
              padding-top: 5px;
              span {
                padding: 0 3px;
              }
            }
          }
        }
        .com_detail {
          width: 100%;
          font-size: 0.14rem;
          padding-top: 5px;
          line-height: 0.24rem;
          padding-left: 5px;
          &:last-child {
            padding-bottom: 5px;
          }
          .p_way {
            color: @deepblues;
          }
          .result {
            color: @namecolor;
            padding-left: 6px;
            span {
              color: @reds;
            }
            i {
              color: @deepblues;
            }
          }
        }
      }
      .all {
        padding-top: 10px;
        line-height: 0.24rem;
        p {
          img {
            width: 100%;
          }
        }
      }
    }
    .package-wrap {
      width: 100%;
      border: 1px solid @bordercolor;
      border-top: none;
      .main-num {
        font-size: 0.1rem;
        color: #f7867a;
        text-align: center;
        padding-top: 37px;
      }
      .memberPackage {
        width: 100%;
        padding: 17px 15px 0 15px;
        .package-item {
          width: 100%;
          border-bottom: 1px dotted @bordercolor;
          padding: 13px 0;
          position: relative;
          font-size: 0.13rem;
          color: @maincolor;
          span {
            display: block;
            &:nth-child(2) {
              color: @garycolor;
              font-size: 0.1rem;
            }
          }
          button {
            outline: none;
            border: none;
            background: @reds;
            color: @whites;
            height: 25px;
            width: 60px;
            line-height: 25px;
            text-align: center;
            border-radius: 4px;
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -12px;
            font-size: 0.12rem;
          }
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
  .recommendList {
    width: 100%;
    font-size: 0;
    margin: 10px 0;
    background: @whites;
    color: @maincolor;
    .tit-wrap {
      width: 100%;
      height: 55px;
      padding: 20px 0;
      position: relative;
      .r-tit {
        font-size: 0.15rem;
        color: @maincolor;
        padding: 0 5px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        &:before {
          content: "";
          width: 16px;
          height: 0.015rem;
          background: @maincolor;
          position: absolute;
          left: -18px;
          top: 50%;
          margin-top: -1px;
        }
        &:after {
          content: "";
          width: 16px;
          height: 0.015rem;
          background: @maincolor;
          position: absolute;
          right: -18px;
          top: 50%;
          margin-top: -1px;
        }
      }
    }
    .r-list {
      width: 100%;
      background: #ffffff;
    }
    .listcon {
      width: 94%;
      padding-top: 15px;
      margin-left: 3%;
      .border-top;
      padding-bottom: 10px;
    }
    .topb img {
      width: 100%;
    }
    .digest {
      margin-top: 0px;
      width: 100%;
      line-height: 0.24rem;
      font-size: 0.15rem;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: @maincolor;
    }
    .bott {
      box-sizing: content-box;
      width: 100%;
      font-size: 0.1rem;
      color: #8b7a39;
      float: left;
      padding-bottom: 12px;
      .txt {
        float: left;
        i {
          float: left;
          line-height: 1;
          padding: 1px 5px;
          margin-right: 10px;
          border-radius: 3px;
          color: @reds;
          border: 1px @reds solid;
          font-size: 10px;
        }
        label {
          color: @oranges;
        }
        .label {
          color: @oranges;
        }
      }
      .r-vip {
        float: left;
        background: @reds;
        color: @whites;
        border-color: @reds;
        border-radius: 3px;
        height: 15px;
        line-height: 15px;
        font-size: 0.1rem;
        display: inline-block;
        padding: 0 5px;
        margin-right: 8px;
      }
    }
    .art-match {
      float: left;
      width: 100%;
      padding-bottom: 15px;
      font-size: 0.1rem;
      color: @blues;
    }
  }
  .art-hint {
    font-size: @assistsize;
    color: @assistcolor;
    padding: 10px;
    padding-top: 0px;
    text-align: center;
    span {
      color: @reds;
    }
  }
  .banner {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .hoge {
    font-size: 0.12rem;
    color: @reds;
    padding-top: 15px;
    width: 100%;
    text-align: center;
    color: @assistcolor;
  }
  .price1 {
    font-size: 0.12rem;
    color: @reds;
    text-align: center;
  }
  .footer-art {
    height: 48px;
    width: 100%;
    .border-top;
    line-height: 48px;
    background: rgba(251, 251, 251, 0.9);
    display: flex;
    justify-content: space-around;
    font-size: 0.11rem;
    color: @maincolor;
    position: absolute;
    bottom: 0;
    div {
      flex-grow: 1;
      text-align: center;
      span {
        background: url("../../common/img/art-unlike.png") no-repeat;
        background-size: 17px;
        padding-left: 25px;
        line-height: 34px;
        background-position: left 7px;
        display: inline-block;
      }
      .arton {
        color: @reds;
        background: url("../../common/img/art-like.png") no-repeat;
        background-size: 17px;
        line-height: 34px;
        background-position: left 7px;
        display: inline-block;
      }
      &:nth-child(2) {
        span {
          background: url("../../common/img/art-uncollect.png") no-repeat;
          background-size: 17px;
          padding-left: 25px;
          line-height: 34px;
          background-position: left 7px;
          display: inline-block;
        }
        .arton {
          color: @reds;
          background: url("../../common/img/art-collect.png") no-repeat;
          background-size: 17px;
          padding-left: 25px;
          line-height: 34px;
          background-position: left 7px;
          display: inline-block;
        }
      }
      &:nth-child(3) {
        span {
          background: url("../../common/img/art-letter.png") no-repeat;
          background-size: 17px;
          padding-left: 25px;
          line-height: 34px;
          background-position: left 8px;
          display: inline-block;
        }
      }
    }
  }
  .art-wrap-outer {
    position: absolute;
    top: 44px;
    bottom: 48px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
  .feedback-hd {
    height: 50px;
    line-height: 50px;
    display: flex;
    display: -webkit-flex;
    font-size: 12px;
    color: #333333;
    .border-bottom;
    background: #ffffff;
    margin-top: 10px;
    padding: 0 15px;
    justify-content: space-between;
  }
  .feedback-hd span:nth-child(1) {
    background: url("../../common/img/msg.png") no-repeat left center;
    background-size: 15px 13px;
    padding-left: 20px;
  }
  .sub_tim {
    font-size: 11px;
    color: #b1b1b1;
  }
}
</style>
