<template>
  <div id="banner">
    <swiper  :options="data.length>1 ? swiperOption : swiperOption2"  ref="mySwiper">
        <swiper-slide v-for="item in data" :key="item.id">
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
    props: ['data'],
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            baseUrl:'http://www.jingcaishuo.com/',
            swiperOption: {
                autoplay: 1000,
                loop : true,
                notNextTick: true,
                pagination: '.swiper-pagination',
                slidesPerView: 'auto',
                centeredSlides: true,
                paginationClickable: true,
                autoHeight: true,
                spaceBetween: 0,
                autoplayDisableOnInteraction:false,
            },
            swiperOption2: {
                autoplay: false,
                loop : false,
                notNextTick: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 0,
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
        //这边就可以使用swiper这个对象去使用swiper官网中的那些方法
        this.swiper.slideTo(0, 0, true);
    },
    methods: {
        goWhere: function(){

        },
        bannerClick(item){
            this.$emit('bannerClick',item);
        }
    },
    watch:{
        banners: function(){

        }
    }

}
</script>

<style>
.oneban{width:100%;overflow:hidden;font-size:0;}
#banner,.swiper-container,.swiper-container img,.oneban img{width:100%;font-size:0;}

</style>
