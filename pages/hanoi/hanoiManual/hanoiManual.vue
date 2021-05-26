<template>
  <view class="content">
    <view class="draw">
      <view class="sequence" v-for="(item,ind) in currentSequence" :key="ind">
        <!-- 2*35+10*50+9*20 =750rpx-->
        <view class="rect" :class="{['pan-selected']:ind===selectedPan}"
          :style="{left:`${25+item.tower*250+70-14*ind}rpx`,top:`${40+(6-panNumber)*60+60*(panNumber-item.height-1)}rpx`,width:`${60+28*ind}rpx`}">

          <view class="rect-text">{{ind+1}}</view>
        </view>
      </view>
      <view class="bottom-base"></view>
      <view class="col col-left"></view>
      <view class="col col-middle"></view>
      <view class="col col-right"></view>
      <view class="tap-area tap-area-left" @tap="tapArea(0)"></view>
      <view class="tap-area tap-area-middle" @tap="tapArea(1)"></view>
      <view class="tap-area tap-area-right" @tap="tapArea(2)"></view>
    </view>

    <view class="control-panel">
      <view class="control-item" @tap="onBack">
        <image class="control-button" src="@/static/button-icons/back.png"></image>
        <view class="button-label">撤销</view>
      </view>
      <view class="control-item" @tap="onNext">
        <image class="control-button" src="@/static/button-icons/next.png"></image>
        <view class="button-label">重做</view>
      </view>
      <view class="control-item" @tap="onHead">
        <image class="control-button" src="@/static/button-icons/head.png"></image>
        <view class="button-label">重置</view>
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
        <view class="status-title">你的完成状态</view>
        <view class="status-context" :class="{['hanoi-completed']:isCompleted}">{{isCompleted?'已完成':'未完成'}}</view>
      </view>
      <view class="status-block">
        <view class="status-title">你的操作步数</view>
        <view class="status-context">{{pointer}}</view>
      </view>
      <view class="status-block">
        <view class="status-title">最少操作步数</view>
        <view class="status-context">{{bestSteps}}</view>
      </view>
    </view>

    <view class="help-block">
      <view class="help-title">操作说明</view>
      <view class="help-text">1. 点击一个塔，选中最顶端的圆盘。再点击另一个塔，可以将圆盘移动到另一个塔的顶端。</view>
      <view class="help-text">2. 点击一个塔后，再次点击同一个塔，可以取消选中的圆盘。</view>
      <view class="help-text">3. 不能将大号圆盘放在小号圆盘上面。</view>
      <view class="help-text">4. 当所有圆盘都移动至中间的塔上，或者右边的塔上，你就完成了汉诺塔游戏。</view>
    </view>




  </view>
</template>

<script>
  // import hanoi from './hanoi.js'
  let getInitSequences = n => [new Array(n).fill(0).map((value, index) => ({
    tower: 0,
    height: n - index - 1
  }))]



  let interval = null;

  export default {
    data() {
      return {
        panNumber: 4,
        pointer: 0,
        sequences: getInitSequences(4),
        sourceTower: -1,
        selectedPan: -1
      }
    },
    computed: {
      currentSequence() {
        // console.log(this.sequences[this.pointer])
        return this.sequences[this.pointer]
      },
      isCompleted() {
        return this.currentSequence.filter(pan => pan.tower === 1).length === this.panNumber ||
          this.currentSequence.filter(pan => pan.tower === 2).length === this.panNumber
      },
      bestSteps() {
        return (2 << (this.panNumber - 1)) - 1
      }
    },
    onHide() {},
    onUnload() {

      clearInterval(interval)
    },
    methods: {
      onBack() {
        if (this.pointer > 0) {
          this.sourceTower = -1
          this.selectedPan = -1
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
        console.log('next')
        if (this.pointer < this.sequences.length - 1) {

          this.sourceTower = -1
          this.selectedPan = -1
          this.pointer++

        } else {

          uni.showToast({
            title: '到底了',
            icon: 'none',
            duration: 1000
          })
        }
      },
      onHead() {
        let that = this
        uni.showModal({
          title: '确定重置状态？',
          content: '你将失去当前的进度。',
          success: function(res) {
            if (res.confirm) {
              that.sourceTower = -1
              that.selectedPan = -1
              that.pointer = 0
              that.sequence = getInitSequences(that.panNumber)

            } else if (res.cancel) {}
          }
        })
      },

      changePanNumber(n) {

        let that = this
        uni.showModal({
          title: '确定修改圆盘数量？',
          content: '你将失去当前的进度。',
          success: function(res) {
            if (res.confirm) {
              that.pointer = 0
              that.panNumber = n
              that.sourceTower = -1
              that.selectedPan = -1
              that.sequences = getInitSequences(n)

            } else if (res.cancel) {}
          }
        })
      },
      tapArea(t) {
        if (this.sourceTower === -1) {
          let topPan = -1

          for (let i = 0; i < this.panNumber; i++) {
            if (this.currentSequence[i].tower === t) {
              topPan = i
              break
            }
          }
          if (topPan !== -1) {
            this.selectedPan = topPan
            this.sourceTower = t
          }
        } else {
          if (this.sourceTower === t) {
            this.selectedPan = -1
            this.sourceTower = -1
          } else {
            let topPan = -1

            for (let i = 0; i < this.panNumber; i++) {
              if (this.currentSequence[i].tower === t) {
                topPan = i
                break
              }
            }
            if (topPan !== -1) {
              if (topPan <= this.selectedPan) {

                uni.showToast({
                  title: '非法操作',
                  duration: 1000,
                  icon: 'none'
                })
              } else {
                this.sequences = this.sequences.slice(0, this.pointer + 1)
                let newSequence = this.currentSequence.map(seq => ({
                  ...seq
                }))
                let pansIntargetTower = this.currentSequence.filter(item => item.tower === t)
                newSequence[this.selectedPan].tower = t
                newSequence[this.selectedPan].height = pansIntargetTower.length
                this.sequences.push(newSequence)
                this.sourceTower = -1
                this.selectedPan = -1

                this.pointer++
              }
            } else {
              this.sequences = this.sequences.slice(0, this.pointer + 1)
              let newSequence = this.currentSequence.map(seq => ({
                ...seq
              }))
              newSequence[this.selectedPan].tower = t
              newSequence[this.selectedPan].height = 0
              this.sequences.push(newSequence)
              this.sourceTower = -1
              this.selectedPan = -1

              this.pointer++
            }

          }
        }
      }
    },

  }
</script>

<style lang="scss">
  .content {
    background-color: $page-bg-color;
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
    z-index: 114;
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
    // font-size: 32rpx;
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

  .tap-area {

    width: 250rpx;
    height: 400rpx;
    position: absolute;
    z-index: 114514;
  }

  .tap-area-middle {
    left: 250rpx;
  }

  .tap-area-right {
    left: 500rpx;
  }

  @keyframes select {
    from {
      background-color: $theme-color;
    }

    to {
      background-color: #d6f1ff;
    }
  }

  .pan-selected {
    animation: select 0.5s infinite alternate;
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

  .hanoi-completed {
    color: #28e530;
  }

  .help-block {
    padding: 20rpx;
    background-color: $card-bg-color;
  }

  .help-title {
    color: $text-help-color;
    margin-bottom: 5rpx;
  }

  .help-text {
    margin-top: 10rpx;
  }
</style>
