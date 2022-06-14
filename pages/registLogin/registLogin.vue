<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/logo.png" class="face"></image>
			</view>

			<view class="info-wapper" style="width: 95%;">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名"
					placeholder-class="graywords" />
			</view>

			<view class="info-wapper" style="margin-top: 40upx;width: 95%;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码"
					placeholder-class="graywords" />
			</view>

			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">登录</button>
		</form>


		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
		<view class="third-wapper">

			<view class="third-line">
				<view class="single-line">
					<view class="line"></view>
				</view>

				<view class="third-words">第三方账号注册</view>

				<view class="single-line">
					<view class="line"></view>
				</view>
			</view>
			<navigator url="../register/register">
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
					<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin"
						class="third-ico"></image>
					<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin" class="third-ico"
						style="margin-left: 80upx;"></image>
					<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin"
						class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<button open-type='getUserInfo' class="third-btn-ico">
					</button>
					<!-- #endif -->
				</view>
			</navigator>
		</view>
		<!-- #endif -->
	</view>
</template>


<script>
	export default {
		data() {
			return {
				baseUrl: "http://localhost:8080/api/fc/"
			};
		},
		methods: {
			formSubmit(e) {
				var me = this;
				var username = e.detail.value.username;
				var password = e.detail.value.password;
				this.$request.request({
					url: 'auth/login',
					data: {
						"username": username,
						"password": password
					},
					method: 'POST',
				}).then(res => {
					// 获取真实数据之前，务必判断状态是否为200
					// console.log(res.data);
					if (res.code == 200) {
						var userInfo = res.data;
						// console.log("注册成功");
						// 保存用户信息到全局的缓存中
						uni.setStorageSync("authorization", userInfo);
						this.$request.request({
							url: '/user/userId',
							method: 'GET',
						}).then(res => {
							console.log("userID", res);
							uni.setStorageSync("userId", res);
						})
						uni.switchTab({
							url: "../home/home"
						});
						// 切换页面跳转，使用tab切换的api
					} else if (res.code == 500) {
						uni.showToast({
							title: res.data.msg,
							duration: 2000,
							image: "../../static/unlogin.png"
						})
					}
				})
			}
		}
	}
</script>

<style>
	@import url("registLogin.css");
</style>
