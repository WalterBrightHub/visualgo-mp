<template>
  <view class="content">
    <view class="sort-type-picker-list">
      <view class="sort-type" v-for="(sortType,index) in sortTypes" :key="index"
        :class="{['sort-type-selected']:index===sortTypeValue}" @tap="onChangeSortType(index)">{{sortType.name}}</view>
    </view>
    <view class="draw">
      <view class="sequence" v-for="(item,ind) in currentSequence" :key="ind">
        <!-- 2*35+10*50+9*20 =750rpx-->
        <view class="rect" :class="'rect-'+item.status"
          :style="{left:`${drawLeftPadding+item.order*70}rpx`,top:`${375-heightLScaleLinear(item.data)}rpx`,height:`${heightLScaleLinear(item.data)}rpx`}">

          <view class="text" :style="{top:`${-40}rpx`}">{{item.data}}</view>
        </view>
        <view class="rect-index" :style="{left:`${drawLeftPadding+ind*70}rpx`,top:'380rpx'}">{{ind}}</view>
      </view>
    </view>
    <view class="control-panel">
      <view class="control-item" @tap="onBack">
        <image class="control-button" src="../../static/button-icons/back.png"></image>
        <view class="button-label">后退</view>
      </view>
      <view class="control-item" @tap="onNext">
        <image class="control-button" src="../../static/button-icons/next.png"></image>
        <view class="button-label">前进</view>
      </view>
      <view class="control-item" @tap="onPlay">
        <image class="control-button"
          :src="isPlaying?'../../static/button-icons/stop.png':'../../static/button-icons/play.png'"></image>
        <view class="button-label">{{isPlaying?'暂停':'播放'}}</view>
      </view>
      <view class="control-item" @tap="onHead">
        <image class="control-button" src="../../static/button-icons/head.png"></image>
        <view class="button-label">起始</view>
      </view>
      <view class="control-item" @tap="onTail">
        <image class="control-button" src="../../static/button-icons/tail.png"></image>
        <view class="button-label">最终</view>
      </view>
    </view>
  </view>
</template>

<script>
  import sortGenerators from './sortGenerators/index.js'

  import {
    scaleLinear
  } from "d3-scale";

  let interval = null;

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
        array: [1, 6, 3, 9, 4, 3, 2, 7, 5, 8],
        pointer: 0,
        isPlaying: false,
      }
    },
    watch: {
      isPlaying(newIsPlaying) {
        if (newIsPlaying) {
          interval = setInterval(this.autoPlay, 500)
        } else {
          clearInterval(interval)
        }
      }
    },
    computed: {
      dataset() {
        return this.array.map((val, ind) => ({
          data: val,
          order: ind,
          status: 'unsorted'
        }))
      },
      sortProcess() {
        let sortType = this.sortTypes[this.sortTypeValue].id
        sortType = 'bubble'
        let sortGenerator = sortGenerators[sortType]
        // console.log([...sortGenerator(this.dataset)])
        return [...sortGenerator(this.dataset)]
      },
      sequences() {
        return this.sortProcess.map(p => p.sequence)
      },
      currentSequence() {
        // console.log(this.sequences[this.pointer])
        return this.sequences[this.pointer]
      },
      heightLScaleLinear() {
        let maxItem = this.array.reduce((max, val) => Math.max(max, val))
        return scaleLinear()
          .domain([0, maxItem])
          .range([20, 375 - 55])
      },
      drawLeftPadding() {
        return (750 - this.array.length * 70 + 20) / 2
      }
    },
    methods: {
      onChangeSortType(index) {
        if (index !== this.sortTypeValue) {
          this.sortTypeValue = index
          this.isPlaying = false
          this.pointer = 0
        }
      },
      onBack() {
        this.isPlaying = false
        if (this.pointer > 0) {
          this.pointer--
        }
      },
      onNext() {
        this.isPlaying = false
        console.log('next')
        if (this.pointer < this.sequences.length - 1) {
          this.pointer++
        }
      },
      onPlay() {
        this.isPlaying = !this.isPlaying
      },
      autoPlay() {

        if (this.pointer < this.sequences.length - 1) {
          this.pointer++
        } else {

          this.isPlaying = false
        }
      },
      onHead() {
        this.isPlaying = false
        this.pointer = 0
      },
      onTail() {
        this.isPlaying = false
        this.pointer = this.sequences.length - 1
      }
    }
  }
</script>

<style lang="scss">
  .content {
    background-color: $page-bg-color;
  }

  .sort-type-picker-list {
    display: flex;
    background-color: $card-bg-color;
    margin-bottom: 20rpx;
    // justify-content: space-between;
  }

  .sort-type {
    font-size: 28rpx;
    padding: 20rpx;
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .sort-type-selected {
    color: #fff;
    background-color: $theme-color;
  }

  .draw {
    background-color: $card-bg-color;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
    position: relative;
    font-size: 28rpx;
    height: 415rpx;
  }

  .rect {
    position: absolute;
    width: 50rpx;
    height: 0;
    background-color: $theme-color;
    transition: all 0.5s;
  }

  .rect-index,
  .text{

    position: absolute;
    display: flex;
    justify-content: center;
    
    width: 50rpx;
  }
  
  .rect-index{
    color: $text-help-color;
  }
  
  .text {
    color: $text-p-color;
    transition: all 0.5s;
  }

  .rect-sorted {
    background-color: #099f17;
  }

  .rect-selected {
    background-color: #e7b446;
  }

  .rect-compared {
    background-color: #34db6f;
  }


  .control-panel {
    display: flex;
    justify-content: space-between;
    background-color: $card-bg-color;
    padding: 20rpx 70rpx;

  }

  .control-item {
    display: flex;
    flex-direction: column;
  }

  .control-button {
    width: 64rpx;
    height: 64rpx;
    margin-bottom: 10rpx;
  }

  .button-label {
    display: flex;
    justify-content: center;
  }
</style>
