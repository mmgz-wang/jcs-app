<template>
    <div class="article-detail">
    	
    </div>
</template>
<script type="text/javascript">
import shareFn from "common/js/sharefn"
import axios from 'axios'
export default {
	name: 'articleDetail',
	data(){
		return {
			articleData: []
		}
	},
	created(){
		this.getData();
	},
	methods: {
		getData(){
			this.$nextTick(function(){
				this.$http.jsonp(
					'http://www.jingcaishuo.com/article/detail?time=' + Math.random(),
					{ 
						params: {
							language: 'M',
							userId: '',
							securityCode: '',
							articleId: this.$router.currentRoute.query.id 
						}
					}
				).then(function(res){
					console.log(res.data)
					if(res.data.Code != '0000'){
						console.log('无效的文章ID')
					}else{
						//console.log(res.data)
					}
				})
			})
		},
		render (){

		}
	}
}

</script>
<style lang="less">
@import "../../common/less/base.less";
.article-detail{
	position:fixed;
	left:0;
	top:0;
	right:0;
	left:0;
	bottom:0;
	z-index:9999999;
	background:@backcolor;
}

</style>