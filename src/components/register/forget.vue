<template>
	<div class="forget">
		<main-header :headerData="headerData"></main-header>
		<ul class="forget-main">
			<li>
				<input type="number" placeholder="请填写手机号码" name="tel" v-model="tel">
			</li>
			<li>
				<input type="text" placeholder="请输入验证码" name="phonecode" v-model="phonecode">
				<span class="getcode" @click="getcode">{{codeText}}</span>
			</li>
			<li>
				<input type="PassWord" placeholder="设置新密码" name="pwd" v-model="pwd">
			</li>
			<li style="display:none;">
				<input type="PassWord" placeholder="请确认密码" name="pwdaging" v-model="pwdaging">
			</li>
			<li>
				<button type="button" @click="signIn()">确定</button>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
import _MD5 from 'common/js/md5.js'
import Common from 'common/js/common'
	export default{
		data(){
			return{
				tel: '',
				pwd: '',
				phonecode: '',
				pwdaging: '',
				codeText: '获取验证码',
				codeing: false,
				headerData:{
					name: 'forget',
					ele: '忘记密码'
				}
			}
		},
		created(){
			//console.log(unescape(document.cookie))
		},
		methods:{
			signIn(){
				this.sendLogin();
			},
			getcode(){
				var that = this;
				if(this.tel.length!=11){
					this.bunceIn('电话号码格式不正确！')
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
					url: Common.baseURI().nativeHost,
					data: {
						sign: _MD5('2'+this.tel+'dxm6zaqW'),
						PhoneNumber: this.tel,
						Type: 2
					},
					headers:{"X-Target":"TrentService.GetVerifyCodeEnhance"},
					callback: function(data){
						if(data.Code === '0000'){
							that.bunceIn('获取成功');
							that.goOn = true;
						}else{
							that.bunceIn(data.msg)
							clearInterval(timer)
							that.codeText = '稍后再试';
							tim = 60;
							that.codeing = false;
						}
					}
				}
				this.custmorAjax(opt);
			},
			sendLogin(){
				if(!this.goOn){
					this.bunceIn('请获取验短信证码！');
					return ;
				}
				if(this.pwd.length<6){
					this.bunceIn('您设置的密码格式有误，请确认！')
					return ;
				}
				this.$http.post(
					Common.baseURI().nativeHost ,
					{
						"language": 'M',
			            "PhoneNumber": this.tel,
			            "NewPassWord": this.pwd,
			            "VerifyCode": this.phonecode,
			            "loginfrom":'PC'
			        },
					{
						headers: {"X-Target":"TrentService.ForgetPassWord"}
					}
				).then(function(res){
					console.log(res)
					if(res.data.Code === '0000'){
						this.bunceIn('变更成功')
					}else{
						this.bunceIn('('+res.data.Code+') 更改失败，请重试！')
					}
				},function(){
					this.bunceIn('请求失败请检查网络')
				})
			},
			custmorAjax(opt){
				var data = null;
				console.log(opt)
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
		},
		components: {
			mainHeader
		}
	}
</script>
<style lang="less" type="text/css">
@import "../../common/less/base.less";
	.forget{
		width:100%;
		height:100%;
		background:@backcolor;
		.forget-main{
			position:absolute;
			left:0;
			top:44px;
			bottom:0;
			right:0;
			background:@whites;
			font-size:0;
			padding:20px 10%;
			li{
				height:50px;
				line-height:50px;
				vertical-align: baseline;
				margin-top:10px;
				.border-bottom;
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
						color:@reds;
						font-size:0.14rem;
						position:absolute;
						right:0;
						top:0;
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
				&:nth-child(4):before{
					margin-top:18px;
					content: '';
					float:left;
					width:21px;
					height:21px;
					background:url('../../common/img/invite.png') no-repeat center;
					background-size:21px;
					margin:18px 5px 0 5px;
				}
				&:last-child{
					border:none;
					margin-top:30px;
				}
				button{
					width:100%;
					height:100%;
					outline:none;
					border:none;
					color:@whites;
					font-size:0.15rem;
					background:@shallowred;
					border-radius:3px;
				}
				input{
					margin-top:10px;
					outline:none;
					border:none;
					font-size:0.14rem;
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
				input-placeholder{
					color:@assistcolor;
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
