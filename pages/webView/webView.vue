<template>
	<web-view :src="goUrl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				goUrl:''
			}
		},
		methods: {
			
		},
		onLoad(res) {
			this.goUrl = res.url;
		}
	}
</script>

<style>

</style>
