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
			this.$emit('menuClick',this.headerData.name)
		}
	}
}
</script>
<style lang="less">
@import "../../common/less/base.less";
	.header{
	  height:50px;
	  line-height:50px;
	  background:@reds;
	  color:#fff;
	  font-size:0.12rem;
	  text-align:center;
	  z-index:666;
	}
	.header div{
		display: inline-block;
	}
	.back{
	  float: left;
	  padding:0 10px;
	  background: url('../../common/img/back.png') no-repeat center;
	  background-size:8px 17px;
	  color: @transparent;
	}
	.menu{
	  color: @transparent;
	  float:right;
	  padding:0 10px;
	  background: url('../../common/img/menu.png') no-repeat center;
	  background-size: 0.20rem auto;
	}
	h1{
	  display:inline-block;
	  font-size:0.18rem;
	}
</style>