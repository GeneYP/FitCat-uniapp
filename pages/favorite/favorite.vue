<template>
	<view>
		<u-sticky>
			<!-- 导航栏 -->
			<uni-nav-bar :fixed="false" color="#333333" background-color="#FFFFFF">
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
					<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词" />
				</view>
			</uni-nav-bar>
		</u-sticky>
		<!-- 收藏 -->
		<!-- 健身房列表 -->
		<view class="home-root" v-for="(gym, gymIndex) in gymList" :key="gymIndex">
			<view class="home-gym">
				<view class="home-gym__content" @longpress="longtapList(gymIndex)" @click="navToDetail(gym.id)">
					<view class="home-gym__content__pic">
						<image class="gym-pic" :src="gym.url"></image>
					</view>
					<view class="home-gym__content__text">
						<text class="gym-name">{{gym.name}}</text>
						<view class="gym-info">
							<text class="gym-info__rate">{{gym.rating}}</text>
							<text
								class="gym-info__eval">{{gym.rating >= 4.3 ? '超棒' : gym.rating >= 4.0 ? '很好' : ''}}</text>
							<!-- <view class="gym-rating__rate">
								<u-rate :value="gym.rating" :activeColor="gym.rating>3.0 ? '#FA3534' : '#FFCC33'"
									allowHalf readonly size="40rpx"></u-rate>
							</view> -->
							<text class="gym-info__member" v-if="gym.member != 0">{{gym.member}}会员</text>
							<text class="gym-info__member" v-if="gym.rating == 0.00">暂无评分</text>
						</view>
						<view class="gym-detail">
							<text class="gym-detail__distance">
								距您{{gym.distance}}
								<text class="gym-detail__cost" v-if="gym.cost != null">
									人均消费 ¥{{gym.cost}}
								</text>
							</text>
							<text class="gym-detail__time">营业时间：{{gym.time == '' ? '到店咨询' : gym.time}}</text>
							<view class="gym-detail__taglist">
								<view class="gym-detail__tag" v-for="(tag, tagIdx) in gym.tag" v-if="tagIdx < 3"
									:key="tagIdx">
									<u-tag :text="gym.tag[tagIdx]"
										:type="gym.tag[tagIdx]=='自由搏击'? 'warning' : gym.tag[tagIdx]=='瑜伽' ? 'error' : gym.tag[tagIdx]=='长跑' ? 'primary' : gym.tag[tagIdx]=='单车' ? 'success' : 'warning'"
										size="mini" plain plainFill></u-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 长按遮罩层 -->
			<view class="gym-mask" v-if="maskFlag == gymIndex" @click="maskFlag=-1">
				<button class="gym-mask__hate" @click="clickHate(gymIndex, gymList[gymIndex].colId)">
					<u-icon name="trash-fill" color="#0f80ff" size="30"></u-icon>
				</button>
				<!-- <button class="gym-mask__love" @click="clickLove(gymIndex)">
					<u-icon name="heart-fill" color="#ff5757" size="32"></u-icon>
				</button> -->
			</view>
		</view>
		<!-- 筛选 -->
		<!-- 健身房列表 -->
	</view>
</template>

<script>
	export default {
		name: "favorite",
		data() {
			return {
				maskFlag: -1,
				gymList: [],
			}
		},
		methods: {
			navToDetail(id) {
				uni.navigateTo({
					url: '../../pages/gymDetail/gymDetail?gymId=' + id
				})
			},
			loadGym(resource) {
				// console.log("加载收藏夹ing：", resource);
				// this.status = 'loading';
				// console.log('rec.loadmore被调用');
				let userId = uni.getStorageSync("userId");
				// const selectCity = uni.getStorageSync('selectCity');
				// console.log('wwwww222', selectCity.substr(0, 2));
				this.$request.request({
					url: 'user/collection/' + userId,
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					for (let i = 0; i < res.data.length; i++) {
						// 获取tag
						this.$request.request({
							url: 'gym/detail/' + res1.data[i].gymId,
							method: 'GET',
						}).then(res => {
							console.log(res1.data)
							var lati = uni.getStorageSync('lati');
							var longti = uni.getStorageSync('longti');
							var distFromThis = this.getDistance(lati, longti, res.data.lat, res.data.lng);
							// var gymTag = new Array(2);
							// for (let i = 0; i < res.data.length; i++) {
							// 	gymTag[i] = res.data[i].title;
							// };
							this.gymList.push({
								id: res.data.gymId,
								name: res.data.gymName,
								rating: Number(res.data.stars).toFixed(1),
								member: 0,
								distance: distFromThis,
								url: res.data.pic,
								cost: res.data.price,
								time: '9:00-23:00',
								// tag: gymTag
							});
						});
					}
					// console.log("------data------", res.data);
				})
			},
			reloadGym(resource) {
				this.gymList = [];
				// console.log("加载收藏夹ing：", resource);
				// this.status = 'loading';
				// console.log('rec.loadmore被调用');
				let userId = uni.getStorageSync("userId");
				// const selectCity = uni.getStorageSync('selectCity');
				// console.log('wwwww222', selectCity.substr(0, 2));
				this.$request.request({
					url: 'user/collection/' + userId,
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					for (let i = 0; i < res.data.length; i++) {
						// 获取tag
						this.$request.request({
							url: 'gym/detail/' + res1.data[i].gymId,
							method: 'GET',
						}).then(res => {
							console.log(res1.data)
							var lati = uni.getStorageSync('lati');
							var longti = uni.getStorageSync('longti');
							var distFromThis = this.getDistance(lati, longti, res.data.lat, res.data.lng);
							// var gymTag = new Array(2);
							// for (let i = 0; i < res.data.length; i++) {
							// 	gymTag[i] = res.data[i].title;
							// };
							this.gymList.push({
								id: res.data.gymId,
								name: res.data.gymName,
								rating: Number(res.data.stars).toFixed(1),
								member: 0,
								distance: distFromThis,
								url: res.data.pic,
								cost: res.data.price,
								time: '9:00-23:00',
								// tag: gymTag
								colId: res1.data[i].id
							});
						});
					}
					// console.log("------data------", res.data);
				})
			},
			// 已经封装好的函数（公共的）
			// 计算距离函数
			Rad(d) {
				//根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			getDistance(lat1, lng1, lat2, lng2) {
				// lat1用户的纬度
				// lng1用户的经度
				// lat2商家的纬度
				// lng2商家的经度
				var radLat1 = this.Rad(lat1);
				var radLat2 = this.Rad(lat2);
				var a = radLat1 - radLat2;
				var b = this.Rad(lng1) - this.Rad(lng2);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math
					.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				s = s.toFixed(1) + 'km' //保留两位小数
				// console.log('经纬度计算的距离:' + s)
				return s
			},
			longtapList(index) {
				this.maskFlag = index;
				console.log("长按了第个健身房：", index);
			},
			clickHate(gym,colId) {
				console.log("hate", gym);
				this.gymList.splice(gym, 1);
				
				this.$request.request({
					url: 'user/delCollection/' + colId,
					method: 'GET',
				}).then(res => {
					uni.showToast({
						title: '已删除',
						duration: 1000
					})
				});
			},
		},
		onLoad() {
			// this.loadGym()
		},
		onShow() {
			this.reloadGym()
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
</style>
