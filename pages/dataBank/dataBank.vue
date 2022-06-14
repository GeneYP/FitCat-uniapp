<template>
	<view>
		<!-- <swiper class="swiper-total" :current="current" @change="onchange"> -->
		<view class="food-list" v-if="current == 0">
			<foodList ref="foodCart"></foodList>
		</view>
		<view v-if="current == 1" class="swiper-total-item">
			<view class="goal-bg">
				<text class="goal-bg__title">
					评估结果
				</text>
				<!-- <image class="goal-bg__rank" :src="rank"></image> -->
				<view class="goal-bg__rank">
					<view class="goal-bg__item">
						<image class="item-dot blue tui-mr"></image>
						<text class="rank-title">碳水化物</text>
					</view>
					<view class="goal-bg__item">
						<text class="score-big">{{sugar.toFixed(2)}}</text>
						<text class="score-small">/ {{sugar_s}} 克</text>
					</view>
					<view class="goal-bg__item">
						<view class="item-dot yellow tui-mr"></view>
						<text class="rank-title">蛋白质</text>
					</view>
					<view class="goal-bg__item">
						<text class="score-big">{{protein.toFixed(2)}}</text>
						<text class="score-small">/ {{protein_s}} 克</text>
					</view>
					<view class="goal-bg__item">
						<view class="item-dot red tui-mr"></view>
						<text class="rank-title">脂肪</text>
					</view>
					<view class="goal-bg__item">
						<text class="score-big">{{fat.toFixed(2)}}</text>
						<text class="score-small">/ {{fat_s}} 克</text>
					</view>
					<view class="rank-progress">
						<image class="rank-progress__img" :src="rank"></image>
						<tui-circular-progress class="rank-progress__sugar" :fontShow="false" @end="reRank"
							:percentage="(sugar/sugar_s*100).toFixed(0)" :diam="176" :lineWidth="12" lineCap="butt"
							progressColor="#50abf8" defaultColor="#e6e7e9" fontColor="#FFFFFF">
						</tui-circular-progress>
						<tui-circular-progress class="rank-progress__protein" :fontShow="false" @end="reRank"
							:percentage="(protein/protein_s*100).toFixed(0)" :diam="142" :lineWidth="12" lineCap="butt"
							progressColor="#f5c242" defaultColor="#e6e7e9" fontColor="#FFFFFF">
						</tui-circular-progress>
						<tui-circular-progress class="rank-progress__fat" :fontShow="false" @end="reRank"
							:percentage="(fat/fat_s*100).toFixed(0)" :diam="108" :lineWidth="12" lineCap="butt"
							progressColor="#e46b66" defaultColor="#e6e7e9" fontColor="#FFFFFF">
						</tui-circular-progress>
					</view>
				</view>
			</view>
			<!-- 建议 -->
			<view class="tui-menu-item">
				<image class="tui-user-avatar tui-mr"
					src="https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/兽设_像素.jpeg"></image>
				<view class="tui-chat-box">
					<tui-bubble-popup direction="left" position="relative" :mask="false" :show="true"
						triangleLeft="-22rpx" triangleTop="30rpx" width="100%" backgroundColor="#52ab39">
						<view class="tui-chat-text">{{advice}}</view>
					</tui-bubble-popup>
				</view>
			</view>
			<!-- 食物列表 -->
			<u-empty v-if="foodList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
			</u-empty>
			<view class="home-root" v-for="(food, foodIndex) in foodList" :key="foodIndex">
				<view class="home-food" @click="popUp(foodIndex)">
					<view class="home-food__pic">
						<image class="food-pic" :src="food.img"></image>
					</view>
					<view class="home-food__content">
						<text class="food-name">{{food.name}}</text>
						<view class="food-info">
							<text class="food-info__level">
								<!-- {{food.level <= 1 ? '零基础' : food.level < 3 ? '初级' : food.level < 5 ? '中级' : '高级'}} -->
								碳水化物：{{food.sugar}} · 蛋白质：{{food.protein}} · 脂肪：{{food.fat}}
							</text>
							<text class="food-info__text" v-for="(tag, tagIdx) in food.tag" v-if="tagIdx < 3"
								:key="tagIdx">
								·&nbsp;{{food.tag[tagIdx]}}
							</text>
						</view>
					</view>
				</view>
				<!-- <u-popup :show="popup" @close="popClose" overlayOpacity="0.3" round="16">
					<view class="food-pop">
						<view class="food-detail">
							<image class="food-detail__img" :src="food.img"></image>
							<view class="food-detail__text">
								<text>{{food.name}}</text>
								<text>{{food.sugar}}</text>
								<text>{{food.protein}}</text>
								<text>{{food.fat}}</text>
							</view>
						</view>
						<u--input placeholder="请输入质量 单位: 克" border="bottom"></u--input>
					</view>
				</u-popup> -->
			</view>
		</view>
		<!-- </swiper> -->
		<tui-tabbar :current="tabIdx" backdropFilter backgroundColor="#333333" :tabBar="tabBar" color="#FFFFFF"
			selectedColor="#FFCC33" @click="change"></tui-tabbar>
	</view>
