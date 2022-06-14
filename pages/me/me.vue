<template>
	<view class="page page-fill">

		<view class="header">
			<view v-if="userIsLogin">
				<image :src="pic" class="face"></image>
			</view>
			<view v-else>
				<image src="../../static/unlogin.png" class="face"></image>
			</view>

			<view class="info-wapper" v-if="userIsLogin">
				<view class="nickname">
					{{name}}
				</view>
				<view class="nav-info">ID：{{username}}</view>
			</view>
			<view v-else>
				<navigator url="../registLogin/registLogin">
					<view class="nickname regist-login">
						注册/登录
					</view>
				</navigator>
			</view>

			<view class="set-wapper" v-if="userIsLogin">
				<navigator url="../meInfo/meInfo">
					<image src="../../static/setting.png" class="settings"></image>
				</navigator>
			</view>
		</view>
		<view class="ui-all" v-if="userIsLogin">
			<view class="ui-list right">
				<text>性别</text>
				<picker @change="bindPickerChange" mode='selector' range-key="name" :value="index" :range="sex">
					<view class="picker">
						{{sex[index].name}}
					</view>
				</picker>
			</view>
			<view class="ui-list right">
				<text>常住地</text>
				<picker @change="bindRegionChange" mode='region'>
					<view class="picker">
						{{region[0]}} {{region[1]}} {{region[2]}}
					</view>
				</picker>
			</view>
			<view class="ui-list">
				<text>年龄</text>
				<input type="number" :placeholder="value" :value="age" @input="bindAge" placeholder-class="place"
					style="box-shadow: 0 0 0 54rpx #fff inset;" />
				<text>岁</text>
			</view>
			<view class="ui-list">
				<text>身高</text>
				<input type="digit" :placeholder="value" :value="height" @input="bindHeight" placeholder-class="place"
					style="box-shadow: 0 0 0 54rpx #fff inset;" />
				<text>cm</text>
			</view>
			<view class="ui-list">
				<text>体重</text>
				<input type="digit" :placeholder="value" :value="weight" @input="bindWeight" placeholder-class="place"
					style="box-shadow: 0 0 0 54rpx #fff inset;" />
				<text>kg</text>
			</view>
			<view class="ui-list gym-detail-taglist right" @click="popHobby">
				<text>爱好</text>
				<view class="gym-detail-tag" v-for="(tag, tagIdx) in hobby" :key="tagIdx">
					<u-tag :text="hobby[tagIdx]"
						:type="hobby[tagIdx]=='力量举'? 'warning' : hobby[tagIdx]=='瑜伽' ? 'error' : hobby[tagIdx]=='游泳' ? 'primary' : hobby[tagIdx]=='单车' ? 'success' : 'info'"
						size="mini" plain plainFill></u-tag>
				</view>
				<u-popup :show="show">
					<text class="hobby-title">选择爱好标签</text>
					<u-line></u-line>
					<view class="hobby-box">
						<view class="hobby-check">
							<u-checkbox-group v-model="hobbyChoose" placement="column" @change="checkboxChange">
								<u-checkbox :customStyle="{marginBottom: '8px'}" v-for="(item, index) in hobbyList"
									:key="index" :label="item.name" :name="item.name">
								</u-checkbox>
							</u-checkbox-group>
						</view>
					</view>
					<view class="hobby-btn" @click="pushHobby">
						确认
					</view>
				</u-popup>
			</view>
			<button class="save" @click="saveInfo">保 存 修 改</button>
			<button class="logout" @click="logout">退 出 登 录</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				userIsLogin: false,
				userInfo: {},
				name: '',
				username: '',
				age: '',
				gender: '',
				hobby: [],
				hobbyChoose: [],
				hobbyList: [{
						name: '单车',
					},
					{
						name: '游泳',
					},
					{
						name: '力量举',
					},
					{
						name: '瑜伽',
					},
					{
						name: 'HIIT',
					},
					{
						name: '自由搏击',
					}
				],
				pic: '',
				height: '',
				weight: '',
				value: '请填写',
				sex: [{
					id: 1,
					name: '女'
				}, {
					id: 2,
					name: '男'
				}],
				index: 0,
				region: ['广东省', '广州市', '荔湾区'],
				date: '请填写',
				avater: '',
				description: '',
				url: '',
				nickName: '',
				mobile: '',
				headimg: ''
			};
		},
		methods: {
			bindPickerChange(e) {
				this.index = e.detail.value;
				console.log(this.index)
			},
			bindRegionChange(e) {
				this.region = e.detail.value;
			},
			bindAge(e) {
				this.age = e.detail.value;
			},
			bindHeight(e) {
				this.height = e.detail.value;
			},
			bindWeight(e) {
				this.weight = e.detail.value;
			},
			checkboxChange(n) {
				console.log('change', n);
			},
			popHobby(e) {
				this.show = true;
				console.log("弹出了", e)
				this.hobbyChoose = this.hobby;
			},
			pushHobby(e) {
				this.show = false;
				console.log("bu 弹出了", e)
				this.hobby = this.hobbyChoose;
			},
			saveInfo() {
				var hobbyInfo = '';
				for (let i = 0; i < this.hobby.length; i++) {
					if (i == this.hobby.length - 1) {
						hobbyInfo += (this.hobby[i]);
					} else {
						hobbyInfo += (this.hobby[i] + ',');
					}
				}
				// console.log(hobbyInfo);
				this.$request.request({
					url: '/user/update',
					data: {
						"username": this.username,
						"height": this.height,
						"weight": this.weight,
						"age": this.age,
						"hobby": hobbyInfo,
						"gender": this.index
					},
					method: 'POST',
				}).then(res => {
					console.log('更新用户信息。', res);
					uni.setStorageSync('weight', this.weight);
				})
			},
			logout() {
				this.$request.request({
					url: '/auth/logout',
					method: 'GET',
				}).then(res => {
					this.userIsLogin = false;
					uni.setStorageSync('userId', null);
				})
			}

		},
		onShow() {
			var me = this;
			// 用户状态的切换
			// 			var userInfo = uni.getStorageSync("globalUser");
			// 			if (userInfo != null && userInfo != "" && userInfo != undefined) {
			// 				me.userIsLogin = true;
			// 				me.userInfo = userInfo;
			// 			} else {
			// 				me.userIsLogin = false;
			// 				me.userInfo = {};
			// 			}
			var uid = uni.getStorageSync("userId");
			console.log('我获取到啦', uid)
			this.$request.request({
				url: 'user/info/' + uid,
				method: 'GET'
			}).then(res => {
				// console.log('用户信息', res.data)
				this.age = res.data.age;
				this.index = res.data.gender;
				this.height = res.data.height;
				this.weight = res.data.weight;
				this.pic = res.data.pic;
				var name = '鼎丰用户' + res.data.username.substr(6);
				this.name = name;
				this.username = res.data.username;
				var hobby = new Array();
				if(res.data.hobby != null){
					hobby = res.data.hobby.split(",");
				}
				this.hobby = hobby;
				this.userIsLogin = true;
			})
		}
	}
