import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import toast from 'components/common/toast/index.js' //index.js使用export default导出的，所以可以改名字
import Vuelazyload from "vue-lazyload"

Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false
Vue.use(toast) //Vue.use本质是执行toast的install方法来安装这个插件的
Vue.use(Vuelazyload, {   //可以写第二个参数也可以不写
  loading: require('./assets/images/common/placeholder.png')
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app') //$mount('#app')的意思是将Vue实例挂载在组件App的<div id='app'>上面
