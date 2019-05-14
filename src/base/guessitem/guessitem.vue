<template>
  <div class="guesslist" :key="item.id">
    <div class="guess">
      <div class="guess-top">
        <p>{{item.match_league}} {{item.end_time.substr(5,11)}}</p>
        <p>{{item.match_teams}}
          <span v-if="item.status < 3">进行中</span>
          <span v-if="item.status >= 3" class="over_guess">已结束</span>
        </p>
        <span class="guess-logo" :class="{'gary':item.status >= 3}"></span>
      </div>
      <div class="guess-center">{{item.handicap_name}}<span style="color: #e9311d">{{item.handicap_plan}}</span>
        <template v-if="item.status==1">
          <span btn @click="teamClick(item, item.value2_name)">{{item.value2_name}} {{item.value2_plan}}</span>
          <span btn style="margin-right: 15px" @click="teamClick(item, item.value1_name)">{{item.value1_name}} {{item.value1_plan}}</span>
        </template>
        <template v-if="item.status==2">
          <i>水位变化，暂停投注</i>
        </template>
        <template v-if="item.status==3">
          <i>投注停止</i>
        </template>
        <template v-if="item.status==4">
          <i res> 结果：<span>{{item.match_rdesc}}</span></i>
        </template>
      </div>
      <div class="guess-bottom" v-if="item.value1_purper != undefined && (parseInt(item.value1_purper) != 0 || parseInt(item.value2_purper) != 0)">
        <p>{{item.value1_name}}投注量：{{parseInt(item.value1_purper)}}%，{{item.value2_name}}投注量：{{parseInt(item.value2_purper)}}%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "guesslist",
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  methods: {
    teamClick (item, val) {
      this.$emit('guessTeamClick',item, val)
    }
  }
}
</script>

<style lang="less">
.guesslist {
  width: 100%;
  height: auto;
  #integral{
    font-style: normal;
  }

  .guess{
    font-size: 15px;
    color: #333333;
    padding: 0 15px;
    background: #ffffff;
    margin-bottom: 10px;
    clear: both;
  }
  .guess-top{
    position:relative;
  }
  .guess-top:before{
    height: 1px;
    content: '';
    border-top: 1px solid #e0e0e0;
    position: absolute;
    bottom: -1px;
    right: -15px;
    left: 0px;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 9999;
  }
  .guess-top p:nth-child(1){
    font-size: 11px;
    color: #666666;
    line-height: 1;
    padding-top: 18px;
  }
  .guess-top p:nth-child(2){
    padding: 7px 0 18px 0;
  }
  .guess-top p:nth-child(2) span{
    line-height: 1;
    padding: 2px 10px;
    border: 1px solid #e9311d;
    color: #e9311d;
    display: inline-block;
    border-radius: 20px;
    font-size: 10px;
    float: right;
  }
  .guess-top p .over_guess{
    border-color: #666666 !important;
    color: #666666 !important;
  }
  .guess-logo{
    width: 26px;
    height: 25px;
    position: absolute;
    right: 15px;
    top: 0;
    background-image: url("../../common/img/guess_b.png");
    background-repeat: no-repeat;
    background-size: 26px 25px;
  }
  .gary{
    width: 26px;
    height: 25px;
    position: absolute;
    right: 15px;
    top: 0;
    background-image: url("../../common/img/over.png");
    background-repeat: no-repeat;
    background-size: 26px 25px;
  }
  .guess-center{
    height: 54px;
    line-height: 54px;
    position: relative;
    font-size: 14px;
  }
  .guess-center:before{
    height: 1px;
    content: '';
    border-top: 1px solid #e0e0e0;
    position: absolute;
    bottom: -1px;
    right: -15px;
    left: 0px;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 9999;
  }
  .guess-center i{
    font-size: 14px;
    color: #888888;
    font-style: normal;
    float: right;
  }
  .guess-center span[btn]{
    font-size: 13px;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    background: #e9311d;
    color: #ffffff;
    padding: 0 7px;
    border-radius: 3px;
    float: right;
    margin-top: 15px;
  }
  .guess-center span[btn]:nth-child(1){
    margin-left:  15px;
  }
  .guess-center i[res]{
    color: #FFFFFF;
  }
  .guess-center i[res]:nth-child(1){
    margin-left: 10px;
  }
  .guess-center i[res] span{
    color: #e9311d;
  }
  .guess-bottom{
    font-size: 11px;
    color: #999999;
    line-height: 1;
    padding-bottom: 9px;
  }
  .guess-bottom p{
    padding-top: 9px;
  }

  .guess-dialog-wrap{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }

  .guess-mask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 88;
  }

  .guess-dialog{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #2f2f2f;
    text-align: center;
    border-radius: 15px 15px 0 0;
  }

  .guess-hide{
    background: url("../../common/img/close.png") no-repeat center;
    -webkit-background-size: 18px;
    background-size: 18px;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 9px;
    top: 9px;
  }
  .guess-hd{
    background: #363636;
    position: relative;
    -webkit-border-radius: 15px 15px 0 0;
    -moz-border-radius: 15px 15px 0 0;
    border-radius: 15px 15px 0 0;
  }
  .guess-tit{
    font-size: 15px;
    color: #ddd;
    padding-bottom: 10px;
  }
  .guess-hint{
    padding-bottom: 20px;
    font-size: 15px;
    color: #ddd;
  }
  .guess-hd img{
    width: 79px;
    margin-top: -20px;
  }

  .guess-gary{
    opacity: 0.3;
  }
  .guess-num{
    margin: 15px 0 35px 0;
    padding: 0 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .guess-num span{
    height: 34px;
    border: 1px solid #e9311d;
    width: 28%;
    font-size: 14px;
    margin-top: 20px;
    border-radius: 50px;
    padding: 0 10px;
    line-height: 34px;
    text-align: center;
    color: #e9311d;
  }
  .guess-num .on{
    background: #e9311d;
    color: #000000;
  }
  .guess-num .btngary{
    border-color: #666666;
    color: #666666;
  }
  .guess-num p{
    width: 205px;
    margin: 0 auto;
    position: relative;
  }
  .guess-num p:after{
    height: 1px;
    content: '';
    border-top: 1px solid #444444;
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
    z-index: 3;
  }
  .selector-open{height:auto;overflow: auto;}
  .guess-num input{
    line-height: 45px;
    width: 205px;
    border:none;
    text-align: center;
    outline: none;
    color: #ddd;
    font-size: 15px;
    background: transparent;
  }
  .guess-num input::-webkit-input-placeholder { /* WebKit browsers */
    color:#666666;
    font-size: 15px;
  }
  .guess-num input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#666666;
    font-size: 15px;
  }

  .guess-num input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#666666;
    font-size: 15px;
  }

  .guess-num input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:#666666;
    font-size: 15px;
  }
  .guess-foot{
    width: 100%;
    height: 49px;
    padding-left: 15px;
    line-height: 49px;
    background: #151515;
    position:relative;
    text-align: left;
    font-size: 13px;
    color: #ddd;
  }
  .guess-foot button{
    width: 105px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    color: #000000;
    background: #e9311d;
    font-size: 16px;
    outline: none;
    border: none;
  }
  .go-recharge{
    color: #e9311d;
    padding-left: 15px;
    position:relative;
  }
  .go-recharge:after{
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    margin-top: -5px;
    width: 9px;
    height: 9px;
    border-right:1px solid #e9311d;
    border-bottom:1px solid #e9311d;
    transform: rotate(-45deg);
    transform-origin: center;
  }
  .guess-balance{
    font-size: 1px;
    margin: 10px 0 30px 0;
  }

}
</style>
