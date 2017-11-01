<template>
    <transition name="slide">
    	<div class="roomindex">
    		123
    	</div>
    </transition>
</template>

<script type="text/javascript">
export default {
	name: 'roomindex',
	props: ['item'],
	created(){
		console.log(this.$route.params)
	}
}
</script>

<style lang="less">
@import '../../common/less/base.less';
.roomindex{
    background:@blacks;
    color:@maincolor;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index:9009;
}
.slide-enter-active,.slide-leave-active{
    transition:all 0.3s;
}
.slide-enter,.slide-leave-to{
    transform:translate3d(100%,0,0);
}
</style>