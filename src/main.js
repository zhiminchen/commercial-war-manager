// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/csss/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import Store from './components/store/Store.vue'

import md5 from "js-md5";
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$md5 = md5;
Vue.prototype.$story = Store
Vue.prototype.$qs = qs

axios.defaults.baseURL = 'http://localhost:8082'
// axios.defaults.baseURL = 'http://106.52.17.243:8082'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
