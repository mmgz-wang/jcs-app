<template>
    <div class="list" v-if="item.lecturerId!=0" :id="item.roomId" @click="gooRoom(item)">
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
                <span v-if="item.roomStatus == '1'" @click.stop="setMsg($event);" :roomId = "item.roomId" class="setmsg" :id="'s'+item.roomId" :class="{roomlistgary:item.isRoomDscriber}">{{item.isRoomDscriber?'关闭通知':'开播后通知'}}</span>
            </div>
            <div class="explain">
                <h4>{{item.roomName}}
                    <i class="room-status"
                    :class="{early:item.roomStatus==1,rooming:item.roomStatus==2,roomover:item.roomStatus==3}"></i></h4>
                <p> {{item.roomMemo}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {

        }
    },
    methods: {
        gooRoom (item) {
            console.log(item)
			var that = this;
			var roomId = item.roomId;
			var targetBtn = document.querySelector('#s'+roomId);
			//if(this.shareFn.isLogin()){
				if(item.roomStatus==1){
				  if(this.shareFn.isLogin()){
            layer.open({
              content: `<p class="teach-name">${item.roomName}</p><p>主播：${item.lecturerName}<span style="width:40px;display: inline-block"></span>门票：${that.setPrice(item)}</p><p>直播时间：${item.startTime.substr(5, 11)} ${item.endTime.substr(5, 11)}</p>`,
              btn: ['开播后通知我', '取消通知'],
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
                    targetBtn.innerHTML = '开播后通知我';
                    targetBtn.className='setmsg';
                  },function(){
                    that.showMeaage('设置失败请重试！');
                  })
                })
                layer.close(index);
              }
            });
          }else{
            this.showMeaage('您还没有登录！')
          }
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
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/base.less';
	.list{
		display:flex;
		width:100%;
		background:@whites;
    padding:20px 0 0px 15px;
    margin-top: 10px;
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
</style>
