<template>
	<div @click="setMenu()" class="menus" id="menu">
		<div class="right">
			<dl id="user">
				<dt><img id="menupic" :src="setPic()"></dt>
				<dd id="menutel">{{getCookie('telephone')}}</dd>
			</dl>
			<ul>
				<router-link to="/home"><li id="home">首页</li></router-link>
				<router-link to="/roomlist"><li id="roomlist">直播</li></router-link>
				<router-link to="/competition"><li id="competition">赛事</li></router-link>
				<router-link to="/attention"><li id="attention">关注</li></router-link>
				<router-link to="/vip"><li id="menu_vip">VIP文章</li></router-link>
				<router-link to="/letterlist"><li id="letterlist">私信</li></router-link>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">
import shareFn from 'common/js/sharefn'
export default {
	name: 'menu',
	created(){
		
	},
	methods: {
		setMenu: function(name){
			var menu = document.querySelector('#menu');
			menu.className = 'menus';
		},
		getCookie(name){
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); 
		　　return (arr=document.cookie.match(reg))?unescape(arr[2]):'请登录';
		},
		setPic(){
			console.log(shareFn.getUserPic())
			if(shareFn.getUserPic()==undefined || shareFn.getUserPic()==''){
				return require('../../common/img/uyse.png')
			}else{
				return shareFn.getUserPic();
			}
			
		}
	},
	watch:{
		$route(){
			document.querySelector('.menus').className = 'menus'
		}
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.menus{
	width:100%;
	position:absolute;
	top:50px;
	bottom:0;
	left:100%;
	background:rgba(0,0,0,0.6);
	z-index:999;
	overflow-y:scroll;
	//display:none;
	transition:all 0.3s;
	ul{
		text-align:center;
		list-style:none;
		line-height:60px;
		a{
			text-decoration:none;
		}
		li{
			font-size:@mainsize;
			color:@maincolor;
		}
		.router-link-active li{
			color:@reds;
		}
	}
	@media (device-height:480px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone4/4s */
		ul{line-height:45px;}
	} 

	@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone5 */
		ul{line-height:45px;}
	}
	.right{
		width: 127px;
		height:100%;
		background:@whites;
		float:right;
		dl{
			width: 127px;
			height:127px;
			background:@backcolor;
			text-align:center;
			font-size:0;
			padding-top:25px;
			dt{
				margin-bottom:10px;
				img{
					height:55px;
					border-radius:50%;
				}
			}
			dd{
				color:@maincolor;
				font-size:0.12rem;
			}
		}
	}
}
.show{
	//display:block;
	left:0;
}
</style>