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
	/*每个页面公共css */
  page {
    background-color: $page-bg-color;

    /* display: flex; */
    /* flex-direction: column; */

    font-size: 28rpx;
    color: $text-p-color;
  }
</style>
