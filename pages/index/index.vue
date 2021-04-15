<template>
  <view class="content">
    <view class="algorithm-list">
      <navigator class="algorithm-block" v-for="algorithm in algorithms" :url="algorithm.url">
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
        }]
      }
    },
    onLoad() {

    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .content {}
</style>
