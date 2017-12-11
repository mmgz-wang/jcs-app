<template>
	<div class="result">
        <main-header :headerData="headerData"></main-header>
	  	<scroll class="scroll" ref="scroll" :data="authorDataList">
	  		<div style="float:left" class="scroll-wrap">
	  			<div class="teacherlist">
	  				<div class="teachmsg" v-for="item in authorDataList">
	  					<dl @click="goauthor(item.id)">
	  						<dt>
	  							<img v-if="item.picurl" v-lazy="item.picurl">
	  						</dt>
	  						<dd>
                                <p>{{item.nickname}}</p>
	  							<!-- <p>
	  								{{item.nickname}}<br>
                                    <span class="fans" v-if="item.follownum">{{item.follownum}}</span>
                                    <span class="tm" v-if="item.newarticletime">{{setTime(item.newarticletime)}}</span>
	  								<i class="isfans">已关注</i>
	  							</p> -->
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
import shareFn from '../../common/js/sharefn'
import Scroll from 'base/scroll/scroll'
import mainHeader from 'base/header/mainheader'
  export default {
    name: 'result',
    data() {
    	return {
    		name: 'attention',
    		isTeach: false,
    		authorDataList: [],
    		scrollData: [],
    		isFirstEnter: false,
            types: 0,
            searchText: '',
            loding: null,
            headerData: {
                ele: '搜索结果',
                name: 'result',
            },
    	}
    },
    created(){
        this.isFirstEnter = true;
    },
    beforeRouteEnter(to, from, next) {
        if(from.name=='author'){
            to.meta.isback = true;
        }
        next();
    },
    activated() {
        if(!this.$route.meta.isback || this.isFirstEnter){
            this.$refs.scroll.scrollTo(0,0,0);
            this.authorDataList = this.$route.params.data;
        }
        this.isFirstEnter = false;
        this.$route.meta.isback=false;
    },
    deactivated() {
        this.authorDataList = [];
        console.log("我是第export个页面的 deactivated 方法");
    },
    mounted(){
        this.authorDataList = this.$route.params.data;
        console.log(this.$route.params)
    },
    components: {
    	Scroll,mainHeader
    },
    methods: {
        setMenu: function(name){
            var menu = document.querySelector('#menu');
            menu.className = 'menus show';
        },
    	goauthor(id){
    	  this.$router.push({
    	    path: `/author/?id=${id}`
    	  })
    	},
    	setTime(str){
    		return shareFn.setTime(str);
    	},
        back(){
            this.$router.go(-1)
        }
    }
  }
</script>

<style lang="less">
@import "../../common/less/base.less";
.result{
	width:100%;
	height:100%;
	color:#fff;
    background:#fbfbfb;
    .export-header{
        width:100%;
    	height:50px;
        line-height:50px;
    	color: @backcolor;
    	font-size: 0.14rem;
    	position: relative;
        padding-left:50px;
        padding-right:15px;
        border-top:1px solid transparent;
    	.back{
            width:50px;
            height:100%;
            float:left;
            position:absolute;
            left:0;
            background:url('../../common/img/deepback.png') no-repeat center;
            color:transparent;
            background-size:11px auto;
        }
        form{
            height:30px;
            margin-top:9px;
            border-radius:15px;
            background:#efefef;
            line-height:30px;
            background:#efefef url(../../common/img/se.png) no-repeat left center;
            background-size:16px;
            background-position:15px center;
            padding-left:35px;
            overflow:hidden;
            input{
                width:90%;
                height: 30px;
                border:none;
                outline:none;
                background:#efefef;
                padding-left:5px;
            }
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
    .teachmsg{
        width:100%;
        float:left;
        background: @whites;
        font-size:0.15rem;
        color: @namecolor;
    }
    .teachmsg dl {
        float:left;
        width:97%;
        margin-left:3%;
        border-bottom:1px solid @bordercolor;
        padding:10px 0;
        dt{
            width:15%;
            float:left;
            img{
                width:40px;
                height:40px;
                border-radius:50%
            }
        }        
        dd{
            width:85%;                     
            float:right;
            padding-right:10px;
            p{
                font-size:0.17rem;
                position: relative;
                .tm,.fans{
                    color:@assistcolor;
                    font-size:@assistsize;
                    background:url('../../common/img/tim.png') no-repeat left center;
                    background-size: 14px;
                    padding-left: 16px;
                    margin-left:15px;
                }
                .fans{
                    background:url('../../common/img/fan.png') no-repeat left center;
                    background-size: 14px;
                    margin-left:0px;
                }
            }
            .newTxt{
                color: @namecolor;
                font-size:0.15rem;
                display:-webkit-box;
                padding-top:3px;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }
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
    .teachmsg:last-child{
        dl{
            border:none;
        }
    }
}
</style>
