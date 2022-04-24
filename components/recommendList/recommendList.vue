<template>
	<view>
		<view class="home-root" v-for="(gym, gymIndex) in recommendList" :key="gym.id">
			<view class="home-gym">
				<view class="home-gym__content" @longpress="longtapList(gymIndex)">
					<view class="home-gym__content__pic">
						<image class="gym-pic" :src="gym.url"></image>
					</view>
					<view class="home-gym__content__text">
						<text class="gym-name">{{gym.name}}</text>
						<view class="gym-info">
							<text class="gym-info__rate">{{gym.rating}}</text>
							<text
								class="gym-info__eval">{{gym.rating >= 4.7 ? '超棒' : gym.rating >= 4.3 ? '很好' : ''}}</text>
							<!-- <view class="gym-rating__rate">
								<u-rate :value="gym.rating" :activeColor="gym.rating>3.0 ? '#FA3534' : '#FFCC33'"
									allowHalf readonly size="40rpx"></u-rate>
							</view> -->
							<text class="gym-info__member" v-if="gym.member != 0">{{gym.member}}会员</text>
						</view>
						<view class="gym-detail">
							<text class="gym-detail__distance">
								距您{{gym.distance > 1000 ? gym.distance / 1000 + 'km' : gym.distance + 'm'}}
								<text class="gym-detail__cost" v-if="gym.cost != 0">
									人均消费 ¥{{gym.cost}}
								</text>
							</text>
							<text class="gym-detail__time">营业时间：{{gym.time == '' ? '到店咨询' : gym.time}}</text>
							<view class="gym-detail__taglist">
								<view class="gym-detail__tag" v-for="(tag, tagIdx) in gym.tag" v-if="tagIdx < 3"
									:key="tagIdx">
									<u-tag :text="gym.tag[tagIdx]"
										:type="gym.tag[tagIdx]=='健身馆'? 'warning' : gym.tag[tagIdx]=='瑜伽馆' ? 'error' : gym.tag[tagIdx]=='游泳馆' ? 'primary' : gym.tag[tagIdx]=='少儿培训' ? 'success' : 'info'"
										size="mini" plain plainFill></u-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="gym-mask" v-if="maskFlag == gymIndex" @click="maskFlag=-1">
				<button class="gym-mask__hate" @click="clickHate(gymIndex)">
					<u-icon name="trash-fill" color="#0f80ff" size="30"></u-icon>
				</button>
				<button class="gym-mask__love" @click="clickLove(gymIndex)">
					<u-icon name="heart-fill" color="#ff5757" size="32"></u-icon>
				</button>
			</view>
		</view>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" />
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
				recommendList: [{
						id: 0,
						name: "超鹿健身房（广东海洋大学店）健身 tuijian",
						rating: 4.6,
						member: 576,
						distance: 1200,
						url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/chaolu.jpg',
						cost: 835,
						time: '8:00-23:00',
						tag: ['健身馆', '游泳馆']
					},
					{
						id: 1,
						name: "康潮健身 tuijian",
						rating: 3.5,
						member: 1200,
						distance: 80,
						url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/chaolu1.png',
						cost: 1600,
						time: '6:00-23:30',
						tag: ['瑜伽馆']
					},
					{
						id: 2,
						name: "康潮健身2 tuijian",
						rating: 4.7,
						member: 0,
						distance: 80,
						url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/兽设_像素.jpeg',
						cost: 0,
						time: '9:00-22:00',
						tag: ['游泳馆', '少儿培训', '瑜伽馆']
					},
					{
						id: 3,
						name: "康潮健身3 tuijian",
						rating: 1.9,
						member: 0,
						distance: 80,
						url: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/chaolu1.png',
						cost: 10,
						time: '',
						tag: []
					},
				]
			};
		},
		methods: {
			loadmore() {
				this.status = 'loading';
				console.log('rec.loadmore被调用');
				// 调用加载数据的函数
				// this.pageNum = this.pageNum + 1;
				setTimeout(() => {
					this.loadGym(this.status);
					for (let i = 0; i < 3; i++) {
						this.recommendList.push({

						});
					}
				}, 5000)

			},
			loadGym(resource) {
				console.log("加载健身房ing：", resource);
			},
			longtapList(index) {
				this.maskFlag = index;
				console.log("长按了第个健身房：", index);
			},
			clickLove(gym) {
				console.log("love", gym);
			},
			clickHate(gym) {
				console.log("hate", gym);
			}
		},
		created() {
			//抓取活动
			// this.loadmore()
			console.log('展示了个寂寞？');
		},
		// onReachBottom() {
		// 	this.loadmore();
		// }
	}
