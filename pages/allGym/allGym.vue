<template>
	<view>
		<u-sticky>
			<!-- 地图 -->
			<!-- <fitmap></fitmap> -->
			<view class="content">
				<map class="map" scale='15' :latitude="latitude" :longitude="longitude" :markers="covers"
					:show-location="true" @markertap="markertap" @tap="tap" @updated="updated" id="map1">
				</map>
			</view>
			<!-- 导航栏 -->
			<uni-nav-bar :fixed="false" color="#333333" background-color="#FFFFFF">
				<!-- <block slot="left"> -->
				<view class="city" @tap="selectCityPage">
					<view>
						<text class="uni-nav-bar-text">{{selectCity}}</text>
					</view>
					<uni-icons type="arrowdown" color="#333333" size="20" />
				</view>
				<!-- </block> -->
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
					<!-- @tap="doSearch" /> -->
					<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"
						@confirm="searchGym" />
					<!-- @confirm="doSearch" /> -->
				</view>
			</uni-nav-bar>
			<!-- 选择排序方式 -->
			<view style="background-color: #FFFFFF;">
				<u-tabs :list="sortList" @click="clickSort" lineColor="#FFCC33"></u-tabs>
			</view>
		</u-sticky>
		<u-empty v-if="gymList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
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
		name: "allGym",
		data() {
			return {
				pos: [{
					latitude: 21.1508,
					longitude: 110.3011,
					city: '获取失败'
				}],
				selectCity: '获取失败',
				status: 'loadmore',
				loadingText: '拼命加载中...',
				loadmoreText: '轻轻上拉，精彩继续',
				nomoreText: '别看了，已经没有了',
				maskFlag: -1,
				sortList: [{
						id: 0,
						name: "离我最近",
					},
					{
						id: 1,
						name: "价格",
					},
					{
						id: 2,
						name: "评分",
					}
				],
				gymList: [{
					id: 0,
					name: "金摩尔健身",
					rating: 4.8,
					member: 531,
					distance: "820m",
					url: 'https://taojin-his.cdn.bcebos.com/caef76094b36acaf865e608677d98d1001e99c0a.jpg',
					cost: 835,
					time: '8:00-23:00',
					tag: ['自由格斗', '游泳']
				}, ],
				mapData: [],
				latitude: 21.1508,
				longitude: 110.3011,
				covers: [] //标记点地图数据
			}
		},
		methods: {
			// 跳转到选择地址页面
			selectCityPage() {
				uni.navigateTo({
					url: "../cityselect/cityselect"
				})
			},
			searchGym(e) {
				console.log(e.target.value);
				// uni.navigateTo({
				// 	url: "../searchResult/searchResult?search=" + e.target.value
				// })
				this.$request.request({
					url: 'gym/search/' + e.target.value,
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					this.gymList = new Array();
					for (let i = 0; i < res.data.length; i++) {
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
							this.gymList.push({
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
					// console.log("------data------", res.data);
				})
			},
			loadmore() {
				this.status = 'loading';
				console.log('rec.loadmore被调用');
				// 调用加载数据的函数
				// this.pageNum = this.pageNum + 1;
				setTimeout(() => {
					this.loadGym(this.status);
				}, 500)
			},
			navToDetail(id) {
				uni.navigateTo({
					url: '../../pages/gymDetail/gymDetail?gymId=' + id
				})
			},
			loadGym(resource) {
				console.log("加载健身房ing：", resource);
				this.status = 'loading';
				// console.log('rec.loadmore被调用');
				// let userId = uni.getStorageSync("userId");
				const selectCity = uni.getStorageSync('selectCity');
				console.log('wwwww222', selectCity.substr(0, 2));
				this.$request.request({
					url: 'gym/list/city/' + selectCity.substr(0, 2),
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					for (let i = 0; i < res.data.length; i++) {
						var lati = uni.getStorageSync('lati');
						var longti = uni.getStorageSync('longti');
						var distFromThis = this.getDistance(lati, longti, res.data[i].lat, res.data[i].lng);
						this.mapData.push({
							id: i,
							name: res1.data[i].gymName,
							imgUrl: '../../static/pin.png',
							lat: res.data[i].lat,
							lng: res.data[i].lng
						})
						// 获取tag
						this.$request.request({
							url: 'gym/tag/' + res1.data[i].gymId,
							method: 'GET',
						}).then(res => {
							var gymTag = new Array(2);
							for (let i = 0; i < res.data.length; i++) {
								gymTag[i] = res.data[i].title;
							};
							this.gymList.push({
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
					// console.log("------data------", res.data);
				})
			},
			longtapList(index) {
				this.maskFlag = index;
				console.log("长按了第个健身房：", index);
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
				this.gymList.splice(gym, 1);
				uni.showToast({
					title: '不感兴趣',
					duration: 1000
				})
			},
			clickSort(idx) {
				if (idx.id == 1 && (this.sortList[1].name == "价格" || this.sortList[1].name == "价格由低到高")) {
					this.sortList[1].name = "价格由高到低";
					this.sortList[2].name = "评分";
					// TODO 获取价格降序的健身房
					this.gymList.sort(function(a, b) {
						return b.cost - a.cost
					});
				} else if (idx.id == 1 && this.sortList[1].name == "价格由高到低") {
					this.sortList[1].name = "价格由低到高";
					this.sortList[2].name = "评分";
					// TODO 获取价格升序的健身房
					this.gymList.sort(function(a, b) {
						return a.cost - b.cost
					});
				} else if (idx.id == 2 && (this.sortList[2].name == "评分" || this.sortList[2].name == "评分由高到低")) {
					this.sortList[2].name = "评分由低到高";
					this.sortList[1].name = "价格";
					// 评分升序
					this.gymList.sort(function(a, b) {
						return a.rating - b.rating
					});
				} else if (idx.id == 2 && this.sortList[2].name == "评分由低到高") {
					this.sortList[2].name = "评分由高到低";
					this.sortList[1].name = "价格";
					// 评分降序
					this.gymList.sort(function(a, b) {
						return b.rating - a.rating
					});
				} else {
					this.sortList[1].name = "价格";
					this.sortList[2].name = "评分";
					// 距离升序
					this.gymList.sort(function(a, b) {
						return Number(a.distance.substr(1, 2)) - Number(b.distance.substr(1, 2))
					});
				}
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
			//map
			init() {
				let that = this;
				console.log("map.init()")
				//发起网络请求获取数据
				//用uni.request(OBJECT)方法
				//我这里模拟下数据
				var data = this.mapData;
				// [{
				// 	id: 1,
				// 	name: '广东海洋大学',
				// 	imgUrl: '../static/pin.png',
				// 	lat: "21.1508",
				// 	lng: "110.3011"
				// }, {
				// 	id: 2,
				// 	name: '李彦宏',
				// 	imgUrl: '../static/pin.png',
				// 	lat: "34.763466",
				// 	lng: "113.686285"
				// }, {
				// 	id: 3,
				// 	name: '马化腾',
				// 	imgUrl: '../static/pin.png',
				// 	lat: "34.763412",
				// 	lng: "113.680185"
				// }, ];
				//获取用户所在位置
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						console.log(res);
						let latitude = res.latitude;
						let longitude = res.longitude;
						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' +
								longitude +
								'&key=UGMBZ-S5AKU-YQGV3-47M5J-BAQ62-ZBBJW',
							success: data => {
								console.log(data.data.result.address_component);
								that.longitude = longitude
								that.latitude = latitude
							}
						});
						that.MapData(that, data)
					}
				});
			},
			//地图数据初始化
			MapData(that, data) {
				this.moveTolocation();
				console.log(data.length)
				let arrayData = [];
				for (var i = 0; i < data.length; i++) {
					console.log(data[i].lat)
					arrayData.push({
						id: data[i].id, //marker点击事件回调会返回此id。建议为每个marker设置上Number类型id，保证更新marker时有更好的性能。
						latitude: data[i].lat, //纬度
						longitude: data[i].lng, //经度
						// title: data[i].name, //点击时显示，callout存在时将被忽略
						iconPath: data[i].imgUrl, //项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径
						width: 36,
						height: 36,
						callout: {
							//自定义标记点上方的气泡窗口
							content: data[i].name,
							color: '', //文本颜色
							fontSize: 12, //文字大小
							borderRadius: 8, //callout边框圆角
							bgColor: '', //背景色
							padding: 6, //文本边缘留白
							display: 'BYCLICK', //'BYCLICK':点击显示; 'ALWAYS':常显
							textAlign: 'left', //文本对齐方式。有效值: left, right, center
						},
						anchor: {
							//经纬度在标注图标的锚点，默认底边中点      {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
							x: .5,
							y: 1
						}
					});
				}
				console.log(arrayData.length)
				console.log(arrayData)
				//重新给地图数据赋值covers 
				that.covers = arrayData;
			},
			//地图点击事件
			markertap(e) {
				// console.log("===你点击了标记点===")
				// console.log("你点击的标记点ID是:" + e.detail.markerId)
				//console.log(e)
				uni.showToast({
					title: "正在跳转至导航",
					duration: 1000
				})
			},
			//点击地图时触发; App-nuve、微信小程序2.9支持返回经纬度
			tap(e) {
				console.log("===你点击了地图点===")
				console.log(e)
				// this.init();
			},
			//在地图渲染更新完成时触发
			updated(e) {
				console.log("===在地图渲染更新完成时触发===")
				console.log(e)
				this.init();
			},
			moveTolocation() {
				let mapObjs = uni.createMapContext('map1', this)
				mapObjs.moveToLocation({
					latitude: 23.12272311614896,
					longitude: 113.32452917268222
				}, {
					complete: res => {
						console.log('移动完成:', res)
					}
				})
				// this.onRegionChange('',true)
			}
		},
		onLoad(options) {
			// 字符串转对象
			var dataPos = JSON.parse(options.position);
			// var dataSearch = options.search;
			this.pos[0].latitude = dataPos[0].latitude;
			this.pos[0].longitude = dataPos[0].longitude;
			this.selectCity = dataPos[0].city;
			console.log(this.selectCity);
			// console.log(dataSearch);
			// 判断城市数据,如果没有,就重新请求一次.
			if (this.selectCity != '获取失败') {
				// 有的话不处理
			} else {
				this.pos[0].city = dataPos[0].city;
			}
			// 抓取活动
			// TODO：loadGym获取距离升序的健身房
			this.loadGym();
		},
		onShow() {
			const selectCity = uni.getStorageSync('selectCity');
			if (selectCity) {
				this.selectCity = selectCity;
			}
		},
		onReachBottom() {
			this.loadmore();
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/uni_modules/uview-ui/index.scss";
	$nav-height: 30px;

	/* #ifndef APP-NVUE */
	page {
		height: 120%;
	}

	/* #endif */
	.uni-nav-bar-text {
		white-space: nowrap;
		font-size: 28rpx;
	}

	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 0px;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 500rpx;
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

	.map {
		width: 100%;
		height: 350rpx;
	}
</style>
