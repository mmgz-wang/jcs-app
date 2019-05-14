<template>
    <div class="preview-img" v-show="active" @click="hide()">
      <img :src="url" :style="setImgstyle" @load="imageLoad" alt="">
    </div>
</template>

<script>
    export default {
        name: 'preview-img',
        data () {
          return {
            active: false,
            url: '',
            setImgstyle: {
              width: 'auto',
              height: 'auto'
            }
          }
        },
        created () {

        },
        computed: {
          deviceW: () => parseInt(document.body.clientWidth * 0.8),
          deviceH: () => parseInt(document.body.clientHeight * 0.9)
        },
        methods: {
          show (url) {
            this.active = true
            this.url = url.indexOf('_s') > 0 ? url.replace('_s', '') : url
          },
          hide(){
            this.active = false
          },
          imageLoad (e) {
            let imgW, imgH
            if (e.path) {
              imgW = e.path[0].width * 0.8
              imgH = e.path[0].height * 0.9
            } else {
              imgW = e.target.width
              imgH = e.target.height
            }
            if (imgW > this.deviceW && imgH < this.deviceH) {
              this.$set(this.setImgstyle, 'width', 'auto')
              this.$set(this.setImgstyle, 'height', '90%')
            } else if (imgW < this.deviceW && imgH > this.deviceH) {
              this.$set(this.setImgstyle, 'width', '80%')
              this.$set(this.setImgstyle, 'height', 'auto')
            } else {
              this.$set(this.setImgstyle, 'width', this.deviceW + 'px')
              this.$set(this.setImgstyle, 'height', 'auto')
            }
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
        z-index: 100;
        img{
          width: auto;
          height: auto;
          position: absolute;
          left:50%;
          top:50%;
          transform: translate3d(-50%,-50%,0);
        }
    }
</style>
