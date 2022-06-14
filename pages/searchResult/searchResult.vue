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
		<u-empty v-if="gymList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<!-- 健身房列表 -->
		<view class="home-root" v-for="(gym, gymIndex) in gymList" :key="gym.id">
			<view class="home-gym">
				<view class="home-gym__content">
					<view class="home-gym__content__pic">
						<image class="gym-pic" :src="gym.url"></image>
					</view>
					<view class="home-gym__content__text">
						<text class="gym-name">{{gym.name}}</text>
						<view class="gym-info">
							<text class="gym-info__rate">{{gym.rating}}</text>
							<text
								class="gym-info__eval">{{gym.rating >= 4.7 ? '超棒' : gym.rating >= 4.3 ? '很好' : ''}}</text>
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
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gymList: [{
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
			search(e) {
				console.log(e.target.value);
			}
		},
		onLoad(options) {
			var dataSearch = options.search;
			console.log(dataSearch);

			// 抓取活动
			// TODO：loadGym获取距离升序的健身房
		},
		onShow() {

		},
	}
</script>

<style lang="scss">
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
