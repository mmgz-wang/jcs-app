<template>
    <div class="feedback">
        <div class="f_hd">
            <div class="f_tab">
                <span :class="{on: !ismyMsg}" @click="selectMsg('all')">精彩留言</span>
                <span :class="{on: ismyMsg}" @click="selectMsg('my')">我的留言</span>
            </div>
            <span class="to_send_feedback"  @click="goLeaveMessage">发表留言</span>
        </div>
        <div class="feedback-list" v-if="feedList.length>0">
            <dl class="feedback-item" 
              :class="{hide: item.userId != shareFn.getUserId() && ismyMsg}" 
              v-for="item in feedList">
                <dt><img :src="item.userPic" alt=""></dt>
                <dd>
                    <p class="nickname_feed">{{item.userName}}（{{item.userId}}）</p>
                    <div class="star">
                        <span v-for="items in stars" :key="items"
                            :class="{on: items<=item.score}"></span>
                    </div>
                    <div class="content">{{item.comment}}</div>
                    <p class="feed-tim">{{item.commentDate.substr(5,11)}}</p>
                    <div class="reply" v-if="item.reply != undefined">
                        <p class="re-tit">老师回复</p>
                        <div class="re-content">
                            {{item.reply}}
                        </div>
                        <p class="feed-tim">{{item.replyDate.substr(5,11)}}</p>
                    </div>
                </dd>
            </dl>
        </div>
        <div class="no-feedback" v-if="feedList.length<=0">
            <dl>
                <dt><img src="../../common/img/nofeedback.png" alt=""></dt>
                <dd>
                    <p>暂无留言内容</p>
                    <span>还不赶快来抢沙发！</span>
                    <div><button @click="goLeaveMessage">去留言</button></div>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script type="text/javascript">
import Common from "common/js/common";
import shareFn from "common/js/sharefn";
export default {
  props: {
    authorId: {
      type: String,
      default: ""
    },
    canMessage: {
      type: Boolean,
      default: false
    },
    chargeable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stars: ["1", "2", "3", "4", "5"],
      feedList: [],
      selected: '',
      ismyMsg: false
    };
  },
  created() {},
  mounted() {
    this.$nextTick(function() {
      this.getData();
    });
  },
  methods: {
    goLeaveMessage() {
      console.log(this.chargeable)
      var that = this;
      let msg = '很抱歉，只有此文章的付费用户才能发表留言!'
      if (!this.canMessage) {
        if(!this.chargeable){
          msg = '很抱歉，免费文章不能发表留言!'
          layer.open({
            content: msg,
            btn: ["取消"],
            shadeClose: false,
            yes: function(index) {
              layer.close(index);
            }
          });
          return false
        }
        layer.open({
          content: msg,
          btn: ["去解锁", "返回"],
          shadeClose: false,
          yes: function(index) {
            layer.close(index);
            document.querySelector('.art-wrap-outer').scrollTop=0+'px'
          },
          no: function(index) {
            layer.close(index);
            that.$router.back()
          }
        });
        return false
      }
      this.$router.push({
        path: `/leavemessage?id=${
          this.$router.currentRoute.query.id
        }&authorId=${this.authorId}`
      });
    },
    getData() {
      var that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(Common.baseURI().host + "/feedback/list", {
            params: {
              language: "M",
              userId: this.shareFn.getUserId(),
              securityCode: this.shareFn.getSecurityCode(),
              articleId: this.$router.currentRoute.query.id
            }
          })
          .then(function(res) {
            if (res.data.code == "0000") {
              that.feedList = res.data.data;
            } else if (res.data.code == "0003") {
            } else {
              console.log("请求失败");
            }
          });
      });
    },
    selectMsg (s) {
      if (s == 'all') {
        this.ismyMsg = false
      } else {
        this.ismyMsg = true
      }
    }
  },
  watch: {}
};
</script>
<style lang="less" type="text/less">
@import "../../common/less/base.less";
.feedback {
  width: 100%;
  height: auto;
  font-size: 15px;
  background: #ffffff;
  margin-top: 10px;
  .f_hd {
    height: 45px;
    line-height: 45px;
    display: flex;
    padding: 0 15px;
    display: -webkit-flex;
    justify-content: space-between;
    .border-bottom;
    .f_tab {
      span {
        margin-right: 25px;
        position: relative;
        color: @garycolor;
      }
      .on {
        color: @maincolor;
        &:before {
          content: "";
          display: inline-block;
          height: 4px;
          width: 26px;
          background: @reds;
          position: absolute;
          left: 50%;
          bottom: -5px;
          border-radius: 2px;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%);
        }
      }
    }
    .to_send_feedback {
      font-size: 13px;
      color: @reds;
    }
  }
  .feedback-list {
    width: 100%;
    padding: 15px;
    .feedback-item {
      display: flex;
      display: -webkit-flex;
      padding: 0;
      margin-top: 12px;
      &:nth-child(1) {
        margin-top: 0;
      }
      dt {
        img {
          width: 30px;
          height: 30px;
          border-radius: 15px;
        }
      }
      dd {
        margin-left: 13px;
        .border-bottom;
        flex-grow: 1;
        padding-bottom: 12px;
        .nickname_feed {
          font-size: 14px;
          color: #999999;
          padding-bottom: 4px;
        }
        .star {
          display: flex;
          display: -webkit-flex;
          span {
            background: url(../../common/img/star.png) no-repeat center;
            width: 19px;
            height: 18px;
            background-size: 19px 18px;
            display: block;
            margin-right: 7px;
          }
        }
        .star .on {
          background: url(../../common/img/staron.png) no-repeat center;
          background-size: 19px 18px;
        }
        .content {
          padding: 8px 0;
          font-size: 15px;
          color: #333333;
        }
        .feed-tim {
          font-size: 11px;
          color: #d1d1d1;
        }
        .reply {
          width: 100%;
          background: #f4f4f4;
          padding: 12px;
          position: relative;
          margin-top: 17px;
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
      }
    }
    .feedback-item:last-child{
      dd{
        .border-none;
      }
    }
    .hide{
      display: none !important;
    }
  }
  .no-feedback {
    dl {
      text-align: center;
      padding: 80px 0 40px 0;
      img {
        width: 106px;
        height: auto;
      }
      p {
        margin-top: 10px;
        font-size: 15px;
        color: #b1b1b1;
      }
      span {
        font-size: 12px;
        color: #c7c7c7;
      }
      button {
        height: 29px;
        line-height: 29px;
        outline: none;
        border: 1px solid #e9311d;
        color: #e9311d;
        font-size: 14px;
        background: #ffffff;
        border-radius: 2px;
        width: 94px;
        margin-top: 20px;
      }
    }
  }
}
</style>
