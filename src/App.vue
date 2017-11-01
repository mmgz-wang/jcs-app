<template>
  <div id="app">
    <router-view></router-view>
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
*{margin:0;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box;}
html,body{width:100%;height:100%;background:@backcolor;overflow:hidden;-webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;list-style:none;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;width:100%;height:100%;
}
</style>
