<template>
	<div class="export">
        <header class="export-header">
            <span class="back" @click="back()"></span>
            <form id="search-form" action="#" @submit.prevent="searchOn">
                <input type="search" name="search-export" placeholder="请输入老师昵称" v-model="searchText">
            </form>
        </header>
	  	<scroll class="scroll" ref="scroll" :data="authorDataList">
	  		<div style="float:left" class="scroll-wrap">
	  			<div class="teacherlist">
	  				<div class="teachmsg" v-for="item in authorDataList">
	  					<dl @click="goauthor(item.id)">
	  						<dt>
	  							<p>
	  								<img v-if="item.picurl" v-lazy="item.picurl">
	  							</p>
	  						</dt>
	  						<dd>
	  							<p>
	  								{{item.nickname}}<br>
                                    <span class="fans" v-if="item.follownum">{{item.follownum}}</span>
                                    <span class="tm" v-if="item.newarticletime">{{setTime(item.newarticletime)}}</span>
	  								<i class="isfans" v-if="item.authorFollowed == 'true'" @click.stop="goFollow(item.id)">已关注</i>
                    <i class="unfans" v-if="item.authorFollowed == 'false'" @click.stop="goFollow(item.id)">
                      <img src="../../common/img/add.png" alt="">关注
                                     </i>
	  							</p>
	  							<p class="newTxt" v-if="item.brief">{{item.brief}}</p>
	  						</dd>
	  					</dl>
	  				</div>
	  			</div>
	  		</div>
	  	</scroll>
	</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Common from 'common/js/common.js'
