<template>
<div class="remind">
    <div class="mailbox" :style="{height:retstyle+'px'}">
        <div class="receive">
            <span class="txt">接收消息</span>
            <span @click="setReceive" class="handle" :class="{'handle_open': open == 1}"><a href="#"></a></span>
        </div>
        <div class="receive recetime" v-show="open == 1">
            <span class="txt txta">接收时间</span>
            <div class="timesel">
            <div class="sel" @click="s_h_click" :class="{'show': s_h_ul}">
                <span class="displayer">{{s_h_txt}}</span>
                <ul class="start">
                    <li :id="item" v-for="item in hour">{{item}}</li>
                </ul>
            </div>
            <div class="sel" @click="s_m_click" :class="{'show': s_m_ul}">
                <span class="displayer">{{s_m_txt}}</span>
                <ul class="start_mu">
                    <li :id="item" v-for="item in minute">{{item}}</li>
                </ul>
            </div>
            
            <span class="line">-</span>
            <div class="sel" @click="e_h_click" :class="{'show': e_h_ul}">
                <span class="displayer">{{e_h_txt}}</span>
                <ul class="end">
                    <li :id="item" v-for="item in hour">{{item}}</li>
                </ul>
            </div>
            <div class="sel" @click="e_m_click" :class="{'show': e_m_ul}">
                <span class="displayer">{{e_m_txt}}</span>
                <ul class="end_mu">
                    <li :id="item" v-for="item in minute">{{item}}</li>
                </ul>
            </div>
            
            <div class="allday" @click="setAllDay"><i :class="{choice: alldays == 10}"></i>全天</div> <!--选择全天加 class choice-->
            </div>
        </div>
    </div>
    <div class="mailbox t_list"  v-show="open == 1">
        <div class="receive" v-for="item in teachList">
            <span class="txt">{{item.analystName}}</span>
            <div class="choice_txt">
                <ul :id="'ul'+item.analystId">
                    <li @click="setTeach(item.analystId,10,$event)"><i :class="{choice: item.type == 10}"></i>全部</li>
                    <li @click="setTeach(item.analystId,20,$event)"><i :class="{choice: item.type == 20}"></i>收费</li>
                    <li @click="setTeach(item.analystId,30,$event)"><i :class="{choice: item.type == 30}"></i>免费</li>
                    <li @click="setTeach(item.analystId,40,$event)"><i :class="{choice: item.type == 40}"></i>关闭</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Common from 'common/js/common'
export default {
    data () {
        return {
            teachList: [],
            hour: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
            minute: ['00','10','20','30','40','50'],
            s_h_ul: false,
            s_m_ul: false,
            e_h_ul: false,
            e_m_ul: false,
            s_h_txt: '00',
            s_m_txt: '00',
            e_h_txt: '00',
            e_m_txt: '00',
            alldays: '10',
            open: false
        }
    },
    created: {  

    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            let that = this;
            this.$nextTick(function () {
                this.$http.jsonp(
                    `${Common.baseURI().host}/users-config/find/`+this.shareFn.getUserId(),
                    {
                        params: {
                            language: 'M',
                            userId: this.shareFn.getUserId(),
                        }
                }).then(function(res){
                    console.log(res.data)
                    that.teachList = res.data.result.usersConfigAnalysts;
                    that.s_h_txt = res.data.result.startHour<9?'0'+res.data.result.startHour:res.data.result.startHour;
                    that.s_m_txt = res.data.result.startMinute<9?'0'+res.data.result.startMinute:res.data.result.startMinute;
                    that.e_h_txt = res.data.result.endHour<9?'0'+res.data.result.endHour:res.data.result.endHour;
                    that.e_m_txt = res.data.result.endMinute<9?'0'+res.data.result.endMinute:res.data.result.endMinute;
                    that.alldays = res.data.result.notifyType;
                    that.open = res.data.result.silenceType;
                })
            })
        },
        setTeach(id,val,e){
            this.ajax('/users-config/update-analyst-notify/', {'type': val, 'analystId': id})
            console.log(document.getElementById('ul'+id))
            var li = document.getElementById('ul'+id).getElementsByTagName('li');
            console.log(li)
            for(var i=0;i<li.length;i++){
                console.log(li[i].getElementsByTagName('i'))
                li[i].getElementsByTagName('i').className = '';
            }
                
            if(e.target.nodeName == 'LI'){
                e.target.children[0].className = 'choice'
            }else{
                e.target.className = 'choice'
            }
            this.getData()
        },
        setReceive(){
            if(this.open == 1){
                this.open = 0;
                this.ajax('/users-config/update-silence/', {'silenceType': 0,language:'M'})
            }else{
                this.open = 1;
                this.ajax('/users-config/update-silence/', {'silenceType': 1,language:'M'})
            }
        },
        ajax(url,data){
            this.$nextTick(function () {
                this.$http.jsonp(
                    Common.baseURI().host+url+this.shareFn.getUserId(),
                    {
                        params: data
                }).then(function(res){
                    console.log(res.data)
                })
            })
        },
        retstyle(){
            return this.open==1?130:50;
        },
        setAllDay(){
            console.log(this.alldays)
            if(this.alldays == 10){
                this.alldays == 20
                this.ajax ('/users-config/update-notify/', {"notifyType": '20'})
            }else{
                this.alldays == 10
                this.ajax ('/users-config/update-notify/', {"notifyType": '10'})
                this.s_h_txt = '00';
                this.s_m_txt = '00';
                this.e_h_txt = '00';
                this.e_m_txt = '00';
            }
            console.log(this.alldays)
        },
        s_h_click(e){
            console.log(e.target.nodeName)
            this.s_h_ul =  !this.s_h_ul
            if(e.target.nodeName == 'LI'){
                this.s_h_txt = e.target.id
                this.ajax('/users-config/update-notify/', {
                    'startHour': this.s_h_txt,
                    'startMinute': this.s_m_txt,
                    'endHour': this.e_h_txt,
                    'endMinute': this.e_m_txt,
                    'notifyType': this.alldays
                })
                this.alldays = 20
                //this.setAllDay()
            }
        },
        s_m_click(e){
            this.s_m_ul = !this.s_m_ul
            if(e.target.nodeName == 'LI'){
                this.s_m_txt = e.target.id
                this.ajax('/users-config/update-notify/', {
                    'startHour': this.s_h_txt,
                    'startMinute': this.s_m_txt,
                    'endHour': this.e_h_txt,
                    'endMinute': this.e_m_txt,
                    'notifyType': this.alldays
                })
                this.alldays = 20
            }
        },
        e_h_click(e){
            this.e_h_ul = !this.e_h_ul
            if(e.target.nodeName == 'LI'){
                this.e_h_txt = e.target.id
                this.ajax('/users-config/update-notify/', {
                    'startHour': this.s_h_txt,
                    'startMinute': this.s_m_txt,
                    'endHour': this.e_h_txt,
                    'endMinute': this.e_m_txt,
                    'notifyType': this.alldays
                })
                this.alldays = 20
            }
        },
        e_m_click(e){
            this.e_m_ul = !this.e_m_ul
            if(e.target.nodeName == 'LI'){
                this.e_m_txt = e.target.id
                this.ajax('/users-config/update-notify/', {
                    'startHour': this.s_h_txt,
                    'startMinute': this.s_m_txt,
                    'endHour': this.e_h_txt,
                    'endMinute': this.e_m_txt,
                    'notifyType': this.alldays
                })
                this.alldays = 20
            }
        }
    }
}
</script>
<style>
.remind{
    width: 100%;height: 100%;background: #f0f0f0;position: absolute;z-index: 9999;
    font-size: 15px;color: #000000;overflow: scroll;
}
input{-webkit-user-select:auto;} 
img{border:0}
a{text-decoration:none}
.mailbox{
    float:left;width:100%;margin-bottom:10px;background:#ffffff;
}
.receive,.recetime{
    float:left;width:96%;height:50px;line-height:50px;margin-left:2%;border-bottom:1px #f4f4f4 solid;
    }
