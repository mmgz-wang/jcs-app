<template>
	<div class="room-list">
		<publick-header @menuClick="setMenu" :headerData="headerData"></publick-header>
		<scroll class="room-list-scroll"
		:needRefresh="needRefresh"
		:pullDownRefresh="pullDownRefresh"
		:pullUpLoad="pullUpLoad"
		:pullingDownFn="pullingDownFn"
		:pullingUpFn="pullingUpFn"
		ref="scroll"
		:data="roomListData">
			<div class="roomlist-wrap">
				<p pulldown>{{pullDownText}}</p>
        <div class="loading-container" v-show="!roomListData.length">
          <loading></loading>
        </div>
				<div class="list" v-for="item in roomListData" :id="item.roomId" @click="gooRoom(item)">
					<div class="room-pic">
						<img :src="item.roomPic" alt="">
					</div>
					<div class="room-list-info">
						<div class="room-list-msg">
							<p class="master roompic">
								主播: {{item.lecturerName}}<span class="null"></span>门票: <span :class="{on:item.roomStatus==2 || item.roomStatus==1}" v-html="setPrice(item)"></span>
							</p>
							<!-- <p class="roompic">门票: <span :class="{on:item.roomStatus==2 || item.roomStatus==1}" v-html="setPrice(item)"></span></p> -->
							<p class="time">直播时间:&nbsp;&nbsp; {{formatTime(item.startTime)}} —  {{formatTime(item.startTime, item.endTime)}}</p>
					    	<span v-if="item.roomStatus == '1'" @click.stop="setMsg($event);" :roomId = "item.roomId" class="setmsg" :id="'s'+item.roomId" :class="{roomlistgary:item.isRoomDscriber}">{{item.isRoomDscriber?'关闭通知':'开启通知'}}</span>
						</div>
						<div class="explain">
							<h4>{{item.roomName}}
								<i class="room-status"
								:class="{early:item.roomStatus==1,rooming:item.roomStatus==2,roomover:item.roomStatus==3}"></i></h4>
							<p> {{item.roomMemo}}</p>
						</div>

					</div>
				</div>
				<p pullup>{{pullUpText}}</p>
			</div>
		</scroll>
		<router-view></router-view>
	</div>

</template>

<script type="text/javascript">
import Common from '../../common/js/common'
import PublickHeader from 'base/header/publickheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'

