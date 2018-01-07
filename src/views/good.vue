<template>
	<div>
		商品页面{{$route.params.goodId}} {{$route.params.username}}
		<!--<router-link to="/good/detail">detail</router-link>
		<router-link to="/good/image">image</router-link>-->
		<counter></counter>
		<router-view></router-view>
		<router-link :to="{name:'cart',params:{id:123 },query:{ab:21}}">跳转到购物车</router-link>
		<router-link :to="{ name: 'cart', params: { id: 123 }}">User</router-link>
		<!--<button @click="goCart">button 跳转到购物车</button>-->
	</div>
</template>

<script>
	import counter from '@/components/counter'
	export default {
		components: {
			counter
		},
		data() {
			return {

			}
		},
		methods: {
			goCart() {
				//				this.$router.push('/cart')
				//				this.$router.push({path:'/cart?id=123'})
				//				this.$router.go(-1)
			}
		}
	}
</script>

<style>

</style>