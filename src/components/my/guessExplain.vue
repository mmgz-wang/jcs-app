<template>
  <div class="help">
    <main-header v-if="!inXCX" :headerData="headerData"></main-header>
    <div class="help-service">
      <p class="title">赛事竞猜—一种全新多对多对战的新型体育游戏</p>
      <p class="smallTitle">1、什么是多对多对战的新型体育游戏</p>
      <p class="mainBody">赛事竞猜是一种有关体育赛事的新型对战游戏。</p>
      <p class="mainBody">PK对战的双方都是游戏用户，是用户间进行的“一对一”、“ 一对多”、“多对多”的对战游戏。</p>
      <p class="mainBody">用户基于平台独家算法提供的赛事结果预测及奖励比例，使用游戏积分参战。游戏玩家游戏积分完全是零和对战。</p>
      <p class="mainBody">我们游戏拒绝“抽水”、拒绝“庄家”模式。这是一款完全属于游戏玩家的自己的对战游戏。</p>

      <p class="smallTitle"> 2、什么是高奖励竞猜？PK对战为什么会有高奖励？</p>
      <p class="mainBody">赛事竞猜基于一种全新体育游戏算法，提供了远高于传统体育竞彩的高奖励。单个竞猜选项相对传统体育竞彩平均提高不止10%的奖励额度。页面上提示的所谓高奖励玩法，就是这样的对战玩法。</p>
      <p class="mainBody">由于本游戏完全是用户间零和对战，基于新创算法实现了对战双方虚拟财富的完全对等，剔除了传统体育竞彩的机构坐庄“抽水”模式产生的额外财富流失。</p>

      <p class="smallTitle">3、用户对战是如何实现的？</p>
      <p class="mainBody">对于平台提供的赛事竞猜选项任意用户都可以先参与发起竞猜邀请，等待其他用户应战。用户看到其他用户发起的竞猜邀请后，可以按照自己的意愿全额应战或余额参战。</p>
      <p class="mainBody">对战双方的竞猜需求经平台系统确认有效后，会完成自动撮合，并第一时间回报用户成交明细。如果无人应战或应战额度不足，差额部分会在竞猜比赛开始后自动退还至用户游戏账户。</p>

      <p class="smallTitle">4、什么是低奖励竞猜</p>
      <p class="mainBody">
        为了确保游戏玩家发起的赛事竞猜尽可能撮合成功，对于开赛前还未成交的竞猜邀约，平台会自动支持不高于1000游戏币的低奖励率的自动撮合。<label style="color: red">盘口如果有变化,将按照投注时的低奖励自动成交，限额1000币。</label>比赛结束经系统清算后，奖励游戏币划转至用户的游戏账户。</p>

      <p class="smallTitle">5、在哪里查看我的竞猜记录</p>
      <p class="mainBody">在游戏的“我的竞猜”页面，您可以查询您发起或参与的竞猜成交情况和游戏币清算情况。</p>

      <p class="smallTitle">6、联系我们</p>
      <p class="mainBody end">如有疑问，请+微信: <label style="color: #5168CD;margin-right: 0.1rem">JCSxiaoyang</label></p>
    </div>
  </div>

</template>

<script type="text/javascript">
  import mainHeader from 'base/header/mainheader'

  export default {
    data() {
      return {
        headerData: {
          ele: '竞猜新玩法',
          name: 'help'
        },
        inXCX: false,
      }
    },
    components: {
      mainHeader
    },
    activated() {
      if (window.__wxjs_environment === 'miniprogram') {

        this.inXCX = true
        this.isEnter = false
        this.userId = this.$router.currentRoute.query.userId
        this.token = this.shareFn.wxGetUserT(this.userId, this.$router.currentRoute.query.token)
        document.getElementsByTagName("title")[0].innerText = '竞猜新玩法'
      }
    }
  }
</script>

<style lang="less">
  @import '../../common/less/base.less';

  .help {
    background: @backcolor;
    color: @maincolor;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    font-size: 0.14rem;

    .help-service {
      position: relative;
      padding: 0.24rem;
      background: @whites;
      overflow-y:scroll;
      height: 100%;
    }

    .title {
      font-weight: bold;
      font-size: 0.15rem;
      text-align: center;
    }

    .smallTitle {
      font-weight: bold;
      font-size: 0.14rem;
      padding: 0.06rem 0;
    }

    .mainBody {
      font-size: 0.13rem;
      text-indent: 2em;
      line-height: 0.26rem;
    }

    .end{
      margin-bottom: 1rem;
    }

  }
</style>
