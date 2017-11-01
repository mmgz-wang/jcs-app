<template>
	<div class="attention">
	  	<publick-header @menuClick="setMenu" :headerData="headerData"></publick-header>
	  	<scroll class="scroll" ref="scroll" :data="scrollData">
	  		<div style="float:left" class="scroll-wrap">
	  			<div class="loading-container" v-show="isloading">
	  			  <loading></loading>
	  			</div>
	  			<div v-if="!isTeach" class="articlelist">
	  				<article-list :articleDataList = "articleDataList"></article-list>
	  			</div>
	  			<div v-if="isTeach" class="teacherlist">
	  				<div class="allteach">
	  					查看跟多老师
	  				</div>
	  				<div class="teachmsg" v-for="item in authorDataList">
	  					<dl onclick="goauthor(324)">
	  						<dt>
	  							<p>
	  								<img v-lazy="item.picUrl">
	  								<span class="warn z324">{{item.notReadArticleNum}}</span>
	  							</p>
	  						</dt>
	  						<dd>
	  							<p>
	  								{{item.nickName}}<br><span class="tm">{{setTime(item.recentArticleTime)}}</span>
	  								<i class="isfans">已关注</i>
	  							</p>
	  							<p class="newTxt">{{item.digest}}</p>
	  						</dd>
	  					</dl>
	  				</div>
	  			</div>
	  			
	  		</div>	  		
	  	</scroll>
	</div>
</template>

<script>
import sharefn from '../../common/js/sharefn'
import publickHeader from 'base/header/publickheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import articleList from 'base/articlelist/articlelist'
  export default {
    name: 'attention',
    data() {
    	return {
    		name: 'attention',
    		isTeach: false,
    		innerelement: '<span class="on" id="article">文章</span><span id="teacher">老师</span>',
    		articleDataList: [],
    		authorDataList: [],
    		scrollData: [],
    		isloading: true,
            headerData: {
                ele: '<span class="on" id="article">文章</span><span id="teacher">老师</span>',
                name: 'attention',
                isShow: true
            },
    		queryString: {
    			urls: '/Author/GetFollowedAuhorArticles',
    			data: {
	            	language: 'M',
	                userId: sharefn.getUserId(),
	                token: sharefn.getSecurityCode(),
					articleId: 0
    			}            	
    		}
    	}
    },
    components: {
    	publickHeader,articleList,Scroll,loading
    },
    created() {
    	this.$nextTick(function(){
    		var that = this;
    		this.getData(this.queryString);
    		let articleBtn = document.querySelector('#article');
    		let teacherBtn = document.querySelector('#teacher');
    		articleBtn.onclick = function(){
    			that.isloading = true;
    			that.isTeach = false;
    			//that.authorDataList = [];
    			that.queryString.urls = '/Author/GetFollowedAuhorArticles';
    			that.getData(that.queryString);
    			that.$refs.scroll.refresh();
                this.className = 'on';
                teacherBtn.className = '';
				that.$refs.scroll.scrollTo(0,0,0,0)
    		};
    		teacherBtn.onclick = function(){
    			that.isloading = true;
    			that.isTeach = true;
    			//that.articleDataList = [];
    			that.queryString.urls = '/author/list/follow';
    			that.getData(that.queryString);
    			that.$refs.scroll.refresh();
                this.className = 'on';
                articleBtn.className = '';
                that.$refs.scroll.scrollTo(0,0,0,0)
    		};
    	})
    },
    mounted: ()=>{
    	
    },
    methods: {
        setMenu: function(name){
            var menu = document.querySelector('#menu');
            menu.className = 'menus show';
        },
    	getData: function(data){
    		console.log(data)
    		this.$http.jsonp('https:www.jingcaishuo.com'+data.urls,{params:data.data})
    			.then(function(res){
					if(!this.isTeach){
						this.articleDataList = res.data.Articles;
						this.scrollData = this.articleDataList;
					}else{
						this.authorDataList = res.data.data;
						this.scrollData = this.authorDataList;
					}
					this.isloading = false;
    			},function(res){
    				alert('请求失败！')
    			})
    	},
    	setTime: function(str){
    		return sharefn.setTime(str);
    	}
    },
    watch: {
    	data(){

    	}
    }
  }
</script>

<style lang="less">
@import "../../common/less/base.less";
.attention{
	width:100%;
	height:100%;
	color:#fff;
}
.header div span{
	margin-right: 35px;
	color: @backcolor;
	font-size: 0.18rem;
	display: inline-block;
	position: relative;
	&.on{
		color:#fff;
	}
	&.on:after{
		content: '';
		width: 0.32rem;
		height:2px;
		background: @whites;
		border-radius:2px;
		position:absolute;
		bottom: 8px;
		left:50%;
		margin-left:-0.16rem;
	}
	&:nth-child(2){
		margin:0;
	}
	
}
.scroll{
	width: 100%;
	position: absolute;
	top: 50px;
	bottom: 0;
	overflow: hidden;
}
.listcon:htn-child(1){
	margin-top:0;
}
.teachmsg{width:100%;float:left;background: @whites;font-size:0.15rem;color: @namecolor;padding-left:10px;}
.teachmsg dl {width:100%;}
.teachmsg dl,.teachmsg dl dt{float:left;}
.teachmsg dl dt{padding-left:5px;}
.teachmsg dl dt p{width:40px;height:40px;border-radius:50%;margin:20px 0 20px 10px;
    position:relative;}
.teachmsg dl dt p span{border-radius:50%;background:#f43531;width:16px;height:16px;
    line-height:16px;text-align:center;color:#ffffff;position:absolute;right:-6px;
    top:-6px;font-size:10px;}
.teachmsg dl dt p img{width:40px;height:40px;border-radius:50%}
.teachmsg dl dd{width:80%;padding:10px 0;border-bottom:1px solid @bordercolor;float:right;
    padding-right:10px;}
.teachmsg dl dd p{font-size:0.17rem;position: relative;}
.teachmsg dl dd p .tm{color:@assistcolor;font-size:@assistsize;}
.isfans{
	height: 25px;
	line-height: 25px;
	color: @assistcolor;
	font-size: @assistsize;
	font-style: normal;
	position: absolute;
	right: 10px;
	border: 1px solid @bordercolor;
	border-radius: 3px;
	top: 50%;
	margin-top:-17px;
	padding:0 15px;
}
.teachmsg dl dd .newTxt{color: @namecolor;font-size:0.15rem;display:-webkit-box;padding-top:3px;
    -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;}
.allteach{
	height: 45px;
	line-height: 45px;
	color: @maincolor;
	font-size: @mainsize;
	padding:0 10px;
	background:@whites url('../../common/img/more.png') no-repeat right center;
	background-position: 97% center;
	padding-right: 20px;
	margin-bottom: 10px;
}
.teacherlist{
	float:left;
	width:100%;
}
.scroll-wrap{
  min-height:100%;
  width:100%;
}
.loading-container{
    position:absolute;
    width:100%;
    height:100%;
    top:50%;
    transform: translateY(-50%);
}
.loading{
	opacity:0.3 !important;
}
</style>