import lackPage from 'base/lackpage/lackpage'
  export default {
    name: 'attention',
    data() {
    	return {
    		name: 'attention',
    		isTeach: false,
    		authorDataList: [],
    		scrollData: [],
    		isFirstEnter: false,
            types: 0,
            searchText: '',
            loding: null
    	}
    },
    components: {
    	Scroll,lackPage
    },
    created() {
    	this.isFirstEnter=true;
    },
    beforeRouteEnter(to, from, next) {
        if(from.name=='author'){
            to.meta.isback = true;
        }
        next();
    },
    activated() {
    	if(!this.$route.meta.isback || this.isFirstEnter){
            this.loding = layer.open({
                type: 2,
                content: '加载中'
            });
            this.$refs.scroll.scrollTo(0,0,0);
            this.getData();
    	}
    	this.isFirstEnter = false;
        this.$route.meta.isback=false;
    },
    deactivated() {
        //this.authorDataList = [];
        console.log("我是第export个页面的 deactivated 方法");
    },
    methods: {
        setMenu: function(name){
            var menu = document.querySelector('#menus');
            menu.className = 'menus show';
        },
    	getData: function(){
            var that = this;
    		this.customAjax({'X-Target':'FrentService.GetAllAuthors'},
                {
                    UserId: this.shareFn.getUserId(),
                    SecurityCode: this.shareFn.getSecurityCode()
                },
                function(data){
                    that.authorDataList = data.Author;
                    console.log(that.authorDataList)
                    layer.close(that.loding);
                }
            )
    	},
        customAjax(heads,data,callback){
            this.$nextTick(function(){
                this.$http.post(
                    Common.baseURI().nativeHost,
                    data,
                    {
                        headers: heads
                    }
                ).then(function(res){
                    callback(res.data)
                },function(res){
                    callback(res)
                })
            })
        },
        searchOn(){
            var that = this;
            if(this.searchText.length>0){
                this.customAjax(
                    {'X-Target':'FrentService.SearchAuthors'},
                    {
                        UserId: this.shareFn.getUserId(),
                        SecurityCode: this.shareFn.getSecurityCode(),
                        KeyWord: that.searchText
                    },
                    function(data){
                        if(data.Author.length>0){
                            that.$router.push({
                                name: 'result',
                                params: {
                                    data: data.Author
                                }
                            })
                            console.log(JSON.stringify(data.Author))
                        }else{
                            layer.open({
                                content: '该老师不存在！',
                                skin: 'msg',
                                time:2
                            })
                        }
                        //that.authorDataList = data.Author;
                    }
                )
            }
        },
        goFollow(id){
            var target = event.target;
            target.nodeName == 'IMG'?target=target.parentNode:target;
            console.log(this.shareFn.isLogin())
            if(!this.shareFn.isLogin()){
              layer.open({
                content: '您还没有登录，请登录！',
                skin: 'msg',
                time:2
              })
              return false;
            }
            console.log(target)
            if(target.className == 'unfans'){
                this.customAjax(
                    {'X-Target':'FrentService.AddFollow'},
                    {
                        UserId: this.shareFn.getUserId(),
                        SecurityCode: this.shareFn.getSecurityCode(),
                        AuthorId: id
                    },
                    function(data){
                        console.log(data)
                        if(data.Code == '0000'){
                            target.className = 'isfans';
                            target.innerHTML = '已关注';
                            layer.open({
                                content: '加关注成功',
                                skin: 'msg',
                                time:2
                            })
                        }else if(data.Code == '1004'){
                            layer.open({
                                content: '您还没有登录，请登录！',
                                skin: 'msg',
                                time:2
                            })
                        }
                    }
                )
            }else{
                this.customAjax(
                    {'X-Target':'FrentService.ReleaseFollow'},
                    {
                        UserId: this.shareFn.getUserId(),
                        SecurityCode: this.shareFn.getSecurityCode(),
                        AuthorId: id
                    },
                    function(data){
                        console.log(data)
                        if(data.Code == '0000'){
                            target.className = 'unfans';
                            target.innerHTML = `<img src="${require('../../common/img/add.png')}" alt="">关注`;
                            layer.open({
                                content: '取消关注成功',
                                skin: 'msg',
                                time:2
                            })
                        }else if(data.Code == '1004'){
                            layer.open({
                                content: '您还没有登录，请登录！',
                                skin: 'msg',
                                time:2
                            })
                        }
                    }
                )
            }

        },
    	goauthor(id){
    	  this.$router.push({
    	    path: `/author/?id=${id}`
    	  })
    	},
    	setTime(str){
    		return this.shareFn.setTime(str);
    	},
        back(){
            this.$router.go(-1)
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
.export{
	width:100%;
	height:100%;
	color:#fff;
    background:#fbfbfb;
    .export-header{
        width:100%;
    	height:44px;
        line-height:44px;
    	color: @backcolor;
    	font-size: 0.14rem;
        padding-right:15px;
        display:flex;
        align-items:center;
    	.back{
            width:38px;
            height:100%;
            background:url('../../common/img/deepback.png') no-repeat center;
            color:transparent;
            background-size:8px 17px;
            background-position:15px center;
        }
        form{
            height:29px;
            border-radius:15px;
            background:#efefef;
            line-height:29px;
            background:#efefef url(../../common/img/se.png) no-repeat left center;
            background-size:14px;
            background-position:15px center;
            padding-left:30px;
            overflow:hidden;
            flex-grow:1;
            input{
                width:90%;
                height: 29px;
                border:none;
                outline:none;
                background:#efefef;
                padding-left:5px;
                line-height:29px;
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
                font-size:14px;
                color:#999999;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                font-size:14px;
                color:#999999;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                font-size:14px;
                color:#999999;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
                font-size:14px;
                color:#999999;
            }
        }

    }
    .scroll{
    	width: 100%;
    	position: absolute;
    	top: 44px;
    	bottom: 0;
    	overflow: hidden;
    }
    .listcon:nth-child(1){
    	margin-top:0;
    }
    .teachmsg{
        width:100%;
        float:left;
        background: @whites;
        font-size:0.15rem;
        color: @namecolor;
        padding-left:15px;
    }
    .teachmsg dl {
        width:100%;
        display:flex;
        dt{
            padding-right:10px;
            padding-top:15px;
            p{
                border-radius:50%;
                position:relative;
                span{
                    border-radius:50%;
                    background:#f43531;
                    width:16px;
                    height:16px;
                    line-height:16px;
                    text-align:center;
                    color:#ffffff;
                    position:absolute;
                    right:-6px;
                    top:-6px;
                    font-size:10px;
                }
                img{
                    width:40px;
                    height:40px;
                    border-radius:50%;
                }
            }
        }
        dd{
            .border-bottom;
            flex-grow:1;
            padding:15px 15px 15px 0;
            p{
                font-size:@mainsize;
                position: relative;
                line-height:1;
                color: @maincolor;
                .tm,.fans{
                    display:inline-block;
                    color:@assistcolor;
                    font-size:0.1rem;
                    background:url('../../common/img/tim.png') no-repeat left center;
                    background-size: 10px;
                    padding-left: 15px;
                    margin-left:6px;
                    margin-top:7px;
                }
                .fans{
                    background:url('../../common/img/fan.png') no-repeat left center;
                    background-size: 12px 10px;
                    margin-left:0px;
                }
            }
            .newTxt{
                color: @namecolor;
                font-size:0.13rem;
                display:-webkit-box;
                padding-top: 5px;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                line-height: 24px;
            }
        }
    }
    .isfans{
        img{
            display:none;
        }
    }
    .isfans,.unfans{
      box-sizing:content-box;
    	height: 25px;
    	line-height: 27px;
    	color: @assistcolor;
    	font-size: @assistsize;
    	font-style: normal;
    	position: absolute;
    	right: 10px;
    	border: 1px solid @bordercolor;
    	border-radius: 2px;
    	top: 50%;
    	margin-top:-17px;
    	padding:0 13px;
      img{
        width: 10px;
        height: 10px;
        margin-right:5px;
        display: inline-block;
      }
    }
    .unfans{
        color:@reds;
        border-color:@reds;
        img{
            width:10px;
        }
    }
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
