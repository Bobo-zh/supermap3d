import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import MapIcon from "./components/MapIcon";
import MapImg from "./components/MapImg";
Vue.component('MapIcon',MapIcon)
Vue.component('MapImg',MapImg)
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
