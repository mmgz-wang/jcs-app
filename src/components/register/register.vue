<template>
	<div class="register">
		<main-header :headerData="headerData"></main-header>
		<ul class="enter-main">
			<li>
				<input type="number" placeholder="请填写手机号码" name="tel" v-model="tel">
			</li>
			<li>
				<input type="text" placeholder="请输入验证码" name="phonecode" v-model="phonecode">
				<span class="getcode" @click="getCode">{{codeText}}</span>
			</li>
			<li>
				<input type="PassWord" placeholder="请输入密码" name="pwd" v-model="pwd">
			</li>
			<li>
				<input type="text" placeholder="请输入邀请码(选填)" name="invitecode" v-model="invitecode">
			</li>
			<li>
				<button type="button"
				:class="{btn_gary:tel.length==0||phonecode.length==0||pwd.length==0}"
				@click="signIn()">注册</button>
			</li>
		</ul>
		
	</div>
</template>
<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common'
import _MD5 from 'common/js/md5.js'
	export default{
		data(){
			return{
				tel: '',
				pwd: '',
				phonecode: '',
				invitecode:'',
				showToast3000:true,
				goOn: false,
				codeText: '获取验证码',
				codeing: false,
				headerData:{
					name: 'register',
					ele: '注册新账号'
				}
			}
		},
		created(){
			console.log()
			//this.sendLogin();
		},
		methods:{
			getCode(){
				var that = this;
				if(this.tel.length!=11){
					this.bunceIn('电话号码格式不正确！');
					return ;
				}
				if(this.codeing){
					return;
				}
				var tim = 60,timer=null;
				that.codeText = `60 (s)`;
				that.codeing = true;
				timer = setInterval(function(){
					tim--;
					that.codeText = `${tim} (s)`
					if(tim == 1){
						clearInterval(timer)
						that.codeText = '获取验证码';
						tim = 60;
						that.codeing = false;
					}
				},1000)
				var opt = {
					url: Common.baseUrl.nativeHost,
					data: {
						sign: _MD5('2'+this.tel+'dxm6zaqW'),
						PhoneNumber: this.tel,
						Type: 1
					},
					headers:{"X-Target":"TrentService.GetVerifyCodeEnhance"},
					callback: function(data){
						if(data.Code == '0000'){
							that.goOn = true;
						}else{
							that.bunceIn(data.Code+data.msg)
							clearInterval(timer)
							that.codeText = '稍后再试';
							tim = 60;
							that.codeing = false;
						}
					}
				}
				this.custmorAjax(opt);
			},
			signIn(){
				if(!this.goOn){
					this.bunceIn('请获取验短信证码！');
					return ;
				}
				if(!this.pwd.length>=6){
					this.bunceIn('您设置的密码格式有误，请确认！')
					return ;
				}
				this.sendLogin();
			},
			sendLogin(){
				this.$http.post(
					Common.baseUrl.nativeHost ,
					{
						"VerifyCode" : this.phonecode,
						"PhoneNumber" : this.tel,
						"InviteId" : this.invitecode,
						"PassWord" : this.pwd,
						"OSV" : "PC"
			        },
					{
						headers: {"X-Target":"TrentService.Register"}
					}
			        
				).then(function(res){
					console.log(res)
					if(res.data.Code === '0000'){
						console.log('注册成功')
					}else if(res.data.Code === '2007'){
						this.bunceIn('验证码错误!');
					}else if(res.data.Code === '3011'){
						this.bunceIn('抱歉，您输入的邀请码无效，请重新输入!');
					}else if(res.data.Code === '2003'){
						this.bunceIn('改手机号已经被注册!')
					}
				},function(){
					this.bunceIn('请求失败请检查网络')
				})
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
			}
		},
		components: {
			mainHeader
		}
	}
</script>
<style lang="less" type="text/css">
@import "../../common/less/base.less";
	.register{
		width:100%;
		hetght:100%;
		background:@backcolor;
		.enter-main{
			position:absolute;
			left:0;
			top:44px;
			bottom:0;
			right:0;
			background:@whites;
			font-size:0;
			padding:30px 10%;
			li{
				height:50px;
				line-height:50px;
				vertical-align: baseline;
				margin-top:10px;
				.border-bottom;
				&:nth-child(1){
					margin-top:0;
				}
				&:nth-child(1):before{
					margin-top:18px;
					content: '';
					float:left;
					width:21px;
					height:21px;
					background:url('../../common/img/phone.png') no-repeat center;
					background-size:21px;
					margin:18px 5px 0 5px;
				}
				&:nth-child(2){
					display:flex;
					position:relative;
					span{
						color: #e9311d;
						font-size:@mainsize;
						position:absolute;
						right:0;
						bottom:0;
						line-height:39px;
					}				
					&:before{
						margin-top:18px;
						content: '';
						float:left;
						width:21px;
						height:21px;	
						background:url('../../common/img/phonecode.png') no-repeat center;
						background-size:21px;
						margin:18px 5px 0 5px;
					}
					input{
						width:120px;
					}
				}
				&:nth-child(3):before{
					margin-top:18px;
					content: '';
					float:left;
					width:21px;
					height:21px;			
					background:url('../../common/img/pwd.png') no-repeat center;
					background-size:21px;
					margin:18px 5px 0 5px;
				}
				&:nth-child(4){
					margin-top:25px;
					&:before{
						margin-top:18px;
						content: '';
						float:left;
						width:21px;
						height:21px;			
						background:url('../../common/img/invite.png') no-repeat center;
						background-size:21px;
						margin:18px 5px 0 5px;
					}
				}
				&:last-child{	
					.border-none;
					margin-top:30px;
				}
				button{
					width:100%;
					height:39px;
					outline:none;
					border:none;
					color:@whites;
					font-size:0.16rem;
					background:@reds;
					border-radius:2px;
					line-height:39px;
				}
				.btn_gary{
					opacity:0.4;
				}
				input{
					margin-top:10px;
					outline:none;
					border:none;
					font-size:@mainsize;
					padding-left:8px;
					height:39px;
				}
				input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {  
				    -webkit-text-fill-color: #ededed !important;  
				    -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;  
				    background-color:transparent;  
				    background-image: none;  
				     transition: background-color 50000s ease-in-out 0s;
				}  
				:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
				     color: #b1b1b1;
				    font-size:@mainsize;
				}

				::-moz-placeholder { /* Mozilla Firefox 19+ */
				     color: #b1b1b1;
				    font-size:@mainsize;
				}

				input:-ms-input-placeholder{
				     color: #b1b1b1;
				    font-size:@mainsize;
				} 
				input::-webkit-input-placeholder{
				    color: #b1b1b1;
				    font-size:@mainsize;
				}
			}
			.go-to{
				width:100%;
				font-size:@assistsize;
				border:none;
				.new-reg{
					float:left;
					color:@reds;
				}
				.forget-pwd{
					float:right;
					color:@namecolor;
				}
			}
		}

	}
</style>