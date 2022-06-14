<template>
	<view class="det-body">
		<image class="det-img" :src="pic"></image>
		<view class="det-name">
			{{name}}
		</view>
		<view class="det-rate">
			<!-- {{rating}} -->
			<text class="det-rate__num">{{rating}}</text>
			<text class="det-rate__eval">{{rating >= 4.3 ? '超棒' : gym.rating >= 4.0 ? '很好' : '一般'}}
			</text>
		</view>
		<view class="det-tag-list">
			<!-- <u--text class="det-tag-text" prefixIcon="star" iconStyle="font-size: 32rpx" text="特色课程"></u--text> -->
			<u-icon name="star" size="20"></u-icon>
			<text style="padding: 0 10rpx;">特色课程:</text>
			<view class="det-tag" v-for="(tagItem, tagIdx) in tag" :key="tagIdx">
				<u-tag :text="tagItem"
					:type="tagItem=='力量举'? 'warning' : tagItem=='瑜伽' ? 'error' : tagItem=='游泳' ? 'primary' : tagItem=='单车' ? 'success' : 'info'"
					size="mini" plain plainFill></u-tag>
			</view>
			<text class="det-distance">距您{{distance}}</text>
		</view>
		<view style="padding-top: 22rpx;">
			<u-collapse accordion>
				<u-collapse-item title="商家简介" name="remark" v-if="remark != null">
					<text class="det-remark">{{remark}}</text>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="det-notice" v-if="noticeTitle.length > 0">
			<u-notice-bar :text="noticeTitle" direction="column"></u-notice-bar>
		</view>
		<view class="det-addr-box">
			<view class="det-addr-content">
				<text class="det-area">{{province}}省·{{city}}市·{{area}}区</text>
				<text class="det-addr">{{address}}</text>
			</view>
			<view class="det-map">
				<u-icon name="map" size="30" color="#035397"></u-icon>
				<text class="det-map-text">导航</text>
			</view>
		</view>
		<u-line></u-line>
		<view class="det-phone">
			<text class="det-phone-title">联系电话</text>
			<text class="det-phone-num">{{phone}}</text>
			<u-icon color="#035397" name="phone" size="28"></u-icon>
		</view>
		<u-line></u-line>
		<view class="det-phone">
			<text class="det-phone-title">营业时间</text>
			<text class="det-phone-num">{{time}}</text>
		</view>
		<u-line></u-line>
		<view class="det-phone" v-if="cost != null">
			<text class="det-phone-title">人均消费</text>
			<text class="det-phone-num">¥{{cost}}元</text>
		</view>
		<u-line v-if="cost != null"></u-line>

		<view class="det-phone">
			<u-icon name="tags" size="26"></u-icon>
			<text class="det-phone-title" style="padding-left: 12rpx;">团课</text>
		</view>
		<courseList ref="courseList"></courseList>
		<u-line v-if="noticeTitle.length > 0"></u-line>

		<view class="det-phone">
			<u-icon name="volume" size="26"></u-icon>
			<text class="det-phone-title" style="padding-left: 12rpx;">健身房公告</text>
		</view>
		<u-divider text="暂无公告" v-if="noticeTitle.length == 0"></u-divider>
		<u-collapse accordion>
			<u-collapse-item v-for="(noticeItem, noticeIdx) in notice" :key="noticeIdx" :title="noticeItem.title"
				name="notice">
				<text class="det-remark">{{noticeItem.content}}</text>
			</u-collapse-item>
		</u-collapse>
		<u-line></u-line>
		<view class="det-phone">
			<u-icon name="car-fill" size="26"></u-icon>
			<text class="det-phone-title" style="padding-left: 12rpx;">器械</text>
		</view>
		<u-divider text="到店咨询" v-if="equipList.length == 0"></u-divider>
		<u-grid :border="false" col="4">
			<u-grid-item v-for="(equipItem, equipIdx) in equipList" :key="equipIdx">
				<u-icon :customStyle="{paddingTop:20+'rpx'}" name="attach" :size="22"></u-icon>
				<text class="grid-text">{{equipItem.name}}</text>
			</u-grid-item>
		</u-grid>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				name: '',
				rating: '',
				member: '',
				distance: '',
				pic: '',
				cost: '',
				time: '',
				tag: '',
				address: '',
				area: '',
				city: '',
				lat: '',
				lng: '',
				phone: '',
				province: '',
				remark: '',
				noticeTitle: [],
				notice: [],
				session: [],
				equipList: []
			}
		},
		methods: {
			loadEquip(gymId) {
				console.log('加载器械')
				this.$request.request({
					url: 'gym/equip/' + gymId,
					method: 'GET',
				}).then(res => {
					console.log('加载器械', res)
					for (let i = 0; i < res.data.length; i++) {
						this.equipList.push({
							name: res.data[i].name
						})
					};
				});
			},
			loadDetail(gymId) {
				this.$request.request({
					url: 'gym/detail/' + gymId,
					method: 'GET',
				}).then(res => {
					// this.recommendList = res.data;
					var res1 = res;
					// console.log('东莞!');
					var lati = uni.getStorageSync('lati');
					var longti = uni.getStorageSync('longti');
					var distFromThis = this.getDistance(lati, longti, res.data.lat, res.data.lng);
					// 获取tag
					this.$request.request({
						url: 'gym/tag/' + gymId,
						method: 'GET',
					}).then(res => {
						var gymTag = new Array(2);
						for (let i = 0; i < res.data.length; i++) {
							gymTag[i] = res.data[i].title;
						};
						this.id = res1.data.gymId,
							this.name = res1.data.gymName,
							this.rating = Number(res1.data.stars).toFixed(1),
							this.member = 0,
							this.distance = distFromThis,
							this.pic = res1.data.pic,
							this.cost = res1.data.price,
							this.time = '9:00-23:00',
							this.tag = gymTag,
							this.address = res1.data.address,
							this.area = res1.data.area,
							this.city = res1.data.city,
							this.lat = res1.data.lat,
							this.lng = res1.data.lng,
							this.phone = res1.data.phone,
							this.province = res1.data.province,
							this.remark = res1.data.remark
					});
					// console.log("------data------", res.data);
				})
			},
			loadNotice(gymId) {
				this.$request.request({
					url: 'gym/notice/' + gymId,
					method: 'GET',
				}).then(res => {
					console.log("公告", res)
					for (let i = 0; i < res.data.length; i++) {
						this.noticeTitle.push(res.data[i].title);
						this.notice.push({
							title: res.data[i].title,
							content: res.data[i].content
						})
					};
				});
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
		onLoad(options) {
			var gymId = options.gymId;
			console.log(gymId);
			// 抓取活动
			// TODO：load获取健身房公告
			this.loadDetail(gymId);
			this.loadNotice(gymId);
			this.loadEquip(gymId);
			this.$refs.courseList.loadmore(gymId);
		},
	}
</script>

<style lang="scss" scoped>
	.det-body {
		display: flex;
		flex-direction: column;
		background-color: #f9f9f9;
	}

	.det-img {
		width: 100%;
		height: 480rpx;
	}

	.det-name {
		font-size: 46rpx;
		font-weight: 500;
		width: 90%;
		// background-color: red;
		/* 超过一行用点显示 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-left: 30rpx;
		padding-top: 30rpx;
	}

	.det-tag-list {
		padding-top: 16rpx;
		padding-left: 30rpx;
		display: flex;
		flex-direction: row;
	}

	.det-tag-text {
		width: 10%;
	}

	.det-tag {
		padding-left: 20rpx;
		// margin-right: 16rpx;
	}

	.det-rate {
		width: 100rpx;
		display: flex;
		background-color: #035397;
		margin-top: 14rpx;
		border-radius: 50rpx 0 50rpx 50rpx;
		margin-left: 30rpx;

		&__num {
			margin-left: 20rpx;
			font-size: 42rpx;
			color: #FFFFFF;
		}

		&__eval {
			margin-left: 50rpx;
			font-size: 42rpx;
			font-weight: 500;
			white-space: nowrap;
			color: #035397;
		}
	}

	.det-addr-box {
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		background-color: #03539739;
		width: 94%;
		margin: 28rpx 3%;
		display: flex;
		flex-direction: row;
	}

	.det-addr-content {
		display: flex;
		width: 85%;
		flex-direction: column;
		padding: 22rpx 20rpx;
	}

	.det-area {
		font-size: 30rpx;
	}

	.det-addr {
		font-size: 28rpx;
		padding-top: 12rpx;
		color: #333333;
	}

	.det-map {
		padding: 26rpx 30rpx;
	}

	.det-map-text {
		white-space: nowrap;
		font-size: 30rpx;
		color: #333333;
	}

	.det-distance {
		padding-top: 2rpx;
		padding-left: 60rpx;
		font-size: 30rpx;
		white-space: nowrap;
		color: #333333;
	}

	.det-phone {
		display: flex;
		flex-direction: row;
		padding: 26rpx 30rpx;
		background-color: #FFFFFF;
	}

	.det-phone-title {
		padding-right: 30rpx;
		font-weight: 500;
		font-size: 36rpx;
	}

	.det-phone-num {
		width: 66%;
		padding-top: 2rpx;
		font-size: 34rpx;
	}

	.det-notice {
		width: 92%;
		padding: 20rpx 4%;
	}

	.det-remark {
		font-size: 30rpx;
		// font-weight: 500;
	}
	.grid-text {
	        font-size: 14px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	    }
</style>