</template>

<script>
	import tuiCircularProgress from "@/components/thorui/tui-circular-progress/tui-circular-progress.vue"
	import tuiTabbar from "@/components/thorui/tui-tabbar/tui-tabbar.vue"
	import tuiBubblePopup from "@/components/thorui/tui-bubble-popup/tui-bubble-popup"
	export default {
		components: {
			tuiCircularProgress,
			tuiTabbar,
			tuiBubblePopup
		},
		data() {
			return {
				tabIdx: 0,
				current: 0,
				popup: false,
				showKey: false,
				sugar: 0,
				sugar_s: 213,
				protein: 0,
				protein_s: 109,
				fat: 0,
				fat_s: 61,
				rank: '../../static/image/d.png',
				advice: '你现在还没有添加饮食哦，快点击下方导航栏去添加吧！',
				tabBar: [{
						text: '食物列表',
						iconPath: '/static/tabbar/food.png',
						selectedIconPath: '/static/tabbar/food_select.png'
					},
					{
						text: '智能评估',
						iconPath: '/static/tabbar/eval.png',
						selectedIconPath: '/static/tabbar/eval_select.png'
					}
				],
				foodList: [
					// {
					// 	name: '全脂拿铁',
					// 	img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/150_无糖全脂拿铁.png',
					// 	sugar: 4.36,
					// 	protein: 2.81,
					// 	fat: 1.62,
					// 	weight: 250,
					// },
					// {
					// 	name: '牛肚',
					// 	img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/137_牛肚.png',
					// 	sugar: 1.01,
					// 	protein: 1.61,
					// 	fat: 14.51,
					// 	weight: 250,
					// },
					// {
					// 	name: '沼虾',
					// 	img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/132_罗氏 沼虾.png',
					// 	sugar: 60,
					// 	protein: 50,
					// 	fat: 90,
					// 	weight: 250,
					// },
					// {
					// 	name: '食4品名称',
					// 	img: 'https://cdn.jsdelivr.net/gh/GeneYP/Image-host@main/img/128_白姑鱼(鱼).png',
					// 	sugar: 125,
					// 	protein: 50,
					// 	fat: 0,
					// 	weight: 250,
					// }
				],

			};
		},
		methods: {
			change(e) {
				// console.log(e)
				this.tabIdx = e.index;
				this.current = e.index;
				if (this.current == 1){
					var cart = this.$refs.foodCart.getCart();
				}
				if (cart != null) {
					this.foodList = cart;
					console.log('食物列表：', this.foodList);
					this.sugar = 0;
					this.protein = 0;
					this.fat = 0;
				}
				this.reCalc();
			},
			reCalc(){
				this.sugar = 0;
				this.protein = 0;
				this.fat = 0;
				for (let i = 0; i < this.foodList.length; i++) {
					this.sugar += parseFloat(this.foodList[i].sugar) * 2.5;
					this.protein += parseFloat(this.foodList[i].protein) * 2.5;
					this.fat += parseFloat(this.foodList[i].fat) * 2.5;
				};
				this.sugar = parseFloat(this.sugar);
				this.protein = parseFloat(this.protein);
				this.fat = parseFloat(this.fat);
			},
			// swiper改变
			// onchange(e) {
			// 	this.tabIdx = e.detail.current;
			// 	this.current = e.detail.current;
			// },
			reRank() {
				var sugar_score = this.sugar / this.sugar_s;
				var protein_score = this.protein / this.protein_s;
				var fat_score = this.fat / this.fat_s;
				var score_all = (sugar_score + protein_score + fat_score) * 100 / 3 - 100;
				var too_much = '';
				var not_enough = '';
				if (sugar_score > 1.15) too_much += '碳水化物 ';
				if (protein_score > 1.15) too_much += '蛋白质 ';
				if (fat_score > 1.15) too_much += '油脂 ';
				if (sugar_score <= 0.9) not_enough += '碳水化物 ';
				if (protein_score <= 0.9) not_enough += '蛋白质 ';
				if (fat_score <= 0.9) not_enough += '油脂 ';
				if (too_much != '' && not_enough != '') {
					this.advice = '营养摄入不够均衡哦，试着多吃点 高' + not_enough + '的食品，降低 高' + too_much + '食物的过量摄入';
				} else if (too_much == '' && not_enough != '') {
					this.advice = not_enough + '摄入不够多哦，试着多吃点吧！';
				} else if (not_enough == '' && too_much != '') {
					this.advice = too_much + '吃太多啦，下顿记得稍微控制一下哦～';
				} else {
					this.advice = '营养搭配得很均衡哦，继续保持！';
				}
				if (score_all == -100) this.advice = '你现在还没有添加饮食哦，快点击下方导航栏去添加吧！';
				if ((score_all < 2) && (score_all > -2)) {
					this.rank = '../../static/image/sp.png';
				} else if ((score_all < 5) && (score_all > -5)) {
					this.rank = '../../static/image/s.png';
				} else if ((score_all < 10) && (score_all > -10)) {
					this.rank = '../../static/image/a.png';
				} else if ((score_all < 20) && (score_all > -20)) {
					this.rank = '../../static/image/b.png';
				} else if ((score_all < 30) && (score_all > -30)) {
					this.rank = '../../static/image/c.png';
				} else if ((score_all < 40) && (score_all > -40)) {
					this.rank = '../../static/image/d.png';
				};
			},
			// popClose() {
			// 	this.popup = false;
			// 	this.showKey = false;
			// },
			popUp(food) {
				// this.popup = true;
				// this.showKey = true;
				console.log(food);
				this.foodList.splice(food, 1);
				this.reCalc();
			},
			focusIn() {
				// this.showKey = true;
				// uni.$u.test.number('2020');
			}

		},
		onLoad() {
			for (let i = 0; i < this.foodList.length; i++) {
				this.sugar += this.foodList[i].sugar;
				this.protein += this.foodList[i].protein;
				this.fat += this.foodList[i].fat;
			};
			// this.reRank();
		}
	}
