import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// import {
//   api
// } from "./apiByAxios/api.js"
import {
  api
} from './apiDesign/api'
import "./router/permission";
import {
  formatObjKey
} from "./assets/js/common"



//引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
Vue.prototype.$npStart = NProgress.start
Vue.prototype.$npDone = NProgress.done

router.beforeEach((to, from, next) => {
  // 清空route顶部loading, 避免跳转其它页面时, 前一页面还未载入完全, 造成laoding残留
  NProgress.done()
  next()
})

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$formatObjKey = formatObjKey;

Vue.use(Antd);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");