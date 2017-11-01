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
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      setTimeout(() => {
        this.initScroll()
      }, 20)
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        if (this.$refs.list && (this.pullDownRefresh || this.pullUpLoad)) {
          this.$refs.list.style.minHeight = getRect(this.$refs.wrapper).height + 'px'
        }

        let options = {
          probeType: this.probeType,
          click: this.click,
        }
        //console.log(options)
        this.scroll = new BScroll(this.$refs.wrapper, options);
        
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
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
          console.log(this.data)
        }, 20)
      }
    }
  }

</script>

<style rel="stylesheet/style">
  
</style>
