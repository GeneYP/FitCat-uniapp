<template>
	<view>
		<u-empty v-if="recommendList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
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
						<text class="plan-info__text" v-for="(tag, tagIdx) in plan.tag" v-if="tagIdx < 3"
							:key="tagIdx">
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
		name: "planList",
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
			loadPlan(resource) {
				console.log("课程加载中ing：", resource);
			},
			navToUrl(index) {
				uni.navigateTo({
					url: "../../pages/webView/webView?url=" + this.recommendList[index].url
				})
			}
		},
		created() {
			//抓取活动
			// this.loadmore()
			console.log('展示了个寂寞？');
			var userWeight = uni.getStorageSync('weight');
			if (userWeight > 80) {
				this.recommendList.splice(0,1);
			} else {
				this.recommendList.splice(1,1);
			}
			// 返回用户的是不是新手、过重还是过轻、年龄等信息，接收计划类型
		},
		// onReachBottom() {
		// 	this.loadmore();
		// }
	}
</script>

<style lang="scss" scoped>
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
