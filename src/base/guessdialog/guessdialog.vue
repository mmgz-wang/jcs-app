<template>
  <div class="guessdialog">
    <div class="guess-dialog-wrap">
      <div class="guess-mask">
        <div class="guess-dialog">
          <div class="guess-hd">
            <img src="../../common/img/e_cup.png" alt="">
            <p class="guess-tit">【爱超】德利城 VS 登克尔克</p>
            <p class="guess-hint">全场让球：-0.5我选主队</p>
            <span class="guess-hide" @click="gusDialogHide()"></span>
          </div>
          <div class="guess-num">
            <span v-for="item in integralVal" @click="chooseVal(item)" :value="item" :class="{on:curIntegralVal==item}">{{item}}积分</span>
          </div>
          <div class="guess-foot">
            <span>当前积分：<i id="integral">{{integral}}</i></span>
            <span class="go-recharge">找客服充值送积分</span>
            <button type="button" @click="subGuess()">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "guessdialog",
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    integral: {
      type: String,
      default: 0
    }

  },
  data () {
    return {
      integralVal: [9,49,99,199,499,999],
      curIntegralVal: 9
    }
  },
  created () {
    console.log(this.item)
  },
  methods: {
    subGuess () {
      this.$emit('subGuess',this.curIntegralVal)
    },
    chooseVal: function (s) {
      console.log(s)
      this.curIntegralVal = s;
    },
    gusDialogHide () {
      this.$emit('gusDialogHide')
    }
  }
}
</script>

<style lang="less">
.guessdialog {
    width: 100%;
    height: 100%;
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
    background: url("../../common/img/gusclose.png") no-repeat center;
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
    border: 1px solid #ffd842;
    width: 28%;
    font-size: 14px;
    margin-top: 20px;
    border-radius: 50px;
    padding: 0 10px;
    line-height: 34px;
    text-align: center;
    color: #ffd842;
  }
  .guess-num .on{
    background: #ffd842;
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
    background: #ffd842;
    font-size: 16px;
    outline: none;
    border: none;
  }
  .go-recharge{
    color: #ffd842;
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
    border-right:1px solid #ffd842;
    border-bottom:1px solid #ffd842;
    transform: rotate(-45deg);
    transform-origin: center;
  }
  .guess-balance{
    font-size: 1px;
    margin: 10px 0 30px 0;
  }

}
</style>
