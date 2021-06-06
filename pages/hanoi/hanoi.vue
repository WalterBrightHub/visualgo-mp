<template>
  <view class="content">
    <view class="algo-type-picker-list">
        <view class="algo-type algo-type-selected">汉诺塔算法</view>
        <view class="algo-type" @tap="onChangeAlgoType()">汉诺塔 动手尝试</view>
    </view>
    <view class="draw">
      <view class="sequence" v-for="(item,ind) in currentSequence" :key="ind">
        <!-- 2*35+10*50+9*20 =750rpx-->
        <view class="rect"
          :style="{left:`${25+item.tower*250+70-14*ind}rpx`,top:`${40+(6-panNumber)*60+60*(panNumber-item.height-1)}rpx`,width:`${60+28*ind}rpx`}">

          <view class="rect-text">{{ind+1}}</view>
        </view>
      </view>
      <view class="bottom-base"></view>
      <view class="col col-left"></view>
      <view class="col col-middle"></view>
      <view class="col col-right"></view>
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

    <view class="custum-panel">
      <view class="custom-label">选择圆盘数量</view>
      <view class="pan-picker-item" @tap="changePanNumber(3)" :class="{['pan-picker-item-selected']:panNumber===3}">3
      </view>
      <view class="pan-picker-item" @tap="changePanNumber(4)" :class="{['pan-picker-item-selected']:panNumber===4}">4
      </view>
      <view class="pan-picker-item" @tap="changePanNumber(5)" :class="{['pan-picker-item-selected']:panNumber===5}">5
      </view>
      <view class="pan-picker-item" @tap="changePanNumber(6)" :class="{['pan-picker-item-selected']:panNumber===6}">6
      </view>

    </view>
    <view class="status-list">
      <view class="status-block">
        <view class="status-title">当前操作步数</view>
        <view class="status-context">{{pointer}}</view>
      </view>
    </view>
    
    <div class="desc-list">
      <div class="desc-block" v-for="(desc,index) in description" :key="index">{{desc}}</div>
    </div>
    <view class="code-list">
      <view class="title-block">
    
        <view class="card-title">伪代码</view>
      </view>
      <view class="code-block" v-for="(line,index) in code">
        <view class="code-index">{{index+1}}. </view>
      <text class="code-text" space="nbsp">{{line}}</text>
      </view>
    </view>


  </view>
</template>

<script>
  import hanoi from './hanoi.js'

  let description=[
    '在3个立柱的汉诺塔游戏中，需要将所有圆盘从一个立柱移动到另一个立柱上，并且过程中始终保持小圆盘在大圆盘的上方。',
    '利用递归算法可以解决汉诺塔游戏。若要将立柱A上的n个圆盘移动到立柱C, 记为hanoi(n,A,B,C), 有3个分步骤：',
    '1, 将n-1个圆盘移动到立柱B, 需要hanoi(n-1,A,C,B)步',
    '2, 将最大的圆盘移动到立柱C, 需要1步。',
    '3, 将n-1个圆盘移动到立柱C, 需要hanoi(n-1,B,A,C)步',
    '其中，步骤1和步骤3都是递归调用自身的过程。',
    '记3个立柱的n个圆盘的游戏的最少步数为step(n), 则有step(1)=1, step(k)=2*step(k-1)+1，易知最少步数step(n)=2^n-1步。'
  ]
  let code=[
    'function hanoi( n , A , B , C )',
    '  if n==1',
    '    盘子从A移动到B',
    '  else',
    '    hanoi( n-1 , A , C , B )',
    '    hanoi( 1 , A , B , C )',
    '    hanoi( n-1 , B , A , C )'
  ]


  let interval = null;

  export default {
    data() {
      return {
        panNumber: 4,
        pointer: 0,
        isPlaying: false,
        description,
        code
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
    },
    computed: {
      algoProcess() {
        return [...hanoi(this.panNumber)]
      },
      sequences() {
        return this.algoProcess.map(p => p.sequence)
      },
      currentSequence() {
        // console.log(this.sequences[this.pointer])
        return this.sequences[this.pointer]
      },
    },
    onHide() {
      this.isPlaying = false
    },
    onUnload() {

      clearInterval(interval)
    },
    methods: {
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
              title: '移动完成',
              duration: 1000
            })
          }
          this.pointer++

        } else {

          uni.showToast({
            title: '已经移动好了',
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
            title: '移动完成',
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
          title: '移动完成',
          duration: 1000
        })
      },
      onChangeAlgoType(){
        uni.redirectTo({
          url:'./hanoiManual/hanoiManual'
        })
      },
      changePanNumber(n) {
        let that = this
        uni.showModal({
          title: '确定修改圆盘数量？',
          content: '你将失去当前的进度。',
          success: function(res) {
            if (res.confirm) {
              that.isPlaying = false
              that.pointer = 0
              that.panNumber = n

            } else if (res.cancel) {}
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .content {
    background-color: $page-bg-color;
    padding-bottom: 128rpx;
  }



  .draw {
    background-color: $card-bg-color;
    // padding-bottom: 20rpx;
    margin-bottom: 8rpx;
    position: relative;
    font-size: 28rpx;
    height: 450rpx;
  }

  .rect {
    position: absolute;
    display: flex;
    // border: 2rpx solid #000;
    // box-sizing: border-box;
    z-index: 114514;
    box-shadow: inset 0 0 10rpx #0f94d6;
    border-radius: 10rpx;
    justify-content: center;
    align-items: center;
    width: 200rpx;
    height: 60rpx;
    background-color: $theme-color;
    transition: all 0.5s;
  }

  .rect-text {

    // position: absolute;
    display: flex;
    justify-content: center;
    // transition: all 0.5s;

    width: 50rpx;
    color: #fff;
  }

  .bottom-base {
    background-color: #666dff;
    position: absolute;
    z-index: 10;
    top: 400rpx;
    left: 15rpx;
    width: 720rpx;
    height: 20rpx;
  }

  .col {
    width: 10rpx;
    position: absolute;
    background-color: #bda8ec;
    height: 385rpx;
    // z-index: -1;
    top: 20rpx;
  }

  .col-left {
    left: 120rpx;
  }

  .col-middle {
    left: 370rpx;
  }

  .col-right {
    left: 620rpx;
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

  .custum-panel {
    // margin-top: 10rpx;
    margin-bottom: 8rpx;
    background-color: $card-bg-color;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    font-size: 32rpx;
  }

  .custom-label {
    color: $text-title-color;
    margin-right: auto;
  }

  .pan-picker-item {
    width: 64rpx;
    padding: 20rpx;
    display: flex;
    justify-content: center;

  }

  .pan-picker-item-selected {
    background-color: $theme-color;
    color: #fff;
  }
  .algo-type-picker-list {
    display: flex;
    background-color: $card-bg-color;
    margin-bottom: 8rpx;
    // justify-content: space-between;
  }
  
  .algo-type {
    font-size: 28rpx;
    padding: 20rpx 0;
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .algo-type-selected {
    color: #fff;
    background-color: $theme-color;
  }
  .desc-list{
    margin-top: 8rpx;
    background-color: $card-bg-color;
    padding: 20rpx;
  }
  .desc-block{
    
  }
  .desc-block+.desc-block{
    margin-top: 1em;
  }
  .status-list {
  
    margin-bottom: 8rpx;
  }
  
  .status-block {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 20rpx;
  
  }
  
  .status-title {}
  
  .status-context {
    margin-left: auto;
  }
  
  .title-block {
    display: flex;
    align-items: flex-end;
    margin-bottom: 14rpx;
  }
  
  .card-title {
    font-size: 32rpx;
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
