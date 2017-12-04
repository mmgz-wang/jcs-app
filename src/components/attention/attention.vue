<template>
	<div class="attention">
	  	<publick-header :headerData="headerData"></publick-header>
	  	<scroll class="scroll" 
        :needRefresh="needRefresh"
        :pullDownRefresh="pullDownRefresh"
        :pullUpLoad="pullUpLoad"
        :pullingDownFn="pullingDownFn"
        :pullingUpFn="pullingUpFn"
        ref="scroll" :data="scrollData">
	  		<div style="float:left" class="scroll-wrap">
                <p pulldown>{{pullDownText}}</p>
	  			<div class="loading-container" v-show="articleDataList.length<=0 && authorDataList.length<=0">
	  			  <loading></loading>
	  			</div>
	  			<div v-if="!isTeach" class="articlelist">
	  				<article-list @goauthor="goauthor" @goarticle="goarticle" :articleDataList = "articleDataList"></article-list>
	  			</div>
	  			<div v-if="isTeach" class="teacherlist">
	  				<div class="allteach" @click="goAllteach()">
	  					查看更多老师
	  				</div>
	  				<div class="teachmsg" v-for="item in authorDataList">
	  					<dl @click="goauthor(item.authorId)">
	  						<dt>
	  							<p>
	  								<img v-lazy="item.picUrl">
	  								<span class="warn" v-if="item.notReadArticleNum != 0">{{item.notReadArticleNum}}</span>
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
                <p pullup>{{pullUpText}}</p>
	  		</div>	  		
	  	</scroll>
	  	<lack-page 
        :src="lackPageData.src"
        :title="lackPageData.title"
        :hint="lackPageData.hint"
        :button="lackPageData.button"
        :goCallback="lackPageData.goCallback"
        v-show="isEnter"></lack-page>
	</div>
</template>

<script>
import sharefn from 'common/js/sharefn'
import publickHeader from 'base/header/publickheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import articleList from 'base/articlelist/articlelist'
import Common from 'common/js/common.js'
import lackPage from 'base/lackpage/lackpage'
  export default {
    name: 'attention',
    data() {
    	return {
    		name: 'attention',
    		isTeach: false,
    		articleDataList: [],
    		authorDataList: [],
    		scrollData: [],
    		isloading: true,
            lastArticleId: 0,
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
    		},
    		isEnter: false,
    		isFirstEnter: false,
            types: 0,
            needRefresh: true,
            pullDownRefresh: {threshold: 50, stop: 50},
            pullUpLoad: {threshold: 0, txt:{more: "", noMore: ""} },
            pullDownText: '下拉刷新！',
            pullUpText: '上拉加载更多！',
            lackPageData:{
                src: require('../../common/img/unenter.png'),
                title: '您还没有登录',
                hint: '登录后才能使用该功能',
                button: '立即登录',
                goCallback(){
                    this.$router.push({name: 'enter'})
                }
            }
    	}
    },
    components: {
    	publickHeader,articleList,Scroll,loading,lackPage
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
                console.log(that.queryString)
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
                console.log(this.authorDataList)
    		};
    	})
    	this.isFirstEnter=true;
    },
    beforeRouteEnter(to, from, next) {
        if(from.name=='enter'){
            location.reload();
        }
        if(from.name == 'articledetail'){
            to.meta.iskeep=true;
        }
        if(from.name == 'home'){
            to.meta.iskeep=false;
        }
        next();
    },
    activated() {
        console.log(this.isEnter)
    	if(!this.$route.meta.iskeep || this.isFirstEnter){
            this.queryString = {
                urls: '/Author/GetFollowedAuhorArticles',
                data: {
                    language: 'M',
                    userId: sharefn.getUserId(),
                    token: sharefn.getSecurityCode(),
                    articleId: 0
                }               
            };
            this.queryString.data.articleId = 0;
            this.articleDataList = [];
            this.authorDataList = [];
            this.isTeach = false;
            this.queryString.urls = '/Author/GetFollowedAuhorArticles';
            let articleBtn = document.querySelector('#article');
            let teacherBtn = document.querySelector('#teacher');
            articleBtn.className = 'on';
            teacherBtn.className = '';
            this.$refs.scroll.refresh();
            this.getData(this.queryString);
    	}
    	this.isFirstEnter = false;
        this.$route.meta.iskeep=false;
    },
    deactivated() {
        if(this.$route.name == 'home'){
            this.$refs.scroll.scrollTo(0,0,0);
        }
        console.log("我是第一个页面的 deactivated 方法");
    },
    methods: {
        pullingDownFn(scroll){
            this.types = 0;
            this.queryString.data.articleId = 0;
            this.pullDownText = '努力加载中 ...';
            console.log(this.queryString);
            this.getData(this.queryString);
        },
        pullingUpFn(scroll){
            this.types = 1;
            this.pullUpText = '努力加载中 ...';
            console.log(this.queryString);
            this.getData(this.queryString);
        },
        /*setMenu: function(name){
            var menu = document.querySelector('#menu');
            menu.className = 'menus show';
        },*/
    	getData: function(data){
            this.$nextTick(function(){
                this.$http.jsonp(Common.baseUrl.host+data.urls,
            {
                params:data.data
            }).then(function(res){
                console.log(res.data)
                if(res.data.Code == '0000' || res.data.code == '0000'){
                    if((res.data.Articles != undefined && res.data.Articles.length == 0) || (res.data.data != undefined && res.data.data.length == 0)){
                        this.lackPageData = {
                            src: require('../../common/img/unfollow.png'),
                            title: '您还没有关注老师',
                            hint: '快快关注起来，发现更多精彩内容！',
                            button: '前往专家频道',
                            goCallback(){
                                this.$router.push({name: 'export'})
                            }
                        }
                        this.isEnter = true;
                        return ;

                    };
                    this.isEnter = false;
                    if(!this.isTeach){
                        if(this.types){
                            this.articleDataList = this.articleDataList.concat(res.data.Articles);
                            this.pullUpText = '上拉加载更多！';
                        }else{
                            this.articleDataList = res.data.Articles;
                            this.pullDownText = '下拉刷新！';
                        }
                        this.queryString.data.articleId = this.articleDataList[this.articleDataList.length-1].id;
                        this.scrollData = this.articleDataList;                        
                    }else{
                        this.authorDataList = res.data.data;
                        this.scrollData = this.authorDataList;
                    }
                }
            },function(res){
                console.log(res)
                this.isEnter = true;
                //this.$router.push({name: 'enter'})
                //alert('请求失败！')
            })
            })
    		
    	},
    	goarticle(item){
    	  this.$router.push({
    	    path: `/articledetail/?id=${item.id}`,
    	    props: {id: item.id}
    	  })
    	},
    	goauthor(id){
    	  this.$router.push({
    	    path: `/author/?id=${id}`
    	  })
    	},
        goAllteach(){
            this.$router.push('export')
        },
    	setTime(str){
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
    p[pulldown]{
        width:100%;
        height:50px;
        line-height:50px;
        text-align:center;
        color:@assistcolor;
        font-size:0.12rem;
        position:absolute;
        top:-50px;
        left:0;
    }
    p[pullup]{
        width:100%;
        height:40px;
        line-height:40px;
        text-align:center;
        color:@assistcolor;
        font-size:0.12rem;
    }
    .header div span{
    	margin-right: 35px;
    	color: @backcolor;
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
}
</style>
