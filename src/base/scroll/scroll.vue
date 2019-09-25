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
        threshold: 50,
        stop: 20
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
      },
      mouseWheel : {
        type: Boolean,
        default:false
      },
      autoBlur:{
        type: Boolean,
        default:true
      },
      istrue :{
        type: Boolean,
        default:true
      },
      isback: {
        type: Boolean,
        default:true
      }
    },
    data(){
      return {
        isPullingDown: false,
        isPullUpLoad: false,
        scroll: null,
        eheight:0
      }
    },
    mounted() {
      this.initScroll();
      // this.refresh();
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
          mouseWheel: false,
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
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        // console.log(this.scroll)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      pullingDown(){
        this.scroll.on('pullingDown',() => {
          this.isPullingDown = true;
          this.pullingDownFn(this);
        })
      },
      pullingUp () {
        this.scroll.on('pullingUp',() => {
          this.isPullUpLoad = true
          this.pullingUpFn(this);
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.refresh()
        })  
      }

    },
    watch: {
      data: {
        handler: function () {
          let that = this;
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
          }, 200)
        },
        deep: true
      },
      istrue: {
        handler : function(){
          if(this.istrue == false){
            this.eheight = this.scroll.y
            // console.log(this.scroll.y)
            this.scroll.scrollTo(0,0,10)
            this.istrue = true
            this.refresh()
          }
        }
      },
      isback: {
        handler: function(){
          if(this.isback == false){
            this.scroll.scrollTo(0,this.eheight,10)
            this.eheight = 0;
            this.isback = true
            console.log(this.scroll.y)    
            this.refresh()        
          }
        }
      },
      $route: {
        handler: function () {
          // this.refresh();
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
