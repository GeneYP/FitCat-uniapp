<template>
	<view>
		<!-- <u-empty v-if="recommendList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty> -->
		<u-divider text="暂无团课" v-if="recommendList.length == 0"></u-divider>
		<view class="home-root" v-for="(course, courseIndex) in recommendList" :key="course.id">
			<view class="home-course">
				<view class="home-course__content" @longpress="longtapList(courseIndex)">
					<view class="home-course__content__pic">
						<image class="course-pic" :src="course.head"></image>
						<text class="course-teacher">{{course.teacher}}</text>
					</view>
					<view class="home-course__content__text">
						<text class="course-name">{{course.name}}</text>
						<view class="course-info">
							<text class="course-info__level">
								{{course.level <= 1 ? '零基础' : course.level < 3 ? '新手推荐' : course.level < 5 ? '强化训练' : '高手进阶'}}
							</text>
							<u-rate activeIcon="heart-fill" inactiveIcon="heart" :value="course.level" readonly
								:activeColor="course.level < 2 ? 'primary' : course.level < 4 ? 'success' : 'error'">
							</u-rate>
						</view>
						<view class="course-detail">
							<text class="course-detail__time">
								{{course.time}}
								<text class="course-detail__cost" v-if="course.cost != 0">
									¥{{course.cost}}/人
								</text>
							</text>
							<view class="course-detail__taglist">
								<view class="course-detail__tag">
									<u-tag :text="course.tag" type="primary" size="mini" plain plainFill>
									</u-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 长按遮罩层 -->
			<view class="course-mask" v-if="maskFlag == courseIndex" @click="maskFlag=-1">
				<button class="course-mask__hate" @click="clickHate(courseIndex)">
					<u-icon name="trash-fill" color="#0f80ff" size="30"></u-icon>
				</button>
				<button class="course-mask__love" @click="clickLove(courseIndex)">
					<u-icon name="heart-fill" color="#ff5757" size="32"></u-icon>
				</button>
			</view>
		</view>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" @loadmore="loadmore"/>
	</view>
</template>

<script>
	export default {
		name: "courseList",
		data() {
			return {
				status: 'loadmore',
				loadingText: '拼命加载中...',
				loadmoreText: '轻轻上拉，精彩继续',
				nomoreText: '别看了，已经没有了',
				maskFlag: -1,
				defaultIcon: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/logo.png',
				recommendList: [
					// {
					// 	id: 0,
					// 	name: "Body Pump 哑铃塑形",
					// 	teacher: '高老师',
					// 	level: 2,
					// 	head: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/f1a10e0d8fd308e9529250c9d49bf911.jpg',
					// 	cost: 16,
					// 	time: '10:00-11:00',
					// 	tag: ['全面训练', '体能提升']
					// },
					// {
					// 	id: 1,
					// 	name: "Zumba 南美燃脂舞",
					// 	teacher: '许玄明',
					// 	level: 4,
					// 	head: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/eh3WDaS9iFEJmh5YM4T.jpg',
					// 	cost: 16,
					// 	time: '10:00-11:00',
					// 	tag: ['波比跳', '体能提升']
					// },
					// {
					// 	id: 2,
					// 	name: "休闲拉伸课",
					// 	teacher: '张晓明',
					// 	level: 1,
					// 	head: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/f1a10e0d8fd308e9529250c9d49bf911.jpg',
					// 	cost: 16,
					// 	time: '10:00-11:00',
					// 	tag: []
					// },
					// {
					// 	id: 3,
					// 	name: "BUMP 燃脂单车",
					// 	teacher: '许无',
					// 	level: 5,
					// 	head: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/eh3WDaS9iFEJmh5YM4T.jpg',
					// 	cost: 16,
					// 	time: '10:00-11:00',
					// 	tag: ['全面训练', '体能提升', '增肌', '减脂塑形']
					// },
				]
			};
		},
		methods: {
			loadmore(gymId) {
				this.status = 'loading';
				console.log('rec.loadmore被调用');
				this.$request.request({
					url: 'gym/session/' + gymId,
					method: 'GET',
				}).then(res => {
					// var gymTag = new Array(2);
					for (let i = 0; i < res.data.length; i++) {
						console.log(res.data[i]);
						var courseDate = '2022年6月' + (i + 15) + '日';
						this.recommendList.push({
							id: res.data[i].id,
							name: res.data[i].name,
							teacher: '线下课',
							level: res.data[i].level,
							head: res.data[i].img,
							cost: 30 + Math.round(Math.random() * (9 - 2)) + 2,
							tag: res.data[i].tag,
							time: courseDate,
						})
					};
				});
				this.status = 'nomore';

			},
			loadCourse(resource) {
				console.log("课程加载中ing：", resource);
			},
			longtapList(index) {
				this.maskFlag = index;
				console.log("长按了第个课程：", index);
			},
			clickLove(course) {
				console.log("love", course);
			},
			clickHate(course) {
				console.log("hate", course);
				this.recommendList.splice(course, 1);
				var uid = uni.getStorageSync('userId');
				if(uid == 10000005){
					uni.setStorageSync('userId', 30031781);
					console.log("帮你cut掉单车");
				} else if(uid == 30031781) {
					uni.setStorageSync('userId', 10000005);
				}
			}
		},
		created() {
			//抓取活动
			// this.loadmore()
			console.log('展示了个寂寞？');
			if(this.recommendList.length == 0) {
				var uid = uni.getStorageSync('userId');
				if(uid == 10000005){
					this.loadmore(1677307);
					console.log("帮你cut掉单车");
				} else if(uid == 30031781) {
					this.loadmore(32450322);
				}
				// this.loadmore(1677307);
			}
		},
		// onReachBottom() {
		// 	this.loadmore();
		// }
	}
</script>

<style lang="scss" scoped>
	.home-course {
		height: 260rpx;
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
				width: 150rpx;
				height: 100%;
				position: relative;
				overflow: hidden;
			}
		}
	}

	.course-name {
		font-size: 38rpx;
		font-weight: 500;
		width: 420rpx;
		// background-color: red;
		/* 超过一行用点显示 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.course-info {
		display: flex;
		margin-top: 10rpx;

		&__level {
			font-size: 30rpx;
			font-weight: 400;
			white-space: nowrap;
			color: #666666;
			padding-right: 12rpx;
		}
	}

	.course-detail {
		display: flex;
		flex-direction: column;
		padding-top: 6rpx;

		&__cost {
			font-size: 36rpx;
			white-space: nowrap;
			color: #fd8008;
			padding-left: 32rpx;
		}

		&__time {
			padding-top: 4rpx;
			font-size: 36rpx;
			font-weight: 700;
			white-space: nowrap;
			color: #191919;
			padding-right: 12rpx;
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

	.course-pic {
		height: 150rpx;
		width: 150rpx;
		border-radius: 90rpx;
	}

	.course-teacher {
		display: flex;
		justify-content: center;
		padding-top: 12rpx;
		font-size: 32rpx;
		font-weight: 400;
	}

	.course-mask {
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
