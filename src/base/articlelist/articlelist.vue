<template>
    <div class="art-list" :class="{artlistnomargin:topMargin}" id="art-list">
        <div class="listcon" v-for="item in articleDataList" v-if="item.otype == 1 || item.otype == undefined" @click="goarticle(item)">
            <div class="txtbox">
                <dl @click.stop="goauthor(item.author_id)" :author_id="item.author_id">
                    <dt>
                        <img v-lazy="item.authorPic">
                    </dt>
                    <dd class="h38">
                        <span class="name">{{item.authorName}}</span>
                        <span class="tm">{{timeformat(item.last_modified)}}</span>
                    </dd>
                </dl>
                <p class="txt" v-if="item.tabView" v-html="tabView(item)">

                </p>
                <span class="list-digest"><i class="vip" v-if="item.tabView == undefined && item.chargeable">VIP</i>{{item.digest}}</span>
            </div>
            <div class="artlist-match" v-if="item.matches!=undefined && item.matches.length>0 && matchShow" @click.stop="gomatch(item.matches[0].entry_id)">
                <span># {{item.matches[0].cup_name}}</span>
                <span>{{item.matches[0].home_team}} vs {{item.matches[0].away_team}}</span>
                <span>{{timeformat(item.matches[0].start_time)}} #</span>
            </div>
        </div>
        <!--<guess-list-->
          <!--v-else-if="item.otype == 4"-->
          <!--@guessTeamClick="guessTeamClick"-->
          <!--:item="item">-->
        <!--</guess-list>-->

    </div>
</template>
<script type="text/javascript">
import shareFn from 'common/js/sharefn'
import guessList from 'base/guesslist/guesslist'
export default{
    props:{
      articleDataList: {
          type: Array,
          default: []
      },
      topMargin: {
          type: Boolean,
          default: false
      },
      matchShow: {
          type: Boolean,
          default: true
      }
    },
    data() {
      return {

      }
    },
    created(){

    },
    mounted(){
      this.$nextTick(function (){
          console.log(this.articleDataList)
      })
    },
    components: {
      guessList
    },
    methods: {
      guessTeamClick (team,val) {
        console.log(team)
        console.log(val)
      },
      goauthor(Id){
          this.$router.push({
              path: `/author/?id=${Id}`
          })
      },
      goarticle(item){
          this.$emit('goarticle',item)
      },
      gomatch(Id){
          this.$router.push({
            path: `/matchdetail/?entryId=${Id}`
          })
      },
      timeformat(s){
          return shareFn.setTime(s);
      },
      tabView(item){
          var str = '';
          if(!item.tabView){
              return '';
          }
          if(item.chargeable) {
              str += '<i class="vip">VIP</i>'+item.tabView;
              if(item.singleUnlock && item.price>0){
                  str += '<span class="list-Price">'+item.price+'精彩币</span>';
              }else if(!item.singleUnlock){
                  str += '<span class="list-Price">(VIP用户专享)</span>';
              }
              return str;
          }else{
              return item.tabView;
          }
      },
      setPrice(val){
          if(val.price == 0 && !val.chargeable && (val.authorLevels != undefined && val.authorLevels.length <= 0)){
              return '查看观点'
          }else if(val.chargeable && (val.authorLevels != undefined && val.authorLevels.length > 0) && (val.price == undefined || val.price == 0)){
              return 'VIP专属'
          }else{
              return '￥'+val.price+'解锁'
          }
      }
    },
    watch: {

    }
}

</script>
<style lang="less" type="text/less">
@import "../../common/less/base.less";
.artlistnomargin{
    margin-top:10px;
}
.art-list{
    .listcon{
        width:100%;
        overflow:hidden;
        margin-bottom:8px;
        background:@whites;
        padding-left:15px;
    }
    .topb img{
        width:100%
    }
    .txtbox{
        float:left;
        width:100%;
        padding:15px 15px 15px 0;
        overflow:hidden;
        dl{
            float:left;
            width:100%;
            display:flex;
            justify-content:space-between;
            dt{
                height:25px;
                padding-right:8px;
               img{
                    width:25px;
                    height:25px;
                    border-radius:50%;
                    float:left;
                }
            }
            dd{
                line-height:25px;
                color:#dddddd;
                flex-grow:1;
            }
        }
        .name{
            float:left;
            font-size:0.15rem;
            color:@namecolor;
        }
        .tm{
            float:right;
            font-size:0.12rem;
            color: @assistcolor;
        }
        dd a{
            color:#514da5;
        }
        dd i{
            float:left;
            width:16%;
            margin:-14px 5px 0 0;
            img{
                width:100%
            }
        }
    }
    .list-digest{
        margin-top:0px;
        width:100%;
        padding-top:15px;
        line-height:0.24rem;
        font-size:0.15rem;
        word-break:break-all;
        display:-webkit-box;
        -webkit-line-clamp:3;
        -webkit-box-orient:vertical;
        overflow:hidden;
        color: @maincolor;
        i{
            float:left;
            line-height:1;
            padding:1px 5px;
            margin-right:10px;
            border-radius:3px;
            font-style:normal;
            color: @reds;
            border:1px @reds solid;
            font-size:10px;
        }
        .vip{
            background: @reds;
            color:@whites;
            border-color: @reds;
        }
    }
    .txt{
        font-size:0.12rem;
        float:left;
        width:100%;
        padding-top:15px;
        line-height:14px;
        i{
            float:left;
            line-height:1;
            padding:1px 5px;
            margin-right:10px;
            border-radius:3px;
            font-style:normal;
            color: @reds;
            border:1px @reds solid;
            font-size:10px;
        }
        .vip{
            background: @reds;
            color:@whites;
            border-color: @reds;
        }
        label{
            color: @oranges;
            font-size:0.1rem;
            padding-right:5px;
        }
    }

    .artlist-match{
        float:left;
        width:100%;
        height:40px;
        line-height:40px;
        position:relative;
        color:@blues;
        .border-top;
        font-size:0.13rem;
        span{
            float:left;
            margin:0 10px 0 0px;
            &:nth-child(1){
                margin-right: 10px;
            }
        }

    }
    .list-Price{
        font-size:0.1rem;
        color:@reds;
    }
}
</style>
