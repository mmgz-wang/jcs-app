<template>
  <div id="integral_exchange">
    <main-header :headerData="headerData" v-if="!inXCX"></main-header>
    <div class="exchange_wrap">
      <dl class="exchange_hd">
        <dt>
          <img src="../../common/img/detil_defaultBG.png" alt>
        </dt>
        <dd>
          {{price}}元文章解锁卷
          <p>{{integral}}积分</p>
        </dd>
      </dl>
      <ul class="li">
        <li>
          数量
          <input type="text" v-model="num">
        </li>
        <li>
          账户共
          <span>{{userIntegral}}</span> 积分
          <span @click="allExchange">积分全部兑换</span>
        </li>
      </ul>
      <div class="foot">
        总计
        <span>{{integral*num}}积分</span>
        <button class="sub" @click="subExchange">确认兑换</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import mainHeader from "base/header/mainheader";
import Common from "common/js/common.js";
export default {
  data() {
    return {
      headerData: {
        ele: "积分兑换",
        name: "exchange"
      },
      id: this.$route.query.id,
      price: this.$route.query.money,
      integral: this.$route.query.integral,
      rule_type: this.$route.query.rule_type,
      userIntegral: 0,
      num: 1,
      inXCX: false,
      userId: this.shareFn.getUserId(),
      token: this.shareFn.getSecurityCode()
    };
  },
  components: {
    mainHeader
  },
  mounted: function() {
    if (window.__wxjs_environment === "miniprogram") {
      this.inXCX = true;
      this.userId = this.$router.currentRoute.query.userId;
      this.token = this.shareFn.wxGetUserT(
        this.userId,
        this.$router.currentRoute.query.token
      );
      document.getElementsByTagName("title")[0].innerText = "积分兑换";
    }
    this.getData();
  },
  methods: {
    getData(id, done) {
      var that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(Common.baseURI().host + "/User/GetUserInfo", {
            params: {
              userId: this.userId,
              token: this.token
            }
          })
          .then(function(res) {
            that.userIntegral = res.data.integral;
          });
      });
    },
    subExchange() {
      let that = this;
      if (this.num * this.integral > this.userIntegral) {
        layer.open({
          content: "您的兑换数量超上限！",
          time: 2,
          skin: "msg"
        });
        //this.allExchange ();
        return false;
      }
      this.$http
        .jsonp(Common.baseURI().host + "/User/IntegralExchange", {
          params: {
            userId: this.userId,
            token: this.token,
            language: "M",
            rulesId: that.id,
            rulesType: that.rule_type,
            nums: that.num
          }
        })
        .then(function(res) {
          if (res.data.code == "0000") {
            layer.open({
              content: "兑换成功，前去我的赠送查看？",
              btn: ["确定", "取消"],
              yes: function(index) {
                if (that.inXCX) {
                    wx.miniProgram.navigateBack({
                        delta: 2
                    })
                } else {
                  that.$router.push({ name: "mypresent" });
                  layer.close(index);
                }
              },
              no: function(index) {
                layer.close(index);
              }
            });
          } else {
            layer.open({
              content: res.data.msg,
              time: 2,
              skin: "msg"
            });
          }
        });
    },
    allExchange() {
      this.num = parseInt(this.userIntegral / this.integral);
    }
  }
};
</script>

<style lang="less">
@import "../../common/less/base.less";
#integral_exchange {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 15px;
  bottom: 0px;
  color: #333333;
  z-index: 99;
  background: #f4f4f4;
  .exchange_wrap {
    .exchange_hd {
      background: #ffffff;
      text-align: center;
      img {
        width: 70px;
        height: 70px;
      }
      p {
        color: #e9311d;
      }
    }
    .li {
      margin-top: 10px;
      background: #ffffff;
      padding-left: 15px;
      li {
        line-height: 49px;
        line-height: 49px;
        border-bottom: 1px solid #e0e0e0;
        input {
          outline: none;
          border: none;
          height: 100%;
          padding-left: 10px;
          font-size: 15px;
        }
      }
      li span {
        color: #e9311d;
      }
      li span:nth-child(2) {
        color: #ff8209;
      }
      li:nth-child(2) {
        border: none;
        font-size: 13px;
      }
    }
    .foot {
      background: #ffffff;
      line-height: 52px;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 15px;
      button {
        background: #e9311d;
        color: #ffffff;
        height: 100%;
        padding: 0 25px;
        outline: none;
        border: none;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 15px;
      }
      span {
        color: #e9311d;
      }
    }
  }
}
</style>
