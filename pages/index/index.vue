<template>
  <view class="content">
    <view class="theme-block">
      <view class="theme-title">排序算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/sort/sort?type=0">
          <!-- <image class="algo-pic" src="../../static/algo-icons/bubble-sort.png"></image> -->
          <view class="algo-name">冒泡</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort?type=1">
          <!-- <image class="algo-pic" src="../../static/algo-icons/selection-sort.png"></image> -->
          <view class="algo-name">选择</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort?type=2">
          <!-- <image class="algo-pic" src="../../static/algo-icons/insertion-sort.png"></image> -->
          <view class="algo-name">插入</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort?type=3">
          <!-- <image class="algo-pic" src="../../static/algo-icons/merge-sort.png"></image> -->
          <view class="algo-name">归并</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort?type=4">
          <!-- <image class="algo-pic" src="../../static/algo-icons/quick-sort.png"></image> -->
          <view class="algo-name">快速</view>
        </navigator>
      </view>
    </view>
    <view class="theme-block">
      <view class="theme-title">递归算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/hanoi/hanoi">
          <!-- <image class="algo-pic" src="../../static/algo-icons/hanoi.png"></image> -->
          <view class="algo-name">汉诺塔</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/hanoi/hanoiManual/hanoiManual">
          <!-- <image class="algo-pic" src="../../static/algo-icons/hanoi-manual.png"></image> -->
          <view class="algo-name">汉诺塔-动手尝试</view>
        </navigator>
      </view>
    </view>
    <view class="theme-block">
      <view class="theme-title">搜索算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/search/search?type=0">
          <!-- <image class="algo-pic" src="../../static/algo-icons/bfs.png"></image> -->
          <view class="algo-name">BFS</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/search/search?type=1">
          <!-- <image class="algo-pic" src="../../static/algo-icons/dfs.png"></image> -->
          <view class="algo-name">DFS</view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    onLoad() {

    },
    onShareAppMessage() {
      return {
        title:'算法可视化动画'
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .content{
    padding: 20rpx 0;
    font-size: 30rpx;
  }
  .theme-block {
    margin:0 20rpx;
    padding-bottom: 20rpx;
    background-color: $card-bg-color;
  }
  .theme-block +.theme-block{
    margin-top: 20rpx;
  }

  .algo-list {

    // display: grid;
    // grid-template-columns: repeat(3, 33.33%);
    // grid-row-gap: 20rpx;
  }

  .algorithm-block {
    // border-radius: 10rpx;
    padding:30rpx 20rpx ;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
  }
    .algorithm-block +  .algorithm-block {
      // border-top: 1rpx solid $divider-color;
    }

.algo-name{
  
    // display: flex;
    // justify-content: center;
}


  .theme-title {
    font-size: 36rpx;
    padding: 20rpx;
    font-weight: bold;
    color: $theme-color;
  }
  .algo-pic{
    width: 200rpx;
    height: 200rpx;
  }
</style>
