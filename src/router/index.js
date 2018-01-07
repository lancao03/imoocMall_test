import Vue from 'vue'
import Router from 'vue-router'
import goodList from '@/views/GoodList'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
			path: '/',
			name: 'good',
			component:goodList
		}
	]
})