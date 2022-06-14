<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* colorui太大了，不用 */
	/* 	@import "colorui/main.css";
	@import "colorui/icon.css"; */
	@import url("uni_modules/uni-icons/components/uni-icons/uniicons.css");
	@import "@/uni_modules/uview-ui/index.scss";

	/*每个页面公共css */
	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 0px;
	}

	.search-btn {
		margin-left: 18rpx;
		white-space: nowrap;
		height: 60rpx;
		border-radius: 28rpx;
		text-align: center;
		font-size: 28rpx;
		background-color: #ffcc33;
	}

	.home-menu {
		background-color: #FFFFFF;
		width: 92%;
		margin: 40rpx 4%;
		border-radius: 16rpx;
		-moz-box-shadow: 0px 0px 8px #b3b3b3;
		-webkit-box-shadow: 0px 0px 8px #b3b3b3;
		box-shadow: 0px 0px 8px #b3b3b3;
		// margin-top: -50rpx;
	}

	.home-menu-img {
		height: 136rpx;
		width: 136rpx;
		margin-top: 16rpx;
	}

	.home-root {
		position: relative;
	}

	.home-gym {
		height: 300rpx;
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
				width: 240rpx;
				height: 260rpx;
				position: relative;
				overflow: hidden;
				border-radius: 20rpx;
			}
		}
	}

	.gym-name {
		font-size: 38rpx;
		font-weight: 500;
		width: 420rpx;
		// background-color: red;
		/* 超过一行用点显示 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.gym-info {
		width: 70rpx;
		display: flex;
		background-color: #035397;
		margin-top: 10rpx;
		border-radius: 30rpx 0 30rpx 30rpx;

		&__rate {
			padding-left: 12rpx;
			font-size: 32rpx;
			color: #FFFFFF;
		}

		&__eval {
			padding-left: 18rpx;
			font-size: 30rpx;
			font-weight: 500;
			white-space: nowrap;
			color: #035397;
		}

		&__member {
			padding-left: 18rpx;
			font-size: 30rpx;
			white-space: nowrap;
			color: #035397;
		}
	}

	.gym-detail {
		display: flex;
		flex-direction: column;
		padding-top: 6rpx;

		&__cost {
			font-size: 28rpx;
			white-space: nowrap;
			color: #fd8008;
			padding-left: 12rpx;
		}

		&__distance {
			padding-top: 4rpx;
			font-size: 30rpx;
			white-space: nowrap;
			color: #191919;
		}

		&__time {
			padding-top: 6rpx;
			font-size: 24rpx;
			white-space: nowrap;
			color: #666666;
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


	.gym-pic {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		/* 图片原宽高去缩放，选择宽高缩放比中较大的一个 */
		/* 如这里图片原宽高是 496*640, 宽缩放比=100/496,高缩放比=100/640,则较大的为100/496~0.2 */
		transform: scale(0.6) translate(-50%, -50%);
	}

	.gym-mask {
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
	
	.home-food {
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
	
	.food-pic {
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		/* 图片原宽高去缩放，选择宽高缩放比中较大的一个 */
		/* 如这里图片原宽高是 496*640, 宽缩放比=100/496,高缩放比=100/640,则较大的为100/496~0.2 */
		transform: scale(1.2) translate(-50%, -50%);
	}
	
	.food-name {
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
	
	.food-info {
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

	/* .pos-bottom {
		position: fixed !important;
		bottom: 0 !important;
		width: 100%;
	} */
</style>
