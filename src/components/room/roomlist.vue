<template>
	<div class="room-list">
		<publick-header @menuClick="setMenu" :headerData="headerData"></publick-header>
		<scroll class="scroll" ref="scroll" :data="roomListData">	
			<div class="roomlist-wrap">			
				<div class="list" v-for="item in roomListData" :id="item.roomId" @click="gooRoom(item)">
					<div class="pic">
						<img :src="item.roomPic" alt="">
					</div>
					<div class="info">
						<div class="msg">
							<p class="master">主播: {{item.lecturerName}}</p>
							<p class="roompic">门票: <span :class="{on:item.roomStatus==2 || item.roomStatus==1}" v-html="setPrice(item)"></span></p>
							<p class="time">直播时间:&nbsp;&nbsp; {{formatTime(item.startTime)}} ——  {{formatTime(item.startTime, item.endTime)}}</p>
					    	<span v-if="item.roomStatus == '1'" @click.stop="setMsg($event);" :roomId = "item.roomId" class="setmsg" :class="{gary:!item.isRoomDscriber}">开启通知</span>
						</div>
						<div class="explain">
							<h4>{{item.roomName}}<i v-html="setRoomStatus(item.roomStatus)"></i></h4>
							<p> {{item.roomMemo}}</p>
						</div>
					    
					</div>
				</div>
			</div>
		</scroll>
		<router-view></router-view>
	</div>

</template>

