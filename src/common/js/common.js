
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
  baseURI: function () {
    if(process.env.NODE_ENV != "development"){
      return {
        // jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html_test",
        // host: "http://182.18.76.156:9095/",
        // nativeHost: 'http://apm.jingcaishuo.net',
        // ioUrl: 'http://182.18.76.155:8080/',
        // roomMsgurls: 'http://182.18.76.155:8822',
        // matchListversion: '1.1.5',
        host: "http://jnv.jingcaishuo.net/",
        ioUrl: 'https://tchat.jingcaishuo.com/',
        roomMsgurls: 'https://tchat.jingcaishuo.com/'
      }
    }else{
      return {
        host: "https://www.jingcaishuo.com",
        nativeHost: 'https:api.jingcaishuo.com/',
        jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html/",
        ioUrl: 'https://chat.jingcaishuo.com/',
        roomMsgurls: 'https://chat.jingcaishuo.com/'
      }
    }
  },
  getDeviceinfo: function() {
    var device_type = 'other';
    var system_version = null;
    var app = null;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/iphone/i) == "iphone" || ua.match(/ipad/i) == "ipad") {
      device_type = 'ios';

      system_version = 10;

      if (ua.match(/iPhone OS 4/i) == "iPhone OS 4") {
        system_version = 4;
      } else if (ua.match(/iPhone OS 5/i) == "iPhone OS 5" || ua.match(/ipad; cpu os 5/i) == "ipad; cpu os 5") {
        system_version = 5;
      } else if (ua.match(/iPhone OS 6/i) == "iPhone OS 6" || ua.match(/ipad; cpu os 6/i) == "ipad; cpu os 6") {
        system_version = 6;
      } else if (ua.match(/iPhone OS 7/i) == "iPhone OS 7" || ua.match(/ipad; cpu os 7/i) == "ipad; cpu os 7") {
        system_version = 7;
      } else if (ua.match(/iPhone OS 8/i) == "iPhone OS 8" || ua.match(/ipad; cpu os 8/i) == "ipad; cpu os 8") {
        system_version = 8;
      } else if (ua.match(/iPhone OS 9/i) == "iPhone OS 9" || ua.match(/ipad; cpu os 9/i) == "ipad; cpu os 9") {
        system_version = 9;
      } else {

      }

    } else if (ua.match(/android/i) == "android") {
      device_type = 'android';
    } else {
      device_type = 'pc';
    }

    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      app = "weixin";
    } else if (ua.match(/Weibo/i) == "weibo") {
      app = "weibo";
    } else if (ua.match(/\sQQ/i) == " qq") {
      app = "qq";
    }

    return {
      'type': device_type,
      'ver': system_version,
      'app': app
    }
  }

}



