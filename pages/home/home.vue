<template>
	<view>
		<!-- 顶部查找 -->
		<u-sticky>
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
						@confirm="doSearch" />
				</view>
			</uni-nav-bar>
		</u-sticky>

		<!-- 健身房公告轮播图 -->
		<view class="home-adSwiper">
			<u-swiper :list="adSwiperList" previousMargin="24" nextMargin="24" circular :autoplay="true" radius="5"
				bgColor="#ffffff00" height="170" @click="clickAD"></u-swiper>
		</view>

		<!-- 首页菜单 -->
		<view class="home-menu">
			<u-grid :border="false" @click="clickMenu">
				<u-grid-item v-for="(menuListItem, menuListIndex) in menuList" :key="menuListIndex">
					<!-- <u-icon :customStyle="{paddingTop:20+'rpx'}" :name="menuListItem.name" :size="22"></u-icon> -->
					<image class="home-menu-img" :src="menuListItem.url" mode="aspectFit"></image>
					<text class="grid-text">{{menuListItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<!-- 提示框 -->
			<u-toast ref="uToast" />
		</view>

		<!-- 为你推荐 -->
		<view class="home-title">
			<text selectable="false">为你推荐</text>
			<view class="home-title-tag">
				<view class="home-tag" v-for="(tag, tagIndex) in tagList" :key="tag.id">
					<u-tag :text="tag.name" :plain="!tag.checked" plainFill="true" type="primary" :name="tag.id"
						size="large" borderColor="#ffcc3300" @click="clickTag">
					</u-tag>
				</view>
			</view>
		</view>

		<!-- 门店/课程/计划的view，用v-if表示是否显示 -->
		<view class="gym-list" v-if="curTag==0">
			<recommendList ref="recList"></recommendList>
		</view>
		<view class="clazz-list" v-if="curTag==1">
			<courseList ref="courseList"></courseList>
		</view>
		<view class="plan-list" v-if="curTag==2">
			<planList ref="planList"></planList>
		</view>

	</view>
</template>

<script>
	export default {
		name: "home",
		data() {
			return {
				pos: [{
					latitude: 21.1508,
					longitude: 110.3011,
					city: '获取失败'
				}],
				selectCity: '获取失败',
				currentSwiper: 0,
				currentDir: 0,
				curTag: 0,
				swiperHeight: '500',
				adSwiperList: [
					// {
					// 	id: 0,
					// 	type: 'image',
					// 	url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/154597789840900.png',
					// 	// name: '健身季',
					// 	gym: '../allGym/allGym'
					// },
					// {
					// 	id: 1,
					// 	type: 'image',
					// 	url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/3295523_15985198809595_7a327.png',
					// }, {
					// 	id: 2,
					// 	type: 'image',
					// 	url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/16pic_7875066_b.jpg'
					// }
				],
				menuList: [{
						title: '全国门店',
						url: '/static/image/store.png'
					},
					{
						title: '训练营',
						url: '/static/image/schedule.png'
					},
					{
						title: '资料库',
						url: '/static/image/database.png'
					},
				],
				tagList: [{
						id: 0,
						name: "门店",
						checked: true
					},
					{
						id: 1,
						name: "课程",
						checked: false
					},
					{
						id: 2,
						name: "计划",
						checked: false
					}
				]
			}
		},
		methods: {
			// 获取地址
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						// console.log(res);
						let latitude = res.latitude;
						let longitude = res.longitude;
						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' +
								longitude +
								'&key=UGMBZ-S5AKU-YQGV3-47M5J-BAQ62-ZBBJW',
							success: data => {
								// console.log(data);
								this.selectCity = data.data.result.address_component.city;
								this.pos[0].latitude = res.latitude;
								this.pos[0].longitude = res.longitude;
								this.pos[0].city = data.data.result.address_component.city;
								uni.setStorageSync('lati', res.latitude);
								uni.setStorageSync('longti', res.longitude);
							}
						});
					}
				});
			},
			// 跳转到选择地址页面
			selectCityPage() {
				uni.navigateTo({
					url: "../cityselect/cityselect"
				})
			},
			// 点击首页菜单
			clickMenu(index) {
				var that = this;
				var navData = JSON.stringify(that.pos);
				console.log('navData: ', navData);
				if (index == 0) {
					console.log('点击了全国门店');
					uni.navigateTo({
						url: "../allGym/allGym?position=" + navData
					})
				} else if (index == 1) {
					console.log('点击了训练营');
					uni.navigateTo({
						url: "../trainCamp/trainCamp"
					})
				} else if (index == 2) {
					console.log('点击了资料库');
					uni.navigateTo({
						url: "../dataBank/dataBank"
					})
				}
				// this.$refs.uToast.success(`点击了第${index}个`)
			},
			// 点击导航tab，绑定Swiper列表
			clickDir(e) {
				// console.log('e=', e);
				this.currentSwiper = e.index;
				this.changeCompHeight();
			},
			// 点击标签tag，切换内容
			clickTag(name) {
				this.tagList.map((tag, tagIndex) => {
					tag.checked = tagIndex == name ? true : false
				});
				this.curTag = name;
			},
			clickAD(index) {
				// console.log('点击了,第张广告', index)
				// console.log('这个会跳转到', this.adSwiperList[index].gym)
				uni.navigateTo({
					url: this.adSwiperList[index].gym
				})
			},
			doSearch(e) {
				console.log('输入了', e.target.value);
				uni.navigateTo({
					url: "../allGym/allGym?search=" + e.target.value
				})
			}
		},
		onLoad() {
			// 判断城市数据,如果没有,就重新请求一次.
			if (this.selectCity != '获取失败') {
				// 有的话不处理
			} else {
				this.getLocation();
			}
			// 抓取活动
			// TODO：？
			// this.changeCompHeight();
			this.$request.request({
				url: '/active/all',
				method: 'GET',
			}).then(res => {
				for (let i = 0; i < res.data.length; i++) {
					this.adSwiperList.push({
						id: i,
						type: 'image',
						url: res.data[i].img,
						gym: '../gymDetail/gymDetail?gymId=' + res.data[i].gymId
					});
				}
				// this.adSwiperList[res.data[0].position].url = res.data[0].img;
				console.log("------data------", res.data[0].img);
			})
			
		},
		onShow() {
			const selectCity = uni.getStorageSync('selectCity');
			// console.log('获取中！！！！！')
			// alert('空！！！！！！')
			if (selectCity) {
				this.selectCity = selectCity;
				// console.log(selectCity)
				// alert(selectCity)
			}
		},
		onReachBottom() {
			// 调用加载
			if (this.curTag == 0) {
				console.log('推荐门店加载ing');
				// 到达底部调用子组件加载更多
				this.$refs.recList.loadmore();
				// 不要异步，在loadmore里面做同步处理
				// this.changeCompHeight();
			} else if (this.curTag == 1) {
				console.log('推荐团课加载ing');
				// this.$refs.courseList.loadmore(1677307);
			} else if (this.curTag == 2) {
				console.log('推荐计划加载ing');
				// this.$refs.recList.loadmore();
			}

		},
		onPullDownRefresh() {
			// console.log('onPullDownRefresh')
			var that = this;
			this.$refs.recList.loadmore();
			setTimeout(function() {
				uni.stopPullDownRefresh();
				// console.log('stopPullDownRefresh')
			}, 1000)
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

	.grid-text {
		font-size: 14px;
		color: #333333;
		font-weight: 700;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}

	.home-title {
		margin: 26rpx 36rpx;
		font-size: 42rpx;
		font-weight: 500;
		display: flex;
		flex-direction: column;
	}

	.home-title-tag {
		display: flex;
		flex-direction: row;
	}

	.home-tag {
		margin: 20rpx 24rpx 0rpx 12rpx;
	}

	.home-adSwiper {
		margin: 14rpx 0;
	}
</style>
