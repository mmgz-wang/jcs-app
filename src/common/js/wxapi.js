import {baseURI} from './common'
import axios from 'axios'

const wxApi = {
  //判断是否微信浏览器
  isweixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  },
  wxRegister() {
    if (!this.isweixin()) {
      console.log('不是微信浏览器');
      return
    }
    let url = location.href.split('#')[0];
    axios.post(
      "/weChat/jcsweixin/jsApi/getSignature",
      {url: url}
    ).then(function (res) {
      //  console.log(res);
      let jsApiRes = JSON.parse(res.jsApiGetResponse);
      wx.config({
        debug: false, // 开启调试模式
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: jsApiRes.timestamp, // 必填，生成签名的时间戳
        nonceStr: jsApiRes.noncestr, // 必填，生成签名的随机串
        signature: jsApiRes.signature, // 必填，签名
        jsApiList: [
          'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          'onMenuShareTimeline' // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        ]
      })
    });
    wx.error(function (res) {
      console.log(res);
    });
  },
  //分享给朋友
  ShareAppMessage(option) {
    if (!this.isweixin()) {
      return
    }
    wx.onMenuShareAppMessage({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述
      link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: option.imgUrl, // 分享图标
      success: function () {
        //分享成功
        option.success();
      }
    });
  },
  //分享到朋友圈
  ShareTimeline(option) {
    if (!this.isweixin()) {
      return
    }
    wx.onMenuShareTimeline({
      title: option.title, // 分享标题
      link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: option.imgUrl, // 分享图标
      success: function () {
        //分享成功
        option.success();
      }
    })
  }

};
export default wxApi
