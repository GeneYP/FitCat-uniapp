<template>
	<view class="content">
		<map class="map" 
		scale='16' 
		:latitude="latitude" 
		:longitude="longitude" 
		:markers="covers" 
		:show-location="true"
		@markertap="markertap"
		@tap="tap" 
		@updated="updated">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// title: '百度地图',
				latitude: 21.1508,
				longitude: 110.3011,
				covers: [] //标记点地图数据
			}
		},
		methods: {
			init() {
				let that = this;
				console.log("init()")
				//发起网络请求获取数据
				//用uni.request(OBJECT)方法
				//我这里模拟下数据
				var data = [{
					id: 1,
					name: '广东海洋大学',
					imgUrl: '../static/pin.png',
					lat: "21.1508",
					lng: "110.3011"
				}, {
					id: 2,
					name: '李彦宏',
					imgUrl: '../static/pin.png',
					lat: "34.763466",
					lng: "113.686285"
				}, {
					id: 3,
					name: '马化腾',
					imgUrl: '../static/pin.png',
					lat: "34.763412",
					lng: "113.680185"
				}, ];
				//获取用户所在位置
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						console.log(res);
						let latitude = res.latitude;
						let longitude = res.longitude;
						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' +
								longitude +
								'&key=UGMBZ-S5AKU-YQGV3-47M5J-BAQ62-ZBBJW',
							success: data => {
								console.log(data.data.result.address_component);
								that.longitude = longitude
								that.latitude = latitude
							}
						});
						that.MapData(that, data)
					}
				})
				
			},
			//地图数据初始化
			MapData(that, data) {
				console.log(data.length)
				console.log(data)
				let arrayData = [];
				for (var i = 0; i < data.length; i++) {
					arrayData.push({
						id: data[i].id, //marker点击事件回调会返回此id。建议为每个marker设置上Number类型id，保证更新marker时有更好的性能。
						latitude: data[i].lat, //纬度
						longitude: data[i].lng, //经度
						// title: data[i].name, //点击时显示，callout存在时将被忽略
						iconPath: data[i].imgUrl, //项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径
						width: 36,
						height: 36,
						callout: {
							//自定义标记点上方的气泡窗口
							content: data[i].name,
							color: '', //文本颜色
							fontSize: 12, //文字大小
							borderRadius: 8, //callout边框圆角
							bgColor: '', //背景色
							padding: 6, //文本边缘留白
							display: 'BYCLICK', //'BYCLICK':点击显示; 'ALWAYS':常显
							textAlign: 'left', //文本对齐方式。有效值: left, right, center
						},
						anchor: {
							//经纬度在标注图标的锚点，默认底边中点      {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
							x: .5,
							y: 1
						}
					});
				}
				console.log(arrayData.length)
				console.log(arrayData)
				//重新给地图数据赋值covers 
				that.covers = arrayData;
			},
			//地图点击事件
			markertap(e) {
				console.log("===你点击了标记点===")
				console.log("你点击的标记点ID是:" + e.detail.markerId)
				//console.log(e)
			},
			//点击地图时触发; App-nuve、微信小程序2.9支持返回经纬度
			tap(e) {
				console.log("===你点击了地图点===")
				console.log(e)
				// this.init();
			},
			//在地图渲染更新完成时触发
			updated(e) {
				console.log("===在地图渲染更新完成时触发===")
				console.log(e)
				this.init();
			}
			
		}
	}
</script>

<style>
	.map {
		width: 100%;
		height: 350rpx;
	}
</style>
