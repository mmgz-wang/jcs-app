<template>
	<div class="help">	
		<main-header :headerData="headerData"></main-header>
		<div class="help-service">
			<h3>客服</h3>
			<p>如需帮助，请联系客服</p>
			<p>工作日 9:00-22:00&nbsp;&nbsp;;&nbsp;&nbsp;节假日 10:00-18:00</p>
			<!-- <p class="QQ">QQ：3383298808</p> -->
			<p class="tel">电话：<a href="tel:‭‭186-1232-5688">‭‭186-1232-5688</a></p>		
			<p class="weixin">微信：jcsvipruirui</p>	
		</div>
		<div class="bus">
			<h3>商务合作</h3>
			<p class="QQ">QQ: 1583329015</p>
			<p class="tel">电话（微信同号）：<a href="tel:18612323822">186-1232-3822</a></p>
			<p>工作日：09:00-22:00&nbsp;&nbsp;&nbsp;&nbsp;节假日：10:00-18:00</p>
		</div>
	</div>

</template>

<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
export default {
	data(){
		return{
			headerData:{
				ele: '客服与帮助',
				name: 'help'
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
    z-index:99999;
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