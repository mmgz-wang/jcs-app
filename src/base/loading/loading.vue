<template>
	<div class="loading">
		<img class="onload" width="24" height="24" src="../../common/img/load.png">
		<p class="desc">{{titles}}</p>
	</div>
</template>
<script type="text/javascript">
export default {
  name: 'loading',
	props: {
		titles: {
			type: String,
			default: '正在载入...'
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
	background:@backcolor;
	opacity:1;
	position:absolute;
	left:0;
	top:0;
	.desc{
		line-height:20px;
		font-size:@assistsize;
		color:@assistcolor;
		margin-top:10px;
	}
}
.onload{
	-webkit-animation: rotates 1.5s linear infinite;
	animation: rotates 1.5s linear infinite;
	opacity:0.6;
	margin-top:20%;
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
