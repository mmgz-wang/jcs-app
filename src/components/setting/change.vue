<template>
	<div class="change">
		<main-header :headerData="headerData"></main-header>
		<ul class="change-main">
			<li>
				<span>手机号码</span>
				<input type="text" placeholder="请输入新手机号码" name="tel" v-model="tel">
			</li>
			<li>
				<span>验证码</span>
				<input type="text" placeholder="请输入验证码" name="phonecode" v-model="phonecode">
				<span class="getcode" @click="getCode()">{{codeText}}</span>
			</li>
			<li>
				<button type="button" @click="sendChange()">确认</button>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
import Common from 'common/js/common'
	export default{
		data(){
			return{
				tel: '',
				phonecode: '',
				goOn: false,
				codeText: '获取验证码',
				codeing: false,
				headerData:{
					name: 'change',
					ele: '更换绑定手机号'
				}
			}
		},
		created(){
			//console.log(unescape(document.cookie))
		},
		methods:{
			getCode(){
				var that=this;
				if(this.tel.length==0){
					this.bunceIn('请输入电话号码！')
					return ;
				}else if(this.tel.length!=11){
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
					url: Common.baseURI().host + '/user/register/sendVerifyCode',
					data: {
						phoneNumber: this.tel
					},
					callback: function(data){
						if(data.code == '0000'){
							that.goOn = true;
						}else{
							that.bunceIn(data.msg);
						}
					}
				}
				this.custmorAjax(opt);
			},
			sendChange(){
				console.log(666)
				if(this.tel.length!=11){
					this.bunceIn('电话号码格式不正确！');
					return ;
				}
				if(this.phonecode.length<6 && this.phonecode.length>0){
					this.bunceIn('验证码格式不正确！');
				}else if(this.phonecode.length == 0){
					this.bunceIn('请获取验证码！');
				}
				if(!this.goOn){
					return ;
				}
				this.$http.post(
					Common.baseURI().nativeHost ,
					{
						"VerifyCode": this.phonecode,
						"PhoneNumber": this.tel,
						"UserId": this.shareFn.getUserId(),
						"SecurityCode": this.shareFn.getSecurityCode()
			        },
					{
						headers: {"X-Target":"TrentService.ChangePhoneNumber"}
					}

				).then(function(res){
					console.log(res)
					if(res.data.Code === '0000'){
						this.bunceIn('变更成功！')
					}else{
						this.bunceIn('变更失败请重试！')
					}
				},function(){
					console.log('请求失败请检查网络')
				})
			},
			bunceIn(s){
				layer.open({
					content: s,
					time: 2,
					skin: 'msg'
				})
			},
			custmorAjax(opt){
				var data = null;
				this.$nextTick(function(){
					this.$http.post(
						opt.url,
						opt.data
					).then(function(res){
						opt.callback(res.data);
					})
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
	.change{
		width:100%;
		position:absolute;
		top:0;
		bottom:0;
		background:@backcolor;
		z-index:99;
		.change-main{
			position:absolute;
			left:0;
			top:44px;
			bottom:0;
			right:0;
			background:@whites;
			font-size:0;
			padding-left:15px;
			li{
				height:50px;
				line-height:50px;
				.border-bottom;
				vertical-align: baseline;
				display:flex;
				overflow:hidden;
				justify-content:space-between;
				&:nth-child(1){
					input{
						width:77%;
					}
				}
				span{
					font-size:@mainsize;
					color:@maincolor;
					line-height:50px;
				}
				&:last-child{
					.border-none;
					margin-top:50px;
				}
				button{
					width:80%;
					height:39px;
					outline:none;
					border:none;
					color:@whites;
					font-size:0.15rem;
					background:@reds;
					border-radius:3px;
					margin-left:10%;
					transform:translateX(-7px);
				}
				input{
					outline:none;
					border:none;
					font-size:0.14rem;
					height:50px;
					width:50%;
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
				.getcode{
					color:@reds;
					font-size:@assistsize;
					text-align:right;
					padding-right:15px;
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
