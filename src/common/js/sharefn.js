import _MD5 from './md5.js'

export default {
	param: {"SecurityCode":"4c5af59cc6c4b747b052c6df529135c5","UserId":"45237"},
	isEnter: false,
	jsonLog: function (){
		if(getCookie('jsonLog') == 'null' || getCookie('jsonLog') == undefined || getCookie('jsonLog') == null){
			return {"abcde":"","abcd":"",pic:""};
		}else{
		  // return this.param;
			return JSON.parse(getCookie('jsonLog'));
		}
		function getCookie(name){
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
		}
	},
	getUserId: function () {
		return this.jsonLog().abcd;
	},
	getSecurityCode: function () {
		 return _MD5(this.jsonLog().abcd+this.jsonLog().abcde)
	},
	getUserPic: function () {
		return this.jsonLog().pic
	},

	//验证登录
	isLogin:function () {
		//console.log(this.getUserId()+' : '+this.getSecurityCode())
		if('' == this.getUserId() || '' == this.getSecurityCode() || undefined == this.getUserId() || undefined == this.getSecurityCode() || 'undefined' == this.getUserId() || 'undefined' == this.getSecurityCode()) {
			return false;
		} else {
			this.isEnter = true;
			return true;
		}
	},
	setTime: function (s){
		var stim = '';
		if(arguments.length>0){
			if(s.indexOf('+')>0){
				stim = s.split('+')[0].replace(/-/g,'/');
			}else{
				stim = s.replace(/-/g,'/');
			}
		}
		stim = stim.split('.')[0];
		var now = new Date(),
		    nowYear = now.getFullYear(),
			nowMonth = addStr((now.getMonth()+1)),
			nowDate = addStr(now.getDate()),
			nowHours = addStr(now.getHours()),
			nowMinutes = addStr(now.getMinutes()),
			old = new Date(stim),
		    oldYear = old.getFullYear(),
			oldMonth = addStr((old.getMonth()+1)),
			oldDate = addStr(old.getDate()),
			oldHours = addStr(old.getHours()),
			oldMinutes = addStr(old.getMinutes());
			function addStr(str){
				return str <= 9 ? '0' + str : str;
			}
		if(arguments.length>0 && arguments[0] != 'send'){
			if(oldDate == nowDate){
				return '今天 '+oldHours+':'+oldMinutes;
			}else if(oldDate+1 == nowDate){
				return '昨天 '+oldHours+':'+oldMinutes;
			}else{
				return oldMonth+'-'+oldDate+' '+oldHours+':'+oldMinutes;
			}
		}else if(arguments[0] == 'send'){
			return nowYear+'/'+nowMonth+'/'+nowDate+' '+nowHours+':'+nowMinutes;
		}else{
			return '今天 '+nowHours+':'+nowMinutes;
		}
	},
	setParms: function (s) {
		var url = location.search;
		console.log(location.search)
		if(url.indexOf('amp;')>-1){
			url = url.replace(/amp;/g,'');
		}
		var parms = {};
		var sarr = url.split('?')[1].split('&');
		for(var i = 0; i<sarr.length; i++){
			sarr[i] = sarr[i].split('=');
		}
		$.each(sarr,function(i,v){
			if(v.length<2){
				parms[v[0]] = '1';
			}else{
				parms[v[0]] = v[1]
			}
		})
		return decodeURI(decodeURI(parms[s]));
	},
	showMeaage: function (msg) {
		layer.open({
			content: msg,
			time: 2,
			skin: 'msg',
			anim: 'scale'
		});
	}
}
