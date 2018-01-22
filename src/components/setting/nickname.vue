<template>
    <div class="nickname">
      <main-header :headerData="headerData"></main-header>
      <div class="main">
        <p class="input">
          <span>昵称</span>
          <input type="text" v-model="val" placeholder="2-8个汉字，英文，数字昵称" name="name">
        </p>
        <p class="hint" :class="{unhint:isHintShow}">{{hintText}}</p>
        <button type="button" :class="{unbtn:val.length<=0}" @click="submitFn()">确定</button>
      </div>
      <div class="mask" v-show="maskShow">
        <div class="dialog">
          <p tit>
            昵称设定后将<span>无法更改</span><br>是否使用以下昵称
          </p>
          <p name>
            {{val}}
          </p>
          <p btn>
            <span no @click="cancle()">取消</span>
            <span yes @click="agree()">确认</span>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
  import mainHeader from 'base/header/mainheader'
  import Common from 'common/js/common'
  export default {
    name: "nickname",
    data(){
      return {
        headerData: {
          ele: '设置昵称',
          name: 'nickName'
        },
        val: '',
        hintText: '昵称最长为8个字',
        isHintShow: false,
        maskShow: false
      }
    },
    created(){

    },
    methods: {
      submitFn(){
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
          regEmoji = /\%uD.{3}/g,
          regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if(regEmoji.test(escape(this.val))){
          this.hintText = '昵称不可包含表情符号';
          this.isHintShow = true;
          return ;
        }
        if(this.val.length>8){
          this.isHintShow = true;
          return ;
        }else if(this.val.length<2){
          this.hintText = '昵称最短为2个字';
          this.isHintShow = true;
          return ;
        }else{
          this.isHintShow = false;
        }
        if(regEn.test(this.val) || regCn.test(this.val)) {
          this.hintText = '名称不能包含特殊字符';
          this.isHintShow = true;
          return false;
        }
        this.maskShow = true;
      },
      cancle(){
        this.maskShow = false;
      },
      agree(){
        var that = this;
        this.$http.post(
          Common.baseURI().host + '/user/info/updateNickName',
          {
            "nickName": this.val,
            "userId": this.shareFn.getUserId(),
            "token": this.shareFn.getSecurityCode()
          },
          {
            headers: {"X-Target":"TrentService.Register"}
          }
        ).then(function(res){
          if(res.data.code == '0000'){
            this.bunceIn(res.data.msg);
            setTimeout(function () {
              that.$emit('nickBack')
              that.$router.back();
            },1000)
          }
          this.bunceIn(res.data.msg);
        },function(){
          console.log('请求失败请检查网络')
        })
      },
      bunceIn(s){
        layer.open({
          content: s,
          time: 2,
          skin: 'msg'
        })
      }
    },
    components: {
      mainHeader
    }
  }
</script>

<style lang="less">
  @import '../../common/less/base.less';
  .nickname {
    width:100%;
    position:absolute;
    left:0;
    top:0px;
    bottom:0px;
    right:0;
    background: @backcolor;
    color: @whites;
    z-index:9999;
    .main {
      width: 100%;
      padding-left: 15px;
      font-size: 0;
      p {
        line-height: 50px;
      }
      .unhint{
        opacity: 1;
      }
    }
    .input{
      position: relative;
      height: 50px;
      line-height: 50px;
      font-size: 0;
      display: flex;
      &:after{
        height: 1px;
        content: '';
        width: 100%;
        border-top: 1px solid @bordercolor;
        position: absolute;
        bottom: -1px;
        right: 0;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
        z-index: 10;
      }
      span{
        color: @maincolor;
        font-size: 0.15rem;
        line-height: 50px;
        padding-right: 20px;
      }
      input{
        flex-grow: 1;
        outline: none;
        border: none;
        height: 100%;
        color: @maincolor;
        background: transparent;
        line-height: 50px;
        font-size: 15px;
        padding-left: 5px;

      }
    }

    input::-webkit-input-placeholder { /* WebKit browsers */
      color:@assistcolor;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:@assistcolor;
    }

    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:@assistcolor;
    }

    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color:@assistcolor;
    }
    .hint{
      font-size: 11px;
      color: #ff4444;
      opacity: 0;
    }
    button{
      width: 80%;
      height: 39px;
      color: @whites;
      line-height: 39px;
      background: @reds;
      font-size: 17px;
      text-align: center;
      outline: none;
      border: none;
      border-radius: 2px;
      margin-left: 10%;
      transform: translateX(-8px);
    }
    .unbtn{
      opacity: 0.4;
    }
    .mask{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999999;
    }
    .zoomIn{
      -webkit-animation-name: zoomIn;
      animation-name: zoomIn;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
    @keyframes zoomIn {
      0% {
        opacity: 0;
        -webkit-transform: scale3d(.3,.3,.3);
        transform: scale3d(.3,.3,.3);
      }
      50% {
        opacity: 1;
      }
    }
    .dialog{
      width: 80%;
      position: absolute;
      left: 10%;
      top:150px;
      background: #e7e7e7;
      border-radius: 5px;
    }
    p[tit]{
      padding: 25px 0;
      text-align: center;
      font-size: 15px;
      color: #202020;
    }
    p[tit] span{
      font-weight: 600;
    }
    p[name]{
      padding-bottom: 35px;
      font-size: 17px;
      color: #666666;
      text-align: center;
    }
    p[btn]{
      height: 40px;
      line-height: 40px;
      position: relative;
    }
    p[btn]:before{
      content: '';
      height: 1px;
      border-top: 1px solid #cfcfcf;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    p[btn] span{
      width: 50%;
      font-size: 15px;
      display: inline-block;
      text-align: center;
      float: left;
    }
    p[btn] span[no]{
      color: #666666;
    }
    p[btn] span[yes]{
      color: #1da479;
      position: relative;
    }
    p[btn] span[yes]:before{
      content: '';
      width: 1px;
      border-left: 1px solid #cfcfcf;
      position: absolute;
      left: -1px;
      top: 0;
      bottom: 0;
    }
  }
</style>
