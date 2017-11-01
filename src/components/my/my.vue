<template>
  <div class="my">
  	<publick-header :headerData="headerData"></publick-header>	
      <div class="usebox">
      	<dl>
      		<dt>
      			<img src="../../common/img/unent.png" alt="" id="usericon">
      		</dt>
      		<dd>
      			<p id="logintel">{{strReplace(userData.PhoneNumber)}}</p>
      			<span class="money_num" v-show="isLogin()"> 精彩币<i id="monney">{{userData.Money}}</i></span>
      		</dd>
      	</dl>
      	<span class="add_money" id="recharge" style="display: ;">充值</span>
      </div>
      <div class="menulist">
      	<div class="menu-wrap">
      		<ul>
      			<li id="buy">
      				<span class="tt"><a href="#"><img src="../../common/img/1.png" alt="" class="img" /></a></span>
      				<span class="txt">我的购买</span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="mesasge">
      				<span class="tt"><img src="../../common/img/2.png" alt="" class="img" /></span>
      				<span class="txt">我的私信</span>
      				<span id="mymessagedot" class="messagereddot" style="display:none;"></span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      				<span class="l_num" style="display: none;">2</span>
      			</li>
      			<li id="collection">
      				<span class="tt"><img src="../../common/img/3.png" alt="" class="img" /></span>
      				<span class="txt">我的收藏</span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="present">
      				<span class="tt"><img src="../../common/img/l.png" alt="" class="img" /></span>
      				<span class="txt">我的赠送</span>
      				<span id="mycard" class="messagereddot" v-show="userData.Omnipotence.length"></span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="myCode">
					<span class="code">{{userData.InviteCode}}</span>
					<span class="tt"><img src="../../common/img/8.png" alt="" class="img" /></span>
					<span class="txt">我的邀请码</span>
				</li>
      		</ul>
      	</div>
      </div>
      <div class="menulist">
      	<div class="menu-wrap">
      		<ul>
      			<li id="onlineservice">
      				<span class="tt"><img src="../../common/img/4.png" alt="" class="img" /></span>
      				<span class="txt">在线客服</span>
      				<span id="onlinedot" class="messagereddot" style="display: none;"></span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="onlinehome" style="display:none;">
      				<span class="tt"><img src="../../common/img/chart.png" alt="" class="img" /></span>
      				
      				<span class="txt">直播间</span>
      				<span id="homedot" class="messagereddot" style="display: none;"></span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="help">
      				<span class="tt"><img src="../../common/img/5.png" alt="" class="img" /></span>
      				<span class="txt">客服与帮助</span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      			<li id="setting">
      				<span class="tt"><img src="../../common/img/6.png" alt="" class="img" /></span>
      				<span class="txt">设置</span>
      				<span class="rico"><a href="#"><img src="../../common/img/r_ico.png"></a></span>
      			</li>
      		</ul>
      	</div>
      </div>
  </div>
</template>

<script>
import shareFn from '../../common/js/sharefn'
import publickHeader from 'base/header/publickheader'
export default {
	name: 'my',
	data(){
		return {
			headerData: {
				ele: '<h1 class="jcs-title">我的</h1>',
				name: 'my',
				isShow: false
			},
			userData: {
				PhoneNumber: '请登录',
				Money: '',
				Omnipotence: [],
				InviteCode: ''
			}
		}
		
	},
	created(){
		this.$nextTick(function(){
			console.log(shareFn.isLogin())
			if(shareFn.isLogin()){
				this.getData()
			}else{

			}
			
		})
	},
	methods: {
		getData(){
			this.$http.jsonp('https:www.jingcaishuo.com/User/GetUserInfo',{params:{
				userId: shareFn.getUserId(),
				token: shareFn.getSecurityCode(),
				language: 'M'
			}}).then(function(res){
				this.userData = res.data;
				console.log(res.data)
			},function(res){
				alert('请求失败！')
			})
		},
		strReplace(str){
			var newStr = str.substr(3,5);
			if(shareFn.isLogin()){
				console.log(shareFn.isLogin())
				return str.replace(newStr,'******');
			}else{
				return str;
			}
		},
		isLogin(){
			return shareFn.isLogin();
		}
	},
	components: {
		publickHeader
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.my{
	width:100%;
	position:absolute;
	left:0;
	top:0px;
	bottom:0px;
	right:0;
	color:#fff;

input{
	-webkit-user-select:auto;
} 
img{
	border:0;
}
a{
	text-decoration:none;
}
li{
	list-style:none;
}
.usebox{
	width:100%;
	background:@whites;
	height:105px;
	position: relative;
	color:@maincolor;
	padding:0 15px;
	dl{
		font-size:0.15rem;
		display:flex;
		width:100%;
		height:100%;
		align-items:center;
		justify-content:flex-star;
		#logintel{

		}
		.money_num{
			color:@namecolor;
			i{
				color:@reds;
			}
		}
		dd{
			padding-left:10px;
			letter-spacing:1px;
			margin-top:-3px;
		}
		#recharge{

		}
	}
	img{
		width: 55px;
		height: 55px;
		border-radius:50%;		
	}
	.add_money{
		float: right;
		height: 24px;
		font-size:@assistsize;
		background: @reds;
		line-height: 24px;
		color:@whites;
		border-radius: 4px;
		padding:0 20px;
		position:absolute;
		right:15px;
		top:50%;
		margin-top:-12px;
	}
}

.userico{
	float:left;
	width:0.5rem;
	height:0.5rem;
}
.userico img{
	width:0.5rem;
	height:0.5rem;
	border-radius:50%;
}

.menulist{
	float:left;
	width:100%;
	margin-top:10px;
	background:@whites;
	color:@maincolor;
	.menu-wrap{
		float:left;
		width:97%; 
		margin-left:3%;
		ul li{
			float:left;
			width:100%; 
			height:50px;
			line-height:50px;
			border-bottom:1px @bordercolor solid;
			font-size: 0.16rem;
			.code{
				float:right;
				padding-right:15px;
			}
		}
	}
}

.l_num{
	width: 0.18rem;
	height: 0.18rem;
	background: #f43531;
	color: #ffffff;
	line-height: 0.18rem;
	font-size:0.14rem;
	text-align: center;
	display: inline-block;
	border-radius: 50%;
	float: right;
	margin:0.1rem 0.1rem 0 0;
}
.menu-wrap .txt{
	float:left;
	font-size:0.15rem;
}
.menu-wrap .rico{
	float:right;
	width:0.21rem;
}
.menu-wrap .rico img{
	width:42%
}
.img{
	width: 0.21rem;
	position: absolute;
	left:50%;top:50%;
	-webkit-transform: translate3d(-50%,-50%,0);
	-moz-transform: translate3d(-50%,-50%,0);
	-ms-transform: translate3d(-50%,-50%,0);
	-o-transform: translate3d(-50%,-50%,0);
	transform: translate3d(-50%,-50%,0);
}


.messagereddot{
	width: 0.5em;
    height: 0.5em;
    background: @reds;
    float: left;
    margin-top: 10px;
    margin-left: 0px;
    border-radius: 5px;
    opacity: 0.8;
}
.tt{
	width:0.5rem;
	height: 100%;
	float: left;
	position: relative;
}

.menu-wrap ul li:nth-last-child(1){
	border-bottom:0 none;
}
.tb{
	display:inline-block;
	width:0.28rem;
	height: 0.28rem;background:url('../../common/img/xb.png') no-repeat center center;
	float:left;
	background-position: 0;
	margin-top:8px;
}
.tb:nth-child(2){
	color: #fff;
	background-position: -20px 0;
}
}
</style>