</script>

<style lang="scss" scoped>
	.home-root {
		position: relative;
	}

	.home-gym {
		height: 300rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 94%;
		margin: 28rpx 3%;
		-moz-box-shadow: 0px 0px 3px #b3b3b3;
		-webkit-box-shadow: 0px 0px 3px #b3b3b3;
		box-shadow: 0px 0px 3px #b3b3b3;

		&__content {
			display: flex;
			padding-left: 20rpx;
			padding-top: 20rpx;

			&__text {
				display: flex;
				flex-direction: column;
				font-size: 36rpx;
				color: black;
				// padding-top: 20rpx;
				padding-left: 24rpx;
			}

			&__pic {
				/* 目标宽高 */
				width: 240rpx;
				height: 260rpx;
				position: relative;
				overflow: hidden;
				border-radius: 20rpx;
			}
		}
	}

	.gym-name {
		font-size: 38rpx;
		font-weight: 500;
		width: 420rpx;
		// background-color: red;
		/* 超过一行用点显示 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.gym-info {
		width: 70rpx;
		display: flex;
		background-color: #035397;
		margin-top: 10rpx;
		border-radius: 30rpx 0 30rpx 30rpx;

		&__rate {
			padding-left: 12rpx;
			font-size: 32rpx;
			color: #FFFFFF;
		}

		&__eval {
			padding-left: 18rpx;
			font-size: 30rpx;
			font-weight: 500;
			white-space: nowrap;
			color: #035397;
		}

		&__member {
			padding-left: 18rpx;
			font-size: 30rpx;
			white-space: nowrap;
			color: #035397;
		}
	}

	.gym-detail {
		display: flex;
		flex-direction: column;
		padding-top: 6rpx;

		&__cost {
			font-size: 28rpx;
			white-space: nowrap;
			color: #fd8008;
			padding-left: 12rpx;
		}

		&__distance {
			padding-top: 4rpx;
			font-size: 30rpx;
			white-space: nowrap;
			color: #191919;
		}

		&__time {
			padding-top: 6rpx;
			font-size: 24rpx;
			white-space: nowrap;
			color: #666666;
		}

		&__taglist {
			padding-top: 10rpx;
			display: flex;
			flex-direction: row;
		}

		&__tag {
			margin-right: 12rpx;
		}

	}


	.gym-pic {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		/* 图片原宽高去缩放，选择宽高缩放比中较大的一个 */
		/* 如这里图片原宽高是 496*640, 宽缩放比=100/496,高缩放比=100/640,则较大的为100/496~0.2 */
		transform: scale(0.6) translate(-50%, -50%);
	}

	.gym-mask {
		position: absolute;
		z-index: 10;
		left: 3%;
		top: 0;
		width: 94%;
		height: 100%;
		border-radius: 20rpx;
		background-color: #000000C0;
		display: flex;
		&__love {
			background-color: #ffffff;
			border-radius: 96rpx;
			width: 120rpx;
			height: 120rpx;
			top: 50%;
			transform: translate(-30%, -50%);
			display: flex;
		}

		&__hate {
			background-color: #ffffff;
			border-radius: 96rpx;
			width: 120rpx;
			height: 120rpx;
			top: 50%;
			transform: translate(30%, -50%);
			display: flex;
		}
	}
</style>