export default {
	name: 'room-list',
	data (){
		return {
			roomPageIndex: 0,
			roomListData: [],
			types: 0,
			headerData: {
				ele: '聊天室',
				name: 'roomlist',
				isShow: true
			},
			needRefresh: true,
			pullDownRefresh: {threshold: 50, stop: 50},
			pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
			pullDownText: '下拉刷新！',
			pullUpText: '上拉加载更多！',
			roomPageIndex: 0,
			informText: '开启通知',
			pageRows: 20
		}
	},
	components: {
		PublickHeader,Scroll,loading
	},
	created(){
		this.getData();
	},
	methods: {
		setMenu: function(name){
			var menu = document.querySelector('#menus');
			menu.className = 'menus show';
		},
		pullingDownFn(scroll){
		  this.types = 0;
		  this.roomPageIndex = 0;
		  this.pullDownText = '努力加载中 ...';
		  this.getData();

		},
		pullingUpFn(scroll){
		  this.types = 1;
		  this.roomPageIndex += 1;
		  this.pullUpText = '努力加载中 ...';
		  this.getData();

		},
		gooRoom: function(item){
			var that = this;
			var roomId = item.roomId;
			var targetBtn = document.querySelector('#s'+roomId);
			console.log(item)
			//if(this.shareFn.isLogin()){
				if(item.roomStatus==1){
					layer.open({
					    content: `<p class="teach-name">${item.roomName}</p><p>主播：${item.lecturerName}<span style="width:40px;display: inline-block"></span>门票：${that.setPrice(item)}</p><p>直播时间：${item.startTime.substr(5, 11)} ${item.endTime.substr(5, 11)}</p>`,
					    btn: ['开启通知', '取消通知'],
					    shadeClose: false,
					    yes: function (index) {
					        that.$nextTick(function(){
	                            that.$http.jsonp(
	                                "https://chat.jingcaishuo.com/Room/SubscribeRoom",
	                                {
	                                    params: {
	                                        language: 'M',
	                                        userId: this.shareFn.getUserId(),
	                                        roomId: roomId
	                                    }
	                                }
	                            ).then(function(){
	                            	targetBtn.innerHTML = '关闭通知';
	                            	targetBtn.className='setmsg roomlistgary';
	                            })
	                        })
	                        layer.close(index);
					    },
					    no: function (index) {
					    	that.$nextTick(function(){
					    	    that.$http.jsonp(
					    	        "https://chat.jingcaishuo.com/Room/CancleSubscribeRoom",
					    	        {
					    	            params: {
					    	                language: 'M',
					    	                userId: this.shareFn.getUserId(),
					    	                roomId: roomId
					    	            }
					    	        }
					    	    ).then(function(){
					    	    	targetBtn.innerHTML = '开启通知';
					    	    	targetBtn.className='setmsg';
					    	    },function(){
					    	        that.showMeaage('设置失败请重试！');
					    	    })
					    	})
					    	layer.close(index);
					    }
					});
				}else{
					this.$router.push({path:`/roomindex?roomId=${item.roomId}&lecturerName=${encodeURI(item.lecturerName)}&roomName=${encodeURI(item.roomName)}&roomPrice=${encodeURI(item.roomPrice)}&startTime=${item.startTime}` });
				}
			/*}else{
				if(item.roomStatus == 2 || item.roomStatus == 1){
					this.$router.push({ name: 'enter'});
				}else{
					this.$router.push({path:`/roomindex?roomId=${item.roomId}&lecturerName=${encodeURI(item.lecturerName)}&roomName=${encodeURI(item.roomName)}&roomPrice=${encodeURI(item.roomPrice)}&startTime=${item.startTime}` });
				}

			}*/

		},
		getData: function(){
			this.$nextTick(function(){
				this.$http.jsonp(Common.baseURI().roomMsgurls+'/Room/GetRoomList',
					{
						params:{
							userId: this.shareFn.getUserId(),
				            pageIndex: this.roomPageIndex,
				            pageRows: this.pageRows
				        }
				    }
				).then(function(res){
					console.log(res.data)
					console.log(this.types)
					if(res.status == 200 && res.data.length > 0){
						if(this.types){

						  this.roomListData = this.roomListData.concat(res.data);
						  this.pullUpText = '上拉加载更多！';
						}else{
						  this.roomListData = res.data;
						  this.pullDownText = '下拉刷新！';
						}
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
              if(data.allowVistor){
                return '免费 游客可进'
              }
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
		showMeaage: function (msg) {
		    layer.open({
		        content: msg,
		        time: 2,
		        skin: 'msg',
		        anim: 'scale'
		    });
		},
		setMsg: function(e){
			console.log(e.target.className)
			var setmsgBtn = e.target;
		    if (this.shareFn.isLogin()) {
		        var roomId = setmsgBtn.attributes['roomId'].nodeValue;
		        if (setmsgBtn.className.indexOf('roomlistgary')>0) {
		            this.$http.jsonp("https://chat.jingcaishuo.com/Room/CancleSubscribeRoom",
		            	{
		            		params:{
		            			language: 'M',
			                    userId: this.shareFn.getUserId(),
			                    roomId: roomId
		                    }
		                }
		            ).then(function(res){
		            	document.querySelector('#s'+roomId).innerHTML = '开启通知';
		            	setmsgBtn.className='setmsg';
		            })
		        } else {
		            setmsgBtn.className='setmsg';
                    this.$http.jsonp("https://chat.jingcaishuo.com/Room/SubscribeRoom",
                    	{
                    		params:{
                    			language: 'M',
        	                    userId: this.shareFn.getUserId(),
        	                    roomId: roomId
                            }
                        }
                    ).then(function(res){
                    	document.querySelector('#s'+roomId).innerHTML = '关闭通知';
                    	setmsgBtn.className='setmsg roomlistgary';
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
	.roomlist-wrap{
		float:left;
		width:100%;
		background:@whites;
	}
	.list{
		display:flex;
		width:100%;
		background:@whites;
		padding:20px 0 0px 15px;
	}
	.room-pic{
		width:50px;
		text-align:center;
		font-size:0;
		padding-right:10px;
		img{
			width:40px;
			height:40px;
			border-radius:50%;
			text-align:left;
		}
	}
	.room-list-msg{
		position:relative;
		width:100%;
		color:#999999;
		line-height:24px;
		p{
			font-size:0.11rem;
			line-height:21px;
		}
		.time{
			padding-bottom:10px;
		}
	}
	.roompic .on{
		color:@reds;
	}
	h4{
		color:@maincolor;
		font-weight:normal;
		font-size:0.15rem;
		.on-tit{
			color:#ffd842;
		}
		i{
			width:37px;
			height:14px;
			display:inline-block;
			overflow:hidden;
			background:url('../../common/img/roomstatus.png') no-repeat top center;
			background-size:34px 42px;
			transform:translateY(2px);
		}
		.rooming{
			background-position:0 -14px;
		}
		.roomover{
			background-position:0 -28px;
		}
	}
	.master{
		padding:0px 0;
	}
	.explain{
		font-size:0.12rem;
		p{
			line-height:22px;
			padding-top:4px;
			color:@namecolor;
		}
	}
	.setmsg{
		height:20px;
		text-align:right;
		color:@reds;
		line-height: 20px;
		font-size:0.12rem;
		padding-right:10px;
		border:1px solid @reds;
		border-radius:10px;
		background:url(../../common/img/timeon.png) no-repeat left center;
		background-size:13px;
		padding-left:25px;
		background-position:10px 3px;
		position:absolute;
		right:0px;
		top:0px;
	}
	.roomlistgary{
		color:#cecece;
		border-color:#cecece;
		background:url(../../common/img/timegary.png) no-repeat left center;
		background-size:13px;
		background-position:10px 3px;
	}
	.room-list-info{
		float: left;
		width: 100%;
		cursor: pointer;
		padding-right:15px;
		padding-bottom:20px;
		.border-bottom;
	}
	.room-list-scroll{
		overflow:hidden;
		width:100%;
		position:absolute;
		top:44px;
		bottom:0;
	}
	.null{
		width:10px;
		height:10px;
		display:inline-block;
	}
  .loading-container{
    position:absolute;
    width:100%;
    height:100%;
    top:50%;
    transform: translateY(-50%);
  }
}
</style>
