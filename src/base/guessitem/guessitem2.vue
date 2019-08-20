<template>
  <div class="guesslist" :key="guess.match_st_id">
    <p class="topIco">
      <span class="guess-logo" :class="{'gary':guess.status >= 3}"></span>
      <span class="guessIng" v-if="guess.status < 3">进行中</span>
      <span class="guessIng over" v-if="guess.status >= 3">已结束</span>
    </p>
    <div class="name">{{guess.match_league}}
      <span>{{guess.end_time_md}}</span>
      <span class="time">{{guess.end_time_hm}}</span>
      <span class="new_play" @click="pageClick('guessExplain')">了解竞猜新玩法</span>
    </div>
    <div class="vsname">
      <label style="font-weight: bold;margin-top: 0.8rem">{{guess.match_teams}}</label>
      <!--<span class="conduct" v-if="guess.status < 3">进行中</span>-->
      <!--<span class="conduct" v-if="guess.status >= 3">已结束</span>-->
    </div>
    <div v-if="guess.status < 3" class="contrast">
      <div class="contc" :class="odd.rightSide ? 'contr' : '' " v-for="(odd,oddIndex) in guess.odds">
        <div class="num">{{odd.handicap_name}}<span>{{odd.handicap_plan}}</span></div>
        <div class="cnt_txt">
          <ul>
            <li @click="teamClick(odd, odd.value1_name,odd.value1_plan,'up')">
              <span
                class="up_name">{{odd.value1_name.length>1 ? odd.value1_name.slice(0,1): odd.value1_name }}</span><br/>
              <span>{{odd.value1_plan}}
                      <label class="low_odd">({{odd.value1_refe}})</label>
                    </span>
            </li>
            <li @click="teamClick(odd, odd.value2_name,odd.value2_plan,'down')">
              <span
                class="up_name">{{odd.value2_name.length>1 ? odd.value2_name.slice(0,1): odd.value2_name}}</span><br/>
              <span>{{odd.value2_plan}}
                      <label class="low_odd">({{odd.value2_refe}})</label>
                    </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="intervalDiv">
    </div>


    <!-- 竞猜成功提示 -->
    <div class="custom cussucc" v-show="jxSuc">
      <div class="pn_566x468">
        <i @click="jxSucClose()"><a>关闭</a></i>
        <span class="txt">竞猜成功</span>
        <div class="txt_btn"><a @click="pageClick('myGuess')">我的竞猜</a><a @click="jxSucClose()" class="jx">继续竞猜</a></div>
      </div>
    </div>
    <!--竞猜弹框-->
    <guess-dialog
      :moneyArr="moneyArr"
      @guessSuccess="guessSuccess()"
      @guessHide="guessHide()"
      ref="guessDialog"></guess-dialog>
  </div>
</template>

<script>

  import guessDialog from 'base/guessdialog/guessdialog2';

  export default {
    name: "guessitem2",
    props: {
      guess: {
        type: Object,
        default: null
      },
      moneyArr:{
        type: Array,
        default: null
      }
    },
    data() {
      return {
        jxSuc: false,
      }
    },
    mounted() {
      console.log('guess数据', this.guess);
    },
    components: {guessDialog},
    methods: {
      guessSuccess() {
        console.log('竞猜成功!');
        this.jxSuc = true;
        this.$emit('hideDiag');
      },
      jxSucClose() {
        console.log('隐藏成功弹层');
        this.jxSuc = false;
        this.$emit('hideDiag');
      },
      guessHide(){
        console.log('隐藏竞猜弹框');
        this.$emit('hideDiag');
      },
      pageClick(target) {
        this.$emit('hideDiag');
        switch (target) {
          case 'guessExplain':
            this.$router.push({name: 'guessExplain'});
            break;
          case 'myGuess':
            if (!this.shareFn.isLogin()) {
              this.$router.push({name: 'enter'});
              return;
            }
            this.$router.push({name: 'my_guess'});
            break;
        }
      },
      //玩法赔率点击
      teamClick() {
        if (this.shareFn.isLogin()) {
          this.$emit('showDiag');
          this.$refs.guessDialog.show(arguments, 'list')
        } else {
          layer.open({
            content: '您还没有登录请先登录！',
            btn: ['确定', '取消'],
            yes: (index) => {
              this.$router.push('/enter');
              layer.close(index)
            },
            no: index => layer.close(index)
          });
        }
      },
    }
  }
</script>

