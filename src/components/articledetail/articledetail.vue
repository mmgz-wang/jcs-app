<template>
    <div class="article-detail" v-if="articleData!=null">
    	<header class="art-header">
    		<span class="back" @click="art_back()">返回</span>
    		<h1>详情</h1>
    		<span class="service">联系客服</span>
    	</header>
    	<div class="art-wrap-outer">
			<div class="hd">
				<dl>
					<dt><img :src="articleData.authorPic" alt="" id="authod_pic"></dt>
					<dd>
						<span class="name" id="authod_name">{{articleData.authorName}}</span><br>
						粉丝:<span id="flllow_num">{{articleData.follownum}}</span>文章:<span id="atticle_num">{{articleData.allaticlenum}}</span>
					</dd>
				</dl>
				<span class="follow" 
				:class="{follow_on:!authorFollowed}"
				@click="goFollow(authorFollowed)"
				 id="is_follow">{{followStr}}</span>
			</div>
			<div class="article-wrap">
				<div class="free_txt">
					<p class="show_tim">发布于：<span class="day" id="publish_day">{{setTime(articleData.last_modified)}}</span></p>		
					<span v-if="articleData.tabView" class="txt" id="zhaiyao" v-html="articleData.tabView">
					</span>
					<div class="digest">
						{{articleData.digest}}
					</div>
				</div>
				<div class="article-main" v-if="articleData.chargeable && !articleData.articlePurchased">
					<div class="match-items">
						<div class="item" v-for="item in articleData.matches">
							<p cupname>
								<span class="home_team">{{item.home_team}}</span>
								<i>VS</i>
								<span class="vis_team">{{item.away_team}}</span>
							</p>
							<p class="tim">
								<span class="ball">{{sportType(item.sportType)}}</span>
								<span class="week"></span>
								<span class="com">{{item.cup_name}}</span>
								<span class="day">{{setTime(item.start_time)}}</span>
							</p>
						</div>
						<div class="lock">
							<p class="main-num">{{productExplain(articleData)}}</p>
							<span></span>
						</div>
					</div>				
				</div>
				<div class="unlock" v-if="!articleData.chargeable || articleData.articlePurchased" v-html="articleData.text">
				</div>
				<p class="hoge" v-if="articleData.matches.length>0">温馨提醒：本平台所有赛事皆为主队在前，客队在后。</p>

				<p class="price1" v-if="articleData.chargeable && articleData.singleUnlock && articleData.price>0 && articleData.articlePurchased">(VIP文章：{{articleData.price}} 精彩币 )</p>

				<p class="price1" v-if="articleData.chargeable && !articleData.singleUnlock && articleData.articlePurchased">(VIP用户专享)</p>

				<div class="memberPackage" v-if="articleData.chargeable && !articleData.articlePurchased" id="aaa" v-html="payForWaystr" @click="PayForPackage">
					<button>解锁<span>58精彩币</span></button>
					<button class="gary">使用赠送机会<span>90精彩币以下</span></button>
					<button>包月解锁<span>5400精彩币</span></button>
					<button>包年解锁<span>38880精彩币</span></button>
					<button>包年解锁<span>38880精彩币</span></button>
				</div>
	    	</div>
	    	<div v-if="recommendData.length" class="recommendList" style="">
				<p class="r-tit"><span>精彩推荐</span></p>
				<div class="r-list">
					<div class="listcon" v-for="item in recommendData" onclick="recommendGoarticle(538590)">
						<div class="titbox" v-if="item.matches.length>0">
							<span>{{item.matches[0].cup_name}}</span>
							<span>{{item.matches[0].home_team}} vs {{item.matches[0].away_team}}</span>
							<span>{{  setTime(item.last_modified)}}</span>
						</div>
						<span class="digest">
							<i class="r-vip" v-if="item.chargeable">VIP</i>{{ item.digest}}
						</span>
						<div class="bott">
							<span class="txt" v-if="item.tabView" v-html="item.tabView">
								<i>足球</i><i>初盘大小球</i>
							</span>
							<dl author_id="905">
								<dt>
									<img :src="item.authorPic">
								</dt>
								<dd class="h38">
									<span class="name">{{item.authorName}}</span>
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
			<div style="display:none;" v-if="articleData.vedioshow" class="banner">
				<img :src="articleData.vedioshow" alt="" id="adver">
			</div>
			<p class="art-hint">观点建议仅供参考，据此投注，风险自负，购彩仅为娱乐，请量力而行！<span id="wanrn">点击查看风险提示及免责声明</span></p>
		</div>
		<div class="footer-art">
			<div @click="ArtFootClick('like')">
				<span class="like" :class="{arton:isLike}">点赞</span>
			</div>
			<div @click="ArtFootClick('collect')">
				<span class="collect-art" :class="{arton:isCollect}">收藏</span>
			</div>
			<div @click="ArtFootClick('letter')">
				<span class="send-letter">发私信</span>
			</div>
			<div @click="ArtFootClick('share')" style="display:none;">
				<span class="share-art">分享</span>
			</div>
		</div>
		<router-view></router-view>
    </div>
    