</script>

<style lang="less">
	@import url("me.css");

	.ui-all {
		padding: 20rpx 40rpx;

		.avatar {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			.imgAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;

				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
				}
			}

			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28rpx;
				margin-left: 40rpx;
			}

			&:after {
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-top: solid 1px #030303;
				border-right: solid 1px #030303;
				transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				/* IE 9 */
				-moz-transform: rotate(45deg);
				/* Firefox */
				-webkit-transform: rotate(45deg);
				/* Safari 和 Chrome */
				-o-transform: rotate(45deg);
				position: absolute;
				top: 85rpx;
				right: 0;
			}
		}

		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}

			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}

			button {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				background: none;
				margin: 0;
				padding: 0;

				&::after {
					display: none;
				}
			}

			picker {
				width: 90%;
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30rpx;
				left: 150rpx;
			}

			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}

			.place {
				color: #999999;
				font-size: 28rpx;
			}
		}

		.right:after {
			content: ' ';
			width: 20rpx;
			height: 20rpx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40rpx;
			right: 0;
		}

		.save {
			background: #030303;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
		.logout {
			background: #fd6666;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}

	.gym-detail-taglist {
		// padding-top: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.gym-detail-tag {
		margin-right: 12rpx;
		text-align: center;
	}

	.hobby-box {
		height: 320rpx;
		display: flex;
		flex-direction: column;
	}

	.hobby-title {
		font-size: 32rpx !important;
		margin: 20rpx 30rpx;
		font-weight: 500;
		color: #000000;
	}

	.hobby-check {
		margin: 20rpx 30rpx;
	}

	.hobby-btn {
		width: 60%;
		height: 60rpx;
		border-radius: 12rpx;
		margin: 30rpx 20%;
		background-color: #579af8;
		color: white;
		text-align: center;
		line-height: 60rpx;
	}

	.hobby-box-row {
		display: flex;
		flex-direction: row;
	}

	.hobby-tag {
		text-align: center;
		margin: 20rpx 24rpx 0rpx 12rpx;
	}
</style>
