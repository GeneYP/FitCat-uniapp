import App from './App'

import favorite from './pages/favorite/favorite.vue'
Vue.component('favorite',favorite)

import home from './pages/home/home.vue'
Vue.component('home',home)

import me from './pages/me/me.vue'
Vue.component('me',me)

import cityselect from './pages/cityselect/cityselect.vue'
Vue.component('cityselect',cityselect)

import fitmap from './components/fitmap.vue'
Vue.component('fitmap',fitmap)

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)