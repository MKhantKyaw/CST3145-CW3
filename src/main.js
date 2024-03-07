import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/css/style.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

library.add(faShoppingCart)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
