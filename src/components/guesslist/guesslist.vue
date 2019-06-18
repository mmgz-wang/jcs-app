<template>
    <div class="guess-list-wrap">
      <publick-header v-if="!inXCX" :headerData="headerData"></publick-header>
      <scroll class="outer-wrap" :class="{inxcx: inXCX}"
              :needRefresh="needRefresh"
              :pullDownRefresh="pullDownRefresh"
              :pullUpLoad="pullUpLoad"
              :pullingDownFn="pullingDownFn"
              :pullingUpFn="pullingUpFn"
              ref="scroll"
              :data="dataList">
        <div class="scroll-wrap">
          <p pulldown>{{pullDownText}}</p>
              <guess-item
                v-for="(item,index) in dataList"
                @guessTeamClick="guessTeamClick"
                :key="index" :item="item"></guess-item>
          <p pullup>{{pullUpText}}</p>
        </div>
      </scroll>
      <guess-dialog
        :moneyArr="moneyArr"
        ref="guessDialog"></guess-dialog>
    </div>
</template>

<script>
import shareFn from 'common/js/sharefn'
import publickHeader from 'base/header/publickheader'
import guessItem from 'base/guessitem/guessitem'
import guessDialog from 'base/guessdialog/guessdialog'
import Scroll from 'base/scroll/scroll'
import { getDataList } from 'common/api/apidata'
export default {
  name: 'guesslist',
  data () {
    return {
      resLen:0,
      planIdx: 1,
      dataList: [],
      moneyArr: [],
      needRefresh: true,
      type: 0,
      pullDownRefresh: {threshold: 50, stop: 50},
      pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
      pullDownText: '下拉刷新！',
      pullUpText: '上拉加载更多！',
      inXCX: false,
      noMore: false,
      headerData: {
        ele: '<h1>竞猜</h1>',
        name: 'guesslisthd',
        isShow: false
      }
    }
  },
  components: {
    publickHeader,
    guessItem,
    guessDialog,
    Scroll
  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList () {
      getDataList('/assets/listGuessingPlan', {
        planIdx: this.planIdx
      }).then(res => {
        console.log('获取竞猜列表数量'+res.data.length);
        this.resLen = res.data.length;
       // console.log(res);
        if (res.data.length == 0) {
          this.noMore = true
        }
        if (this.types === 0) {
          this.dataList = res.data
        } else {
          this.dataList = [...this.dataList, ...res.data]
        }
        this.moneyArr = res['bet.prices.list']
      })
    },
    guessTeamClick () {
      if (shareFn.isLogin()) {
        this.$refs.guessDialog.show(arguments)
      } else {
        layer.open({
          content: '您还没有登录请先登录！',
          btn: ['确定', '取消'],
          yes: (index) => {
            this.$router.push('/enter')
            layer.close(index)
          },
          no: index => layer.close(index)
        });
      }
    },
    pullingDownFn(){
      this.types = 0;
      this.planIdx = 1
      this.pullUpText = '努力加载中...'
      this.pullDownText = '努力加载中 ...'
      this.noMore = false
      this.getDataList()

    },
    pullingUpFn(){
      this.types = 1;
     // this.planIdx += 20
      this.planIdx +=this.resLen;
      console.log('请求的planIdx数量 '+this.planIdx);
      if (this.noMore) {
        this.pullUpText = '已经是全部竞猜了...'
        return false
      }
      this.pullUpText = '努力加载中 ...'
      this.getDataList();
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../common/less/base.less";
.guess-list-wrap{
  width:100%;
  position:absolute;
  top:0;
  bottom:0;
  overflow:hidden;
  p[pulldown]{
    width:100%;
    height:50px;
    line-height:50px;
    text-align:center;
    color:@assistcolor;
    font-size:0.12rem;
    position:absolute;
    top:-50px;
    left:0;
  }
  p[pullup]{
    width:100%;
    height:40px;
    line-height:40px;
    text-align:center;
    color:@assistcolor;
    font-size:0.12rem;
  }
  .inxcx{
    top: 0;
  }
  .outer-wrap{
    width:100%;
    position:absolute;
    top: 45px;
    bottom:0;
    overflow:hidden;

  }
  .scroll-wrap{
    min-height:100%;
    width:100%;
  }
}

</style>
