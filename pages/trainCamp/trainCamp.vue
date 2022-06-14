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
		<view class="home-root" v-for="(plan, planIndex) in recommendList" :key="plan.id">
			<view class="home-plan" @click="navToUrl(planIndex)">
				<view class="home-plan__pic">
					<image class="plan-pic" :src="plan.img"></image>
				</view>
				<view class="home-plan__content">
					<text class="plan-name">{{plan.name}}</text>
					<view class="plan-info">
						<text class="plan-info__level">
							{{plan.level <= 1 ? '零基础' : plan.level < 3 ? '初级' : plan.level < 5 ? '中级' : '高级'}}
						</text>
						<text class="plan-info__text" v-for="(tag, tagIdx) in plan.tag" v-if="tagIdx < 3" :key="tagIdx">
							·&nbsp;{{plan.tag[tagIdx]}}
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
				defaultIcon: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/9CACD21541F975EA560D37BF99493CD3.jpg',
				recommendList: [{
						id: 0,
						name: "瘦子增重 上半身增肌计划",
						level: 2,
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/8C4A69E91EB043E8BD6994054341C0B7.jpg',
						url: 'https://zhuanlan.zhihu.com/p/72035758',
						tag: ['增肌', '力量提升']
					},
					{
						id: 1,
						name: "告别肚腩 高效减脂计划",
						level: 5,
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/0C15599CE6EECA07967DA545DCE43989.jpg',
						url: 'https://zhuanlan.zhihu.com/p/412235330',
						tag: ['减脂']
					},
					{
						id: 2,
						name: "体态纠正 告别弯腰驼背",
						level: 1,
						img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/22625E86F8C5D78976E06D43CF7D5B28.jpg',
						url: 'https://zhuanlan.zhihu.com/p/457394165',
						tag: ['拉伸', '体态纠正']
					},
				]
			};
		},
		methods: {
			search(e) {
				console.log(e.target.value);
			},
			loadPlan(resource) {
				console.log("课程加载中ing：", resource);
			},
			navToUrl(index) {
				uni.navigateTo({
					url: "../../pages/webView/webView?url=" + this.recommendList[index].url
				})
			}
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

	.home-plan {
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

	.plan-pic {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		/* 图片原宽高去缩放，选择宽高缩放比中较大的一个 */
		/* 如这里图片原宽高是 496*640, 宽缩放比=100/496,高缩放比=100/640,则较大的为100/496~0.2 */
		transform: scale(1.2) translate(-50%, -50%);
	}

	.plan-name {
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

	.plan-info {
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
