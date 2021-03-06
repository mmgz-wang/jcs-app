module.exports = {
  fontSizeRem: function () {
    /*
         *大字体小字体
         */
    function o() {
      if (document.documentElement.clientWidth > 380) {
        document.documentElement.style.fontSize = /*(document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth) / 3.2*/110 + "px";
      } else {
        document.documentElement.style.fontSize = /*(document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth) / 3.2*/100 + "px";
      }
    }

    var e = null;
    window.addEventListener("resize", function () {
      clearTimeout(e), e = setTimeout(o, 300)
    }, !1), o();
  },
  baseURI: function () {
    //打包===生产环境,!==测试环境   //开发 ===代表测试环境,!==代表生产环境
    if (process.env.NODE_ENV !== "development") {
      console.log('测试',process.env.NODE_ENV)
      return {
        // jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html_test",   //不可用
        // host: "http://182.18.76.156:9095/",   不可用
        // 测试host
        nativeHost: 'http://apm.jingcaishuo.net',
        // ioUrl: 'http://182.18.76.155:8080/', //图片
        // roomMsgurls: 'http://182.18.76.155:8822',
        // matchListversion: '1.1.5',
        // 测试H5host
        host: "http://jnv.jingcaishuo.net/", //不可用
        // host: "http://10.8.0.10:9095", //不可用
        ioUrl: 'https:/tchat.jingcaishuo.com/',
        roomMsgurls: 'https://tchat.jingcaishuo.com/'


        // host  返回请求失败弹窗


        // h5_api 9095   jnv.jingcaishuo.net
        // host  9093    apm.jingcaishuo.net
        // push 9999
        // schedule 9600 9997   qa-schedule.jingcaishuo.com
        // ums 18080
        // guess_oms 8098   qa-guess-manager.jingcaishuo.com
        // tms 8779   qa-tms.jingcaishuo.net
        // chat  9292 8080  tchat.jingcaishuo.com
      }
    } else {
      console.log('线上',process.env.NODE_ENV)
      return {
        // 正式H5host
        host: "https://www.jingcaishuo.com",
        // 正式host
        nativeHost: 'https://api.jingcaishuo.com/',
        jcsurl: "http://www.jingcaishuo.com/mandarin_h5_html/",
        ioUrl: 'https://chat.jingcaishuo.com/',
        roomMsgurls: 'https://chat.jingcaishuo.com/'
      }
    }
  },
  getDeviceinfo: function () {
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

// export default

