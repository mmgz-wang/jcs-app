<template>
    <div class="preview-img" @click="hide()">
      <img :src="imgurl" alt="">
    </div>
</template>

<script>
    export default {
        name: "preview-img",
        props: {
          imgurl: {
            type: String,
            default: require('../../common/img/load.png')
          }
        },
        methods: {
          hide(){
            this.$emit('previewHide')
          }
        }
    }
</script>

<style lang="less" type="text/less">
    .preview-img {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        text-align: center;
        img{
            max-width: 90%;
            max-height: 100%;
            position: absolute;
          left:50%;
          top:50%;
          transform: translate3d(-50%,-50%,0);
        }
    }
</style>
