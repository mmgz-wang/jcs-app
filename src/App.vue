<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <menus></menus>
  </div>
</template>

<script>
import menus from './components/menu/menu'
  export default {
    name: 'app',
    data(){
      return {

      }
    },
    components: {
    	menus
    },
    mounted(){
    //this.$ajax.get('http:www.jingcaishuo.com/article/detail',{});
    //  console.log(this.$axios)
    }
  }
</script>

<style lang="less" type="text/less">
@import "./common/less/base.less";
*{
  margin:0;
  padding:0;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  -webkit-tap-highlight-color: transparent;
}
html,body{
  width:100%;
  height:100%;
  max-width: 800px;
  background:@backcolor;
  list-style:none;
  margin:0 auto;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  width:100%;
  height:100%;
  overflow:hidden;
  position: relative;
}
</style>
