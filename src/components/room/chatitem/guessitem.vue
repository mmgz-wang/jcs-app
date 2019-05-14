<template>
  <div>
    <section :key="item.messageId" class="left guess-section">
      <div class="pic" @click="goauthor(item.userId)">
        <img :src="item.userPic" alt="">
      </div>
      <div class="msg">
        <p class="tim">{{item.userName}} {{item.createTime.substr(5,11)}}</p>
        <div class="dialog">
          <dl class="teams"
              :class="{'teams-over': item.content.status == 3 || item.content.status == 4}">
            <dt>
              <img src="../../../common/img/d_cup.png" alt="">
            </dt>
            <dd>
              <div class="cup-name">{{item.content.match_teams}}</div>
              <div class="cup-tim">【{{item.content.match_league}}】{{item.content.end_time.substr(5,11)}}</div>
              <div v-if="item.content.value1_purper != undefined" class="guess-goal">
                <span>{{item.content.handicap_name }}</span>
                <span>{{item.content.handicap_plan}}</span>
                <span>({{item.content.value1_name }}</span>
                <span>{{ parseInt(item.content.value1_purper)}}%,</span>
                <span>{{item.content.value2_name}}</span>
                <span>{{parseInt(item.content.value2_purper)}}%)</span>
              </div>
              <div v-else class="guess-goal">{{item.content.handicap_name}} {{item.content.handicap_plan}}</div>
            </dd>
          </dl>
          <div class="guess-item">
            <template v-if="item.content.status == 1">
              <p>
                <span @click="guessTeamClick(item.content, item.content.value2_name)">{{item.content.value2_name}} {{item.content.value2_plan}}</span>
                <span @click="guessTeamClick(item.content, item.content.value1_name)">{{item.content.value1_name}} {{item.content.value1_plan}}</span>
              </p>
            </template>
            <template v-if="item.content.status==2">
              <p class="onlyline">水位变化，暂停投注</p>
            </template>
            <template v-if="item.content.status==3">
              <p class="onlyline">投注停止</p>
            </template>
            <template v-if="item.content.status==4">
              <p class="result onlyline">结果：<span>{{item.content.match_result || item.content.match_rdesc}}</span></p>
            </template>
          </div>
          <div class="me-val"
               v-if="item.content.guessingPlanSaleList != undefined && item.content.guessingPlanSaleList.length>0"
               v-html="jointStr(item.content)">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'guessitem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  created () {
    this.item.content = JSON.parse(this.item.content)
  },
  methods: {
    jointStr(data) {
      var str = '';
      for (var i = 0; i < data.guessingPlanSaleList.length; i++) {
        str += `<p><i>${data.guessingPlanSaleList[i].cdate.substr(5, 11).replace(/-/, "/")}</i>我选 ${data.guessingPlanSaleList[i].invest_target}`
        if (data.status == 4) {
          str += `获得 <span>${data.guessingPlanSaleList[i].result}`
        } else {
          str += `投注 <span>${data.guessingPlanSaleList[i].cost}`
        }
        str += `</span> 精彩币</p>`
      }
      return str;
    },
    guessTeamClick (item, meval) {
      this.$emit('guessTeamClick', item, meval)
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../common/less/base.less';
  .guess-section {
    width: 100%;
    height: auto;
    float: left;
  }

  .guess-section {
    width: 100%;
    float: left;
    margin-top: 15px;
    font-size: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .guess-section .pic {
    float: left;
    width: 15%;
    padding-top: 5px;
  }

  .guess-section .pic .picwrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .guess-section .msg {
    float: left;
    width: 80%;
  }

  .guess-section .msg .tim {
    color: #999;
    font-size: 13px;
    margin-bottom: 5px;
    text-align: left;
  }

  .guess-section .msg .dialog {
    width: 100%;
    color: #000;
    position: relative;
    float: left;
    text-align: left;
    border-radius: 10px;
    padding: 0;
    font-size: 0;
    background: #ffffff;
    overflow: hidden;
  }

  .guess-section .msg .dialog:before {
    border-color: transparent;
  }

  .guess-section .msg .dialog .teams {
    width: 100%;
    height: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-radius: 10px 10px 0 0;
    padding: 15px 10px;
    background: -webkit-gradient(linear, left top, right top, from(#ff8d4f), to(#f97757));
    background: linear-gradient(to right, #ff8d4f, #f97757);
  }

  .guess-section .msg .dialog .teams dt {
    margin-right: 10px;
  }

  .guess-section .msg .dialog .teams dd {
    font-size: 0;
    text-align: center;
    flex-grow: 1;
  }

  .guess-section .msg .dialog .teams dd div {
    font-size: 14px;
    color: #fff;
  }

  .guess-section .msg .dialog .teams dd .cup-tim {
    font-size: 10px;
  }

  .guess-section .msg .dialog .teams dd .guess-goal {
    color: #ba2c00;
    font-size: 11px;
  }

  .guess-section .msg .dialog .teams dd .cup-name {

  }

  .guess-section .msg .dialog .teams img {
    width: 35px;
  }

  .guess-section .msg .dialog .teams-over {
    background: -webkit-gradient(linear, left top, right top, from(#b3babf), to(#92969c));
    background: linear-gradient(to right, #b3babf, #92969c);
  }

  .guess-section .msg .dialog .teams-over dd .guess-goal {
    color: #4f5154;
  }

  .guess-section .msg .dialog .guess-item {
    width: 100%;
    background: #fff;
    padding: 0 20px;
    color: rgba(173, 173, 173, 0.678);
  }

  .guess-item p {

    font-size: 15px;
  }

  .guess-section .msg .dialog .guess-item p:nth-child(1) {
    padding: 14px 0 14px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .guess-section .msg .dialog .guess-item p:nth-child(1) span {
    background: #f97757;
    height: 28px;
    font-size: 13px;
    color: #fff;
    text-align: center;
    padding: 0 22px;
    border-radius: 50px;
    line-height: 28px;
  }

  .guess-section .msg .dialog .guess-item p:nth-child(2) {
    font-size: 12px;
    text-align: center;
    padding-bottom: 15px;
  }

  .guess-section .msg .dialog .guess-item .onlyline {
    display: block !important;
    text-align: center;
  }

  .guess-section .msg .dialog .guess-item .result {
    text-align: center;
    color: #fa7b56;
    font-size: 16px;
    -ms-flex-pack: distribute;
    justify-content: space-around;
  }

  .guess-section .msg .dialog .me-val {
    width: 100%;
    float: left;
    background: #fafafa;
    color: #666;
    font-size: 12px;
    position: relative;
    padding-left: 0px;
    border-radius: 0 0 10px 10px;
    padding-bottom: 14px;
    text-align: center;
  }

  .guess-section .msg .dialog .me-val:before {
    height: 1px;
    content: '';
    width: 100%;
    border-top: 1px solid #e0e0e0;
    position: absolute;
    top: -1px;
    right: 0;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 9999;
  }

  .guess-section .msg .dialog .me-val p {
    padding-top: 10px;
    line-height: 1;
    text-align: center;
  }

  .guess-section .msg .dialog .me-val p i {
    color: #999;
    font-style: normal;
  }

  .guess-section .msg .dialog .me-val p span {
    color: #f97757;
  }

  .guess-section .msg .jmsgimg {
    width: 100px;
    height: auto;
    float: left;
    min-height: 100px;
    border-radius: 3px;
  }


  .guess {
    font-size: 0.15rem;
    color: #DDDDDD;
    padding: 0 15px;
    background: #333333;
    margin-bottom: 10px;
  }

  .guess-top {
    position: relative;
  }

  .guess-top:before {
    height: 1px;
    content: '';
    border-top: 1px solid #434343;
    position: absolute;
    bottom: -1px;
    right: -15px;
    left: 0px;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 9999;
  }

  .guess-top p:nth-child(1) {
    font-size: 11px;
    color: #999999;
    line-height: 1;
    padding-top: 18px;
  }

  .guess-top p:nth-child(2) {
    padding: 7px 0 18px 0;
  }

  .guess-top p:nth-child(2) span {
    line-height: 1;
    padding: 2px 10px;
    border: 1px solid #ffd842;
    color: #ffd842;
    display: inline-block;
    border-radius: 20px;
    font-size: 10px;
    float: right;
  }

  .guess-top p .over_guess {
    border-color: #666666 !important;
    color: #666666 !important;
  }

  .guess-logo {
    width: 26px;
    height: 25px;
    position: absolute;
    right: 15px;
    top: 0;
    background-image: url("../../../common/img/guess_b.png");
    background-repeat: no-repeat;
    background-size: 26px 25px;
  }

  .gary {
    width: 26px;
    height: 25px;
    position: absolute;
    right: 15px;
    top: 0;
    background-image: url("../../../common/img/over.png");
    background-repeat: no-repeat;
    background-size: 26px 25px;
  }

  .guess-center {
    height: 54px;
    line-height: 54px;
    position: relative;
    font-size: 14px;
  }

  .guess-center:before {
    height: 1px;
    content: '';
    border-top: 1px solid #434343;
    position: absolute;
    bottom: -1px;
    right: -15px;
    left: 0px;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 9999;
  }

  .guess-center i {
    font-size: 14px;
    color: #888888;
    font-style: normal;
    float: right;
  }

  .guess-center span {
    font-size: 13px;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    background: #ffd842;
    color: #000000;
    padding: 0 15px;
    border-radius: 3px;
    float: right;
    margin-top: 15px;
  }

  .guess-center span:nth-child(1) {
    margin-left: 15px;
  }

  .guess-bottom {
    font-size: 11px;
    color: #99863b;
    line-height: 1;
    padding-bottom: 9px;
  }

  .guess-bottom p {
    padding-top: 9px;
  }
</style>
