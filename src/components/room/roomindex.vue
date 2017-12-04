<template>
    <transition name="slide">
        <div class="roomindex">
            <main-header @setMsg="setMsg" :headerData="headerData"></main-header>
            <div class="room-nav">
                <ul class="selector">
                    <li @click="selector('all')" class="all" :class="{on:onData.isAll}">查看全部</li>
                    <li @click="selector('recommend')" class="recommend" :class="{on:onData.isRec}">老师推荐</li>
                    <li @click="selector('teach')" class="teach" :class="{on:onData.isTeach}">仅看老师</li>
                    <li @click="selector('own')" class="own" :class="{on:onData.isOwn}">仅看本人</li>
                    <li class="peopleli"><span class="people">{{roomUsers}}</span></li>
                </ul>
            </div>
            
            <div ref="scrollWraper" class="msg-list">
                <div ref="roomMain" class="room-main">
                    <section id="233782" v-for="item in msgData" 
                        :class="{
                            left:item.isLecturer||userId!=item.userName,
                            right:!item.isLecturer&&userId==item.userName,
                            te_left:item.isLecturer
                        }">
                        <div 
                            :class="{
                                pic:item.isLecturer||userId!=item.userName,
                                rpic:!item.isLecturer&&userId==item.userName
                            }" onclick="goauthor(353)">
                            <img :src="item.userPic" alt="">
                        </div>
                        <div 
                        :class="{
                            msg:item.isLecturer||userId!=item.userName,
                            rmsg:!item.isLecturer&&userId==item.userName
                        }">
                            <p 
                            :class="{
                                tim:item.isLecturer||userId!=item.userName,
                                rtim:!item.isLecturer&&userId==item.userName
                            }">{{item.userName}}    {{setTime(item.createTime)}}</p>
                            <div v-if="(!item.hasPurchased && !item.payable) || item.hasPurchased" 
                                :class="{
                                    dialog:item.isLecturer||userId!=item.userName,
                                    rdialog:!item.isLecturer&&userId==item.userName
                                }">{{item.content}}<img v-if="item.payable || item.hasPurchased" class="lock-pic" src="../../common/img/lop.png">
                            </div>
                            <div v-if="item.payable && !item.hasPurchased" @click="openMsg(item.messageId,item.price)" class="dialog dialog-close">
                                <span class="close-lock"></span>
                                <p>推荐锦囊：{{item.price}} 精彩币解锁</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            
            <div class="room-foot">
                <input ref="msgInput" type="text" placeholder="发送消息..." name="msg">
                <button type="button" id="send" @click="sendMsg()">发送</button>
            </div>
            <jcs-Dialog v-if="dialogShow" :openRoomWay="openRoomWay" :data="dialogData" @callbackFn="callbackFn"></jcs-Dialog>
        </div>
    </transition>
</template>

