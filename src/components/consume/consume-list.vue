<template>
  <div class="consume_list">
    <main-header :headerData="headerData" v-if="!inXCX"></main-header>
    <div class="tab">
      <span :class="{matchliston:isGold}" @click="wrapShow('gold')">精彩币</span>
      <span class="search" :class="{matchliston:!isGold}" @click="wrapShow('integral')">积分</span>
    </div>
    <scroll
      :needRefresh="needRefresh"
      :pullDownRefresh="pullDownRefresh"
      :pullUpLoad="pullUpLoad"
      :pullingUpFn="pullingUpFn"
      :pullingDownFn="pullingDownFn"
      ref="Scroll"
      class="com-list-wrap"
      :class="{inxcx: inXCX}"
      :data="scrollData"
    >
      <div class="com-list-inner" style="float:left;padding-bottom:50px;">
        <p pulldown>{{pullDownText}}</p>
        <div class="gold-wrap" v-if="isGold">
          <div class="item" v-for="item in goldList">
            <div class="item-l">
              <template v-if="item.typeFlag == 1">{{item.data.Author}}</template>
              <template v-else-if="item.typeFlag == 2">{{item.data.TypeName}}</template>
              <p>{{item.data.Date.substr(6,11)}}</p>
            </div>
            <div class="item-r">
              <span v-if="item.typeFlag == 1" style="color: #1da479;">-{{item.data.Money}}</span>
              <span v-else style="color: #e9311d;">+{{item.data.Money}}</span>
              <br>
              <template v-if="item.typeFlag == 1">{{item.data.Author}}的{{item.data.PurchaseName}}</template>
              <template v-else-if="item.typeFlag == 2">{{item.data.MainTypeName}}</template>
            </div>
          </div>
        </div>
        <div class="integral-wrap" v-if="!isGold">
          <div class="item" v-for="item in integralList">
            <div class="item-l">
              {{typeArr[item.type]}}
              <p>{{getLocalTime(item.udate)}}</p>
            </div>
            <div class="item-r">
              <span v-if="item.turnover == 1" style="color: #1da479;">-{{item.disburse}}</span>
              <span v-else style="color: #e9311d;">+{{item.inflow}}</span>
              <br>
              {{item.comment}}
            </div>
          </div>
        </div>
        <p pullup>{{pullUpText}}</p>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Common from "common/js/common";
