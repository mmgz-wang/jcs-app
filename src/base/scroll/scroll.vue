<template>
  <div ref="wrapper">
    <slot>

    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      probeType: {
        type: Number,
        default: 3
      },
      click: {
        type: Boolean,
        default: true
      },
      scrollIng: {
        type: Function,
        default: null
      },
      pullDownRefresh:{
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      pullingDownFn: {
        type: Function,
        default: null
      },
      pullingUpFn: {
        type: Function,
        default: null
      },
      needRefresh: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        isPullingDown: false,
        isPullUpLoad: false,
        scroll: null
      }
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      initScroll() {
        var that = this;
        if (!this.$refs.wrapper) {
          return
        }
        if (this.$refs.list && (this.pullDownRefresh || this.pullUpLoad)) {
          this.$refs.list.style.minHeight = getRect(this.$refs.wrapper).height + 'px'
        }

        let options = {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          mouseWheel: true,
          scrollbar:  {
            fade: false,
            interactive: false
          }
        }
        this.scroll = new BScroll(this.$refs.wrapper, options);
        if(that.scrollIng != undefined){
          this.scroll.on('scroll',function(opt){
            that.scrollIng(opt);
          })
        }
        // if(this.needRefresh){
        //   this.pullingDown();
        // }
        if (this.pullDownRefresh) {
          this.pullingDown()
        }

        if (this.pullUpLoad) {
          this.pullingUp()
        }

      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        console.log(this.scroll.refresh)
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      pullingDown(){
        var that = this;
        this.scroll.on('pullingDown',() => {
          that.isPullingDown = true;
          that.pullingDownFn(that);
          //this.$emit('pullingDown')
        })
      },
      pullingUp () {
        var that = this;
        this.scroll.on('pullingUp',() => {
          this.isPullUpLoad = true
          that.pullingUpFn(that);
          //this.$emit('pullingUp')
        })  
      }

    },
    watch: {
      data: {
        handler: function () {
          var that = this;
          if (this.pullDownRefresh && this.isPullingDown) {
            this.isPullingDown = false
            this.scroll.finishPullDown()
            this.refresh()
          } else if (this.pullUpLoad && this.isPullUpLoad) {
            this.isPullUpLoad = false
            this.scroll.finishPullUp()
            this.refresh()
          } else {
            this.refresh()
          }
          setTimeout(() => {
            that.refresh();
            console.log(999999)
          }, 2000)
        },
        deep: true
      },
      // data: {
      //   handler: function(){
      //     var that = this;
      //     setTimeout(() => {
      //       that.refresh();
      //       that.scroll.finishPullDown();
      //       that.scroll.finishPullUp();
      //     }, 20)
      //   },
      //   deep: true
      // },
      $route: {
        handler: function () {
          //this.refresh();
          // console.log(this.$route)
        }
      }
    }
  }

</script>

<style rel="stylesheet/style">
  .bscroll-indicator{
    background: #eeeeee !important;
  }
</style>