.receive .txt{
    float:left;width:35%;font-size:13px;color:#000000
}
.receive .txta{
    width: 25%;
}
.handle{
    float:right;width:52px;height:34px;margin:8px 10px 0 0; background:url(../../common/img/handle.png); 
    background-size:contain;
}
.handle_open{
    background:url(../../common/img/handle_open.png); background-size:contain;
}
.handle a{
    display:block;width:52px;height:34px;
}
.recetime{
    height:auto; padding-bottom:10px; border-bottom:0 none;
}
.timesel{
    float:left;width:75%;height: 70px;
}
.timesel .sel{
    float:left;width:22%;position: relative; height: 26px; line-height: 26px; text-align: center;
     margin:14px 2px 0 0; border:0; background:#f0f0f0; font-size:.875em;color:#000;
     overflow: hidden;
}
.sel ul{
    width: 100%;position: absolute; left:0;top:26px;z-index: 888;height: 156px; 
    background: #f0f0f0;overflow: scroll;
}
.timesel .show{height: 182px;overflow: auto;}
.sel p{position: absolute;width: 100%;height: 100%; z-index: 999; background: #f0f0f0}
.displayer{
    width: 100%;height: 26px;position: absolute;left: 0;top: 0;z-index: 9999;background: #f0f0f0;
}
.timesel li{float:left;width: 100%;height: 26px;}
.line{float:left;margin:0 5px 0 3px;font-size:1em;color:#000;}
.allday{float:left;width:94%;height:20px; line-height:20px;text-align:right; font-size:.875em;color:#000}
.allday i,.choice_txt i{display:inline-block;width:14px;height:14px;margin-right:5px;background:url(../../common/img/selbox.png);background-size:contain;vertical-align:middle}
.allday .choice,.choice_txt .choice{background:url(../../common/img/choice.png);background-size:contain;}
.choice_txt{float:right;width:65%;}
.choice_txt ul{
    display: flex;display: -webkit-flex;justify-content: space-between;
}
.choice_txt ul li{
    float:left; margin-right:4%; font-size:11px; color:#000;
}

.receive:nth-last-child(1){ border-bottom:0 none}
.choice_txt ul li:nth-last-child(1){margin-right:0}

@media (device-height:667px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone6 */
.receive .txta{width: 25%}
.timesel{width:75%}

}

@media (device-height:736px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone6 Plus */
.receive .txta{width: 25%;}
.timesel{width:75%;}
}
.mask{width: 100%;height: 100%;background: rgba(20,20,19,0.6);z-index: 999;position: absolute;left:0;top:0;}
.dilog{width: 200px; height: 110px; background: #2f3030; border: solid 1px #000;border-radius: 8px; position: absolute;left:50%;top:50%;margin-left:-100px;margin-top:-55px;line-height: 30px;text-align: center;}
.dilog p{font-size: .9em; color: #000;}
.dilog h3{width: 100%;height: 35px;color: #000;line-height: 35px;text-align: center;
font-size: 1.2em;border-bottom: 1px solid #eee;}
.sure{width: 3em; height: 1.5em;border-radius: 4px; line-height: 1.5em;text-align:center;position: absolute;bottom:10px;right:10px;font-size:0.9em;background: #fddd4e;}
</style>

