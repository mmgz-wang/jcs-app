<template>
	<div class="consumerocore">
		<main-header :headerData="headerData"></main-header>
		<div class="record-tab">
			<span @click="tabClick('art')" :class="{auton:isart}">消费</span>
			<span @click="tabClick('room')"  :class="{auton:!isart}">充值</span>
		</div>
		<div class="consumerocore-wrap" :class="{roomActive:show,roomLeave:!show}">
			<scroll v-if="consumeList.length>0"
			:needRefresh="needRefresh"
		    :pullDownRefresh="pullDownRefresh"
		    :pullUpLoad="pullUpLoad"
		    :pullingDownFn="pullingDownFn"
		    :pullingUpFn="pullingUpFn"
		    ref="scroll" 
			class="consume-list" :data="consumeList" >
				<div>
					<p pulldown>{{pullDownText}}</p>
					<div class="consume-item" v-for="item in consumeList">
						<p class="consume-item-top">
							<span class="consumemoney">{{'-'+item.Money}}精彩币</span>
							{{item.Author+'的'+item.PurchaseName}}
						</p>
						<p class="consume-item-bottom">
							<span class="pay-way">{{item.Date.substr(5,11)}}</span>
							{{item.TypeName}}
						</p>
					</div>
					<p pullup>{{pullUpText}}</p>
				</div>
				<!-- <loading v-show="consumeList.length==0" :title="loadText"></loading> -->
			</scroll>
			<scroll v-if="rechargeList.length>0"
			:needRefresh="needRefresh"
		    :pullDownRefresh="pullDownRefresh"
		    :pullUpLoad="pullUpLoad"
		    :pullingDownFn="pullingDownFn"
		    :pullingUpFn="pullingUpFn"
		    ref="scroll" 
			class="recharge-list" :data="rechargeList">
				<div>
					<p pulldown>{{pullDownText}}</p>
					<div class="recharge-item" v-for="item in rechargeList">
						<p class="recharge-item-top">
							<span class="rechargemoney">{{'+'+item.GoldCoin}}精彩币</span>
							{{item.MainTypeName}}
						</p>
						<p class="recharge-item-bottom">
							<span class="pay-way">{{item.Date.substr(5,11)}}</span>
							{{item.MainTypeDetail}}
						</p>
					</div>
					<p pullup>{{pullUpText}}</p>
				</div>
			</scroll>
		</div>
	</div>
