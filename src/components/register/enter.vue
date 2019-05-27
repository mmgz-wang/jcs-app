<template>
	<div class="enter-in">
		<main-header :headerData="headerData"></main-header>
		<ul class="enter-main">
			<li>
				<input type="number" placeholder="请填写手机号码" name="tel" v-model="tel">
			</li>
			<li>
				<input type="PassWord" placeholder="请输入密码" name="pwd" v-model="pwd">
			</li>
			<li>
				<button type="button"
				:class="{btn_gary:tel.length==0||pwd.length==0}"
				@click="signIn()">登录</button>
			</li>
			<li class="go-to">
				<router-link to="/register"><span class="new-reg">注册新账号</span></router-link>
				<router-link to="/forget"><span class="forget-pwd">忘记密码？</span></router-link>
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
				pwd: '',
				headerData:{
					name: 'enter-in',
					ele: '登录精彩说'
				},
        loginfrom: 'H5'
			}
		},
		created(){
			// this.goWhere()
		},
		methods:{
			signIn(){
				if(this.tel.length!=11){
					layer.open({
						content: '电话号码格式有误，请重试！',
						skin: 'msg',
						time: 2
					})
					return ;
				}else if(this.pwd.length<6){
					layer.open({
						content: '密码长度不符，请重试！',
						skin: 'msg',
						time: 2
					})
					return ;
				}
				this.sendLogin();
			},
			sendLogin(){
        if(Common.getDeviceinfo().type=="pc"){
			    this.loginfrom = 'PC'
        } else if (Common.getDeviceinfo().app=='weixin'){
          this.loginfrom = 'weixin'
        } else if (Common.getDeviceinfo().app=='weixin' || Common.getDeviceinfo().type=="android" || Common.getDeviceinfo().type=="android"){
          this.loginfrom = 'H5'
        }

				this.$nextTick(function(){
					this.$http.post(Common.baseURI().host + '/user/login',
            {
              language: 'M',
              phoneNumber: this.tel,
              passWord: this.pwd,
              loginfrom: this.loginfrom
            }
					).then(function(res){
						if(res.data.Code === '0000'){
							let jsonLog={
							  abc: escape(this.tel),
                abcd: res.data.UserId,
                abcde: res.data.SecurityKey,
                pic: res.data.PicPath,
                money: res.data.Money
							};
							setCookie('jsonLog',null,-1);
							setCookie('telephone','',-1);
							setCookie2('jsonLog',null,-1);
							setCookie2('telephone','',-1);

							setCookie('jsonLog',JSON.stringify(jsonLog),1);
              setCookie(
                'telephone',
                res.data.NikeName,
                1
							);
							this.goWhere(res.data.UserId);
							function setCookie(c_name, value, expiredays){
								var exdate=new Date();
								exdate.setDate(exdate.getDate() + expiredays);
								document.cookie=c_name+ "=" +escape(value)+
								((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+';path=/');
							}
							function setCookie2(c_name, value, expiredays){
								var exdate=new Date();
								exdate.setDate(exdate.getDate() + expiredays);
								document.cookie=c_name+ "=" +escape(value)+
								((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
							}
						}else if(res.data.Code === '2000'){
							layer.open({
								content: '您输入的密码有误，请重试！',
								skin: 'msg',
								time: 2
							})
						}
					}).catch(function (err) {
            console.log(err)
          })
				})
			},
			goWhere (userId) {
				let qstr = this.$route.query
				if (!qstr.hasOwnProperty('queryData')) {
					this.$router.back();
					return false
				}
				qstr = JSON.parse(qstr.queryData)
				if (qstr.length > 1) {
					this.$router.push({path:`/roomlist?queryData=${this.$route.query.queryData}`});
				} else if (qstr.length === 1) {
					this.$router.push({path:`/roomindex?roomId=${qstr[0].roomId}&lecturerName=${encodeURI(qstr[0].lecturerName)}&roomName=${encodeURI(qstr[0].roomName)}&roomPrice=${encodeURI(qstr.roomPrice)}&userId=`+userId });
				} else {
					this.$router.push('roomlist')
					// this.$router.back();
				}
			}
		},
		components: {
			mainHeader
		}
	}
</script>
<style lang="less">
@import "../../common/less/base.less";
	.enter-in{
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
			padding:52px 10%;
			li{
				height:50px;
				line-height:50px;
				vertical-align: baseline;
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
					margin-top:15px;
				}
				&:nth-child(2):before{
					margin-top:18px;
					content: '';
					float:left;
					width:21px;
					height:21px;
					background:url('../../common/img/pwd.png') no-repeat center;
					background-size:21px;
					margin:18px 5px 0 5px;
				}
				&:nth-child(3){
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
					font-size:0.14rem;
					padding-left:8px;
					height:39px;
					line-height:39px;
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
				font-size:0.14rem;
				.border-none;
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
