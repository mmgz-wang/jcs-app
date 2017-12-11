	
module.exports = {
	fontSizeRem: function(){
		/*
		 *大字体小字体
		 */
		function o() {
			if(document.documentElement.clientWidth>380){
				document.documentElement.style.fontSize = /*(document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth) / 3.2*/110 + "px";
			}else{
				document.documentElement.style.fontSize = /*(document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth) / 3.2*/100 + "px";
			}		
		}
		var e = null;
		window.addEventListener("resize", function() {
			clearTimeout(e), e = setTimeout(o, 300)
		}, !1), o();
	},
	baseUrl: {
	 	host: "http://www.jingcaishuo.com",
	 	nativeHost: 'https:api.jingcaishuo.com',
		jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html",
		ioUrl: 'http://123.206.88.92:80',
		roomMsgurls: 'http://123.206.88.92:8080'/*
		jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html_test",
		host: "http://123.57.59.76:9095",
		nativeHost: 'http://apm.jingcaishuo.net',
		ioUrl: 'http://182.18.76.155:8080/',
		roomMsgurls: 'http://182.18.76.155:8822',
		matchListversion: '1.1.5'*/
	}

}
	
	

	