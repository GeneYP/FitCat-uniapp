<template>
	<view>
		<u-sticky>
			<!-- 导航栏 -->
			<uni-nav-bar :fixed="false" color="#333333" background-color="#FFFFFF">
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
					<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"
						@confirm="search" />
				</view>
			</uni-nav-bar>
		</u-sticky>
		<u-empty v-if="foodList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="home-root" v-for="(food, foodIndex) in foodList" :key="foodIndex">
			<view class="home-food" @click="addToCart(foodIndex)">
				<view class="home-food__pic">
					<image class="food-pic" :src="food.img"></image>
				</view>
				<view class="home-food__content">
					<text class="food-name">{{food.name}}</text>
					<view class="food-info">
						<text class="food-info__level">
							<!-- {{food.level <= 1 ? '零基础' : food.level < 3 ? '初级' : food.level < 5 ? '中级' : '高级'}} -->
							碳水化物：{{food.sugar}} · 蛋白质：{{food.protein}} · 脂肪：{{food.fat}}
						</text>
						<text class="food-info__text" v-for="(tag, tagIdx) in food.tag" v-if="tagIdx < 3" :key="tagIdx">
							·&nbsp;{{food.tag[tagIdx]}}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "foodList",
		data() {
			return {
				foodList: [{
						name: '高钙低脂奶',
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/168_伊利 高钙低脂.png',
						sugar: 5.2,
						protein: 3.3,
						fat: 3.6,
						weight: 250,
					},
					{
						name: '巴氏鲜牛奶',
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/160_光明 优倍 高品质鲜牛奶巴氏杀菌乳946ml.png',
						sugar: 4.7,
						protein: 3.8,
						fat: 3.2,
						weight: 250,
					},
					{
						name: '奶酪',
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/157_奶酪.png',
						sugar: 3.3,
						protein: 25.5,
						fat: 27.8,
						weight: 250,
					},
					{
						name: '酸奶',
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/159_酸奶(调味).png',
						sugar: 9.5,
						protein: 2.1,
						fat: 1.9,
						weight: 250,
					},
					{
						name: '纯牛奶',
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/155_光明 纯牛奶.png',
						sugar: 105,
						protein: 89,
						fat: 12,
						weight: 250,
					},
				],
				cart: []
			};
		},
		methods: {
			loadFood(resource) {
				console.log("食物加载中：", resource);
				this.$request.request({
					url: '/food/list?current=1&size=10',
					method: 'GET',
				}).then(res => {
					this.foodList = res.data.records;
					// console.log("------data------", res.data);
				})
			},
			addToCart(id) {
				this.cart.push({
					id: id,
					name: this.foodList[id].name,
					sugar: this.foodList[id].sugar,
					protein: this.foodList[id].protein,
					fat: this.foodList[id].fat,
					img: this.foodList[id].img
				}),
				uni.showToast({
					title: '已添加：' + this.foodList[id].name,
					duration: 2000
				})
			},
			getCart(){
				if(this.cart.length != 0){
					return this.cart;
				} else {
					return;
				}
			},
			search(e) {
				console.log(e.target.value);
				this.$request.request({
					url: '/food/name/' + e.target.value,
					method: 'GET',
				}).then(res => {
					this.foodList = res.data;
					// console.log("------data------", res.data);
				})
			}
		},
		created() {
			//抓取活动
			this.loadFood()
			console.log('展示了个寂寞？');
			// 返回用户的是不是新手、过重还是过轻、年龄等信息，接收计划类型
		},
	}
</script>

<style lang="scss">
	$nav-height: 30px;

	.uni-nav-bar-text {
		white-space: nowrap;
		font-size: 28rpx;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 600rpx;
		flex: 1;
		background-color: #f8f8f8;
		height: $nav-height;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		margin-left: 24rpx;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.nav-bar-input {
		height: $nav-height;
		line-height: $nav-height;
		/* #ifdef APP-PLUS-NVUE */
		width: 100%;
		/* #endif */
		width: 100%;
		padding: 0 5px;
		font-size: 14px;
		background-color: #f8f8f8;
	}
</style>
