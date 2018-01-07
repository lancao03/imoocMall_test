<template>
	<div>
		<button @click="increment">+</button>
		<button @click="decrement">-</button>
		<p><span>{{num}}</span></p>
	</div>
</template>

<script>
	export default {
		props: {
			//			num: {
			//				default: 0
			//			}
		},
		data() {
			return {
				num: 0
			}
		},
		methods: {
			increment() {
				this.num++
				import('./../util')
			},
			decrement() {
				this.num--
			}
		}
	}
</script>

<style>

</style>