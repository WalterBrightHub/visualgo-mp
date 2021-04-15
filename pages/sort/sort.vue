<template>
  <view>
    <view class="sort-type-picker-list">
      <view class="sort-type" v-for="(sortType,index) in sortTypes"
        :class="{['sort-type-selected']:index===sortTypeValue}" @tap="onChangeSortType(index)">{{sortType.name}}</view>
    </view>
    <view class="canvas">
      <view class="rect"></view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        sortTypes: [{
            name: '冒泡',
            id: 'bubble'
          },
          {
            name: '选择',
            id: 'selection'
          },
          {
            name: '插入',
            id: 'insertion'
          },
          {
            name: '归并',
            id: 'merge'
          },
          {
            name: '快速',
            id: 'quick'
          },
        ],
        sortTypeValue: 0,
        rects: []
      }
    },
    methods: {
      onChangeSortType(index) {
        if (index !== this.sortTypeValue) {
          this.sortTypeValue = index
        }
      }
    }
  }
</script>

<style lang="scss">
  .sort-type-picker-list {
    display: flex;
    // justify-content: space-between;
  }

  .sort-type {
    font-size: 14px;
    padding: 20rpx;
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .sort-type-selected {
    color: #fff;
    background-color: $algo-theme-color;
  }
</style>
