<template>
  <div class="guessdialog" v-show="active">
    <div class="guess-dialog-wrap">
      <div class="guess-mask">
        <div class="guess-dialog">
          <div class="guess-hd">
            <img src="../../common/img/e_cup.png" alt="">
            <p class="guess-tit">【{{item.match_league}}】{{item.match_teams}}</p>
            <p class="guess-hint">{{item.handicap_name}} {{item.handicap_plan}} 我选{{mychoose}}</p>
            <span class="guess-hide" @click="hide()"></span>
          </div>
          <div class="guess-num">
            <span v-for="item in moneyArr"
                  @click="curIntegralVal = item"
                  :value="item"
                  :class="{on:curIntegralVal==item}">{{item}}币</span>
          </div>
          <div class="guess-foot">
            <span>当前精彩币：<i id="integral">{{money}}</i></span>
            <span class="go-recharge"><router-link to="/recharge"> 去充值</router-link></span>
            <button type="button" @click="subGuess()">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shareFn from 'common/js/sharefn'
import Common from 'common/js/common.js'
export default {
  name: 'guessdialog',
  props: {
    moneyArr: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      item: {},
      mychoose: '',
      curIntegralVal: 0,
      active: false,
      money: ''
    }
  },
  created () {
     this.getData()
  },
  mounted () {
   
  },
  methods: {
    subGuess () {
      this.$get('/assets/purchaseGuessing', {
        userId: shareFn.getUserId(),
        Language: 'M',
        token: shareFn.getSecurityCode(),
        guessing_plan_id: this.item.id,
        cost: this.curIntegralVal,
        invest_target: this.mychoose,
        purchaseType: 3
      }).then(res => {
        if (res.code == '0000') {
          this.layerOpen(res.msg)
          this.money -= this.curIntegralVal * 1
          shareFn.setCookie('money', this.money, 1);
          this.$emit('guessSuccess')
        } else {
          this.layerOpen(res.msg)
        }
        this.active = false
      }).catch(err => {
        this.layerOpen(JSON.stringify(err))
      })
    },
    getData() {
        this.$get('/User/GetUserInfo',
          {
            userId: this.shareFn.getUserId(),
            token: this.shareFn.getSecurityCode(),
            language: 'M'
          }
        ).then(res => {
          this.money = res.Money
          console.log(this.money)
        }, function (res) {
          alert('请求失败！')
        })
    },
    show () {
      this.getData()
      this.item = arguments[0][0]
      this.mychoose = arguments[0][1]
      this.curIntegralVal = this.moneyArr[0]
      this.active = true
    },
    hide () {
      this.curIntegralVal = this.moneyArr[0]
      this.active = false
    },
    layerOpen (msg) {
      layer.open({
        content: msg,
        time: 2,
        skin: 'msg',
        anim: 'scale'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.guessdialog {
    width: 100%;
    height: 100%;
  .guess-dialog-wrap{
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }

  .guess-mask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 88;
  }

  .guess-dialog{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #f4f4f4;
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
    background: #ffffff;
    position: relative;
    -webkit-border-radius: 15px 15px 0 0;
    -moz-border-radius: 15px 15px 0 0;
    border-radius: 15px 15px 0 0;
  }
  .guess-tit{
    font-size: 15px;
    color: #000000;
    padding-bottom: 10px;
  }
  .guess-hint{
    padding-bottom: 20px;
    font-size: 15px;
    color: #666666;
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
    color: #ffffff;
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
    background: #ffffff;
    position:relative;
    text-align: left;
    font-size: 13px;
    color: #000000;
    z-index: 99999;
  }
  .guess-foot button{
    width: 105px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    color: #ffffff;
    background: #e9311d;
    font-size: 16px;
    outline: none;
    border: none;
  }
  .go-recharge{
    margin-left: 25px;
    position:relative;
    a{
      color: #e9311d;
    }
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
  #integral{
    color: #e9311d;
  }

}
</style>
