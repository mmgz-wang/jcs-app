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
    components: {
    	menus
    },
    mounted(){
    //this.$ajax.get('http:www.jingcaishuo.com/article/detail',{});
    //  console.log(this.$axios)
    }
  }
</script>

<style lang="less">
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
  background:@backcolor;
  list-style:none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  width:100%;
  height:100%;
  overflow:hidden;
}
</style>
