<template>
	<div :data="dialogData" class="dialog-jcs">
		<div class="dialog-mask" @click="callbackFn">
			
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
	props: {
		
	},
	data(){
		return {

		}
	},
	methods: {
		callbackFn(){
			console.log(this.openRoomWay)
			console.log(this.dialogData)
			this.$emit('callbackFn');
		}
	},
	watch: {
		dialogData: {
			handler:function(val,old){
				console.log(val+'----'+old)
			},
			deep: true
		}
	}
}
</script>
<style type="text/css" lang="less">
@import '../../common/less/base.less';
.dialog-jcs{
	position:absolute;
	top:0;
	bottom:0;
	width:100%;
	background:rgba(0,0,0,0.3);
	color:@reds;
	font-size:0.15rem;
	ul{
		width:100%;
		text-align:center;
		background:@whites;
		position:absolute;
		bottom:0;
		padding:0 15px;
		li{
			height:45px;
			line-height:45px;
			border-bottom:1px solid @shallowred2;
			&:last-child{
				border:none;
			}
		}
		.btn{
			font-size:0.13rem;
		}
	}
}
</style>