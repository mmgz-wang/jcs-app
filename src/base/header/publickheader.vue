<template>
	<div class="header">
		<span class="back" @click="back()">返回</span>
        <div v-html="headerData.ele">
        	<h1 class="jcs-title">聊天室</h1>
        </div>
        <span v-show="headerData.isShow" ref="menu" @click="menushow()" class="menu">私信</span>
    </div>
</template>
<script type="text/javascript">
import shareFn from 'common/js/sharefn.js'
export default {
	props: {
		headerData: {
			name: {
				type: String,
				default: 'roomlist'
			},
			ele: {
				type: String,
				default: '<h1>聊天室</h1>'
			},
			isShow: {
				type: Boolean,
				default: true
			}
		}
	},
	name: 'publickheader',
	created(){
		console.log(this.headerData)
	},
	methods: {
		back: function(){
			this.$router.back();
		},
		menushow: function(){
			var menu = document.querySelector('#menu');
			menu.className = 'menus show';
			menu.querySelector('#menupic').setAttribute('src',this.setPic())
		},
		getCookie(name){
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); 
		　　return (arr=document.cookie.match(reg))?unescape(arr[2]):'请登录';
		},
		setPic(){
			if(shareFn.getUserPic()==undefined || shareFn.getUserPic()==''){
				return require('../../common/img/uyse.png')
			}else{
				return shareFn.getUserPic();
			}
			
		}
	}
}
</script>
<style lang="less">
@import "../../common/less/base.less";
	.header{
		height:44px;
		line-height:44px;
		background:@reds;
		color:#fff;
		font-size:0.12rem;
		text-align:center;
		z-index:666;
	div{
		display: inline-block;
		width:50%;
		margin:0 auto;
		text-align:center;
		font-size:@titsize;
	}
	.back{
	  float: left;
	  padding:0 10px;
	  background: url('../../common/img/back.png') no-repeat center;
	  background-size:8px 17px;
	  color: @transparent;
	  position:absolute;
	  left:0;
	  top:0;
	}
	.menu{
	  color: @transparent;
	  float:right;
	  padding:0 10px;
	  background: url('../../common/img/menu.png') no-repeat center;
	  background-size: 0.20rem auto;
	  position:absolute;
	  right:0;
	  top:0;
	}
	h1{
	  display:inline-block;
	  font-size:0.18rem;
	}
}
</style>