<script type="text/javascript">
import Common from '../../common/js/common'
import Sharefn from '../../common/js/sharefn'
import PublickHeader from 'base/header/publickheader'
import Scroll from 'base/scroll/scroll'
export default {
	name: 'room-list',
	data (){
		return {
			roomPageIndex: 0,
			roomListData: [],
			headerData: {
				ele: '<h1 class="jcs-title">聊天室</h1>',
				name: 'roomlist',
				isShow: true
			}
		}
	},
	components: {
		PublickHeader,Scroll
	},
	created(){
		this.getDta();
	},
	methods: {
		setMenu: function(name){
			var menu = document.querySelector('#menu');
			menu.className = 'menus show';

		},
		gooRoom: function(item){
			this.$router.push({ name: 'roomindex', params: item });
		},
		getDta: function(){
			this.$nextTick(function(){
				this.$http.jsonp(Common.baseUrl.roomMsgurls+'/Room/GetRoomList',
					{ 
						params:{
							userId: Sharefn.getUserId(),
				            pageIndex: this.roomPageIndex,
				            pageRows: 20
				        }
				    }
				).then(function(res){
					if(res.status == 200 && res.data.length > 0){
						this.roomListData = res.data;
					}else{
						console.log('请求失败')
					}
					
				})
			})
		},
		setRoomStatus: function(s){
		    var statues = {
		        '2': '<span class="ing">直播中</span>',
		        '1': '<span>未开播</span>',
		        '3': '<span class="finish">已结束</span>'
		    }
		    return statues[s];
		},
		setOnHeigh: function(s){
		    return s == '2'? 'on-tit' : "";
		},
		setPrice: function(data){
		    if(data.periodList != undefined){
		        if (data.roomPrice == 0 && data.periodList.length<=0) {
		            return '免费';
		        }else if(data.roomPrice != 0 && data.periodList.length>=0){
		            return data.roomPrice+'精彩币 '+this.returnPackage(data.periodList);
		        }else if(data.roomPrice != 0 && data.periodList.length<=0){
		            return data.roomPrice+'精彩币';
		        }else{
		            return this.returnPackage(data.periodList);
		        }
		    }else{
		        return data.roomPrice==0?'免费':data.roomPrice+'精彩币';
		    }
		},
		returnPackage: function(v){
		    var packageArr = {'1':' 可包月','3':' 可包季','6':' 可包半年','12':' 可包年'};
		    var str = "";
		    v.forEach(function(v,i){
		        str += packageArr[v.termmonths]
		    })
		    return str;
		},
		formatTime: function(t1, t2){
		    var str = '';
		    var star = new Date(arguments[0].replace(/-/g, '/')),
		        starYear = star.getFullYear(),
		        starMonth = star.getMonth()+1,
		        starDay = star.getDate(),
		        starHour = star.getHours(),
		        starMinute = star.getMinutes();
		        starMonth<9?starMonth='0'+starMonth:starMonth;
		        starDay<9?starDay='0'+starDay:starDay;
		        starHour<9?starHour='0'+starHour:starHour;
		        starMinute<9?starMinute='0'+starMinute:starMinute;
		    if (arguments.length > 1) {
		        var ends = new Date(arguments[1].replace(/-/g, '/')),            
		            endsYear = ends.getFullYear(), 
		            endsMonth = ends.getMonth()+1,           
		            endsDay = ends.getDate(),
		            endsHour = ends.getHours(),
		            endsMinute = ends.getMinutes();
		            endsMonth<9?endsMonth='0'+endsMonth:endsMonth;
		            endsDay<9?endsDay='0'+endsDay:endsDay;
		            endsHour<9?endsHour='0'+endsHour:endsHour;
		            endsMinute<9?endsMinute='0'+endsMinute:endsMinute;
		        if(starDay < endsDay){
		            return endsMonth+'-'+endsDay+' '+endsHour+':'+endsMinute;
		        }else{
		            return endsHour+':'+endsMinute;
		        }    
		    } else {
		        return starMonth+'-'+starDay+' '+starHour+':'+starMinute;
		    }
		},
		setMsg: function(e){
			console.log(e.target.className)
			var setmsgBtn = e.target;
		    if (Sharefn.isLogin()) {
		        var roomId = setmsgBtn.attributes['roomId'].nodeValue;
		        console.log(roomId)
		        if (setmsgBtn.className.indexOf('gary')<0) {
		            setmsgBtn.className='setmsg gary';
		            this.$http.jsonp("https://chat.jingcaishuo.com/Room/CancleSubscribeRoom",
		            	{ 
		            		params:{
		            			language: 'M',
			                    userId: Sharefn.getUserId(),
			                    roomId: roomId
		                    }
		                }
		            ).then(function(res){
		            	
		            })
		        } else {
		            setmsgBtn.className='setmsg';
                    this.$http.jsonp("https://chat.jingcaishuo.com/Room/SubscribeRoom",
                    	{ 
                    		params:{
                    			language: 'M',
        	                    userId: Sharefn.getUserId(),
        	                    roomId: roomId
                            }
                        }
                    ).then(function(res){
                    	
                    })
		        }
		    } else {
		        app.pushLoginView();
		    }
		}
	},
	watch:{
		data(){

		}
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.room-list{
	width:100%;
	height:100%;
}
.roomlist-wrap{
	float:left;
	width:100%;
	padding-left:15px;
	background:@whites;
}
.list{
	display:flex;
	border-bottom:1px solid @bordercolor;
	width:100%;
	background:@whites;
	padding-top:10px;
	padding:10px 10px 10px 0;
}
.pic{
	width:50px;
	text-align:center;
	font-size:0;
	padding-right:10px;
}
.pic img{
	width:40px;
	height:40px;
	border-radius:50%;
	text-align:left;
}
.msg{
	position:relative;
	width:100%;
	color:@assistcolor;
	line-height:24px;
}
.msg p{
	font-size:0.12rem;
}
.roompic .on{
	color:@reds;
}
h4{
	color:@maincolor;
	font-weight:normal;
	font-size:0.15rem;
}
.on-tit{
	color:#ffd842;
}
i span{
	font-size:0.1rem;
	height:16px;
	padding:0 3px;
	line-height:14px;
	display:inline-block;
	line-height:16px;
	margin-left:10px;
	color:@oranges;
	background:#fff2e6;
}
i .ing{
	color:@whites;
	background:@reds;
}
i .finish{
	color:@whites;
	background:#cecece;
}
.master{
	padding:0px 0;
}
.explain{
	padding-top:5px;
	font-size:0.12rem;
}
.explain p{
	line-height:0.24rem;
}
.setmsg{
	height:22px;
	text-align:right;
	color:@reds;
	line-height: 22px;
	font-size:0.12rem;
	padding-right:10px;
	border:1px solid @reds;
	border-radius:10px;
	background:url(../../common/img/timeon.png) no-repeat left center;
	background-size:14px;
	padding-left:25px;
	background-position:6px 3px;
	position:absolute;
	right:0px;
	top:0px;
}
.gary{
	color:#cecece;
	border-color:#cecece;
	background:url(../../common/img/timegary.png) no-repeat left center;
	background-size:14px;
	background-position:6px 3px;
}
.info{float: left;width: 100%;cursor: pointer;}
.scroll{
	overflow:hidden;
	width:100%;
	position:absolute;
	top:50px;
	bottom:0;
}
</style>