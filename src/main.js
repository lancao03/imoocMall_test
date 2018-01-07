// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import { sum, minus } from './util'
import * as util from './util'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
	loading:"/static/loading-svg/loading-bars.svg"
})

Vue.config.productionTip = false

//console.log(`sum:${sum(1,6)}`)
//console.log(`minus:${minus(10,2)}`)

console.log(`sum:${util.sum(1,6)}`)
console.log(`minus:${util.minus(10,2)}`)

/* eslint-disable no-new */
new Vue({
	//	el: '#app',
	router,
	//	template: '<App/>',
	//	components: {
	//		App
	//	}
	//	render: h => h(App)
	render: function(h) {
		return h(App)
	}
}).$mount('#app')