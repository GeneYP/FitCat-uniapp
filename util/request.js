import config from "./config.js"
export const request = (options) => {
	return new Promise((resolve, reject) => {
		let token = uni.getStorageSync('authorization')
		// 在登录的时候需要储存 token uni.setStorageSync("authorization","这里是登录获取的token值")
		uni.request({
			url: config.baseUrl + options.url,
			data: options.data || {},
			method: options.method || 'POST',
			header: options.header || {
				// 根据实际接口设计 key 取 token 或者 authorization
				authorization: token,
			},
			success: (res) => {
				// console.log(res.data); // 控制台显示数据信息
				resolve(res.data)
			},
			fail: (err) => {
				// 页面中弹框显示失败
				uni.showToast({
					title: '请求接口失败'
				})
				// 返回错误消息
				reject(err)
			},
			catch: (e) => {
				console.log(e);
			}
		})
	})
}
// 将对象导出外部引入使用
export default {
	request
}
