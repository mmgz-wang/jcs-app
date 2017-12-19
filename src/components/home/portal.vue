<template>
  <div class="ent_nav" id="portals">        
        <dl v-for="item in portals" v-if="item.name!='筛价格' && item.name!='选低价'" @click="portalClick(item)">
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
        portalClick(item){
            this.$emit('portalClick', item)
        }
    }
}
</script>

<style lang="less">
@import "../../common/less/base.less";
.ent_nav{
    color: @blacks;
    background: @whites;
    display:flex;
    padding:0.15rem 0;
    justify-content:space-around;
    dl{
        text-align: center;
        font-size: 0.13rem;
        dt{
            font-size:0;
            img{
                width: 0.45rem;
            }
        }
        dd{
            padding-top:9px;
            line-height:1;
        }
    }
}
</style>