</template>
<script type="text/javascript">
import shareFn from 'common/js/sharefn'
import Common from 'common/js/common'
import BUS from 'common/js/bus'
export default {
	name: 'articleDetail',
	props:{
		id:{
			type: String,
			default: ''
		}
	},
	data(){
		return {
			articleData: [],
			recommendData: [],
			payForWaystr: '',
			authorFollowed: true,
			authorId: '',
			followStr: '加关注',
			authorName: '',
			price: '',
			isCollect: false,
			isLike: false
		}
	},
	created(){
		
	},
	mounted(){
		//this.getData();
	},
	activated() {
		this.articleData = [];
		this.getData();
	},
	deactivated() {
		//console.log("我是第一个页面的 deactivated 方法");
	},
	components: {
		
	},
	methods: {
		getData(){
			var that = this;
			this.$nextTick(function(){
				this.$http.jsonp(
					Common.baseUrl.host + '/article/detail?time=' + Math.random(),
					{
						params: {
							language: 'M',
							userId: shareFn.getUserId(),
							securityCode: shareFn.getSecurityCode(),
							articleId: this.$router.currentRoute.query.id
						}
					}
				).then(function(res){
					console.log(res.data)
					if(res.data.Code == '0000'){
						this.articleData = res.data.Articles;
						this.recommendData = res.data.recommendList;
						this.authorFollowed = this.articleData.authorFollowed;
						this.authorId = this.articleData.author_id;
						this.authorFollowed?this.followStr = '已关注':this.followStr = '加关注';
						this.authorName = this.articleData.authorName;
						this.isCollect = this.articleData.articleCollected;
						this.isLike = this.articleData.articlePraised;
						this.payForWay(res.data);
					}else if(res.data.code == '0003'){
						layer.open({
							content: '登录过期，请重新登录！',
							btn: ['确定','取消'],
							yes: function(index){
								that.$router.push({ name: 'enter'});
								layer.close(index);
							},
							no: function(index){
								setCookie('jsonLog',null,1);
								function setCookie(c_name,value,expiredays){
									var exdate=new Date();
									exdate.setDate(exdate.getDate()+expiredays);								
									document.cookie=c_name+ "=" +escape(value)+
									((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
								}
								that.$router.back();
							}
						})
					}else{
						console.log('请求失败')
					}
				})
			})
		},
		ArtFootClick(s){
			var that = this;
			if(!shareFn.isLogin()) {
				this.bunceIn('您还没有登录！');
				return ;
			}
			if(s == 'like'){
				this.AddArticleWhat(
					'ArentService.AddArticlePraise',
					function(data){
						if(data.Code == '0000'){
							that.bunceIn('点赞成功');
							that.isLike = true;
						}else if(data.Code == '3009'){
							that.bunceIn('您已经点过赞了');
						}
					}
				);
			}else if(s == 'collect'){
				var str = '';
				this.isCollect?str='CrentService.ReleaseCollection':str='CrentService.AddCollection';
				console.log(str+this.isCollect)
				this.AddArticleWhat(
					str,
					function(data){
						console.log(data)
						if(data.Code == '0000'){
							if(that.isCollect){
								that.bunceIn('取消收藏成功');
								that.isCollect = false;
							}else{
								that.bunceIn('收藏成功');
								that.isCollect = true;
							}
						}
					}
				);
			}else if(s == 'letter'){
				this.$router.push({
				  path: `/letterindex?id=${this.authorId}&name=${encodeURI(this.authorName)}`
				})
			}else if(s == 'share'){

			}
		},
		setTime (s){
			return shareFn.setTime(s);
		},
		sportType (s){
			if(s == 0){
				return '足球'
			}else if(s == 1){
				return '篮球'
			}else{
				return '';
			}
		},
		productExplain (data){
			var packages = data.authorLevels,needPackages = data.authorLevelList;
			var productExplainJson = {
				jdp: 'VIP内容共' +data.textLength +'字，解锁后方可查看。',
				jby: 'VIP内容共' +data.textLength +'字，包月用户可见。',
				jbbn:'VIP内容共' +data.textLength +'字，包半年用户可见。',
				jbn:'VIP内容共' +data.textLength +'字，包年用户可见。',
				by:'此文章包月用户可见，但可单篇解锁。',
				bbn:'此文章包半年用户可见，但可单篇解锁。',
				bn:'此文章包年用户可见，但可单篇解锁。',
			};
			if(data.chargeable && !data.articlePurchased && !data.singleUnlock && data.periods != undefined) {
				if(needPackages.length<1){
					return productExplainJson.jdp;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '12'){
					return productExplainJson.jbn;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '6'){
					return productExplainJson.jbbn;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '1'){
					return productExplainJson.jby;
				}else if(needPackages.length > 1){
					return 'VIP内容共' +data.textLength +'字，包'+this.returnYears(needPackages[(needPackages.length-1)].termmonths)+'更优惠。';
				}else{
					return productExplainJson.jdp;
				}
			}else if(data.chargeable && !data.articlePurchased && data.singleUnlock && data.periods != undefined){
				if(needPackages.length<1){
					return productExplainJson.jdp;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '12'){
					return productExplainJson.bn;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '6'){
					return productExplainJson.bbn;
				}else if(needPackages.length == 1 && needPackages[0].termmonths == '1'){
					return productExplainJson.by;
				}else if(needPackages.length > 1){
					return 'VIP内容共' +data.textLength +'字，包'+this.returnYears(needPackages[(needPackages.length-1)].termmonths)+'更优惠。';
				}else{
					return productExplainJson.jdp;
				}
			}else{
				return productExplainJson.jdp;
			}
		},
		returnYears (s){
			var packageArr = {'1':'月','3':'季','6':'半年','12':'年'};
			return packageArr[s];
		},
		payForWay (data){
			var articles = data.Articles,authorLevelList = data.Articles.authorLevelList, authorLevels = data.Articles.authorLevels;
			var payForWaystr = '';
			if(articles.chargeable && !articles.articlePurchased && articles.singleUnlock) {
				payForWaystr += '<button types="money">解锁<span>'+ articles.price +'精彩币</span></button>';
			}
			if('' != articles.omnCardId &&'' != articles.omnCardValue && articles.omnCardId != 0 && articles.omnCardValue != 0&&undefined!=articles.omnCardId&&undefined!=articles.omnCardValue&& articles.singleUnlock) {
				payForWaystr += '<button types="card">赠送机会<span>'+articles.omnCardValue+'精彩币以下</span></button>';
			}

			if(authorLevelList != undefined && authorLevels != undefined){
				authorLevels.forEach(function(v,i){
					authorLevelList.forEach(function(val,key){
						if(val.termmonths == 0){
							return;
						}
						if(v.termmonths == val.termmonths){
							console.log(v.termmonths)
							payForWaystr += returnPackage(val);
						}
					})
					
				})
				authorLevelList.forEach(function(v,i){
					if(v.termmonths == 0 && v.termdays == 1){
						payForWaystr += returnPackage(v);
					}else if(v.termmonths == 0 && v.termdays != 1){
						payForWaystr += returnPackage('zhou',v);
					}		
				})
				function returnPackage(v){
					var packageArr = {'0':'天','1':'月','3':'季','6':'半年','12':'年'};
					if(arguments.length>1){
						return '<button types="packages" months="'+arguments[1].termmonths+'" id="'+arguments[1].id+'" price='+arguments[1].price+'>'+
							'包周解锁<span>'+arguments[1].price+'精彩币</span></button>';
					}else{
						return '<button types="packages" months="'+v.termmonths+'" id="'+v.id+'" price='+v.price+'>'+
							'包'+packageArr[v.termmonths]+'解锁<span>'+v.price+'精彩币</span></button>';
					}
				}
			}
			this.payForWaystr = payForWaystr;	
		},
		PayForPackage(){
			if(!shareFn.isLogin()){
				this.$router.push({ name: 'enter'});
				return false;
			}
			var trg = event.target;
			if(trg.nodeName != 'BUTTON' && trg.nodeName == 'SPAN'){
				trg = trg.parentNode;
			}
			var types = trg.getAttribute('types');
			if(types == 'money'){
				this.$router.push({
					path: `/payfor?id=${this.$router.currentRoute.query.id}&proType=jcs`,
				})
				console.log(types)
			}else if(types == 'card'){
				
			}else if(types == 'packages'){
				this.$router.push({
					name: 'payfor',
					query: {
						id: trg.getAttribute('id'),
						months: trg.getAttribute('months'),
						authorName: this.authorName,
						price: trg.getAttribute('price'),
						proType: 'package'
					}
				})
			}
		},
		goFollow (s){
			var that = this;
			if(!shareFn.isLogin()) {
				this.bunceIn('您还没有登录！')
			} else {
				if(!s) { //关注
					follow('add');
				} else { //未关注
					follow('cancel');
				}
			}
			function follow(flag) {
				that.$nextTick(function(){
					that.$http.jsonp(
						Common.baseUrl.host + '/follow/' + flag,
						{ 
							params: {
								language: 'M',
								analystId: that.authorId,
								userId: shareFn.getUserId(),
								securityCode: shareFn.getSecurityCode()
							}
						}
					).then(function(res){
						that.authorFollowed = !that.authorFollowed;
						showFollow(2);
					})
				})
				
			}
			function showFollow(type) {
				if(that.authorFollowed) {
					that.followStr = '已关注';
					showMeaage('关注成功');
				} else {
					that.followStr = '加关注';
					showMeaage('取消成功');
				}
			}
			//app.jcsClickEvent('Article_followbutton_click');
			return false;
		},
		art_back(){
			this.$router.back();
			this.$nextTick(function(){
				BUS.$emit('reload',true);
			})
		},
		bunceIn(s){
			layer.open({
				content: s,
				time: 2,
				skin: 'msg'
			})
		},
		AddArticleWhat(str,Fn){
			var that = this;
			var opt = {
			    url: Common.baseUrl.nativeHost,
			    data: {
			        "SecurityCode": shareFn.getSecurityCode(),
			        "UserId": shareFn.getUserId(),
			        "ArticleId": this.$router.currentRoute.query.id
			    },
			    headers:{"X-Target":str},
			    callback: function(data){
			       Fn(data)
			    }
			}
			this.custmorAjax(opt);
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
		articleData: function(){

		}
	}
}

</script>
<style lang="less">
@import "../../common/less/base.less";
.article-detail{
	position:absolute;
	left:0;
	top:0;
	right:0;
	left:0;
	bottom:0;
	z-index:9999999;
	background:@backcolor;
	overflow:hidden;
	overflow-y: scroll;
	padding-top:44px;
	.art-header{
		height:44px;
		line-height:44px;
		width:100%;
		font-size:0.14rem;
		color:@headercolor;
		text-align:center;
		position:fixed;
		background:@backcolor;
		top:0;
		z-index:10;
		h1{
			font-size:0.18rem;
			font-weight:400;
		}
		.back{
			width:44px;
			height:100%;
			float:left;
			position:absolute;
			left:0;
			background:url('../../common/img/deepback.png') no-repeat center;
			color:transparent;
			background-size:11px auto;
		}
		.service{
			display:none;
			height:100%;
			position:absolute;
			right:0;
			top:0;
			padding:0 15px;
		}
	}
	.hd{
		font-size:0.16rem;
		color:@namecolor;
		background:@whites;
		height:0.55rem;
		width:100%;
		position: relative;
		padding:0 15px;
		img{
			width:0.27rem;
			height:0.27rem;
			border-radius:50%;
		}
		dl{
			float:left;
			height:100%;
			display:flex;
			align-items:center;
			dt{
				height:0.27rem;
				width:0.27rem;
			}
			dd{
				padding-left:10px;
				font-size:0.11rem;
				color:#999;
				span{
					padding:0 10px 0 5px;
				}
				#authod_name{
					padding:0;
					font-size:0.15rem;
				}
			}
		}
		.follow{
			position:absolute;
			right:20px;
			bottom:0.1rem;
			font-size:0.1rem;
			color:#888888;
			text-align:center;
		}
		.follow_on{
			color:@reds;
		}
		.follow:before{
			content:"";
			width:0.21rem;
			height:0.21rem;
			background:url('../../common/img/w.png') no-repeat;
			background-size:contain;
			position:absolute;
			top:-0.21rem;
			left:50%;
			margin-left:-0.105rem;
		}
		.follow_on:before{
			content:"";
			background:url('../../common/img/w_on.png') no-repeat;
			background-size:contain;
		}
	}
	.article-wrap{
		width:100%;
		background:@whites;
		margin-top:10px;
		padding:10px 15px;
		.free_txt{
			width:100%;
			padding-bottom:10px;
			.show_tim{
				font-size:0.1rem;
				color:@assistcolor;
				clear:both;
				line-height:0.2rem;
			}
			.digest{
				width:100%;
				font-size:@mainsize;
				color:@maincolor;
			}		
			.label{
				padding-bottom:5px;
			}
			.txt{
				width:100%;
				height:28px;
				line-height:28px;
				display:flex;
				justify-content:flex-start;
				box-sizing:content-box;
				align-items:center;
				i{
					height:16px;
					line-height:16px;
					padding:0 5px;
					border-radius:3px;
					font-style:normal;
					color:@reds;
					border:1px @reds solid;
					font-size:@assistsize;
					margin-right:8px;
				}
				.vip{
					background:#ffd842;
					color:#404040;
				}
				label{
					color:@oranges;
					font-size:@assistsize;
				}
				.gg{
					padding:0px 3px;
				}
			}
		}
		.article-main{
			width:100%;
			border:1px solid @bordercolor;
			background:#fbfbfb;
			font-size:@mainsize;
			color:@maincolor;
			.match-items{
				width:100%;
				.item{
					width:90%;
					margin-left:5%;
					text-align:center;
					padding:12px 0 8px 0;
					border-bottom:1px dotted @bordercolor;
					&:last-child{
						border:none;
					}
					p[cupname]{
						text-align:center;
						width:100%;
						display:flex;
						justify-content:center;
						align-items:center;
						i{
							color:@oranges;
							padding:0 5px;
						}
						
					}
					.tim{
						font-size:@assistsize;
						color:@assistcolor;
						padding-top:5px;
						span{
							padding:0 3px;
						}
					}
				}
				.lock{
					width:100%;
					height:0.6rem;
					text-align:center;
					font-size:@assistsize;
					color:@shallowred;
					position:relative;
					line-height:40px;
					span{
						width:0.4rem;
						height:0.4rem;
						background:#fbfbfb url('../../common/img/lock.png') no-repeat center;
						background-size:19px auto;	
						position:absolute;
						left:50%;
						bottom:-0.19rem;
						margin-left:-20px;
						border:1px solid @bordercolor;
						border-radius:50%;
					}
				}
			}
		}
		.unlock{
			font-size:0.15rem;
			color:@maincolor;
			width:100%;
			border-top:1px solid @bordercolor;
			.compition{
				width:100%;
				border:1px solid @bordercolor;
				background:#fbfbfb;
				font-size:@mainsize;
				color:@maincolor;
				border-top:none;
				.teamz{
					width:100%;
					text-align:center;
					padding:12px 0 8px 0;
					border-bottom:1px dotted @bordercolor;
					&:last-child{
						border:none;
					}
					p{
						text-align:center;
						width:100%;
						&:nth-child(1){
							color:@oranges;
							display:flex;
							justify-content:center;
							align-items:center;
							span{
								color:@maincolor;
								padding:0 5px;
							}
						}
						&:nth-child(2){
							font-size:@assistsize;
							color:@assistcolor;
							padding-top:5px;
							span{
								padding:0 3px;
							}
						}
					}
				}
				.com_detail{
					width:100%;
					font-size:0.14rem;
					padding-top:5px;
					line-height:0.24rem;
					padding-left:5px;
					&:last-child{
						padding-bottom:5px;
					}
					.p_way{
						color:@deepblues;
					}
					.result{
						color:@namecolor;
						padding-left:6px;
						span{
							color:@reds;
						}
						i{
							color:@deepblues;
						}
					}
				}
			}
			.all{
				padding-top:10px;
				line-height:0.24rem;
				p{
					img{
						width:100%;
					}
				}
			}
		}
		.memberPackage{
			width:100%;
			padding:10px;
			font-size:0.15rem;
			color:#ffd842;
			display:flex;
			flex-flow:row wrap;
			justify-content:space-around;
			margin-top:5px;
			button{
				flex:1;
				min-width:31%;
				max-width:45%;
				outline:none;
				border:1px solid @reds;
				background:@shallowred2;
				color:@reds;
				display:inline-block;
				font-size:0.15rem;
				border-radius:2px;
				margin-right:3%;
				margin-top:20px;
				padding:10px 0;
				&:nth-child(3n){
					margin:0;
					margin-top:20px;
				}
				span{
					display:block;
					font-size:@assistsize;
					padding-top:5px;
				}
			}
			.gary{
				flex:1;
				min-width:31%;
				max-width:45%;
				outline:none;
				border:1px solid @bordercolor;
				background:@whites;
				color:@assistcolor;
				display:inline-block;
				font-size:0.15rem;
				border-radius:2px;
				margin-right:3%;
				margin-top:20px;
				padding:10px 0;
				span{
					display:block;
					font-size:@assistsize;
					padding-top:5px;
				}
			}
		}
	}
	.recommendList{
		width:100%;
		font-size:0;
		margin:10px 0;
		background:@whites;
		color:@maincolor;
		.r-tit{
			width:100px;
			height:20px;
			border-bottom:1px solid #434343;
			text-align:center;
			line-height:20px;
			font-size:0;
			margin:0 auto;
			margin-top:20px;
			span{
				font-size:0.16rem;
				color:@maincolor;
				padding:0 5px;
				transform:translateY(9px);
				display:inline-block;
				background:@whites;
			}
		}
		.r-list{
			width:100%;
			margin-top:25px;
		}
		.listcon{
			width:94%;
			overflow:hidden;
			padding-bottom:8px;
			margin-left:3%;
			margin-top:5px;
			border-bottom:1px solid @bordercolor;
		}
		.listcon:last-child{
			border:none;
		}
		.topb img{
			width:100%;
		}
		.digest{
			margin-top:0px;
			width:100%;
			line-height:0.24rem;
			font-size:0.15rem;
			word-break:break-all;
			display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            overflow:hidden;
            color:@maincolor;
		}
		.bott{
			width:100%;
			font-size:0.12rem;
			color:#8b7a39;
			height:25px;
			line-height:25px;
			float: left;
			margin-top:5px;
		}
		.bott .txt{
			float:left;
		}
		.bott .txt i{
			display:inline-block;
			height:0.16rem;
			line-height:0.14rem;
			padding:0 5px;
			margin-right:8px;
			border-radius:2px;
			font-style:normal;
			color:@reds;
			border:1px @reds solid;
			font-size:0.12rem;
			transform: translateY(-0.01rem);
		}
		.r-vip{
			background:@reds;
			color:@whites;
			border-color:@reds;
			border-radius:3px;
			height:15px;
			line-height:16px;
			font-size:12px;
			display:inline-block;
			padding:0 5px;
		}
		.bott dl{
			float:right;
			height:25px;
			img{
				width:15px;
				border-radius:50%;
				margin-right:5px;
				margin-top:5px;
			}
			dt{
				float:left;
			}
			dd{
				float:right;
				color:#999;
				.name{
					color:@namecolor;
				}
			}
		}
		.txtbox{float:left;overflow:hidden;padding:0 15px;}
		.txtbox .label{padding-bottom:5px;}
		.txtbox .txt{float:left;width:100%;line-height:0.24rem;font-size:0.17rem;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#dddddd}
		.txtbox .txt i{display:inline-block;height:0.16rem;line-height:0.16rem;padding:0 5px;margin-right:5px;border-radius:2px;font-style:normal;color:#ffd842;border:1px #8b7a39 solid; font-size:.688em;}
		.txtbox .txt .vip{background:#ffd842;color:#404040}
		.titbox{float:left;width:100%;height:0.26rem;line-height:0.26rem;font-size:0.12rem;color:#8b7a39}
		.txtbox .txt label{color:#8b7a39;font-size:0.12rem;padding: 0 5px;}
		.txtbox .txt .gg{padding:0px;}
	}
	.art-hint{
		font-size:@assistsize;
		color:@assistcolor;
		padding:10px;
		padding-top:0px;
		text-align:center;
		span{
			color:@reds;
		}
	}
	.banner{
		width:100%;
		img{
			width:100%;
		}
	}
	.hoge{
		font-size:0.12rem;
		color:@reds;
		margin: 10px 0;
		margin-top:50px;
		text-align:center;
	}
	.price1{
		font-size:0.12rem;
		color:@reds;
		text-align:center;
	}
	.footer-art{
		height:48px;
		width:100%;
		.border-top;
		line-height:48px;
		background:rgba(251,251,251,0.9);
		display:flex;
		justify-content:space-around;
		font-size:@assistsize;
		color:@maincolor;
		position:absolute;
		bottom:0;
		div{
			flex-grow:1;
			text-align:center;
			span{
				background:url('../../common/img/art-unlike.png') no-repeat left center;
				background-size: 17px;
				padding-left:20px;
			}
			.arton{
				color:@reds;
				background:url('../../common/img/art-like.png') no-repeat left center;
				background-size: 17px;
				padding-left:20px;
			}
			&:nth-child(2){
				span{
					background:url('../../common/img/art-uncollect.png') no-repeat left center;
					background-size: 17px;
					padding-left:20px;
				}
				.arton{
					color:@reds;
					background:url('../../common/img/art-collect.png') no-repeat left center;
					background-size: 17px;
					padding-left:20px;
				}
			}
			&:nth-child(3){
				span{
					background:url('../../common/img/art-letter.png') no-repeat left center;
					background-size: 17px;
					padding-left:20px;
				}
			}
		}
	}
	.art-wrap-outer{
		position:absolute;
		top:44px;
		bottom:48px;
		overflow:scroll;
	}
}

</style>