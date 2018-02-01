<template>
  	<div class="setting">
	  	<main-header :headerData="headerData"></main-header>
	  	<div class="setwrap">
  			<div class="menulist">
  		    	<div class="menu-wrap">
  		    		<ul>
  		    			<li @click="setClick('mode')" id="mode">
  		    				<span class="txt">修改登录密码</span>
  		    				<span class="rico"><img src="../../common/img/r_ico.png"></span>
  		    			</li>
  		    			<li @click="setClick('change')" id="change">
  		    				<span class="txt">更换绑定手机</span>
  		    				<span class="rico"><img src="../../common/img/r_ico.png"></span>
  		    			</li>
  		    			<li @click="setClick('about')" id="about">
  		    				<span class="txt">关于我们</span>
  		    				<span class="rico"><img src="../../common/img/r_ico.png"></span>
  		    			</li>
  		    		</ul>
  		    	</div>
  			</div>
  			<p class="singout" v-if="isLogin()" @click="singOut()">退出当前账号</p>
	  	</div>

	    <router-view></router-view>
  	</div>
</template>

<script>
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common.js'
export default {
	name: 'my',
	data(){
		return {
			headerData: {
				ele: '设置',
				name: 'setting'
			}
		}

	},
	created(){
		this.$nextTick(function(){
			if(this.shareFn.isLogin()){

			}
		})
	},
	methods: {
		isLogin(){
			return this.shareFn.isLogin();
		},
		singOut(){
			this.$nextTick(function(){
					this.$http.jsonp(
						Common.baseURI().host + '/user/logout',
						{
							params: {
								"UserId": this.shareFn.getUserId(),
								loginfrom:'H5'
							}
				        }
					).then(function(res){
						console.log(res)
						if(res.data.Code === '0000'){
							this.bunceIn('成功退出！')
							setCookie('jsonLog',null,1);
              setCookie('telephone','',1);
							function setCookie(c_name,value,expiredays){
								var exdate=new Date();
								exdate.setDate(exdate.getDate()+expiredays);
								document.cookie=c_name+ "=" +escape(value)+
								((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
							}
							//this.$router.back();
							location.reload();
						}
					},function(){
						console.log('请求失败请检查网络')
					})
			})

			/*this.$http.post(
				Common.baseURI().nativeHost ,
				{
					"UserId": shareFn.getUserId(),
					loginfrom:'H5'
		        },
				{
					headers: {"X-Target":"TrentService.LogOut"}
				}

			).then(function(res){
				console.log(res)
				if(res.data.Code === '0000'){
					this.bunceIn('成功退出！')
					setCookie('jsonLog',null,1);
					function setCookie(c_name,value,expiredays){
						var exdate=new Date();
						exdate.setDate(exdate.getDate()+expiredays);
						document.cookie=c_name+ "=" +escape(value)+
						((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
					}
					//this.$router.back();
					location.reload();
				}
			},function(){
				console.log('请求失败请检查网络')
			})*/
		},
		setClick(s){
			if(s == 'mode'){
				if(!this.isLogin()){
					this.$router.push({name: 'enter'});
					return ;
				}
				this.$router.push({name:'modifi'})
			}else if(s == 'change'){
				if(!this.isLogin()){
					this.$router.push({name: 'enter'});
					return ;
				}
				this.$router.push({name:'change'})
			}else if(s == 'about'){
				this.$router.push({name: 'our'})
			}
		},
		enterClick(){
			if(!this.isLogin()){
				this.$router.push({name: 'enter'});
				return false;
			}
		},
		bunceIn(s){
			layer.open({
				content: s,
				time: 2,
				skin: 'msg'
			})
		}
	},
	components: {
		mainHeader
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.setting{
	width:100%;
	position:absolute;
	left:0;
	top:0px;
	bottom:0px;
	right:0;
	background: @backcolor;
	color:#fff;
	z-index:9999;
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
	ul{
		&:last-child{
			.border-none;
		}
	}

	.setwrap{
		width:100%;
		position:absolute;
		top:44px;
		bottom:0;
		overflow:scroll;
		.menulist{
			float:left;
			width:100%;
			background:@whites;
			color:@maincolor;
			.menu-wrap{
				float:left;
				width:97%;
				margin-left:3%;
				ul{

					li{
						width:100%;
						height:50px;
						line-height:50px;
						.border-bottom;
						font-size: 0.16rem;
						.code{
							float:right;
							padding-right:15px;
						}
						&:last-child{
							.border-none;
						}
					}
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
		width:5px;
		height:10px;
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

	.menu-wrap ul li:nth-last-child(1){
		.border-none;
	}
	.singout{
		width:100%;
		height:50px;
		background:@whites;
		color:@reds;
		font-size:0.16rem;
		float:left;
		margin-top:15px;
		text-align:center;
		line-height:50px;
	}
}
</style>
