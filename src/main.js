// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/csss/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import Store from './components/store/Store.vue'
import JsonExcel from 'vue-json-excel'

import md5 from "js-md5";
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

Vue.prototype.$md5 = md5;
Vue.prototype.$story = Store
Vue.prototype.$qs = qs
Vue.prototype.$excel = JsonExcel

Vue.component('downloadExcel', JsonExcel)

axios.defaults.baseURL = 'http://localhost:8082'
axios.defaults.withCredentials=true
// axios.defaults.baseURL = 'http://106.52.17.243:8082'  内网
// axios.defaults.baseURL = 'http://159.75.102.218:8082'  外网
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


axios.interceptors.response.use(  response => {
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
} , error => {
  if (error.response.status) {
    // console.log(error.response.status)
    switch (error.response.status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        router.push("/login")
        break;

      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        Message({
          message: '登录过期，请重新登录',
          duration: 1000,
          forbidClick: true,
          type: 'error'
        });
        // 清除token
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        setTimeout(() => {
          router.push("/login")
        }, 1500);
        break;

      // 404请求不存在
      case 404:
        Message({
          message: '网络请求不存在',
          duration: 1500,
          forbidClick: true,
          type: 'error'
        });
        break;
      case 405 :
        Message({
          message: '权限访问错误！',
          duration: 2500,
          forbidClick: true,
          type: 'error'
        });
        router.push("/login")
        break;
      case 406 :
        Message({
          message: '多个账号同时登入！',
          duration: 2500,
          forbidClick: true,
          type: 'error'
        });
        router.push("/login")
        break;
      // 其他错误，直接抛出错误提示
      default:
        Message({
          message: error.response.data.message,
          duration: 1500,
          forbidClick: true
        });
    }
    // return Promise.reject(error.response);
    return Promise.resolve(error.response);
  }})


Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
