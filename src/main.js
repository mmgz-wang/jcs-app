// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import vueSwiper from 'vue-awesome-swiper'
import VueLazyLoad from 'vue-lazyload'
//import axios from 'axios'
//import VueAxios from 'vue-axios'
//import Axios from './dist/config'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
Vue.use(VueLazyLoad,{
	loading: require('common/img/pic.jpg')
})
Vue.use(vueResource);
Vue.use(vueSwiper);
//Vue.use(axios,VueAxios);
//Vue.prototype.$ajax = Axios;
