module.exports = {
	param: {"SecurityCode":"7dd607fad7c3b282965c5b0affbf241b","UserId":"402"},
	isEnter: false,
	getUserToken: function () {
		return this.param;
		return $.parseJSON(app.checkTheLoginState());

	},
	getUserId: function () {
		return this.getUserToken().UserId;
	},
	getSecurityCode: function () {
		return this.getUserToken().SecurityCode;
	},
	goauthor: function (id) {
		if(id != undefined || id != ''){
			app.openAuthor(id);
		}else{
			return;
		}
	},
	//验证登录
	isLogin:function () {
		if('' == this.getUserId() || '' == this.getSecurityCode() || undefined == this.getUserId() || undefined == this.getSecurityCode() || 'undefined' == this.getUserId() || 'undefined' == this.getSecurityCode()) {
			console.log(false)
			return false;
		} else {
			isEnter = true;
			return true;
		}
	},

	setTime: function (s){
		if(arguments.length>0){
			var stim = s.split('+')[0].replace(/-/g,'/');
		}	
		var now = new Date();
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
		if(arguments.length>0){
			if(oldDate == nowDate){
				return '今天 '+oldHours+':'+oldMinutes;
			}else if(oldDate+1 == nowDate){
				return '昨天 '+oldHours+':'+oldMinutes;
			}else{
				return oldMonth+'-'+oldDate+' '+oldHours+':'+oldMinutes;
			}
		}else{
			return '今天 '+nowHours+':'+nowMinutes;
		}
		
	},

	setParms: function (s) {
		var url = location.search;
		console.log(location.href)
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

	customAjax: function (opt){
	    var defaults = {
	        url: "/match/detail",
	        data: {
	            language: 'M',
	            userId: ""
	        },
	        sucFn:function (data){
	            console.log(data)
	        },
	        errFn: function(e){
	            console.log(e);
	        }
	    };
	    var settings = $.extend({},defaults,opt);
	    $.ajax({
	        url: settings.url,
	        type: "get",
	        dataType: "jsonp",
	        jsonp: "callback",
	        async: true,
	        data: settings.data,
	        success: function(data) {
	            settings.sucFn(data);
	        },
	        error: function(data) {
	            settings.errFn(data);
	        }
	    });
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