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
        isPullingDown: false
      }
    },
    mounted() {
      this.initScroll();
      if(this.needRefresh){
        this.pullingDown();
      }
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
        console.log(this.pullUpLoad)
        let options = {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        }
        this.scroll = new BScroll(this.$refs.wrapper, options);
        if(that.scrollIng != undefined){
          this.scroll.on('scroll',function(opt){
            that.scrollIng(opt);
          })
        }
        
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
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
        this.scroll.on('pullingDown',function(){
          this.isPullingDown = true;
          if(this.isPullingDown){            
            console.log('fish')
            that.isPullingDown = false;
            that.pullingDownFn(that);
          }     
        })
        this.scroll.on('pullingUp',function(){
          that.pullingUpFn(that);
        })
      }
      
    },
    watch: {
      data: {
        handler: function(){
          var that = this;
          setTimeout(() => {
            that.refresh();
            that.scroll.finishPullDown();
            that.scroll.finishPullUp();
          }, 20)
        },
        deep: true
       
      }
    }
  }

</script>

<style rel="stylesheet/style">
  
</style>
