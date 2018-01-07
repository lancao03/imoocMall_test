<template>
	<div>
		<v-header></v-header>
		<v-bread>
		</v-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" @click="sortGoods" class="price" :class="{'sort-up':sortFlag}">Price
						<svg class="icon icon-arrow-short">
							<use xlink:href="#icon-arrow-short"></use>
						</svg>
					</a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd>
								<a href="javascript:void(0)" :class="{'cur':priceChecked==='all'}" @click="setPriceFilter('all')">All</a>
							</dd>
							<dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index) ">
								<a href="javascript:void(0)" :class="{'cur':index===priceChecked}">{{price.startPrice}} - {{price.endPrice}}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="item in goodsList">
									<div class="pic">
										<a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<div v-infinite-scroll="loadMore" infinite-scroll-disable="busy" infinite-scroll-distance="20">
								<img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>

		<v-footer></v-footer>
	</div>
</template>

<script>
	import './../assets/css/base.css'
	import './../assets/css/product.css'
	import vHeader from '@/components/header'
	import vFooter from '@/components/footer'
	import vBread from '@/components/bread'

	import axios from 'axios'
	export default {
		components: {
			vHeader,
			vFooter,
			vBread
		},
		data() {
			return {
				goodsList: [],
				sortFlag: true,
				page: 1,
				pageSize: 8,
				busy: true,
				loading: false,
				priceChecked: 'all',
				filterBy: false,
				overLayFlag: false,
				priceFilter: [{
					startPrice: '0.00',
					endPrice: '500.00'
				}, {
					startPrice: '500.00',
					endPrice: '1000.00'
				}, {
					startPrice: '1000.00',
					endPrice: '1500.00'
				}, {
					startPrice: '1500',
					endPrice: '5000'
				}]
			}
		},
		mounted() {
			this.getGoodList()
		},
		methods: {
			getGoodList(flag) {
				let param = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag ? 1 : -1,
					priceLevel: this.priceChecked
				}
				this.loading = true
				axios.get('/goods', {
						params: param
					})
					.then((response) => {
						let res = response.data
						this.loading = false
						if(res.status === "0") {
							//数据是否需要累加，加载更多的场景
							if(flag) {
								this.goodsList = this.goodsList.concat(res.result.list)
								
								if(this.goodsList.count === 0) {
									//假如没有数据了 就不能再滚动了
									this.busy = true
								} else {
									this.busy = false
								}
							} else {
								this.goodsList = res.result.list
							}
						} else {
							this.goodsList = []
						}
					})
			},
			sortGoods() {
				this.sortFlag = !this.sortFlag
				this.page = 1
				this.getGoodList()
			},
			loadMore() {
				this.busy = true
				setTimeout(() => {
					this.page++;
					this.getGoodList(true)
					this.busy = false
				}, 1000)
			},
			showFilterPop() {
				this.filterBy = true
				this.overLayFlag = true
			},
			setPriceFilter(index) {
				this.priceChecked = index
				this.page = 1
				this.closePop()
				this.getGoodList()
			},
			closePop() {
				this.filterBy = false
				this.overLayFlag = false
			}
		}
	}
</script>
