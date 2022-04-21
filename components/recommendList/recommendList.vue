<template>
	<view>
		<view v-for="(gym, gymIndex) in recommendList" :key="gym.id">
			<view class="home-gym">
				<view class="home-gym__content" @longpress="longtapList">
					<view class="home-gym__content__pic">
						<image class="gym-pic" :src="gym.url"></image>
					</view>
					<view class="home-gym__content__text">
						<text class="gym-name">{{gym.name}}</text>
						<text class="gym-rating">{{gym.rating}}</text>
						<text class="gym-distance">{{gym.distance}}</text>
					</view>
				</view>
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
				nomoreText: '没有更多了',
				optionsList: [{
						id: 0,
						text: '不感兴趣',
						// icon: 'trash-fill',
						iconSize: '20',
						style: {
							backgroundColor: '#f56c6c',
							// width: '40px',
							// height: '40px',
							// borderRadius: '100px',
							// margin: '0 6px'
						}
					},
					{
						id: 1,
						text: '收藏',
						icon: 'star-fill',
						iconSize: '20',
						style: {
							backgroundColor: '#3c9cff'
						}
					}
				],
				recommendList: [{
						id: 0,
						name: "健身 tuijian",
						rating: 4.5,
						distance: 1200,
						url: 'https://assets-global.website-files.com/5f3b1e7e87a54051ee78b018/61e51b4d1164450d4e93c5cd_Group.png'
					},
					{
						id: 1,
						name: "康潮健身 tuijian",
						rating: 1.9,
						distance: 80,
						url: 'https://assets-global.website-files.com/5f3b1e7e87a54051ee78b018/61e51b4d1164450d4e93c5cd_Group.png'
					},
					{
						id: 2,
						name: "康潮健身2 tuijian",
						rating: 1.9,
						distance: 80,
						url: 'https://assets-global.website-files.com/5f3b1e7e87a54051ee78b018/61e51b4d1164450d4e93c5cd_Group.png'
					},
					{
						id: 3,
						name: "康潮健身3 tuijian",
						rating: 1.9,
						distance: 80,
						url: 'https://assets-global.website-files.com/5f3b1e7e87a54051ee78b018/61e51b4d1164450d4e93c5cd_Group.png'
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
			longtapList(e) {
				console.log(e);
			},
		},
		created() {
			//抓取活动
			// this.loadmore()
			console.log('展示了个寂寞？？');
		},
		// onReachBottom() {
		// 	this.loadmore();
		// }
	}
</script>

<style lang="scss" scoped>
	.home-gym {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 94%;
		margin: 8rpx 3%;
		-moz-box-shadow: 0px 0px 3px #b3b3b3;
		-webkit-box-shadow: 0px 0px 3px #b3b3b3;
		box-shadow: 0px 0px 2px #b3b3b3;

		&__content {
			padding: 24rpx 0;
			display: flex;

			&__text {
				display: flex;
				font-size: 36rpx;
				color: black;
				padding-left: 24rpx;
			}

			&__pic {
				padding-left: 24rpx;
			}
		}
	}

	.gym-pic {
		width: 96rpx;
		height: 96rpx;
	}
</style>
