<template>
  <div class="ent_nav" id="portals">        
        <dl v-for="item in portals">
            <dt><img :src="baseurl+item.img_url" alt=""></dt>
            <dd>{{item.name}}</dd>
        </dl>
  </div>
</template>

<script>
export default {
	props: ['portals'],
    data() {
        return {
            baseurl: 'http://www.jingcaishuo.com/'
        }
    },
    methods: {

    }
}
</script>

<style lang="less">
@import "../../common/less/base.less";
.ent_nav{color: @blacks;background: @whites;height:0.95rem;display:-webkit-flex;display:flex;
    -webkit-justify-content:space-around;justify-content:space-around;}
.ent_nav dl{float: left;text-align: center;margin-top:0.15rem;font-size: 0.14rem;}
.ent_nav dl dt{margin-bottom: 5px;}
.ent_nav dl img{width: 0.45rem;}

</style>
