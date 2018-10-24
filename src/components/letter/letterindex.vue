<template>
    <div class="letterindex">
        <main-header :headerData="headerData"></main-header>
        <div ref="scrollWraper" class="msg-list">
            <div ref="roomMain" class="room-main">
                <section v-for="item in msgData" :id="item.id" :class="{left:item.flag=='from',right:item.flag=='to'}">
                    <div onclick="goauthor(353)" :class="{pic:item.flag=='from',rpic:item.flag=='to'}">
                        <img :src="item.flag=='from'?teachPic:userPic" alt="">
                    </div>
                    <div :class="{msg:item.flag=='from',rmsg:item.flag=='to'}">
                        <p :class="{tim:item.flag=='from',rtim:item.flag=='to'}">
                            {{item.flag=='from'?headerData.ele:userId}}    {{setTime(item.timestamp)}}
                        </p>
                        <div :class="{dialog:item.flag=='from',rdialog:item.flag=='to'}">{{item.content}}</div>
                    </div>
                </section>
            </div>
        </div>

        <div class="room-foot">
            <p>
                <input ref="msgInput" type="text" placeholder="发送消息..." name="msg">
            </p>

            <button type="button" id="send" @click="sendMsg()">发送</button>
        </div>
    </div>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common'
import 'common/js/jcs_dialoga.css'
export default {
	name: 'letter',
	props: ['item'],
    data(){
        return{
            headerData:{
                name: 'letter',
                ele: '私信'
            },
            msgData: [],
            IO: null,
            roomUsers: 0,
            isLogin: this.shareFn.isLogin(),
            userId: this.shareFn.getUserId(),
            userPic: this.shareFn.getUserPic(),
            teachId: 0,
            websocket: null,
            teachPic: ''

        }
    },
	created(){
        console.log('created')
	},
    activated () {
        console.log(99999999999)
        this.$nextTick(function(){
            this.GetLetterMsg();
            this.headerData.ele=decodeURI(this.$router.currentRoute.query.name);
            this.socketConnect();
        })
    },
    mounted(){
        console.log('mounted')
        this.$nextTick(function(){
            this.GetLetterMsg();
            this.headerData.ele=decodeURI(this.$router.currentRoute.query.name);
            this.socketConnect();
        })
    },
    methods:{
        socketConnect(){
            var that=this;
            if('WebSocket' in window){
                this.websocket = new WebSocket("ws://10.0.0.34:9999/letter");
                this.websocket.onmessage = function(event){
                    var data = JSON.parse(event.data);
                    console.log(data)
                    if(data.user_id != that.$router.currentRoute.query.id){
                        return ;
                    }
                    console.log({
                        content: event.data.text,
                        flag: "from",
                        id: 'null',
                        timestamp: this.shareFn.setTime('send')
                    })
                    that.msgData.push({
                        content: data.text,
                        flag: "from",
                        id: 'null',
                        timestamp: this.shareFn.setTime('send')
                    })
                }
            }else{
                showMeaage('Not support websocket')
            }
        },
        sendMsg(){
            var that = this;
            if(that.$refs.msgInput.value == ''){
                return false;
            }
            var opt = {
                url: Common.baseURI().nativeHost,
                data: {
                    "SecurityCode" : this.shareFn.getSecurityCode(),
                    "UserId" : this.shareFn.getUserId(),
                    "AuthorId" : that.$router.currentRoute.query.id,
                    "Contents" : that.$refs.msgInput.value
                },
                headers:{"X-Target":"TrentService.SendLetterToAuthor"},
                callback: function(data){
                    that.msgData.push({
                        content: that.$refs.msgInput.value,
                        flag: "to",
                        id: 'null',
                        timestamp: that.shareFn.setTime('send')
                    })
                    console.log(that.msgData)
                    that.$refs.msgInput.value = '';
                }
            }
            this.custmorAjax(opt);
            this.websocket.send("register,"+this.userId);
            that.scrollTo();
        },
        GetLetterMsg(){
            var that = this;
            var opt = {
                url: Common.baseURI().nativeHost,
                data: {
                    "SecurityCode" : this.shareFn.getSecurityCode(),
                    "UserId" : this.shareFn.getUserId()*1,
                    "AuthorId" : that.$router.currentRoute.query.id*1,
                    "LetterId" : ""
                },
                headers:{"X-Target":"TrentService.GetLetteresBetweenAuthors"},
                callback: function(data){
                   that.msgData = data.Author;
                   that.teachPic = data.PicPath;
                   console.log(that.msgData)
                }
            }
            this.custmorAjax(opt);
        },
        setTime(s){
            return this.shareFn.setTime(s);
        },
        back(){
            this.$router.back();
        },
        scrollTo(){
            var that = this;
            setTimeout(function(){
                var mainH = that.$refs.scrollWraper.offsetHeight;
                var innerH = that.$refs.roomMain.offsetHeight;
                var scrollH = innerH - mainH;
                that.$refs.scrollWraper.scrollTop = scrollH;
            },50)
        },
        showMeaage: function (msg) {
            layer.open({
                content: msg,
                time: 2,
                skin: 'msg',
                anim: 'scale'
            });
        },
        custmorAjax(opt){
            var data = null;
            console.log(opt)
            this.$http.post(
                opt.url,
                opt.data,
                {
                    headers: opt.headers
                }

            ).then(function(res){
                opt.callback(res.data);
            },function(){
                this.bunceIn('请求失败请检查网络')
            })
        }

    },
    watch:{
        msgData:{
            handler: function(){
                var that = this;
                this.scrollTo(that.$refs.scrollWraper.scroll.maxScrollY);
            },
            deep:true
        },
        dialogData:{
            handler: function(){

            },
            deep:true
        }
    },
    components:{
        Scroll,mainHeader
    }
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.letterindex{
    background:@backcolor;
    color:@maincolor;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index:90;
    font-size:0.14rem;
    .room-main{
        float:left;
        width:100%;
    }
    .msg-list{
        width:100%;
        position:absolute;
        left:0;
        top:44px;
        right:0;
        bottom:50px;
        overflow-y:scroll;
        padding-bottom:3px;
        padding:0 15px;
        section{
            width:100%;
            float:left;
            margin-top:15px;
            font-size:0.15rem;
            user-select:none;
            .pic{
                float:left;
                width:15%;
                padding-top:5px;
                img{
                    width:40px;
                    height:40px;
                    border-radius:50%;
                }
            }
            .tim{
                color:#999;
                font-size:0.13rem;
                margin-bottom:5px;
            }
            .msg{
                float:left;width:80%;
            }
            .dialog{
                width:auto;
                background:@whites;
                color:@maincolor;
                padding:12px;
                border-radius:10px;
                position:relative;
                float:left;
                word-wrap:break-word;
                word-break:break-all;
                white-space:pre-wrap;
                .lock-pic {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 28px;
                }
            }
            &.te_left{
                .dialog{
                    width:auto;
                    background:@shallowred;
                    color:@whites;
                    padding:12px;
                    border-radius:10px;
                    position:relative;
                    float:left;
                    word-wrap:break-word;
                    word-break:break-all;
                    white-space:pre-wrap;
                    &:before{
                        border-left-color:@shallowred;
                    }
                }
                .dialog-close {
                    background: @shalloworange;
                    line-height: 30px;
                    font-size: 0;
                    .close-lock {
                        width: 30px;
                        height: 30px;
                        background: #f55a3f url(../../common/img/roomlock.png) no-repeat center center;
                        border-radius: 50%;
                        display: inline-block;
                        background-size: 100%;
                        float: left;
                    }
                    &:before{
                        border-left-color:@shalloworange;
                    }
                    p {
                        display: inline-block;
                        color: #fff;
                        font-size: 0.15rem;
                        float: left;
                        padding-left: 10px;
                    }
                }
            }

            .dialog:before{
                content:"";
                position:absolute;
                left:-9px;top:5px;
                width:0;
                height:0;
                border:10px solid transparent;
                border-left-color:@whites;
                transform:rotate(-45deg);
            }

            .rpic{
                float:right;
                width:15%;
                text-align:right;
                padding-top:5px;
            }
            .rtim{
                text-align:right;
                color:#999;
                font-size:0.13rem;
                margin-bottom:5px;
            }
            .rpic img{
                width:40px;
                height:40px;
                border-radius:50%;
            }
            .rmsg{
                float: right;
                width:80%;
            }

            .rdialog{
                float:right;
                background:@whites;
                color:#000;
                padding:12px;
                border-radius:10px;
                position:relative;
                word-wrap:break-word;
                word-break:break-all;
                white-space:pre-wrap;
            }
            .rdialog:before{
                content:"";
                position:absolute;
                right:-9px;
                top:5px;
                width:0;
                height:0;
                border:10px solid transparent;
                border-right-color:@whites;
                transform:rotate(45deg);
            }
        }
    }
    .room-foot{
        height:50px;
        width:100%;
        border-top:1px solid @bordercolor;
        line-height:50px;
        padding:8px 10px;
        display:flex;
        align-items:center;
        background:#f8f8f8;
        justify-content:space-around;
        position:absolute;
        left:0;
        bottom:0;
        p{
            width:85%;
            height:100%;
            border-radius:17px;
            overflow:hidden;
            border:1px solid @bordercolor;
            input{
                width:100%;
                height:100%;
                outline:none;
                border:none;
                padding-left:8px;
                font-size:0.14rem;
                float:left;
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
                font-size:14px;
                color:#999999;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                font-size:14px;
                color:#999999;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                font-size:14px;
                color:#999999;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
                font-size:14px;
                color:#999999;
            }
        }
        button{
            height:100%;
            border:none;
            outline:none;
            background:transparent;
            color:@reds;
            font-size:0.142rem;
        }
    }
}
.slide-enter-active,.slide-leave-active{
    transition:all 0.3s;
}
.slide-enter,.slide-leave-to{
    transform:translate3d(100%,0,0);
}
</style>
