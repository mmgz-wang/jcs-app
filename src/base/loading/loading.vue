<template>
	<div class="loading">
		<img class="onload" width="24" height="24" src="../../common/img/load.png">
		<p class="desc">{{title}}</p>
	</div>
</template>
<script type="text/javascript">
export default {
	props: {
		title: {
			type: String,
			defaults: '正在载入...'
		}
	}
}
</script>
<style lang="less">
@import '../../common/less/base.less';
.loading{
	width: 100%;
	height:100%;
	text-align:center;
	background:@blacks;
	opacity:0.8;
	.desc{
		line-height:20px;
		font-size:@assistsize;
		color:@assistcolor;
	}
}
.onload{
	-webkit- animation: rotates 1.5s linear infinite;
	animation: rotates 1.5s linear infinite;
	opacity:0.6;
}
@keyframes rotates {
	from{
		transform: rotate(0deg);
	    -webkit-transform: rotate(0deg);
	    -moz-transform: rotate(0deg);
	    -o-transform: rotate(0deg);
	    -ms-transform: rotate(0deg);
	}
	to{
		transform: rotate(360deg);
	    -webkit-transform: rotate(360deg);
	    -moz-transform: rotate(360deg);
	    -o-transform: rotate(360deg);
	    -ms-transform: rotate(360deg);
	}
	
}
</style>