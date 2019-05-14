<template>
	<div class="paydialog" v-show="active">
	    <ul>
	        <li class="room-pay-tit" v-html="tit">

	        </li>
	        <li v-if="lis.length>0"></li>
	        <li v-for="(item,index) in btns" @click="lisClick" :class="{yes:index==0,no:index==1}">{{item}}</li>
	    </ul>
	</div>
</template>
<script type="text/javascript">
export default {
	name: 'paydialog',
	props:{
		tit: {
			type: String,
			default: '<p>解锁测试老师的聊天室</p><p>需支付<span>28</span>精彩币</p>'
		},
		lis: {
			type: Array,
			default: () => []
		},
		btns: {
			type: Array,
			default: () => ['确定','取消']
		},
		yesFn: {
			type: Function,
			default: function(){
				console.log('I am yes')
			}
		},
		noFn: {
			type: Function,
			default: function(){
				console.log('I am no')
			}
		}
	},
  data () {
	  return {
      active: false
    }
  },
	created(){

	},
	methods: {
	  show () {
	    this.active = true
    },
    hide () {
      this.active = false
    },
		lisClick(event){
			if(event.target.className == 'yes'){
			  console.log('yes')
				this.yesFn();
			}else if(event.target.className == 'no'){
        console.log('no')
				this.noFn();
			}
		}
	}
}
</script>
<style lang="less">
@import '../../common/less/base.less';
.paydialog{
   position:absolute;
   left:0;
   top:0;
   right:0;
   bottom:0;
   z-index:9999;
   background:rgba(0,0,0,0.6);
   ul{
       width:100%;
       background:@whites;
       color:@maincolor;
       text-align:center;
       font-size:@mainsize;
       border-radius:15px 15px 0 0;
       overflow:hidden;
       position:absolute;
       left:0;
       bottom:0;
       li{
           height:45px;
           line-height:45px;
       }
       li:nth-child(2n){
           .border-bottom;
           &:after{
               width:92%;
               left:4%;
           }
       }
       .room-pay-tit{
            height:105px;
            background:@backcolor;
            padding-top:25px;
			p{
				line-height:1;
				&:nth-child(2){
					font-size:@assistsize;
					color:#666666;
					padding-top:12px;
					span{
						font-size:30px;
						color:@reds;
					}
				}
				.pay-dialog-price{
					font-size:30px;
					color:@reds;
				}

			}
       }
   }
}

</style>
