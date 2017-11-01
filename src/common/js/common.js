	
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
		jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html",
		ioUrl: 'http://123.206.88.92:9292',
		roomMsgurls: 'http://123.206.88.92:8080'		
	}
}
	
	

	