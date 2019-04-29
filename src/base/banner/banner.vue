<template>
  <div id="banner" v-if="bannerData.length>0">
    <swiper  :options="bannerData.length>1 ? swiperOption : swiperOption2"  ref="mySwiper">
        <swiper-slide v-for="item in bannerData" :key="item.id">
            <img @click="bannerClick(item)" :src="item.img_url">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
require('swiper/dist/css/swiper.css')
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    props: {
      bannerData: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            baseUrl:'http://www.jingcaishuo.com/',
            swiperOption: {
                autoplay: 3000,
                loop : true,
                pagination: '.swiper-pagination',
                autoplayDisableOnInteraction:false
            },
            swiperOption2: {
                autoplay: false,
                loop : false,
                paginationClickable: true
            }
        }
    },
    //定义这个sweiper对象
    computed: {
        swiper() {
          return this.$refs.mySwiper.swiper;
        }
    },
    mounted() {
        //这边就可以使用swiper这个对象
        this.swiper.slideTo(0, 0, true);
    },
    methods: {
        goWhere: function(){

        },
        bannerClick(item){
          console.log(item)
          this.$emit('bannerClick',item);
        }
    },
    watch: {
        banners: {

        },
        $route: {
          handler: function (old,news) {
            console.log('old:'+old.name)
            console.log('news:'+news.name)
            if(old.name == 'Home'){
              //this.$refs.mySwiper.swiper.destroy(true, true)
            }
          },
          deep: true
        }
    }

}
</script>

<style>
.oneban{width:100%;overflow:hidden;font-size:0;}
#banner,.swiper-container,.swiper-container img,.oneban img{width:100%;font-size:0;}

</style>
