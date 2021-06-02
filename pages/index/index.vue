<template>
  <view class="content">
    <view class="theme-block">
      <view class="theme-title">排序算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/sort/sort">
          <view class="algo-name">冒泡</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort">
          <view class="algo-name">选择</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort">
          <view class="algo-name">插入</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort">
          <view class="algo-name">归并</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/sort/sort">
          <view class="algo-name">快速</view>
        </navigator>
      </view>
    </view>
    <view class="theme-block">
      <view class="theme-title">递归算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/hanoi/hanoi">
          <view class="algo-name">汉诺塔</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/hanoi/hanoiManual/hanoiManual">
          <view class="algo-name">汉诺塔-动手尝试</view>
        </navigator>
      </view>
    </view>
    <view class="theme-block">
      <view class="theme-title">搜索算法</view>
      <view class="algo-list">

        <navigator class="algorithm-block" url="/pages/search/search?type=0">
          <view class="algo-name">BFS</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/search/search?type=1">
          <view class="algo-name">DFS</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/search/bfs/bfs">
          <view class="algo-name">BFS</view>
        </navigator>
        <navigator class="algorithm-block" url="/pages/search/dfs/dfs">
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
    methods: {

    }
  }
</script>

<style lang="scss">
  .content{
    padding: 20rpx 0;
  }
  .theme-block {
    margin:0 20rpx;
    background-color: $card-bg-color;
  }
  .theme-block +.theme-block{
    margin-top: 20rpx;
  }

  .algo-list {

    display: grid;
    grid-template-columns: repeat(3, 33.33%);
  }

  .algorithm-block {
    border-radius: 10rpx;
    padding: 20rpx 0;
  }

.algo-name{
  
    display: flex;
    justify-content: center;
}


  .theme-title {
    font-size: 36rpx;
    padding: 20rpx;
    font-weight: bold;
    color: $theme-color;
  }
</style>
