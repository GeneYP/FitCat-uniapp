<template>
	<view>
		<u-sticky>
			<!-- 导航栏 -->
			<uni-nav-bar :fixed="false" color="#333333" background-color="#FFFFFF">
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
					<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"/>
				</view>
			</uni-nav-bar>
		</u-sticky>
		<!-- 卡的列表 -->
		<u-empty v-if="cardList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="home-root" v-for="(food, foodIndex) in foodList" :key="foodIndex">
			<view class="home-food" @click="showDetail(foodIndex)">
				<view class="home-food__pic">
					<image class="food-pic" :src="food.image"></image>
				</view>
				<view class="home-food__content">
					<text class="food-name">{{food.name}}</text>
					<view class="food-info">
						<text class="food-info__level">
							过期时间：{{food.time}}
						</text>
						<text class="food-info__level" v-if="food.isExp == 1">
							（已过期）
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				foodList: []
			}
		},
		methods: {
			showDetail(id){
				// console.log('打印', this.foodList[id].name)
				uni.navigateTo({
					url: '../../pages/gymDetail/gymDetail?gymId=' + this.foodList[id].gymId
				})
			},
			loadCard() {
				this.foodList = [];
				console.log("会员卡加载中……");
				var userId = uni.getStorageSync("userId");
				this.$request.request({
					url: 'user/card/' + userId,
					method: 'GET',
				}).then(res => {
					var res1 = res;
					for (let i = 0; i < res.data.length; i++) {
						// console.log("------data------", expireTime);
						this.$request.request({
							url: 'gym/detail/' + res1.data[i].gymId,
							method: 'GET',
						}).then(res => {
							console.log(res.data)
							var expireTime = res1.data[i].expire.substr(0, 10);
							var gymName = res.data.gymName;
							var gymImg = res.data.pic;
							let today = new Date();
							let cardTime = new Date(expireTime);
							console.log(cardTime)
							var isExpire = 0;
							if (cardTime <= today) {
								isExpire = 1;
								// console.log('过期了')
							}
							this.foodList.push({
								id: res1.data[i].id,
								name: gymName,
								image: gymImg,
								time: expireTime,
								isExp: isExpire,
								gymId: res1.data[i].gymId
							})
						})
					};
				})
			},
		},
		onShow() {
			this.loadCard();
			console.log(this.foodList)
		}
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

	.home-food {
		height: 260rpx;
		background-color: #000000;
		border-radius: 20rpx;
		width: 94%;
		margin: 28rpx 3%;
		-moz-box-shadow: 0px 0px 3px #b3b3b3;
		-webkit-box-shadow: 0px 0px 3px #b3b3b3;
		box-shadow: 0px 0px 3px #b3b3b3;

		&__pic {
			z-index: 10;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			position: relative;
			overflow: hidden;
			border-radius: 20rpx;
			opacity: 0.6;
		}

		&__content {
			position: absolute;
			z-index: 12;
			top: 30%;
			left: 60rpx;

		}
	}

	.food-pic {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		/* 图片原宽高去缩放，选择宽高缩放比中较大的一个 */
		/* 如这里图片原宽高是 496*640, 宽缩放比=100/496,高缩放比=100/640,则较大的为100/496~0.2 */
		transform: scale(1.2) translate(-50%, -50%);
	}

	.food-name {
		font-size: 42rpx;
		color: #FFFFFF;
		font-weight: 700;
		width: 420rpx;
		// background-color: red;
		/* 超过一行用点显示 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.food-info {
		display: flex;
		margin-top: 10rpx;

		&__level {
			font-size: 30rpx;
			font-weight: 500;
			white-space: nowrap;
			color: #FFFFFF;
			padding-right: 12rpx;
		}

		&__text {
			font-size: 30rpx;
			font-weight: 400;
			white-space: nowrap;
			color: #cccccc;
			padding-right: 12rpx;
		}
	}
</style>
