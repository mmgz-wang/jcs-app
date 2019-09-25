<template>
  <div class="guessdialog" v-show="active">
    <div class="guess-dialog-wrap" >
      <div class="guess-mask">
        <div class="guess-dialog">
          <div class="guess-hd">
            <!--<img src="../../common/img/e_cup.png" alt="">-->
            <p class="guess-tit"><label style="color: #666666">[{{item.match_league}}]</label>{{item.match_teams}}</p>
            <p class="guess-hint">
              <label style="font-weight: bold">{{mychoose.length>1 ? mychoose.slice(0,1): mychoose}}</label>
              (<label>{{handicap_name}}<label class="sharpen">{{handicap_plan}}</label></label>)
              (高 {{mychoosePlanHigh}})
              (低 {{mychoosePlanLow}})
              <img @click="guessPlain()" style="width: 20px;vertical-align:text-bottom"
                   src="../../common/img/wenhao.png" alt="">
            </p>
            <span class="guess-hide" @click="hide()"></span>
          </div>
          <div class="auto_matching">
            <input type="checkbox" id="awesome" v-model="autoMatching"/>
            <label for="awesome">
            </label>
            <label class="auto_match_des">
              高返奖撮合失败,自动参与不超过1000币的低返奖
              <img @click="guessPlain()" style="width: 20px;height: 20px;vertical-align:text-bottom"
                   src="../../common/img/wenhao.png"/>
            </label>
          </div>
          <div class="guess-num">
            <span v-for="item in moneyArr"
                  @click="numCli(item)"
                  :value="item"
                  :class="{on:curIntegralVal==item}">{{item}}币</span>
          </div>
          <div class="accord-num">
             <span>
               <input type="text" @input="pressnum($event)" v-model.trim="curIntegralVal" placeholder="请输入竞猜额"/>
             </span>
            <span>
              <label class="moneyLimitTip">{{betMoneyLimitTipMsg}}</label>
            </span>
          </div>
          <div class="help-num">
            如需协助，请+微信: <label style="color: #5168CD;margin-right: 0.1rem">JCSxiaoyang</label> 加微信 送好礼呦!
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
  import {getDataList} from 'common/api/apidata'

  export default {
    name: 'guessdialog',
    props: {
      moneyArr: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        item: {},
        mychoose: '',
        handicap_name: '',
        handicap_plan: '',
        mychoosePlanHigh: '',
        mychoosePlanLow: '',
        mychooseUpDown: '',
        betLimitData: '',
        curIntegralVal: 0,
        betMoneyLimitTipMsg: '',
        betMoneyLimitToolsMsg: '超出限额，您可以考虑反向竞猜或联系客服！',
        active: false,
        money: '',
        targetSource: '',
        autoMatching: true //自动匹配高水checkBox
      }
    },
    created() {
      // this.getData()  
    },
    mounted() {
      
    },
    methods: {
      pressnum(event) {
        this.curIntegralVal = this.curIntegralVal.replace(/[^\d]/g, '');
        // this.checkBetMoneyLimit();
      },
      guessPlain() {
        this.$router.push({name: 'guessExplain'});
      },
      numCli(opt) {
        this.curIntegralVal = opt;
        // this.checkBetMoneyLimit();
      },
      checkBetMoneyLimit() {
        // console.log('判断投注额度');
        //判断投注额度
        if (this.mychooseUpDown == 'up') {
          if (this.betLimitData.upMaxGuessBetValue != -1 && this.curIntegralVal > this.betLimitData.upMaxGuessBetValue) {
            this.layerOpen(this.betMoneyLimitToolsMsg);
            if (this.betLimitData.upMaxGuessBetValue <= 0) {
              this.betMoneyLimitTipMsg = '实时额度: ' + 0;
            } else {
              this.betMoneyLimitTipMsg = '实时额度: ' + parseInt(this.betLimitData.upMaxGuessBetValue);
            }
            return true;
          }
        } else if (this.mychooseUpDown == 'down') {
          if (this.betLimitData.downMaxGuessBetValue != -1 && this.curIntegralVal > this.betLimitData.downMaxGuessBetValue) {
            this.layerOpen(this.betMoneyLimitToolsMsg);
            if (this.betLimitData.downMaxGuessBetValue <= 0) {
              this.betMoneyLimitTipMsg = '实时额度: ' + 0;
            } else {
              this.betMoneyLimitTipMsg = '实时额度: ' + parseInt(this.betLimitData.downMaxGuessBetValue);
            }
            return true;
          }
        }
        this.betMoneyLimitTipMsg = '';
        return false;
      },
      //确认按钮
      subGuess() {
        if (this.curIntegralVal < 10) {
          this.layerOpen('最小额度为10');
          return false;
        }
        if (this.checkBetMoneyLimit()) {
          return false;
        }
        if (this.curIntegralVal > this.money) {
          this.layerOpen('您的精彩币不足');
          return false;
        }
        this.finalDataSub();
        //最后校验盘口水位是否有变化
        this.$get('/assets/getGuessDataByGuessId', {
          userId: this.shareFn.getUserId(),
          token: this.shareFn.getSecurityCode(),
          guess_id: this.item.id
        }).then(res => {
          let nowOdds = res;
          // console.log('提交确认时的：' + JSON.stringify(nowOdds));
          if (this.mychooseUpDown == 'up') {
            if (this.mychoosePlan != nowOdds.value1_plan || this.item.handicap_plan != nowOdds.handicap_plan) {
              //不一致，确认框提示
              if (confirm('数据发生变化,确认继续吗?') == true) {
                this.finalDataSub();
                return true;
              } else {
                return false;
              }
            } else {
              this.finalDataSub();
            }
          } else if (this.mychooseUpDown == 'down') {
            if (this.mychoosePlan != nowOdds.value2_plan || this.item.handicap_plan != nowOdds.handicap_plan) {
              //不一致,确认框提示
              if (confirm('数据发生变化,确认继续吗?') == true) {
                this.finalDataSub();
                return true;
              } else {
                return false;
              }
            } else {
              this.finalDataSub();
            }
          }
        });

      },
      finalDataSub() {
        // console.log('最终数据提交.....');
        this.$get('/assets/purchaseGuessing', {
          userId: shareFn.getUserId(),
          Language: 'M',
          token: shareFn.getSecurityCode(),
          guessing_plan_id: this.item.id,
          cost: this.curIntegralVal,
          invest_target: this.mychoose,
          purchaseType: 3,
          transaction_type: this.autoMatching ? 1 : 0
        }).then(res => {
          // console.log("投注返回数据:");
          console.log(res);
          if (res.code == '0000') {

            this.money -= this.curIntegralVal * 1
            shareFn.setCookie('money', this.money, 1);
            this.$emit('guessSuccess')
            if (this.targetSource == 'list') {
              // console.log('来源于竞猜列表!');
            } else if (this.targetSource == 'list_myguess') {
              // console.log('来源于我的竞猜!');
            } else {
              this.layerOpen(res.msg)
            }
          } else {
            this.layerOpen(res.msg)
          }
          this.active = false;
          this.betMoneyLimitTipMsg = '';
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
        }, function (res) {
          alert('请求失败！')
        })
      },
      //获取竞猜额度
      getBetLimit() {
        this.$get('/assets/getGuessMoneyLeft',
          {
            userId: this.shareFn.getUserId(),
            token: this.shareFn.getSecurityCode(),
            language: 'M',
            guess_id: this.item.id
          }
        ).then(res => {
          console.log('获取竞猜额度');
          console.log(res);
          this.betLimitData = res;
        }, function (res) {
          alert('请求失败！')
        })
      },
      //获取竞猜最新盘口水位
      betOdds() {
        this.$get('/assets/getGuessDataByGuessId', {
          userId: this.shareFn.getUserId(),
          token: this.shareFn.getSecurityCode(),
          guess_id: this.item.id
        }).then(res => {
          console.log('获取竞猜最新赔率');
          let newOdds = res;
          console.log(newOdds);
          this.item.handicap_plan = newOdds.handicap_plan;
          this.handicap_name = newOdds.handicap_name;
          this.handicap_plan = newOdds.handicap_plan;
          if (this.mychooseUpDown == 'up') {
            this.mychoosePlanHigh = newOdds.value1_plan;
            this.mychoosePlanLow = newOdds.value1_refe;
          } else if (this.mychooseUpDown == 'down') {
            this.mychoosePlanHigh = newOdds.value2_plan;
            this.mychoosePlanLow = newOdds.value2_refe;
          }
        })
      },
      show() {
        //     console.log("显示竞猜pop,传递参数:");
        // console.log(arguments);
        // console.log(this.moneyArr);
        if (arguments[1] != undefined && arguments[1] == 'list') {
          this.targetSource = 'list';
        }

        if (arguments[1] != undefined && arguments[1] == 'list_myguess') {
          this.targetSource = 'list_myguess';
        }
        // console.log('默认选中第一个::', this.moneyArr[0]);
        this.item = arguments[0][0];
        this.betOdds();
        this.getData();
        this.getBetLimit();
        this.mychoose = arguments[0][1];
        // this.mychoosePlan = arguments[0][2];
        this.mychooseUpDown = arguments[0][3];
        this.curIntegralVal = this.moneyArr[0];
        this.active = true

      },
      hide() {
        // console.log('我要隐藏了......');
        this.$emit('guessHide');
        this.curIntegralVal = this.moneyArr[0];
        this.active = false;
        this.betMoneyLimitTipMsg = '';
      },
      layerOpen(msg) {
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
    .guess-dialog-wrap {
      width: 100%;
      height:100%;
      position: fixed;
      left:0;
      top:0;
      z-index:999;
     
    }

    .guess-mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top:0;
      left:0;
      z-index: 99;
    }

    @-moz-document url-prefix(){
      .guess-mask{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top:0;
        left:0;
        z-index: 9999;
      }
    }
    .guess-dialog {
      width: 100%;
      position: fixed;
      left: 0;
      bottom:0;
      background: #f4f4f4;
      text-align: center;
      border-radius: 15px 15px 0 0;
    }

    .guess-hide {
      background: url("../../common/img/gusclose.png") no-repeat center;
      -webkit-background-size: 18px;
      background-size: 18px;
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.01rem;
      top: 0.01rem;
    }

    .guess-hd {
      background: #ffffff;
      position: relative;
      -webkit-border-radius: 15px 15px 0 0;
      -moz-border-radius: 15px 15px 0 0;
      border-radius: 15px 15px 0 0;
    }

    .guess-tit {
      font-size: 15px;
      color: #000000;
      padding-bottom: 10px;
      padding-top: 20px;
    }

    .guess-hint {
      padding-bottom: 10px;
      font-size: 15px;
      color: #666666;
    }

    .guess-hd img {
      width: 79px;
      margin-top: -20px;
    }

    .guess-gary {
      opacity: 0.3;
    }

    .guess-num {
      margin: 0 0 15px 0;
      padding: 0 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .accord-num {
      display: flex;
      height: 40px;
    }

    .accord-num input {
      line-height: 30px;
      width: 60%;
      border: none;
      text-align: center;
      outline: none;
      color: red;
      font-size: 18px;
      border-radius: 1rem;
      //background: transparent;
    }

    .accord-num span {
      width: 50%;
      font-size: 14px;
      /*margin-top: 20px;*/
      /*border-radius: 50px;*/
      /*padding: 0 10px;*/
      /*line-height: 34px;*/
      /*text-align: center;*/
      /*color: #e9311d;*/
    }

    .moneyLimitTip {
      float: left;
      padding-top: 5px;
      font-size: 16px;
    }

    .guess-num span {
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

    .guess-num .on {
      background: #e9311d;
      color: #ffffff;
    }

    .guess-num .btngary {
      border-color: #666666;
      color: #666666;
    }

    .guess-num p {
      width: 205px;
      margin: 0 auto;
      position: relative;
    }

    .guess-num p:after {
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

    .selector-open {
      height: auto;
      overflow: auto;
    }

    .guess-num input {
      line-height: 45px;
      width: 205px;
      border: none;
      text-align: center;
      outline: none;
      color: #ddd;
      font-size: 15px;
      background: transparent;
    }

    .guess-num input::-webkit-input-placeholder { /* WebKit browsers */
      color: #666666;
      font-size: 15px;
    }

    .guess-num input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #666666;
      font-size: 15px;
    }

    .guess-num input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #666666;
      font-size: 15px;
    }

    .guess-num input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #666666;
      font-size: 15px;
    }

    .guess-foot {
      width: 100%;
      height: 49px;
      padding-left: 15px;
      line-height: 49px;
      background: #ffffff;
      position: relative;
      text-align: left;
      font-size: 13px;
      color: #000000;
      z-index: 99999;
      margin-bottom: 10px;
    }

    .guess-foot button {
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

    .go-recharge {
      margin-left: 25px;
      position: relative;

      a {
        color: #e9311d;
      }
    }

    .go-recharge:after {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      margin-top: -5px;
      width: 9px;
      height: 9px;
      border-right: 1px solid #e9311d;
      border-bottom: 1px solid #e9311d;
      transform: rotate(-45deg);
      transform-origin: center;
    }

    .guess-balance {
      font-size: 1px;
      margin: 10px 0 30px 0;
    }

    #integral {
      color: #e9311d;
    }

    .sharpen {
      color: red;
      font-weight: bold;
    }

    .plan_wh {
      width: 15px;
    }

    .auto_matching {
      display: flex;
      font-size: 15px;
      color: #666666;
      margin-left: 0.1rem;
    }

    input[type="checkbox"] + label::before {
      content: "\a0"; /*不换行空格*/
      display: inline-block;
      vertical-align: .4em;
      width: 1.8em;
      height: 1.8em;
      margin-right: .2em;
      margin-top: 0.1rem;
      background-image: url("../../common/img/checkNo.png");
    }

    input[type="checkbox"]:checked + label::before {
      background-image: url("../../common/img/checkYes.png");
    }

    input[type="checkbox"] {
      position: absolute;
      clip: rect(0, 0, 0, 0);
    }

    .help-num {
      display: flex;
      font-size: 15px;
      background-color: #F8EFE0;
      color: #BB9676;
      height: 0.3rem;
      line-height: 0.3rem;
      padding-left: 0.1rem;
      letter-spacing: 0.04em;
    }

    .auto_match_des {
      padding-top: 0.14rem;
    }

  }
</style>
