<template>
	<div class="help">
		<main-header :headerData="headerData"></main-header>
		


	</div>
</template>

<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
export default {
	data(){
		return{
			headerData:{
				ele: '下载精彩说客户端',
				name: 'download'
			}
		}
	},
	components:{
		mainHeader
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.help{
	background:@backcolor;
    color:@maincolor;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index:99;
    font-size:0.14rem;

	.help-service,.bus{
		padding:25px;
		background: @whites;
	}
	h3{
		padding-bottom:10px;
		color: #444444;	
		line-height:1;	
		font-size:@mainsize;
		font-weight:400;
		padding-left:10px;
		position:relative;
	}
	.bus{
		margin-top:15px;
	}
	h3:before{
		content: "";
		width:3px;
		height: 14px;
		display: inline-block;
		background: @reds;
		position:absolute;
		left:0;
		top:1px;
	}
	.help-service,.bus{
		p{
			line-height: 24px;
			color:@garycolor;
			font-size:0.12rem;
		}
		.QQ{
			padding-top:8px;
			color:@maincolor;
			font-size:0.14rem;
		}
	}
	.bus .QQ{
		padding-top:0;
	}
	.tel a{
		color: #0099cc;
		padding-right: 10px;
	}
	.hd{
		width: 100%;
		height: 40px;
		border-bottom: 2px solid #dddddd;
		line-height: 40px;
		padding-left: 10px;
		font-size: 15px;
	}

}
</style>