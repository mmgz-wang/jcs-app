<template>
	<div class="letterlist">
	  	<main-header :headerData="headerData"></main-header>
	  	<scroll class="letter-scroll" 
        :needRefresh="needRefresh"
        :pullDownRefresh="pullDownRefresh"
        :pullUpLoad="pullUpLoad"
        :pullingDownFn="pullingDownFn"
        :pullingUpFn="pullingUpFn"
        ref="scroll" 
        :data="letterListData">
	  		<div style="float:left" class="scroll-wrap">
                <p pulldown>{{pullDownText}}</p>
	  			<div class="teacherlist">
	  				<div class="teachmsg" v-for="item in letterListData">
	  					<dl @click="letterIndex(item)">
	  						<dt :id="'A'+item.id">
	  							<img v-lazy="item.picurl">
	  						</dt>
	  						<dd>
	  							<p>
	  								{{item.nickname}}<span class="tm">{{setTime(item.timestamp)}}</span>
	  							</p>
	  							<p class="newTxt">{{item.content}}</p>
	  						</dd>
	  					</dl>
	  				</div>
	  			</div>
                <p pullup v-if="letterListData.length>4">{{pullUpText}}</p>
	  		</div>	  		
	  	</scroll>
	  	<lack-page 
        :src="lackPageData.src"
        :title="lackPageData.title"
        :hint="lackPageData.hint"
        :button="lackPageData.button"
        :goCallback="lackPageData.goCallback"
        v-show="isEnter || letterListData.length<=0"></lack-page>
        <router-view></router-view>
	</div>
</template>

<script>
import shareFn from 'common/js/sharefn'
import mainHeader from 'base/header/mainheader'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import articleList from 'base/articlelist/articlelist'
import Common from 'common/js/common.js'
import lackPage from 'base/lackpage/lackpage'
  export default {
    name: 'letterlist',
    data() {
    	return {
    		letterListData: [],
            headerData: {
                ele: '私信',
                name: 'letter',
                isShow: true
            },
            isEnter: true,
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
    	mainHeader,Scroll,lackPage
    },
    created() {
    	
    },
    activated() {
        if(shareFn.isLogin()){
            this.$nextTick(function(){
                this.getData();
                this.getNews();
            })
            
            this.isEnter = false;
        }
    },
    methods: {
        pullingDownFn(scroll){
            this.types = 0;
            this.queryString.data.articleId = 0;
            this.pullDownText = '努力加载中 ...';
            this.getData(this.queryString);
        },
        pullingUpFn(scroll){
            this.types = 1;
            this.pullUpText = '努力加载中 ...';
            console.log(this.queryString);
            this.getData(this.queryString);
        },
    	getData: function(data){
            var that = this;
            var opt = {
                url: Common.baseUrl.nativeHost,
                data: {
                    "SecurityCode" : shareFn.getSecurityCode(),
                    "UserId" : shareFn.getUserId()
                },
                headers:{"X-Target":"TrentService.GetLetteredAuthors"},
                callback: function(data){
                    if(data.Code === '0000'){
                        that.letterListData = data.Author;
                        if(that.letterListData.length<=0){
                            that.lackPageData = {
                                src: require('../../common/img/unletter.png'),
                                title: '暂无私信内容',
                                hint: '多和老师交流才能进步哦！',
                                button: '找个老师聊聊',
                                goCallback(){
                                    this.$router.push({name: 'export'})
                                }
                            }
                        }
                    }else{
                        that.bunceIn(data.msg)
                    }
                }
            }
            this.custmorAjax(opt);
    	},
        getNews(){
            var that = this;
            var opt = {
                url: Common.baseUrl.nativeHost,
                data: {
                    "SecurityCode" : shareFn.getSecurityCode(),
                    "UserId" : shareFn.getUserId()
                },
                headers:{"X-Target":"TrentService.CheckLetter"},
                callback: function(data){
                    if(data.Code === '0000'){
                        var authorArr = data.LetterdAuthor.split(',');
                        for(var i = 0;i<authorArr.length;i++){
                            if(authorArr[i]==''){
                                continue;
                            }
                            document.querySelector('#A'+authorArr[i]).className='onmsg';
                        }
                    }else{
                        that.bunceIn(data.msg)
                    }
                }
            }
            this.custmorAjax(opt);
        },
    	letterIndex(item){
    	  this.$router.push({
    	    path: `/letterindex?id=${item.id}&name=${encodeURI(item.nickname)}`
    	  })
    	},
    	setTime(str){
    		return shareFn.setTime(str);
    	},
        custmorAjax(opt){
            var data = null;
            console.log(opt)
            this.$http.post(
                opt.url,
                opt.data,
                {
                    headers: opt.headers
                }
                
            ).then(function(res){
                opt.callback(res.data);
            },function(){
                this.bunceIn('请求失败请检查网络')
            })
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
.letterlist{
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
    .letter-scroll{
    	width: 100%;
    	position: absolute;
    	top: 44px;
    	bottom: 0;
        background: @whites;
    	overflow: hidden;
    }
    .teachmsg{
        width:100%;
        float:left;
        background: @whites;
        font-size:0.15rem;
        color: @namecolor;
        padding-left:15px;
        dl {
            width:100%;
            display:flex;
            align-items:center;
            padding:17px 0;
            align-items:center;
            dt{
                width:40px;
                height:40px;
                border-radius:50%;
                position:relative;
                img{
                    width:40px;height:40px;
                    border-radius:50%;
                }
            }
            .onmsg{
                &:before{
                    content:'';
                    position:absolute;
                    right:3px;
                    top:3px;
                    width:10px;
                    height:10px;
                    background:@reds;
                    border-radius:50%;
                }
            }
            dd{
                .border-bottom;
                font-size:@mainsize;
                flex-grow:1;
                padding-left:10px;
                padding-right:15px;
                p{
                    font-size:@mainsize;
                    position: relative;
                    .tm{
                        color:@assistcolor;
                        font-size:0.1rem;
                        float:right;
                    }
                }
                .newTxt{
                    color: @garycolor;
                    font-size:13px;
                    display:-webkit-box;
                    padding-top:7px;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    float:left;
                }
                &:after{
                    bottom:-17px;
                }
            }
        }
        &:last-child{
            dd{
                .border-none;
            }
        }
    }
    
    .teacherlist{
    	float:left;
    	width:100%;
        min-height:100%;
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
