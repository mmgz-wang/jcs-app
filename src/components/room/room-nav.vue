<template>
    <div>
        <div class="room-nav">
            <span class="selbtn" :class="{'open': selShow}" @click="selClick">{{currentSel}}</span>
            <span @click="guessSelect" :class="{'onguess': onGuess}">竞猜</span>
            <span class="people">{{roomUsers}}</span>
        </div>
        <ul class="selector" v-show="selShow">
            <li v-for="(item, idx) in selArr" 
                @click="selector(idx)" 
                class="all" 
                :class="{on: currentSel === item}">
                {{item}}
                <i></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        roomUsers: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            range: 0,
            selShow: false,
            currentSel: '查看全部',
            onGuess: false,
            selArr: {
                '0': '查看全部',
                '1': '仅看老师',
                '2': '仅看本人',
                '3': '老师推荐'
            }
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {
        selClick () {
            this.selShow = !this.selShow
        },
        selector (s) {
            this.onGuess = false
            this.currentSel = this.selArr[s]
            this.selShow = false
            this.$emit('selector', s)
        },
        guessSelect () {
            this.onGuess = !this.onGuess
            this.$emit('guessSelect')
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/base.less';
    .room-nav {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: @whites;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      .people {
        display: inline-block;
        font-size: 0.14rem;
        color: #d2d2d2;
      }
      .people:before {
        content: "";
        width: 21px;
        height: 18px;
        background: url("../../common/img/pp.png") no-repeat left center;
        background-size: 18px 14px;
        padding-left: 25px;
      }
      .selbtn{
          display: flex;
          align-items: center;
          &:after{
              content: '';
              width: 0;
              height: 0;
              margin-top: 3px;
              margin-left: 3px;
              border: 6px solid transparent;
              border-top-color: #8a8a8a;
          }
      }
      .open{

          &:after{
              margin-top: -10px;
              border: 6px solid transparent;
              border-bottom-color: #8a8a8a;
          }
      }
      .onguess{
            color: @reds;
        }
    }
    .selector {
        width: 100%;
        line-height: 40px;
        font-size: 0.13rem;
        user-select: none;
        position: absolute;
        top: 83px;
        background: #ffffff;
        z-index: 999;
        padding-left: 15px;
    .selector-open {
        height: 132px;
        overflow: auto;
    }
    li {
        height: 40px;
        color: #333;
        .border-bottom;
        position: relative;
        i{
            width: 12px;
            height: 6px;
            border-left: 1px solid #666666;
            border-bottom: 1px solid #666666;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-55%) rotate(-45deg);
        }
    }
    li:last-child{
        &:after{
            border: none;
        }
    }
    .on {
        color: @reds;
        i{
            width: 12px;
            height: 6px;
            border-left: 1px solid @reds;
            border-bottom: 1px solid @reds;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-55%) rotate(-45deg);
        }
    }
}
</style>


