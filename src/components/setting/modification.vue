<template>
	<div class="modifi">
		<main-header :headerData="headerData"></main-header>
		<ul class="modifi-main">
			<li>
				<span>原密码</span>
				<input type="PassWord" placeholder="请输入原密码" name="pwd" v-model="pwd">
			</li>
			<li>
				<span>新密码</span>
				<input type="PassWord" placeholder="设置新密码(6位或一上)" name="npwd" v-model="npwd">
			</li>
			<li>
				<span>确认密码</span>
				<input type="PassWord" placeholder="请确认密码" name="npwd2" v-model="npwd2">
			</li>
			<li>
				<button type="button" @click="modifiGo()">提交</button>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
import shareFn from 'common/js/shareFn'
import Common from 'common/js/common'
	export default{
		data(){
			return{
				tel: '',
				pwd: '',
				npwd: '',
				npwd2: '',
				headerData:{
					name: 'forget',
					ele: '修改密码'
				}
			}
		},
		created(){
			//console.log(unescape(document.cookie))
		},
		methods:{
			modifiGo(){

				if(this.pwd.length<6){
					console.log(666)
					this.bunceIn('请填写完整初始密码！');
					return ;
				}
				if(this.npwd.length<6 || this.npwd2.length<6){
					this.bunceIn('新密码长度不符合要求，请从新设定！');
					return ;
				}
				if(this.npwd != this.npwd2){
					this.bunceIn('请确认新密码！');
					return ;
				}
				this.sendLogin();
				
			},
			sendLogin(){
				this.$http.post(
					Common.baseUrl.nativeHost ,
					{
						"UserId": shareFn.getUserId(),
						"NewPassWord": this.npwd,
						"PassWord": this.pwd,
						"SecurityCode" : shareFn.getSecurityCode()
			        },
					{
						headers: {"X-Target":"TrentService.UpdatePassWord"}
					}
			        
				).then(function(res){
					console.log(res)
					if(res.data.Code === '0000'){
						this.bunceIn('修改成功！')
					}else{
						this.bunceIn('修改失败请重试！')
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
			}
		},
		components: {
			mainHeader
		}
	}
</script>
<style lang="less" type="text/css">
@import "../../common/less/base.less";
	.modifi{
		width:100%;
		position:absolute;
		top:0;
		bottom:0;
		z-index:99;
		background:@backcolor;
		.modifi-main{
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
				span{
					font-size:0.15rem;
					color:@maincolor;
					line-height:50px;
					padding-right:10px;
				}
				&:last-child{	
					.border-none;
					margin-top:50px;
					position:relative;
				}
				button{
					width:80%;
					height:39px;
					outline:none;
					border:none;
					color:@whites;
					font-size:0.16rem;
					background:@reds;
					border-radius:3px;
					position:absolute;
					left:50%;
					transform:translateX(-50%);
					margin-left:-7px;
				}
				input{
					outline:none;
					border:none;
					font-size:0.14rem;
					padding-left:10px;
					height:50px;
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