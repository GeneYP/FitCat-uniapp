<template>
	<view>
		<u-empty v-if="recommendList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="home-root" v-for="(gym, gymIndex) in recommendList" :key="gymIndex">
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
										:type="gym.tag[tagIdx]=='力量举'? 'warning' : gym.tag[tagIdx]=='瑜伽' ? 'error' : gym.tag[tagIdx]=='游泳' ? 'primary' : gym.tag[tagIdx]=='单车' ? 'success' : 'info'"
										size="mini" plain plainFill></u-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 长按遮罩层 -->
			<view class="gym-mask" v-if="maskFlag == gymIndex" @click="maskFlag=-1">
				<button class="gym-mask__hate" @click="clickHate(gymIndex)">
					<u-icon name="trash-fill" color="#0f80ff" size="30"></u-icon>
				</button>
				<button class="gym-mask__love" @click="clickLove(gym.id)">
					<u-icon name="heart-fill" color="#ff5757" size="32"></u-icon>
				</button>
			</view>
		</view>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText" :nomore-text="nomoreText"
			@loadmore="loadmore" />
	</view>
</template>

<script>
	export default {
		name: "recommendList",
		data() {
			return {
				status: 'loadmore',
				loadingText: '拼命加载中...',
				loadmoreText: '轻轻上拉，精彩继续',
				nomoreText: '别看了，已经没有了',
				maskFlag: -1,
				recommendList: []
			};
		},
		methods: {
			loadmore() {
				this.status = 'loading';
				// console.log('rec.loadmore被调用');
				let userId = uni.getStorageSync("userId");
				// console.log(userId);
				this.$request.request({
					url: 'gym/rec/' + userId,
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].city == '广州') {
							// console.log('东莞!');
							var lati = uni.getStorageSync('lati');
							var longti = uni.getStorageSync('longti');
							var distFromThis = this.getDistance(lati, longti, res.data[i].lat, res.data[i].lng);
							// 获取tag
							this.$request.request({
								url: 'gym/tag/' + res1.data[i].gymId,
								method: 'GET',
							}).then(res => {
								var gymTag = new Array(2);
								for (let i = 0; i < res.data.length; i++) {
									gymTag[i] = res.data[i].title;
								};
								this.recommendList.push({
									id: res1.data[i].gymId,
									name: res1.data[i].gymName,
									rating: Number(res1.data[i].stars).toFixed(1),
									member: 0,
									distance: distFromThis,
									url: res1.data[i].pic,
									cost: res1.data[i].price,
									time: '9:00-23:00',
									tag: gymTag
								});
							});
						}
					}
					// console.log("------data------", res.data);
				})

			},
			// loadGym(resource) {
			// 	console.log("加载健身房ing：", resource);
			// },
			longtapList(index) {
				this.maskFlag = index;
				console.log("长按了第个健身房：", index);
			},
			navToDetail(id) {
				uni.navigateTo({
					url: '../../pages/gymDetail/gymDetail?gymId=' + id
				})
			},
			clickLove(gymId) {
				console.log("love", gymId);
				var userId = uni.getStorageSync('userId');
				this.$request.request({
					url: 'user/setCollection/' + userId + '/' + gymId,
					method: 'GET',
				}).then(res => {
					uni.showToast({
						title: '已收藏',
						duration: 1000
					})
				});
			},
			clickHate(gym) {
				console.log("hate", gym);
				this.recommendList.splice(gym, 1);
				// var uid = uni.getStorageSync('userId');
				// if(uid == 10000005){
				// 	uni.setStorageSync('userId', 30031781);
				// 	console.log("帮你cut掉单车");
				// } else if(uid == 30031781) {
				// 	uni.setStorageSync('userId', 10000005);
				// } else {
				// 	var temp = uid;
				// 	uni.setStorageSync('userId', 30031781);
				// 	uid = temp;
				// }
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
		},
		created() {
			//抓取活动
			this.loadmore()
			// console.log('展示了个寂寞？');
		}
	}
</script>

<style lang="scss" scoped>

</style>