</template>
<script type="text/javascript">
import mainHeader from "base/header/mainheader"
import Scroll from "base/scroll/scroll"
import Common from "common/js/common"
import shareFn from "common/js/shareFn"
//import loading from 'base/loading/loading'
export default {
	name: 'consumerecord',
	data(){
		return {
			headerData:{
                name: 'record',
                ele: '账户明细'
            },
			isart: true,
			show: false,
			consumeId: 0,
			rechargeId: 0,
			queryId: '',
			consumeList: [],
			rechargeList:[],
			loding: null,
			matchShow: false,
			queryTypes: 1,
			types: 0,
			needRefresh: true,
			pullDownRefresh: {threshold: 50, stop: 50},
			pullUpLoad: {threshold: 90, txt:{more: "", noMore: ""} },
			pullDownText: '下拉刷新！',
			pullUpText: '上拉加载更多！',
			loadText: '努力加载中...',
			unNeed: false
		}
	},
	created(){
		this.loding = layer.open({
			type: 2,
			content: '加载中'
		});	
	},
	mounted(){
		this.$nextTick(function(){
			this.getData();
		})
	},
	activated() {
		
	    
	},
	methods: {
		 pullingDownFn(scroll){
			this.types = 0;
			this.queryId = '';
			this.pullDownText = '努力加载中 ...';
			this.pullUpText = '上拉加载更多！';
			this.getData();
		  
		},
		pullingUpFn(scroll){
			console.log('666')
			this.types = 1;
			this.pullUpText = '努力加载中 ...';
			this.getData();
		  
		},
		tabClick(s){
			if(s == 'art'){
				this.isart = true;
				this.show = false;
				this.queryTypes = 1;
				this.queryId = this.consumeId = '';
				this.consumeList = [];
				this.getData();
			}else{
				this.queryTypes = 2;
				this.isart = false;
				this.show = true;
				this.queryId = this.rechargeId = '';
				this.rechargeList = [];
				this.getData();
			}
			console.log(this.queryId)
		},
		getData(){
			var that = this;
			var opt = {
				url: Common.baseUrl.nativeHost,
				data: {
					"Type": that.queryTypes,
					Id: that.queryId,
					"SecurityCode": shareFn.getSecurityCode(),
					"UserId": shareFn.getUserId()
				},
				headers:{"X-Target":'TrentService.GetUserCapitalDetails'},
				callback: function(data){
					if(data.Code == '0000'){
						if(that.queryTypes == 1){
							if(that.types == 0){
								that.consumeList = data.Details;
							}else{
								if(data.Details.length<=0){
									that.unNeed = true;
									that.pullUpText = '暂无更多数据！！！';
									return ;
								}
								that.consumeList = that.consumeList.concat(data.Details);
							}
							that.consumeId = that.consumeList[that.consumeList.length-1].Id;
							that.queryId = that.consumeId;
							console.log(that.consumeList)
						}else{
							if(that.types == 0){
								that.rechargeList = data.Details;
							}else{
								if(data.Details.length<=0){
									that.unNeed = true;
									that.pullUpText = '暂无更多数据！！！';
									return ;
								}
								that.rechargeList = that.rechargeList.concat(data.Details);
							}
							that.rechargeId = that.rechargeList[that.rechargeList.length-1].Id;
							that.queryId = that.rechargeId;
						}
						that.pullDownText = '下拉刷新！';
						that.pullUpText = '上拉加载更多！';
						console.log('consumeId:'+that.consumeId+'rechargeId:'+that.rechargeId)
					}else{
						that.bunceIn(data.Code+data.msg)
						clearInterval(timer)
						that.codeText = '稍后再试';
						tim = 60;
						that.codeing = false;
					}
					layer.close(that.loding);		
				}
			}
			this.custmorAjax(opt);
		},
		custmorAjax(opt){
			var data = null;
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
		},
		bunceIn(s){
				layer.open({
					content: s,
					time: 2,
					skin: 'msg'
				})
		},
		back(){
			this.$router.back();
		}
	},
	components: {
		Scroll,mainHeader//,loading
	},
	watch: {
		
	}
}
</script>
<style type="text/css" lang="less">
@import '../../common/less/base.less';
.consumerocore{
	width:100%;
	height:100%;
	background:@backcolor;
	position:absolute;
	left:0;
	top:0;
	z-index:999;
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
	.record-tab{
		width:100%;
		height:44px;
		background:@whites;
		border-bottom:1px solid @bordercolor;
		display:flex;
		justify-content:space-around;
		line-height:44px;
		text-align:center;
		span{
			width:25%;
			font-size:@mainsize;
			border-bottom:3px solid transparent;
		}
		.auton{
			color:@reds;
			border-color:@reds;
		}
	}
	.consumerocore-wrap{
		position:absolute;
		top:88px;
		bottom:0;
		width:200%;
		.consume-list{
			width:50%;
			position:absolute;
			bottom:0;
			top:0;
			overflow:hidden;
			background:@whites;
			padding-left:15px;
			.consume-item{
				.border-bottom;
				padding:20px 15px 20px 0;
				&:last-child{
					.border-none;
				}
				.consume-item-top{
					font-size:@mainsize;
					color:@maincolor;
					.consumemoney{
						float:right;
						color:@reds;
					}
				}
				.consume-item-bottom{
					font-size:@assistsize;
					color:#999999;
					padding-top:10px;
					.pay-way{
						float:right;
					}
				}
			}
		}
		.recharge-list{
			width:50%;
			position:absolute;
			bottom:0;
			top:0;
			left:50%;
			overflow:hidden;
			font-size:@mainsize;
			color:@maincolor;
			background:@whites;
			padding-left:15px;
			.recharge-item{
				.border-bottom;
				padding:20px 15px 20px 0;
				&:last-child{
					.border-none;
				}
				.recharge-item-top{
					font-size:@mainsize;
					color:@maincolor;
					.rechargemoney{
						float:right;
						color:@reds;
					}
				}
				.recharge-item-bottom{
					font-size:@assistsize;
					color:#999999;
					padding-top:10px;
					.pay-way{
						float:right;
					}
				}
			}
		}
	}
	
	.roomActive{
		transform:translateX(-50%);
		transition: all 0.6s ease;
	}
	.roomLeave{
		transform:translateX(0);
		transition: all 0.6s ease;
	}
}
</style>