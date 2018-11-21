<template>
    <div class="leave-message">
       <main-header :headerData="headerData"></main-header>
       <div class="top">
           <dl class="teach-infor">
                <dt>
                    <img :src="authorInfo.picurl" alt="">
                </dt>
                <dd>
                    <p class="username">{{authorInfo.nickname}}</p>
                    <p class="brief">{{authorInfo.brief}}</p>
                </dd>
            </dl>
            <div class="star">
                请评分：<span v-for="items in stars" :key="items"
                        @click="scoreClick(items)"
                        :class="{on: myScore>=items}"></span>
            </div>
            <div class="text">
                <textarea name="content" v-model="content" id="content" cols="30" rows="8"
                    placeholder="请输入您的留言"></textarea>
            </div>
       </div>
       <div class="sub" @click="addFeedback">
           发布
       </div>
       
    </div>
</template>
<script type="text/javascript">
import Common from "common/js/common";
import shareFn from "common/js/sharefn";
import mainHeader from "base/header/mainheader";
export default {
  data() {
    return {
      headerData: {
        ele: "文章留言",
        name: "leave_message"
      },
      stars: ["1", "2", "3", "4", "5"],
      feedList: [],
      authorInfo: {},
      content: "",
      myScore: 0
    };
  },
  created() {

  },
  activated() {
    this.getAuthor();
  },
  mounted() {
    this.$nextTick(function() {
      this.getAuthor();
    });
  },
  components: {
    mainHeader
  },
  methods: {
    scoreClick(s) {
      this.myScore = s;
    },
    getAuthor() {
      var that = this;
      this.$nextTick(function() {
        this.$http
          .jsonp(Common.baseURI().host + "/Author/GetAuhorInfo", {
            params: {
              language: "M",
              userId: this.shareFn.getUserId(),
              authorId: this.$router.currentRoute.query.authorId,
              token: this.shareFn.getSecurityCode(),
              articleId: 0
            }
          })
          .then(function(res) {
            console.log(res.data.Author);
            if (res.data.Code == "0000") {
              that.authorInfo = res.data.Author;
            } else {
              console.log("请求失败");
            }
          });
      });
    },
    addFeedback() {
      var that = this;
      if (this.content.length < 5 || this.content.length > 200) {
        layer.open({
          content: "留言内容应当在5~200个长度之间！",
          time: 2,
          skin: "msg"
        });
        return false;
      }
      if (this.myScore < 1) {
        layer.open({
          content: "文章评分最少为一分，请您打分！",
          time: 2,
          skin: "msg"
        });
        return false;
      }
      this.$nextTick(function() {
        this.$http
          .post(Common.baseURI().host + "/feedback/add", {
            language: "M",
            userId: this.shareFn.getUserId(),
            securityCode: this.shareFn.getSecurityCode(),
            targetId: this.$router.currentRoute.query.id,
            comment: this.content,
            score: this.myScore
          })
          .then(function(res) {
            console.log(res.data);
            if (res.data.code == "0000") {
              layer.open({
                content: "留言成功，感谢您的评价！",
                btn: ["返回"],
                shadeClose: false,
                yes: function(index) {
                  layer.close(index);
                  that.myScore = 0
                  that.content = ''
                  that.$router.back();
                }
              });
            } else if (res.data.code == "0003") {
            } else {
              console.log("请求失败");
            }
          });
      });
    }
  },
  watch: {}
};
</script>
<style lang="less" type="text/less">
@import "../../common/less/base.less";
.leave-message {
  font-size: 15px;
  color: #333333;
  .top {
    padding: 20px 0px 20px 15px;
    background: #ffffff;
  }
  .star {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    background: #ffffff;
    margin-top: 20px;
    .border-top;
    .border-bottom;
    height: 54px;
    line-height: 54px;
    span {
      background: url(../../common/img/star.png) no-repeat center;
      width: 19px;
      height: 18px;
      background-size: 19px 18px;
      display: block;
      margin-right: 20px;
    }
  }
  .star .on {
    background: url(../../common/img/staron.png) no-repeat center;
    background-size: 19px 18px;
  }
  .teach-infor {
    display: flex;
    display: -webkit-flex;
    background: #ffffff;
    padding-right: 15px;
    dt {
      margin-right: 12px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
    }
    dd {
      .username {
        font-size: 16px;
      }
      .brief {
        font-size: 12px;
        color: #666666;
        padding-top: 8px;
      }
    }
  }
  .text {
    padding-right: 15px;
    margin-top: 20px;
    #content {
      width: 100%;
      outline: none;
      border: none;
      &::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #b1b1b1;
        font-size: 14px;
      }
    }
  }
  .sub {
    width: 90%;
    margin-left: 5%;
    height: 39px;
    line-height: 39px;
    text-align: center;
    color: #ffffff;
    background: #e9311d;
    margin-top: 30px;
    font-size: 16px;
    border-radius: 2px;
  }
}
</style>