<script type="text/javascript">
import ShareFn from 'common/js/sharefn'
import Scroll from 'base/scroll/scroll'
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common'
import DialogZ from 'common/js/jcs_dialoga.js'
import 'common/js/jcs_dialoga.css'
export default {
	name: 'roomindex',
	props: ['item'],
    data(){
        return{
            headerData:{
                name: 'roomindex',
                ele: '聊天室',
                r_ele: '订阅推荐消息'
            },
            msgData: [],
            IO: null,
            roomUsers: 0,
            isLogin: ShareFn.isLogin(),
            userId: ShareFn.getUserId(),
            teachId: 0,
            range: 0,
            roomPic: '',
            roomId: this.$router.currentRoute.query.roomId,
            roomName: this.$router.currentRoute.query.roomName,
            roomPrice: this.$router.currentRoute.query.roomPrice,
            toData: { 
                limit: 30, 
                userId: ShareFn.getUserId(),
                range: 0,
                token: ShareFn.getSecurityCode()
            },
            onData: {
                isAll: true,
                isRec: false,
                isTeach: false,
                isOwn: false
            },
            dialogData: '<li>您确定吗？</li><li class="btn">确定</li>',
            dialogShow: false,
            openRoomWay: null
        }
    },
	created(){
        //this.$refs.msgInput.disabled = true;
	},
    activated() {
        console.log(this.$route.meta.iskeep)
        if(!this.$route.meta.iskeep){
            this.msgData = [];
            if(this.isLogin){
                this.IO = io.connect(Common.baseUrl.ioUrl);
                //this.IO = io.connect('http://182.18.76.155:8080/');
                this.roomId = this.$router.currentRoute.query.roomId,
                this.roomName = this.$router.currentRoute.query.roomName,
                this.roomPrice = this.$router.currentRoute.query.roomPrice,
                this.roomScoket();
            }else{
                this.$router.push({name:'enter'})
            }
        }

    },
    mounted(){
        
    },
    computed: {
        
    },
    methods:{
        roomScoket(){
            var that = this;
            //连接并登陆
            this.IO.on('connect', function () {
                //console.log('on connect')
                //链接成功
                var jsonObject = {
                    roomId: that.roomId,
                    userId: ShareFn.getUserId(),
                    token: ShareFn.getSecurityCode()
                };
                that.IO.emit('login', jsonObject);
            });
            this.IO.on('ack', function (data) {
                console.log(data);
                that.roomUsers = data.roomUsers;
                that.roomPrice = data.roomPrice;
                that.teacherId = data.userId;
                that.roomPic = data.userPic;
                if (data.code == 999) {
                    var userMoney = data.userMoney;
                    var roomLecturer = data.roomLecturer;
                    var roomPrice = data.roomPrice;
                    console.log(DialogZ)
                    that.payForRoom(data);                    
                } else if (data.code == 888) {
                    that.$refs.msgInput.placeholder = '直播未开始';
                    that.$refs.msgInput.disabled = 'disabled';
                    that.isOver = true;
                    that.showMeaage('直播未开始');
                    layer.open({
                        content: '<p class="teach-name">' + that.roomName + '</p>' +
                        '<p>主播：' + data.roomLecturer + '<span style="width:40px;display: inline-block"></span>门票：' + that.roomPrice + '</p>' +
                        '<p>直播时间：' + data.startTime.substr(5, 11) + ' ' + data.endTime.substr(5, 11) + '</p>',
                        btn: ['返回', '开启后通知我'],
                        shadeClose: false,
                        yes: function (index) {
                            layer.close(index);
                            that.$router.back();
                        },
                        no: function (index) {

                            var sub = {
                                url: "http://123.206.88.92:8080/Room/SubscribeRoom",
                                data: {
                                    language: 'M',
                                    userId: getUserId(),
                                    roomId: roomId
                                }
                            };
                            customAjax(sub);
                            layer.close(index);
                        }
                    });

                } else if (data.code == 887) {
                    that.$refs.msgInput.placeholder='直播已结束';
                    that.$refs.msgInput.disabled="disabled";
                    that.isOver = true;
                    that.GetRoomMsg();
                    layer.open({
                        content:'直播已结束',
                        skin:'msg',
                        time:2
                    });
                } else if(data.code == 777){
                    
                    that.showMeaage('请求过于频繁，访问受限！');

                } else {
                    //登录成功，有权限
                    that.userPic = data.userPic;
                    that.GetRoomMsg();
                }
            });
            this.IO.on('chatevent', function (data) {
                console.log(data.userId +'!='+ that.userId)
                if(data.userId != that.userId){

                    that.msgData.push(data);
                }
                

                //setTimeout(function(){
                    //that.scrollTo(that.$refs.scrollWraper.scroll.maxScrollY);
                //},30)
                if(data.payable){
                    that.GetRoomMsg();
                }
            });
            this.IO.on('rescindevent', function (data) {
                //console.log(data)
                //DialogZ.remoDom();
                that.GetRoomMsg();
            });
            this.IO.on('roomstatusevent', function (data) {
                if (data.roomStatus == 'opened') {
                   that.roomConnect();
                    that.$refs.msgInput.disabled = false;
                    that.$refs.msgInput.value = "";
                    that.isOver = false;
                } else if (data.roomStatus == 'closed') {
                    that.$refs.msgInput.placeholder = '直播已结束';
                    that.$refs.msgInput.disabled = "disabled";
                    that.showMeaage('直播已结束')
                }
            });
        },
        roomConnect: function () {
            var that = this;
            var jsonObject = {
                userId: that.userId,
                roomId: that.roomId,
                token: ShareFn.getSecurityCode()
            };
            this.IO.emit('login', jsonObject);
        },
        sendMsg(){
            var that = this;
            if(that.$refs.msgInput.value == ''){
                return false;
            }
            var arr = {
                content: that.$refs.msgInput.value,
                createTime: ShareFn.setTime('send'),
                isLecturer: false,
                isRecommended: false,
                messageId: '',
                payId: 0,
                payable: false,
                userName: that.userId,
                userPic: that.roomPic
            };
            this.msgData.push(arr);
            //推送给其他人
            var jsonObject = {
                roomId: that.$router.currentRoute.query.roomId,
                userId: that.userId,
                content: that.$refs.msgInput.value
            };
            
            this.IO.emit('chatevent', jsonObject);
            that.$refs.msgInput.value = '';
            that.scrollTo();
        },
        selector(s){
            var targetsName = event.target.className,
                targets = event.target,
                that = this;          
            if (s == 'all') {
                that.toData = {
                    limit: 20, 
                    userId: that.userId,
                    range: 0,
                    token: ShareFn.getSecurityCode()
                }
                that.onData = {
                    isAll: true,
                    isRec: false,
                    isTeach: false,
                    isOwn: false
                }
                that.GetRoomMsg();
                that.range = 0;
                
            } else if (s == 'teach') {
                that.toData = {
                    limit: 20, 
                    userId: that.userId,
                    range: 1,
                    token: ShareFn.getSecurityCode()

                }
                that.onData = {
                    isAll: false,
                    isRec: false,
                    isTeach: true,
                    isOwn: false
                }
                that.GetRoomMsg();
                that.range = 1;
            } else if (s == 'own') {
                that.toData = {
                    limit: 20, 
                    userId: that.userId,
                    range: 2,
                    token: ShareFn.getSecurityCode()
                }
                that.onData = {
                    isAll: false,
                    isRec: false,
                    isTeach: false,
                    isOwn: true
                }
                that.GetRoomMsg();
                that.range = 2;
            }else if (s == 'recommend') {
                that.toData = {
                    limit: 20, 
                    userId: that.userId,
                    range: 3,
                    token: ShareFn.getSecurityCode()
                }
                that.onData = {
                    isAll: false,
                    isRec: true,
                    isTeach: false,
                    isOwn: false
                }
                that.GetRoomMsg();
                that.range = 3;
            }else if(s == 'peopleli'){
                return false;
            }
            that.scrollTo();
        },
        setMsg(s){
            if (s != '订阅推荐消息') {
                this.headerData.r_ele = '订阅推荐消息';
                this.$nextTick(function(){
                    this.$http.jsonp(
                        Common.baseUrl.roomMsgurls+"/Room/CancleSubscribeMsg",
                        {
                            params: {
                                language: 'M',
                                userId: ShareFn.getUserId(),
                                roomId: this.roomId
                            }
                        }
                    )
                })
            } else {
                this.headerData.r_ele = '已订阅推荐消息';
                this.$nextTick(function(){
                    this.$http.jsonp(
                        Common.baseUrl.roomMsgurls+"/Room/SubscribeMsg",
                        {
                            params: {
                                language: 'M',
                                userId: ShareFn.getUserId(),
                                roomId: this.roomId
                            }
                        }
                    )
                })
            }
        },
        GetRoomMsg(){
            var that = this;
            this.$nextTick(function(){
                this.$http.jsonp(
                    Common.baseUrl.roomMsgurls+'/Message/GetMsgList?roomId=' + that.$router.currentRoute.query.roomId,
                    { 
                        params: that.toData
                    }
                ).then(function(res){
                    console.log(that.toData)
                    if(res.status == 200){
                        this.msgData = res.data.messages;
                        res.data.isMsgDescriber?that.headerData.r_ele = '已订阅推荐消息':that.headerData.r_ele = '订阅推荐消息';
                       that.scrollTo();
                    }else{
                        console.log('请求失败')
                    }
                    
                })
            })
        },
        setTime(s){
            return ShareFn.setTime(s);
        },
        openMsg(id,price){
            var that = this;
            layer.open({
                content: '您确定要支付' + price + '精彩币购买此消息吗？',
                shadeClose: false,
                btn: ['确定', '取消'],
                yes: function (index) {
                    that.$nextTick(function(){
                        that.$http.jsonp(
                            Common.baseUrl.host+'/Purchase/PurchaseChatRoomMsg',
                            { 
                                params: {
                                    UserId: that.userId,
                                    Language: 'M',
                                    payable: true,
                                    MsgId: id,
                                    SecurityCode: ShareFn.getSecurityCode()
                                }
                            }
                        ).then(function(res){
                            console.log(res.data)
                            var texts = "购买成功！"
                            if (res.data.Code == '3006') {
                                texts = "精彩币余额不足请充值！";
                                layer.open({
                                    content:texts,
                                    time:2,
                                    skin:'msg'
                                });
                                return;
                            } else if (res.data.Code == '0000') {
                                /*that.$nextTick(function(){
                                    that.$http.jsonp(function(){
                                        roomMsgurls + '/Message/GetOpenedMsg',
                                        {
                                            params: {
                                                userId: that.userId,
                                                messageId: id,
                                                token: ShareFn.getSecurityCode()
                                            }
                                        }
                                    }).then(function(res){
                                        console.log(res)
                                        var ht = '<div class="pic" onclick="goauthor('+teachId+')">'+
                                                    '<img src="' + data.userPic + '" alt="">'+
                                                '</div><div class="msg">'+
                                                    '<p class="tim">' + data.userName + '    ' + setTime(data.createTime) + '</p>'+
                                                    '<div class="dialog">' + data.content + '<img class="lock-pic" src="./img/lop.png"></div>'+
                                                '</div>';
                                        $(that).parents('section').html(ht);
                                    },function(){
                                        console.log('解锁请求失败')
                                    })
                                })*/
                                that.GetRoomMsg();
                                layer.close(index)
                            }
                            
                        })
                    })
                },
                no: function (index) {
                    layer.close(index);
                }
            })
        },
        callbackFn(s){
            console.log(this.dialogData);
        },
        payForRoom: function(data) {
            this.openRoomWay = data;
            var that = this;
            var roomData = data;
            var ele = '';
            var btnArr = ['确认购买','返回列表'];
            var authorLevelList = [];
            if(data.authorLevelList != undefined){
                authorLevelList = data.authorLevelList.sort(compare("termmonths"));
            }
            console.log(authorLevelList)
            function compare(property){
                return function(obj1,obj2){
                    var value1 = obj1[property];
                    var value2 = obj2[property];
                    return value1 - value2;     // 升序
                }
           }
            if(authorLevelList.length>0){
                that.teachId = authorLevelList[0].authorId;
                for(var i = authorLevelList.length-1;i>=0;i--){
                    if(authorLevelList[i].termmonths == 0){
                        continue;
                    }
                    ele += '<p class="payList" onclick="payForPackage('+authorLevelList[i].id+','+authorLevelList[i].price+')" id="'+authorLevelList[i].packageid+'">';
                    if(authorLevelList[i].termmonths==1){                    
                        ele += '包月畅聊，仅'+authorLevelList[i].price+'精彩币</p>';
                    }else if(authorLevelList[i].termmonths > 1){
                        ele += '包'+authorLevelList[i].termmonths+'月畅聊，仅'+authorLevelList[i].price+'精彩币</p>';
                    }else if(authorLevelList[i].termmonths == 0){
                        ele += '包'+authorLevelList[i].termdays+'天畅聊，仅'+authorLevelList[i].price+'精彩币</p>';
                    }
                };
                if(data.roomPrice>0){
                    ele += '<p class="jcs_decision_true payList">购买门票'+data.roomPrice+'精彩币</p>';
                }
                btnArr = ['返回列表'];
            }
            
            var payListData = {
                msg: '门票售价' + data.roomPrice + '精彩币！',
                Dom: ele,
                btn: btnArr,
                trueCallback: succFn,
                falseCallback: eorFn
            };
            DialogZ.init(payListData);
            function succFn() {
                DialogZ.remoDom();
                if(roomData.userMoney < roomData.roomPrice){
                    var data = {
                        msg: '您的精彩币余额不足！',
                        btn: ['去充值', '返回列表'],
                        trueCallback: sucRechargeFn,
                        falseCallback: eorFn
                    };
                    function sucRechargeFn(){
                        app.pushToPayMoneyView('money')
                    };
                    function eorRechargeFn(){
                        that.$router.back();
                    };
                    DialogZ.init(data);
                }else{
                    var enterData = {
                        msg: '您确定要支付' + roomData.roomPrice + '精彩币购买门票吗？',
                        btn: ['确定', '取消'],
                        Dom: '',
                        trueCallback: function () {
                            //document.querySelector('.jcs_decision_true').attr('disabled',true);
                            that.$nextTick(function(){
                                that.$http.jsonp(
                                    Common.baseUrl.host+'/Purchase/PurchaseChatRoom',
                                    {
                                        params: {
                                            UserId: that.userId,
                                            Language: 'M',
                                            RoomId: that.roomId,
                                            SecurityCode: ShareFn.getSecurityCode()
                                        }
                                    }
                                ).then(function(res){
                                    //console(res.data)
                                    var texts = "购买成功！"
                                    if (res.data.Code == '3006') {
                                        texts = "余额不足请充值！";
                                        layer.open({
                                            content: texts,
                                            skin: 'msg',
                                            time: 2
                                        });
                                        return;
                                    } else if (res.data.Code == '0000') {
                                        DialogZ.remoDom();
                                        that.roomConnect();
                                        console.log(that.$refs.msgInput)
                                        that.isOver = false;
                                        that.GetRoomMsg();
                                    }
                                    
                                })
                            })
                        },
                        falseCallback: function () {
                            that.$router.back();
                        }
                    }
                    console.log(enterData);
                    DialogZ.init(enterData);
                }
            };
            function eorFn() {
                DialogZ.remoDom();
                that.$router.back();
            }
            //产品包解锁
            window.payForPackage = function(id,price){
                if(!isLogin()) {
                    app.toastLogIn();
                } else {
                    if (/iphone|ipad|ipod/.test(ua)) {
                       // alert('-'+id+','+0)
                        app.pushToPayment('-'+id,0);
                        //that.payForRoom(data);
                    } else {
                        that.goPay(roomData,id,price);
                    }
                    
                }
            }
        },
        back(){
            this.$router.back();
        },
        scrollTo(){
            var that = this;
            setTimeout(function(){
                //console.log(that.$refs.scrollWraper.offsetHeight)
                var mainH = that.$refs.scrollWraper.offsetHeight;
                var innerH = that.$refs.roomMain.offsetHeight;
                //console.log(mainH+':'+innerH)
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
.roomindex{
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
    .room-nav{
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: @whites;
        .selector{
            width: 100%;
            line-height: 40px;
            font-size: 0.14rem;
            height:40px;
            overflow: hidden;
            user-select:none;
        }
        .selector-open{
            height:132px;
            overflow: auto;
        }
        .selector li{
            height:40px;
            width:20%;
            border-bottom: 1px solid @bordercolor;
            float:left;
            text-align:center;
        }
        .selector .on{
            color: @reds;
        }
        .selector .on span{
            border-color:#ffd842;
            color:#ffd842;
        }
        .people{
            display:inline-block;
            font-size:0.14rem;
            color: #d2d2d2;
        }
        .people:before{
            content: "";
            width: 21px;
            height: 18px;
            background: url("../../common/img/pp.png") no-repeat left center;
            background-size: auto 100%;
            padding-left: 25px;
        }
     }
    .msg-list{
        width:100%;
        position:absolute;
        left:0;
        top:90px;
        right:0;
        bottom:50px;
        overflow-y:scroll;
        padding-bottom:3px;
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
        line-height:49px;
        padding:8px 10px;
        display:flex;
        align-items:center;
        background:#f8f8f8;
        justify-content:space-around;
        position:absolute;
        left:0;
        bottom:0;
        input{
            width:85%;
            height:100%;
            outline:none;
            border-radius:15px;
            border:1px solid @bordercolor;
            padding-left:8px;
            font-size:0.14rem;
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