<style lang="less">
  .guesslist {
    width: 100%;
    height: auto;
    background-color: white;
    float: left;

    #integral {
      font-style: normal;
    }

    * {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    img {
      border: 0
    }

    a {
      text-decoration: none
    }

    input {
      border: 0;
      outline: 0
    }

    .topmenu {
      position: relative;
      width: 100%;
      height: 0.45rem;
      line-height: 0.45rem;
      padding: 0 4%;
      background: #e9311d;
      text-align: center;
    }

    .topmenu i {
      position: absolute;
      left: 4%;
      top: 0.14rem;
      width: 0.08rem;
      height: 0.17rem;
      background: url(../../common/img/left_ico.png);
      background-size: 0.08rem 0.17rem
    }

    .topmenu i a {
      display: block;
      width: 0.08rem;
      height: 0.17rem
    }


    .t_tab2 {
      display: inline-block;
      width: 1.82rem;
      margin-bottom: 0.19rem;
    }

    .t_tab2 span {
      float: left;
      width: 100%;
      height: 0.26rem;
      line-height: 0.26rem;
      font-size: 0.16rem;
      color: #fff;
      font-weight: bold;
    }

    .t_tab {
      display: inline-block;
      width: 1.62rem;
      border: 1px #fff solid;
      border-radius: 0.25rem;
      margin-bottom: 0.21rem;
    }

    .t_tab a {
      float: left;
      width: 50%;
      height: 0.26rem;
      line-height: 0.26rem;
      font-size: 0.16rem;
      color: #fff
    }

    .t_tab .now {
      background: #fff;
      color: #e9311d;
      border-radius: 0.25rem
    }

    .top_my {
      position: absolute;
      right: 0.17rem;
      top: 0.06rem;
    }

    .top_my dl {
      float: left;
      width: 0.17rem
    }

    .top_my dt, .top_my dt img {
      float: left;
      width: 100%
    }

    .top_my dd {
      float: left;
      width: 100%;
      height: 0.15rem;
      line-height: 0.15rem;
      font-size: 0.14rem;
      color: #fff
    }

    .top_my .myleft {
      margin-right: 0.27rem;
    }

    /* 内容 */

    .box_bd {
      width: 100%;
      overflow: hidden;
    }

    .box_list {
      display: none;
      float: left;
      width: 100%
    }

    .concnet {
      position: relative;
      margin-bottom: 0.06rem;
      width: 100%;
      padding: 5px 4%;
      overflow: hidden;
      border-bottom: 5px #d1d1d1 solid;
      background: url(../../common/img/conbg.jpg) repeat-x left top #eee;
    }

    .guess-logo {
      width: 26px;
      height: 25px;
      background-image: url("../../common/img/guess_b.png");
      background-repeat: no-repeat;
      background-size: 26px 25px;
      position: absolute;
    }

    .name {
      font-size: 0.14rem;
      color: #333;
      width: 90%;
      margin-left: 0.2rem;
      margin-top: 0.1rem;
    }

    .concnet .name {
      float: left;
      width: 100%;
      margin-top: 0.1rem;
      font-size: 0.14rem;
      color: #666
    }

    .concnet .name span {
      color: #333;
      margin-left: 0.07rem
    }

    .concnet .name .time {
      color: #cc0000
    }

    .new_play {
      color: #798CDA;
    }

    .vsname {
      position: relative;
      float: left;
      width: 90%;
      line-height: 0.46rem;
      font-size: 0.16rem;
      color: #333;
      text-align: center;
    }

    .vsname span {
      margin: 0 0.2rem;
      font-size: 0.11rem;
      color: #999
    }

    .conduct {
      position: absolute;
      right: -0.15rem;
      top: 0.15rem;
      width: 0.41rem;
      height: 0.16rem;
      line-height: 0.16rem;
      border: 1px #e9311d solid;
      color: #e9311d !important;
      border-radius: 0.15rem
    }

    .contrast {
      float: left;
      width: 90%;
      background: url(../../common/img/line.png) no-repeat center center;
      margin-left: 0.2rem;
      //margin-top: 0.1rem
    }

    .contc {
      float: left;
      width: 1.5rem;
      color: #333;
    }

    .contc .num {
      float: left;
      width: 100%;
      font-size: 0.14rem;
      text-align: center;
    }

    .contc .num span {
      color: #cc0000
    }

    .cnt_txt {
      float: left;
      width: 100%;
      margin: 0.08rem 0;
      border: 1px #bfbfbf solid;
      background: #fff;
      border-left: 0;
    }

    .cnt_txt ul li {
      float: left;
      width: 50%;
      height: 0.4rem;
      /*line-height: 0.23rem;*/
      text-align: center;
      font-size: 0.12rem;
      border-left: 1px #bfbfbf solid;
    }

    .cnt_txt .now {
      background: #ed9187;
      border: 1px #e9311d solid;
      color: #fff
    }

    .contr {
      float: right;
      color: #333;
      width: 1.5rem;
    }

    .custom {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
    }

    .pn_566x468 {
      display: inline-block;
      width: 2.87rem;
      height: 2.37rem;
      margin-top: 1.37rem;
      background: url(../../common/img/succ.png);
      background-size: 2.87rem 2.37rem
    }

    .cussucc {
      text-align: center;
      z-index: 999;
    }

    .pn_566x468 i {
      float: right;
      width: 0.24rem;
      height: 0.24rem;
      margin: 0.3rem 0.1rem 0 0;
      background: url(../../common/img/closeSuc.png);
      background-size: 0.24rem 0.24rem;
      text-indent: -9999px
    }

    .pn_566x468 i a {
      display: block;
    }

    .pn_566x468 .txt {
      float: left;
      width: 100%;
      margin-top: 0.9rem;
      font-size: 0.17rem;
      color: #333
    }

    .txt_btn {
      float: left;
      width: 100%;
      height: 0.44rem;
      line-height: 0.44rem;
      margin-top: 0.27rem;
    }

    .txt_btn a {
      display: inline-block;
      width: 50%;
      text-align: center;
      font-size: 0.14rem;
      color: #333;
      float: left;
    }

    .txt_btn .jx {
      color: #cc0000
    }

    .choose {
      width: 100%;
      margin: auto;
      overflow-y: scroll;
      height: fill-available;
      height: -webkit-fill-available;
      height: fill-available;
    }

    .choose ul li {
      float: left;
      width: 0.9rem;
      height: 0.31rem;
      line-height: 0.31rem;
      margin: 0.1rem 0 0 0.15rem;
      border: 1px #b8b8b8 solid;
      border-radius: 0.03rem;
      font-size: 0.13rem;
      color: #999;
      text-align: center;
    }

    .choose ul li a {
      display: block;
      color: #999
    }

    .choose .now {
      background: #fdeae8;
      border: 1px #e9311d solid;
    }

    .choose .now a {
      color: #e9311d
    }


    .guess-foot {
      width: 100%;
      height: 0.5rem;
      background: #ffffff;
      font-size: 0.14rem;
      color: #000000;
      clear: both;
      line-height: 0.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
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

    .guess-foot .all {
      float: left;
    }

    .guess-foot .chos-btn {
      float: right;
    }

    .guess-foot .all-chos {
      width: 0.18rem;
      height: 0.18rem;
      border: 1px solid #aeaeae;
      border-radius: 888px;
      display: inline-block;
      margin: 0rem 0.05rem 0 0.1rem;
      -webkit-transform: translateY(0.02rem);
      -moz-transform: translateY(0.02rem);
      -ms-transform: translateY(0.02rem);
      -o-transform: translateY(0.02rem);
      transform: translateY(0.02rem);
      position: relative;
    }

    .guess-foot .chosOn {
      background: red;
      border-color: #ffd842;
    }

    .guess-foot .chosOn:after {
      content: "";
      width: 0.10rem;
      height: 0.05rem;
      display: inline-block;
      border: 2px solid transparent;
      border-left-color: #313131;
      border-bottom-color: #313131;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -0.07rem;
      margin-top: -0.06rem;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }

    .guess-foot .num-chos {
      color: red;
      font-weight: 600;
    }

    .noData {
      font-size: 0.18rem;
      width: 100%;
      text-align: center;
      position: absolute;
      top: 0.5rem;
    }

    .up_name {
      line-height: 0.2rem;
    }

    .low_odd {
      font-size: 0.10rem;
      color: #666666;
    }
  }

  .intervalDiv {
    float: left;
    width: 100%;
    background-color: #F4F4F4;
    height: 0.1rem;
  }

  .topIco {
    font-size: 0.14rem;
    color: #333;
    position: absolute;
    margin-left: 3.1rem;
  }

  .guessIng {
    color: #e9311d;
    margin-top: 0.3rem;
    display: inline-block;
    margin-left: -0.1rem;
  }

  .over {
    color: #666;
  }

</style>
<style scoped>
  /*.guessdialog >>> .guess-mask{*/
    /*height: 6rem !important;*/
  /*}*/
  .guessdialog >>> .guess-dialog{
    /*margin-bottom: 0.8rem ;*/
    bottom:auto !important;
  }
</style>