import mainHeader from "base/header/mainheader";
export default {
  name: "consume_list",
  data() {
    return {
      needRefresh: true,
      pullDownRefresh: { threshold: 50, stop: 50 },
      pullUpLoad: { threshold: 0, txt: { more: "", noMore: "" } },
      pullDownText: "下拉加载更多历史赛事",
      pullUpText: "上拉加载更多赛事",
      headerData: {
        ele: "账户流水",
        name: "consume_list"
      },
      goldList: [],
      integralList: [],
      scrollData: [],
      isGold: true,
      loding: null,
      maxaddMoney: "",
      maxsubMoney: "",
      maxIconId: "",
      typeArr: {
        "1": "黑单送积分",
        "2": "充值送积分",
        "3": "文章兑换",
        "4": "新用户送积分",
        "5": "其他",
        "6": "锦囊兑换",
        "7": "门票兑换"
      },
      inXCX: false,
      userId: this.shareFn.getUserId(),
      token: this.shareFn.getSecurityCode()
    };
  },
  components: {
    Scroll,
    mainHeader
  },
  created() {
    this.lodingDom();
  },
  activated() {
    if (window.__wxjs_environment === "miniprogram") {
      this.inXCX = true;
      this.userId = this.$router.currentRoute.query.userId;
      this.token = this.shareFn.wxGetUserT(
        this.userId,
        this.$router.currentRoute.query.token
      );
      document.getElementsByTagName("title")[0].innerText = "账户流水";
    }
  },
  deactivated() {},
  mounted() {
    this.getData();
  },

  methods: {
    pullingDownFn(scroll) {
      console.log("pulling down and load data");
      this.IS_PAGEUP = false;
      this.maxsubMoney = "";
      this.maxaddMoney = "";
      this.maxIconId = "";
      this.pullDownText = "释放加载 ...";
      if (this.isGold) {
        this.getData();
      } else {
        this.getIntegralData();
      }
    },
    pullingUpFn(scroll) {
      console.log("pulling up and load data");
      this.IS_PAGEUP = true;
      this.pullUpText = "努力加载中 ...";
      if (this.isGold) {
        this.getData();
      } else {
        this.getIntegralData();
      }
    },
    getData() {
      let that = this;
      this.$nextTick(function() {
        this.$http
          .post(
            Common.baseURI().nativeHost,
            {
              language: "M",
              UserId: that.userId,
              SecurityCode: that.token,
              Type: 3,
              Id: that.maxsubMoney,
              chargeMaxId: that.maxaddMoney
            },
            {
              headers: { "X-Target": "TrentService.GetUserCapitalDetails" }
            }
          )
          .then(
            function(res) {
              if (res.data.Code == "0000") {
                if (that.IS_PAGEUP) {
                  that.goldList = that.goldList.concat(res.data.Details);
                  res.data.Details.length == 0
                    ? (that.pullUpText = "已是全部数据 ...")
                    : "上拉加载更多 ...";
                } else {
                  that.goldList = res.data.Details;
                }
                that.scrollData = that.goldList;
                that.maxsubMoney =
                  res.data.Details[res.data.Details.length - 1].data.Id;
                that.maxaddMoney =
                  res.data.Details[res.data.Details.length - 1].data.Id;
                layer.close(this.loding);
                that.$refs.Scroll.refresh();
              }
              console.log(res.data);
            },
            function() {
              this.bunceIn("请求失败请检查网络");
            }
          );
      });
    },
    getIntegralData() {
      var that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(Common.baseURI().host + "/User/IntegralLists", {
            params: {
              userId: that.userId,
              token: that.token,
              maxId: that.maxIconId,
              language: "M"
            }
          })
          .then(function(res) {
            console.log(res.data);
            if (res.data.code == "0000") {
              if (that.IS_PAGEUP) {
                that.integralList = that.integralList.concat(res.data.Details);
                res.data.Details.length == 0
                  ? (that.pullUpText = "已是全部数据 ...")
                  : "上拉加载更多 ...";
              } else {
                that.integralList = res.data.Details;
              }
              that.scrollData = that.integralList;
              that.maxIconId = res.data.Details[res.data.Details.length - 1].id;
              that.$refs.Scroll.refresh();
              console.log(that.$refs.Scroll);
            }
          });
      });
    },
    getLocalTime(nS) {
      var now = new Date(parseInt(nS));
      var year = now.getYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      var minute = now.getMinutes();
      if (minute < 10) {
        minute = "0" + minute;
      }
      var second = now.getSeconds();
      return month + "-" + date + " " + hour + ":" + minute;
    },
    wrapShow(s) {
      this.maxsubMoney = "";
      this.maxaddMoney = "";
      this.maxIconId = "";
      if (s == "gold") {
        this.IS_PAGEUP = "";
        this.isGold = true;
        this.isAllText = "精彩币";
        this.getData();
      } else {
        this.IS_PAGEUP = "";
        this.isGold = false;
        this.isAllText = "积分";
        this.getIntegralData();
      }
    },
    back: function() {
      this.$router.back();
    },
    lodingDom() {
      this.loding = layer.open({
        type: 2,
        content: "加载中"
      });
    }
  },
  watch: {}
};
</script>

<style lang="less">
@import "../../common/less/base.less";

.consume_list {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0px;
  bottom: 0px;
  color: @whites;
  background: @backcolor;
  font-size: 15px;
  color: #333333;
  p[pulldown] {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: @assistcolor;
    font-size: 0.12rem;
    position: absolute;
    top: -50px;
    left: 0;
  }
  p[pullup] {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: @assistcolor;
    font-size: 0.12rem;
    float: left;
  }
  .tab {
    font-size: 15px;
    width: 100%;
    height: 44px;
    background: @whites;
    padding: 10px 0;
    position: relative;
    .border-bottom;
    span {
      width: 50%;
      float: left;
      color: @maincolor;
      text-align: center;
      position: relative;
    }
    .matchliston {
      color: @reds;
    }
    .search {
      .border-left;
    }
    .open {
      &:after {
        border-bottom-color: @reds;
        border-top-color: transparent;
        margin-top: -6px;
      }
    }
    .garyun {
      color: @maincolor;
      &:after {
        border-bottom-color: @maincolor;
        border-top-color: transparent;
        margin-top: -6px;
      }
    }
    .garyopen {
      color: @maincolor;
      &:after {
        border-top-color: @maincolor;
      }
    }
  }
  .isAllWrap,
  .searchwrap {
    width: 100%;
    font-size: 0.15rem;
    background: rgba(0, 0, 0, 0.3);
    color: @maincolor;
    position: absolute;
    top: 88px;
    bottom: 0;
    z-index: 99;
    height: 0;
    overflow: hidden;
  }
  .matchSelectShow {
    height: auto;
  }
  .com-list-wrap {
    width: 100%;
    position: absolute;
    left: 0;
    top: 88px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    background: #ffffff;
  }
  .inxcx {
    top: 44px;
  }
  .com-list-inner {
    min-height: 100%;
    width: 100%;
    box-sizing: content-box;
  }
  .item {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    width: 97%;
    margin-left: 3%;
    padding: 15px;
    padding-left: 0;
    .border-bottom;
    .item-l {
      text-align: left;
      p {
        font-size: 12px;
        color: #999999;
      }
    }
    .item-r {
      text-align: right;
      font-size: 12px;
      color: #999999;
      span {
        font-size: 15px;
        color: #333333;
      }
    }
  }
}
</style>
