<template>
  <view class="content">
    <view class="algorithm-list">
      <navigator class="algorithm-block" v-for="algorithm in algorithms" :key="algorithms.url" :url="algorithm.url">
        <view class="algo-name">{{algorithm.name}}</view>
      </navigator>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        algorithms: [{
          name: '排序',
          detail: '冒泡、选择、插入、归并、快速等排序方法',
          url: '/pages/sort/sort'
        },{
          name: '递归-汉诺塔',
          detail: '冒泡、选择、插入、归并、快速等排序方法',
          url: '/pages/hanoi/hanoi'
        }],
      }
    },
    onLoad() {

    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .algorithm-list{
    padding: 20rpx;
  }
  .algorithm-block{
    background-color: $card-bg-color;
    border-radius: 10rpx;
  }
  .algorithm-block+.algorithm-block{
    margin-top: 20rpx;
  }
  .algo-name{
    font-size: 36rpx;
    padding:  20rpx;
    font-weight: bold;
    color: $theme-color;
  }
</style>
