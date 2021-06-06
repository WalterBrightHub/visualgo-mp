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

          <view class="rect-text" :style="{top:`${-40}rpx`}">{{item.data}}</view>
        </view>
        <view class="rect-index" :style="{left:`${drawLeftPadding+ind*70}rpx`,top:'380rpx'}">{{ind}}</view>
      </view>
    </view>
    <view class="legend-card">
      <!-- <view class="title-block">

        <view class="card-title">图例</view>
      </view> -->
      <view class="legend-list">

        <view class="legend-block">
          <view class="legend legend-common"></view>
          <view class="legend-text">元素</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-selected"></view>
          <view class="legend-text">选区</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-sorted"></view>
          <view class="legend-text">排好序的</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-featured"></view>
          <view class="legend-text">{{featuredRectWord}}</view>
        </view>
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
        <view class="button-label">初始</view>
      </view>
      <view class="control-item" @tap="onTail">
        <image class="control-button" src="../../static/button-icons/tail.png"></image>
        <view class="button-label">最终</view>
      </view>
    </view>
    <view class="custom-block">
      <view class="title-block">

        <view class="card-title">自定义数据</view>
        <view class="card-label">输入2-10个数字，用空格隔开。</view>
      </view>
      <view class="input-block">
        <input class="array-input" v-model="customArray" />
        <view class="array-button array-apply-button" @tap="onApplyCustomArray">应用</view>
        <view class="array-button array-random-button" @tap="onRandomArray">随机</view>
      </view>
    </view>
    <view class="code-list">
      <view class="title-block">

        <view class="card-title">伪代码</view>
      </view>
      <view class="code-block" v-for="(line,index) in algo.code">
        <view class="code-index">{{index+1}}. </view>
      <text class="code-text" space="nbsp">{{line}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import sortAlgorithms from './sortAlgorithms/index.js'

  import {
    scaleLinear
  } from "d3-scale";

  let interval = null;
  let initArray = [1, 6, 3, 9, 4, 3, 2, 7, 5, 8]

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
        array: initArray,
        pointer: 0,
        isPlaying: false,
        customArray: initArray.join(' ')
      }
    },
    watch: {
      isPlaying(newIsPlaying) {
        if (newIsPlaying) {
          interval = setInterval(this.autoPlay, 500)
        } else {
          clearInterval(interval)
        }
      },
      array(newArray) {
        this.pointer = 0
        this.isPlaying = false
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
      sortType() {
        return this.sortTypes[this.sortTypeValue]
      },
      algo(){
        return sortAlgorithms[this.sortType.id ]
      },
      sortProcess() {
        let sortType = this.sortType.id 
        let {
          sortGenerator
        } = sortAlgorithms[sortType]
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
      featuredRectWord() {
        return sortAlgorithms[this.sortType.id].featuredRectWord
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
    onHide() {
      this.isPlaying = false
    },
    onLoad(option) {
      
        let {
          type
        } = option
        this.sortTypeValue=Number(type)||0
    },
    onUnload() {

      clearInterval(interval)
    },
    methods: {
      onChangeSortType(index) {
        if (index !== this.sortTypeValue) {
          this.sortTypeValue = index
          this.isPlaying = false
          this.pointer = 0
          this.onRandomArray()
        }
      },
      onBack() {
        this.isPlaying = false
        if (this.pointer > 0) {
          this.pointer--
        } else {
          uni.showToast({
            title: '已经是初始状态了',
            icon: 'none',
            duration: 500
          })
        }
      },
      onNext() {
        this.isPlaying = false
        console.log('next')
        if (this.pointer < this.sequences.length - 1) {
          if (this.pointer === this.sequences.length - 2) {

            uni.showToast({
              title: '排序完成',
              duration: 1000
            })
          }
          this.pointer++

        } else {

          uni.showToast({
            title: '已经排好序了',
            icon: 'none',
            duration: 1000
          })
        }
      },
      onPlay() {
        this.isPlaying = !this.isPlaying
      },
      autoPlay() {
        console.log('auto play')

        if (this.pointer < this.sequences.length - 1) {
          this.pointer++
        } else {

          this.isPlaying = false
          uni.showToast({
            title: '排序完成',
            duration: 1000
          })
        }
      },
      onHead() {
        this.isPlaying = false
        this.pointer = 0
        uni.showToast({
          title: '初始状态',
          duration: 1000
        })
      },
      onTail() {
        this.isPlaying = false
        this.pointer = this.sequences.length - 1
        uni.showToast({
          title: '排序完成',
          duration: 1000
        })
      },
      onApplyCustomArray() {
        console.log(this.customArray)
        let newArray = this.customArray.trim().split(' ').slice(0, 10).map(str => Number(str))
        if (newArray.length < 2) {
          uni.showToast({
            title: '输入少于2个数',
            duration: 1000,
            icon: 'none'
          })
        } else {

          let areAllNumbers = newArray.reduce((res, curr) => res && typeof curr === 'number' && !isNaN(curr), true)
          // console.log(areAllNumbers)
          if (areAllNumbers) {
            this.array = newArray
          } else {

            uni.showToast({
              title: '数据不合法',
              duration: 1000,
              icon: 'none'
            })
          }
        }
      },
      onRandomArray() {
        let newArray = new Array(Math.ceil(Math.random() * 3 + 7)).fill(0).map(() => Math.ceil(Math.random() * 20))

        this.array = newArray
      }
    }
  }
</script>

<style lang="scss">
  .content {
    background-color: $page-bg-color;
    padding-bottom: 128rpx;
  }

  .sort-type-picker-list {
    display: flex;
    background-color: $card-bg-color;
    margin-bottom: 8rpx;
    // justify-content: space-between;
  }

  .sort-type {
    font-size: 28rpx;
    padding: 20rpx 0;
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
    margin-bottom: 8rpx;
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
  .rect-text {

    position: absolute;
    display: flex;
    justify-content: center;
    transition: all 0.5s;

    width: 50rpx;
  }

  .rect-index {
    color: $text-help-color;
  }

  .rect-text {
    color: $text-p-color;
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

  .rect-featured {
    background-color: #099f17;
    background-color: #a066ff;
  }

  .control-panel {
    display: flex;
    justify-content: space-between;
    background-color: $card-bg-color;
    padding: 20rpx 70rpx;
    margin-bottom: 8rpx;

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

  .custom-block {
    background-color: $card-bg-color;
    padding: 20rpx;
  }

  .title-block {
    display: flex;
    align-items: flex-end;
    margin-bottom: 14rpx;
  }

  .card-title {
    font-size: 32rpx;
  }

  .card-label {
    margin-left: 28rpx;
    color: $text-help-color;
  }

  .input-block {
    display: flex;
  }

  .array-input {
    flex: 1;
    background-color: $page-bg-color;
    border-radius: 10rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    height: 28rpx;
    padding: 10rpx 10rpx;
  }

  .array-button {
    padding: 5rpx 20rpx;
    border-radius: 10rpx;
    // font-size: 28rpx;
    // line-height: 28rpx;
    display: flex;
    align-items: center;
    margin-left: 14rpx;
  }

  .array-apply-button {
    background-color: $theme-color;
    color: #fff;
  }

  .array-random-button {
    border: 1rpx solid $text-p-color;
  }

  .legend-card {
    background-color: $card-bg-color;
    padding: 20rpx;
    margin-bottom: 8rpx;
  }

  .legend-list {

    display: flex;
  }

  .legend-block {
    display: flex;
    align-items: center;
  }

  .legend-block+.legend-block {
    margin-left: 28rpx;
  }

  .legend {
    width: 28rpx;
    height: 28rpx;
    background-color: $theme-color;
  }

  .legend-selected {
    background-color: #e7b446;
  }

  .legend-featured {

    background-color: #a066ff;
  }

  .legend-sorted {

    background-color: #099f17;
  }

  .legend-text {
    display: flex;
    line-height: 28rpx;
    margin-left: 10rpx;
  }
  .code-list{
    font-family: 'Consolas';
    background-color: $card-bg-color;
    margin-top: 8rpx;
    padding: 20rpx;
  }
  .code-block{
    display: flex;
  }
  .code-index{
    flex-shrink: 0;
    width: 2em;
    display: flex;
    justify-content: flex-end;
    margin-right: 1em;
    color: $text-help-color;
  }
  .code-text{
    word-break: break-all;
  }
  .code-block+.code-block{
    margin-top: 20rpx;
  }
  
</style>