</script>

<style lang="scss">
	.food-list {
		padding-bottom: 210rpx;
	}

	.swiper-total-item {
		background-color: #F9F9F9;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: 210rpx;
	}

	.goal-bg {
		height: 500rpx;
		width: 94%;
		border-radius: 24rpx;
		margin: 24rpx 3%;
		// -moz-box-shadow: 0px 0px 3px #b3b3b3;
		// -webkit-box-shadow: 0px 0px 3px #b3b3b3;
		// box-shadow: 0px 0px 3px #b3b3b3;
		// background-color: #303030;
		// background-image: linear-gradient(to right top, #f7e4b1, #f3a530);
		background-image: linear-gradient(to bottom, #23272d, #505052);
		display: flex;
		flex-direction: column;

		&__title {
			color: #FFFFFF;
			font-size: 46rpx;
			font-weight: 600;
			padding-left: 30rpx;
			padding-top: 30rpx;
		}

		&__rank {
			width: 40%;
			display: flex;
			flex-direction: column;
			padding-left: 60%;
		}

		&__item {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}

	.rank-title {
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: 500;
		padding: 6rpx 0;
	}

	.item-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
	}

	.blue {
		background-color: #50abf8;
	}

	.red {
		background-color: #e46b66;
	}

	.yellow {
		background-color: #f5c242;
	}

	.score-big {
		color: #FFFFFF;
		font-size: 46rpx;
		font-weight: 700;
		padding-right: 14rpx;
	}

	.score-small {
		color: #cccccc;
		font-size: 26rpx;
		font-weight: 500;
	}

	.rank-progress {
		position: absolute;
		// z-index: 12;
		left: 56rpx;
		top: 134rpx;

		&__protein {
			position: absolute;
			// z-index: 14;
			left: 34rpx;
			top: 34rpx;
		}

		&__fat {
			position: absolute;
			// z-index: 16;
			left: 68rpx;
			top: 68rpx;
		}

		&__img {
			position: absolute;
			// z-index: 18;
			width: 212rpx;
			height: 72rpx;
			left: 68rpx;
			top: 138rpx;
		}
	}

	.tui-user-avatar {
		width: 84rpx;
		height: 84rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.tui-mr {
		margin-right: 24rpx;
	}

	.tui-chat-box {
		max-width: 78%;
	}

	.tui-chat-text {
		width: 100%;
		min-width: 40rpx;
		padding: 18rpx 24rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		word-break: break-all;
		box-sizing: border-box;
	}

	.tui-menu-item {
		width: 100%;
		padding-left: 24rpx;
		padding-top: 4rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		display: flex;
		position: relative;
	}
</style>
