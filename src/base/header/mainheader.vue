<template>
	<div class="main-header" :name="headerData.name">
         <span class="back" @click="back()"></span>
         <p>{{headerData.ele}}</p>
         <span v-if="headerData.r_ele" @click="setMsg(headerData.r_ele)" class="r_ele">{{headerData.r_ele}}</span>
    </div>
</template>
<script type="text/javascript">
export default {
	props: {
		headerData: {
      type: Object,
      default: function () {
        return {
          name: {
            type: String,
            default: 'detail'
          },
          ele: {
            type: String,
            default: '详情'
          }
        }
      }
		}
	},
	name: 'publickheader',
	created(){
		console.log(this.headerData)
	},
	methods: {
		back: function(){
			if(this.headerData.name == 'roomindex'){
        this.$emit('back');
      }else{
        this.$router.back();
      }
		},
    setMsg(s){
        this.$emit('setMsg',s)
    }
	}
}
</script>
<style lang="less">
@import "../../common/less/base.less";
	.main-header{
        width:100%;
        height:44px;
        text-align:center;
        position:relative;
        line-height:44px;
        padding:0 15px;
        background:@mainheadercolor;
        p{
            font-size:@titsize;
            font-weight:400;
            color:@maincolor;
        }
        .back{
            width:50px;
            height:100%;
            float:left;
            position:absolute;
            left:15px;
            background:url('../../common/img/deepback.png') no-repeat left center;
            color:transparent;
            background-size:8px 17px;
        }
        .r_ele{
            position:absolute;
            right:0;
            top:0;
            height:100%;
            padding-right:15px;
            font-size:0.14rem;
            position:absolute;
            right:0;
            top:0;
        }
    }
</style>
