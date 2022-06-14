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
			<view class="info-wapper" style="margin-top: 40upx;width: 95%;">
				<label class="words-lbl">确认</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请确认密码"
					placeholder-class="graywords" />
			</view>

			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">注册</button>
		</form>
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
					url: 'auth/register',
					data: {
						"username": username,
						"password": password
					},
					method: 'POST',
				}).then(res => {
					uni.switchTab({
						url: "../me/me"
					});
					// 获取真实数据之前，务必判断状态是否为200
					// console.log(res.data);
					if (res.code == 200) {
						var userInfo = res.data;
						// console.log("注册成功");
						// 保存用户信息到全局的缓存中
						// uni.setStorageSync("globalUser", userInfo);
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
	@import url("register.css");
</style>
