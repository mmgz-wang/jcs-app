<template>
	<div id="lackpage">
    	<dl>
       <dt><img :src="src"></dt>
       <dd>
          <h4>{{title}}</h4>
          <p>{{hint}}</p>
          <p class="goenter" @click="goPage()">{{button}}</p>
       </dd> 
      </dl>
	</div>
</template>

<script type="text/ecmascript-6">

export default {
	name: 'lackpage',
  props: {
    src: {
      type: String,
      default: require('../../common/img/unenter.png')
    },
    title: {
      type: String,
      default: '您还没有登录'
    },
    hint: {
      type: String,
      default: '登录后才能使用该功能'
    },
    button:{
      type: String,
      default: '立即登录'
    },
    goCallback: {
      type: Function,
      default() {
        this.$router.push({name: 'enter'});
      }
    }
  },
  data(){
    return {

    }
  },
	methods: {
    goPage(){
      this.goCallback();
    }
    
  }
}
</script>

<style lang="less">
@import "../../common/less/base.less";
#lackpage{
  width:100%;
  position:absolute;
  left:0;
  top:44px;
  bottom:0px;
  color:#c6c6c6;
  background:@backcolor;
  font-size:@mainsize;
  dl{
    width:100%;
    text-align:center;
    margin-top:20%;
    dt{
      img{
        width:115px;
      }
    }
    dd{
      h4{
        color:@assistcolor;
      }
      p{
        font-size:@assistsize;
        line-height:25px;
      }
      .goenter{
        line-height:25px;
        font-size:0.15rem;
        padding:0 8px;
        color:@reds;
        border:1px solid @reds;
        display:inline-block;
        border-radius:3px;
        margin-top:15px;
      }
    }
    

  }
}
</style>