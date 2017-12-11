<template>
	<div class="our">
		<main-header :headerData="headerData"></main-header>
		<dl>
			<dt>
				<img src="../../common/img/our.png">
			</dt>
			<dd>
				
			</dd>
		</dl>
		<p main>精彩说创立于2015年，立志成为中国最大的彩民聚合平台和彩票媒体平台。为了给彩民提供最全面的优惠和便利，精彩说邀请了近百位彩票圈内知名分析师，让彩民能第一时间了解优惠信息和分析推荐，以助于彩民多快好省中大奖。<br>
		同时，我们还拥有自己的专业团队及签约专家，高度关注彩票行业的发展动向，解读和分析彩票行业相关的国家政策及各种数据，同时提供数字彩、竞技彩相关的专家免费预测推荐，力求让行业信息更公开化、透明化，让彩民购彩更省心、放心。</p>
		<p class="tel">
			<span>客服</span>  QQ：3383298808<br>
			电话：15010777055   010-59007232<br>
			(工作日 9:00-22:00   节假日 10:00-18:00)<br>
			<span>商务</span>  QQ：1056568783   2662756233<br>
			电话：18612323822
		</p>
		<p last>您在使用软件的时候，如果有什么问题，请随时<a href="tel:15010777055;" <span>联系客服</span></a></p>

	</div>
</template>
<script type="text/javascript">
import mainHeader from 'base/header/mainheader'
export default {
	name: 'our',
	data(){
		return {
			headerData: {
				ele: '关于我们',
				name: 'our'
			}
		}
	},
	components: {
		mainHeader
	}
}
</script>
<style type="text/css" lang="less">
@import "../../common/less/base.less";
	.our{
		width:100%;
		position:absolute;
		top:0;
		bottom:0;
		background:@backcolor;
		text-align:center;
		font-size:@mainsize;
		background:@whites;
		color:@maincolor;
		overflow:scroll;
		z-index:99;
		dl{
			margin-top:10%;
			margin-bottom:15px;
		}
		img{
			width:70px;
		}
		p[main]{
			padding:0 30px;
			text-align:left;
			line-height:25px;
			font-size:0.13rem;
			color:#444444;
			span{
				color:@reds;
			}
		}
		p span{
			color:@reds;
		}
		.tel{
			text-align:center;
			color:@assistcolor;
			font-size:0.13rem;
			margin-top:30px;
			margin-bottom:20px;
		}
		p[last]{
			font-size:@assistsize;
			color:@maincolor;
			text-align:center;
		}
	}
</style>