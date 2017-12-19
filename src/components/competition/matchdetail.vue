<template>
	<div class="matchdetail">
		<div ref="matchinfo" class="match_info" v-if="matchScore!=null"
		:class="{over_match:matchScore.matchStatus==-1,future_match:matchScore.matchStatus==0}"
		id="div">
			<div class="matchdetail_head" v-if="matchMsg!=null">
				<span @click="back" class="back"></span>
				<p class="match-tim">
					{{matchMsg.match_id}}
					{{matchMsg.cup_name}}
					{{matchMsg.start_time.substr(5,11)}}
				</p>
			</div>
			<div class="match_team_msg" v-if="matchMsg!=null">
				<h3>
					{{matchMsg.home_team}}
					<span>{{matchScore.homeTeamScore}}:{{matchScore.guestTeamScore}}</span>
					{{matchMsg.away_team}}
				</h3>
				<p class="harfe_sorce">
					({{matchScore.homeTeamHalfScore}}:{{matchScore.guestTeamHalfScore}})
				</p>
				<p class="matchStatus"></p>
			</div>
		</div>
		<div class="match-tab">
			<span @click="tabClick('art')" :class="{auton:isart}">赛事分析</span>
			<span @click="tabClick('room')"  :class="{auton:!isart}">赔率</span>
		</div>
		<div class="match-detail-wrap" :class="{roomActive:!isart,roomLeave:isart}">
			<scroll class="matchdetail-list" :data="articleList">
				<article-list 
					:topMargin='false'
					:matchShow="false"
					@goarticle="goarticle"
					:articleDataList="articleList">
				  
				</article-list>
			</scroll>
			<div class="odds_wrap" v-if="oddsData != null">
				<div style="700px;">
					<ul class="Asia" v-if="AsianOdds != null">
						<li>
							<span>亚赔</span>
						</li>
						<li>
							<span>初盘</span>
							<span>即时</span>
						</li>
						<li>
							<span>{{AsianOdds.homeEarlyOdds}}</span>
							<span>{{AsianOdds.earlyMarket}}</span>
							<span>{{AsianOdds.guestEarlyOdds}}</span>
							<span>{{AsianOdds.homeInstantOdds}}</span>
							<span>{{AsianOdds.instantMarket}}</span>
							<span>{{AsianOdds.guestInstantOdds}}</span>
						</li>
					</ul>
					<ul class="europe" v-if="EuropeOdds != null">
						<li>
							<span>欧赔</span>
						</li>
						<li>
							<span></span>
							<span>主胜</span>
							<span>平</span>
							<span>客胜</span>
						</li>
						<li>
							<span>初盘</span>
							<span>{{EuropeOdds.homeVictoryEarlyOdds}}</span>
							<span>{{EuropeOdds.tieEarlyOdds}}</span>
							<span>{{EuropeOdds.guestVictoryEarlyOdds}}</span>
						</li>
						<li>
							<span>即时</span>
							<span>{{EuropeOdds.homeVictoryInstantOdds}}</span>
							<span>{{EuropeOdds.tieInstantOdds}}</span>
							<span>{{EuropeOdds.guestVictoryInstantOdds}}</span>
						</li>
					</ul>
					<ul class="size" v-if="SizeOdds != null">
						<li>
							<span>大小</span>
						</li>
						<li>
							<span>初盘</span>
							<span>即时</span>
						</li>
						<li>
							<span>{{SizeOdds.bigEarlyOdds}}</span>
							<span>{{SizeOdds.earlyMarket}}</span>
							<span>{{SizeOdds.smallEarlyOdds}}</span>
							<span>{{SizeOdds.bigInstantOdds}}</span>
							<span>{{SizeOdds.instantMarket}}</span>
							<span>{{SizeOdds.smallInstantOdds}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		
	</div>
</template>
<script type="text/javascript">
import Scroll from "base/scroll/scroll"
import Common from "common/js/common"
import shareFn from "common/js/shareFn"
import articleList from 'base/articlelist/articlelist'
export default {
	data(){
		return {
			isart: true,
			show: false,			
			url: Common.baseUrl.host + '/match/detail',
			start_articleid: 0,
			articleList: [],
			oddsData: [],
			matchMsg: null,
			matchScore: null,
			loding: null,
			sportType: 0,
			scoutMatchId: 0,
			AsianOdds: null,
			EuropeOdds: null,
			SizeOdds: null,
			matchShow: false
		}
	},
	created(){
		this.loding = layer.open({
			type: 2,
			content: '加载中'
		});
		console.log('created')		
	},
	mounted(){
		
		//this.getData();
		console.log('mounted')
	},
	activated() {
		this.resetData();
	    this.getData();
	    console.log('activated')
	},
	methods: {
		resetData(){
			this.loding = layer.open({
				type: 2,
				content: '加载中'
			});
			this.start_articleid =  0;
			this.articleList =  [];
			this.oddsData =  [];
			this.matchMsg =  null;
			this.matchScore =  null;
			this.isart = true;
			this.url = Common.baseUrl.host + '/match/detail';
		},
		tabClick(s){
			if(s == 'art'){
				this.url = Common.baseUrl.host + '/match/detail';
				this.isart = true;
				this.show = false;
				if(this.articleList.length>0){
					return;
				}
				this.getData();
			}else{
				this.url = Common.baseUrl.host + '/match/odds';
				this.isart = false;
				this.show = true;
				if(this.oddsData.length>0){
					return;
				}
				this.getData();	
			}
		},
		getData(){
			this.$nextTick(function(){
				this.$http.jsonp(
					this.url,
					{
						params: {
							language: 'M',
							matchId: this.$router.currentRoute.query.id,
							articleId: this.start_articleid,
							sportType: this.sportType,
							scoutMatchId: this.scoutMatchId,
							lotteryEntryId: this.$router.currentRoute.query.entryId
						}
					}
				).then(function(res){				
					if(this.url.indexOf('odds')>0){
						if(res.data.code == '0000'){
							this.oddsData = res.data.data
							if(this.sportType == 0){
								this.AsianOdds = res.data.data.fbAsianOdds;
								this.EuropeOdds = res.data.data.fbEuropeOdds;
								this.SizeOdds = res.data.data.fbSizeOdds;
							}else{
								this.AsianOdds = res.data.data.bbAsianOdds;
								this.EuropeOdds = res.data.data.bbEuropeOdds;
								this.SizeOdds = res.data.data.bbSizeOdds;
							}
												
						}else{
							this.oddsData = [];
						}
						
					}else{
						this.matchMsg = res.data.match;
						this.matchScore = JSON.parse(res.data.matchScore);
						this.articleList = res.data.Articles;
						this.sportType = res.data.sportType;
						this.scoutMatchId = res.data.scoutMatchId;
					}
					console.log(this.matchScore);
					layer.close(this.loding);			
				})
			})
		},
		goarticle(item){
			console.log(item)
			this.$router.push({
			  path: `/articledetail/?id=${item.id}`
			})
		},
		back(){
			this.$router.back();
		}
	},
	components: {
		Scroll,articleList
	},
	watch: {
		
	}
}
</script>
<style type="text/css" lang="less">
@import '../../common/less/base.less';
.matchdetail{
	width:100%;
	height:100%;
	background:@backcolor;
	.back{
	    width:50px;
	    height:100%;
	    position:absolute;
	    left:15px;
	    height:50px;
	    background:url('../../common/img/wback.png') no-repeat left center;
	    color:transparent;
	    background-size:8px 17px;
	    z-index:999;
	}
	.match-tab{
		width:100%;
		height:44px;
		background:@whites;
		border-bottom:1px solid @bordercolor;
		display:flex;
		justify-content:space-around;
		line-height:44px;
		text-align:center;
		span{
			width:25%;
			font-size:@mainsize;
			border-bottom:3px solid transparent;
		}
		.auton{
			color:@reds;
			border-color:@reds;
		}
	}
	.match_info{
		width:100%;
		height:110px;
		background-image: url('../../common/img/matchc.png');
		background-repeat: no-repeat;
		background-size: cover;
		padding:0 15px;
		.matchdetail_head{
			height:50px;
			line-height:50px;
			font-size:0.12rem;
			color:@whites;
			text-align:center;
		}
		.match_team_msg{
			text-align:center;
			font-size:@mainsize;
			color:@whites;
			h3{
				font-weight:400;
			}
		}
	}
	.future_match{
		background-image: url('../../common/img/matcha.png');
	}
	.over_match{
		background-image: url('../../common/img/matchb.png');
	}
	.match-detail-wrap{
		position:absolute;
		top:154px;
		bottom:0;
		width:200%;
		.matchdetail-list{
			width:50%;
			position:absolute;
			bottom:0;
			top:0;
			overflow:hidden;
		}
		.odds_wrap{
			width:50%;
			position:absolute;
			bottom:0;
			top:0;
			left:50%;
			overflow-y:scroll;
			font-size:@mainsize;
			color:@maincolor;
			background:@whites;
			padding-bottom:30px;
			ul{
				width:90%;
				margin-left:5%;
				margin-top:20px;
				border:1px solid @bordercolor;
				li{
					height:35px;
					line-height:35px;
					border-bottom:1px solid @bordercolor;
					display:flex;
					text-align:center;
					&:last-child{
						border:none;
					}
					span{
						border-right:1px solid @bordercolor;
						flex-grow:1;
						&:last-child{
							border:none;
						}
					}
				}
			}
		}
	}
	.roomActive{
		transform:translateX(-50%);
		transition: all 0.6s ease;
	}
	.roomLeave{
		transform:translateX(0);
		transition: all 0.6s ease;
	}
}
</style>