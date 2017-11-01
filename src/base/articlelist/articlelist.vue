<template>
    <div class="art-list" :class="{artlistnomargin:topMargin}" id="art-list">
        <div class="listcon" v-for="item in articleDataList" @click="goarticle(item)">
            <div class="txtbox">
                <dl @click="goauthor(item.author_id)" :author_id="item.author_id">
                    <dt>
                        <img v-lazy="item.authorPic">
                    </dt>
                    <dd class="h38">
                        <span class="name">{{item.authorName}}</span>
                        <span class="tm">{{timeformat(item.last_modified)}}</span>
                    </dd>
                </dl>
                <span class="txt" v-html="item.tabView">
                    {{item.tabView}}
                </span>
                <span class="txt">{{item.digest}}</span>
            </div>
            <div class="titbox match" @click="gomatch(item.matches[0].entry_id)" v-if="item.matches.length>0">
                <span># {{item.matches[0].cup_name}}</span>
                <span>{{item.matches[0].home_team}} vs {{item.matches[0].away_team}}</span>
                <span>{{timeformat(item.matches[0].start_time)}} #</span>
            </div>
        </div>
       
    </div>
</template>
<script type="text/javascript">
export default{
    props:{
        articleDataList: {
            type: Array,
            default: []
        },
        topMargin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    components: {
        
    },
    methods: {
        goauthor(Id){
            console.log(Id)
        },
        goarticle(item){
            this.$emit('goarticle',item);
        },
        gomatch(Id){
            console.log(Id)
        },
        timeformat(s){
            var now = new Date(),
                targetTime = new Date(s),
                tody = now.getDate(),
                targetDate = targetTime.getDate(),
                thisMonth = now.getMonth()+1,
                targetMonth = targetTime.getMonth()+1,
                thisYear = now.getFullYear(),
                targetYear = targetTime.getFullYear(),
                hours = targetTime.getHours(),
                minutes = targetTime.getMinutes();
            if(targetYear == thisYear && targetDate == tody){
                return "今天 "+ (hours < 9 ? '0'+hours : hours)+':'+(minutes < 9 ? '0'+minutes : minutes);
            }else if(targetYear == thisYear && targetDate == tody-1) {
                return "昨天 "+ (hours < 9 ? '0'+hours : hours)+':'+(minutes < 9 ? '0'+minutes : minutes);
            }else {
                return (targetMonth < 9 ? '0'+targetMonth : targetMonth) + '-' + targetDate +' ' + (hours < 9 ? '0'+hours : hours)+':'+(minutes < 9 ? '0' + minutes : minutes);
            }
            
        }
    }
}

</script>
<style lang="less">
@import "../../common/less/base.less";
.art-list{margin-top:10px;}
.artlistnomargin{margin-top:0;}
.listcon{width:100%;overflow:hidden;margin-bottom:8px;background:@whites;padding-left:10px;}
.topb img{width:100%}
.txtbox{float:left;width:100%;padding:8px 10px 5px 0;overflow:hidden;}
.txtbox dl{float:left;width:100%;padding-bottom:5px;}
.txtbox dt{float:left;height:0.275rem;padding-right:10px;}
.txtbox dt img{width:0.275rem;height:0.275rem;border-radius:50%;float:left;}
.txtbox dd{width:87%;float:left;line-height:0.3rem;color:#dddddd;}
.txtbox .name{float:left;font-size:0.15rem;color:@namecolor;}
.txtbox .tm{float:right;font-size:0.12rem;color: @assistcolor;}
.txtbox dd a{color:#514da5;}
.txtbox dd i{float:left;width:16%; margin:-14px 5px 0 0;}
.txtbox dd i img{width:100%}
.txtbox .txt{float:left;margin-top:0px;width:100%;line-height:0.24rem;font-size:0.15rem;
    word-break:break-all;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;
    overflow:hidden;color: @maincolor;}
.txtbox .txt i{display:inline-block;height:0.16rem;line-height:0.14rem;padding:0 5px;margin-right:8px;border-radius:2px;font-style:normal;color: @reds;border:1px @reds solid; font-size:0.12rem;-webkit-transform: translateY(-0.01rem);transform: translateY(-0.01rem);}

.txtbox .txt .vip{background: @reds;color:#404040;border-color: @reds;}
.titbox{float:left;width:100%;font-size:0.12rem;color: @blues;padding-bottom:10px;}
.titbox span{margin:0 10px 0 0px;}
.titbox span:nth-child(1){margin-right: 10px;}
.titbox span:last-child{display: inline-block;}
/*.titbox span:last-child:after {
    content: '';width: 0px;height: 0px;float: right;
    border: 0.05rem solid transparent;border-left-color: #8b7a39;
    -webkit-transform: translate3d(0.06rem,0.035rem,0);transform: translate3d(0.06rem,0.035rem,0);}*/
.txtbox label{color: @oranges;font-size:0.12rem;padding: 0 5px;}
.txtbox .label .gg{padding:0px;}
.match{border-top:1px solid @bordercolor;padding-top:5px;}

</style>