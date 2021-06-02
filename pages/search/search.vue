<template>
  <view>
    <view class="algo-type-picker-list">
      <view class="algo-type" v-for="(algoType,index) in algoTypes" :key="index"
        :class="{['algo-type-selected']:index===algoTypeValue}" @tap="onChangeAlgoType(index)">{{algoType.name}}</view>
    </view>
    <view class="cell-block">
      <view class="cell" :class="[`cell-${val}`]" v-for="(val,ind) in flatMaze" :key="ind"></view>
    </view>

    <view class="control-panel">
      <view class="control-item" @tap="onBack">
        <image class="control-button" src="@/static/button-icons/back.png"></image>
        <view class="button-label">后退</view>
      </view>
      <view class="control-item" @tap="onNext">
        <image class="control-button" src="@/static/button-icons/next.png"></image>
        <view class="button-label">前进</view>
      </view>
      <view class="control-item" @tap="onPlay">
        <image class="control-button"
          :src="isPlaying?'../../static/button-icons/stop.png':'../../static/button-icons/play.png'"></image>
        <view class="button-label">{{isPlaying?'暂停':'播放'}}</view>
      </view>
      <view class="control-item" @tap="onHead">
        <image class="control-button" src="@/static/button-icons/head.png"></image>
        <view class="button-label">重置</view>
      </view>
    </view>

    <view class="custum-panel">
      <view class="custom-label">播放速度</view>
      <view class="speed-picker-item" @tap="changePlaySpeed(4)" :class="{['speed-picker-item-selected']:playSpeed===4}">
        快速
      </view>
      <view class="speed-picker-item" @tap="changePlaySpeed(16)"
        :class="{['speed-picker-item-selected']:playSpeed===16}">较快
      </view>
      <view class="speed-picker-item" @tap="changePlaySpeed(50)"
        :class="{['speed-picker-item-selected']:playSpeed===50}">适中
      </view>
      <view class="speed-picker-item" @tap="changePlaySpeed(100)"
        :class="{['speed-picker-item-selected']:playSpeed===100}">较慢
      </view>

    </view>

  </view>
</template>

<script>
  import searchAlgos from './searchAlgos/index.js'
  const clone = obj => JSON.parse(JSON.stringify(obj))
  let interval = null;
  const getMaze = () => {
    let n = 30
    let m = 30
    let maze = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      maze[i] = new Array(m).fill(0)
      for (let j = 0; j < m; j++) {
        maze[i][j] = Math.random() > 0.67 ? 1 : 0
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        maze[i][j] = 0
        maze[n - i - 1][m - j - 1] = 0
      }
    }
    let count = 0
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (maze[i][j] === 0) {
          let up = (i === 0) ? true : (maze[i - 1][j] === 1)
          let down = (i === n - 1) ? true : (maze[i + 1][j] === 1)
          let left = (j === 0) ? true : (maze[i][j - 1] === 1)
          let right = (j === m - 1) ? true : (maze[i][j + 1] === 1)
          if (up && down && left && right) {
            maze[i][j] = 1
            count++
          }
        }
      }
    }
    console.log(count)
    return maze
  }
  // let mazeBackup = null
  export default {
    data() {
      return {
        algoTypes: [{
            name: 'BFS 广度优先搜索',
            id: 'bfs'
          },
          {
            name: 'DFS 深度优先搜索',
            id: 'dfs'
          },
        ],
        algoTypeValue: 0,
        maze: [],
        mazeBackup: [],
        pointer: 0,
        isPlaying: false,
        playSpeed: 4,
        // sequences: [],

      };
    },
    watch: {
      isPlaying(newIsPlaying) {
        if (newIsPlaying) {
          interval = setInterval(this.autoPlay, this.playSpeed)
        } else {
          clearInterval(interval)
        }
      },
      playSpeed(newSpeed){
        this.isPlaying=false
      },
      pointer(newP, oldP) {
        if (newP === 1 + oldP) {
          //前进
          this.do(newP)
        } else if (newP === oldP - 1) {
          //后退
          this.undo(oldP)
        }
      }
    },
    computed: {
      algoType() {
        return this.algoTypes[this.algoTypeValue]
      },
      flatMaze() {
        // console.log('hello!')
        return this.maze.reduce((res, curr) => res.concat(curr), [])
      },
      // searchGenerator(){
      //   let algoType = this.algoType.id
      //   // console.log(searchAlgos)
      //   return searchAlgos[algoType]
      // },
      sequences() {
        console.log('change seuqence')
        let algoType = this.algoType.id
        // console.log(searchAlgos)
        let {
          searchGenerator
        } = searchAlgos[algoType]
        // console.log([...sortGenerator(this.ma)])
        return [...searchGenerator(this.mazeBackup)]
      },
      currentSequence() {
        return this.sequences[this.pointer]
      },
      link() {
        if (this.currentSequence) {

          let {
            x,
            y
          } = this.currentSequence
          return x === 29 && y === 29
        } else {
          return false
        }
      }
    },
    onLoad(option) {
      let {
        type
      } = option
      let mazeBackup = getMaze()
      this.mazeBackup = mazeBackup
      this.maze = clone(mazeBackup).slice()
      if (type) {
        this.algoTypeValue = Number(type)
      }
      // this.sequences = [...this.searchGenerator(this.maze)]
      // this.do(0)
    },
    onUnload() {

      clearInterval(interval)
    },
    onShow() {},
    onHide() {
      this.pointer = 0
    },
    methods: {
      onChangeAlgoType(index) {
        if (index !== this.algoTypeValue) {
          this.algoTypeValue = index
          this.isPlaying = false
          this.maze = clone(this.mazeBackup).slice()
          this.pointer = 0
        }
      },
      undo(p) {
        if (this.sequences[p]) {

          let {
            x,
            y,
            from
          } = this.sequences[p]
          this.maze[x][y] = from
          this.maze = this.maze.slice()
        }
      },
      do(p) {
        // console.log(this.sequences[p])
        let {
          x,
          y,
          to
        } = this.sequences[p]
        this.maze[x][y] = to
        this.maze = this.maze.slice()
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
        // console.log('next')
        if (this.pointer < this.sequences.length - 1) {
          if (this.pointer === this.sequences.length - 2) {

            uni.showToast({
              title: '搜索完成',
              duration: 1000
            })
          }
          this.pointer++

        } else {

          uni.showToast({
            title: '已经搜索完毕了',
            icon: 'none',
            duration: 1000
          })
        }
      },
      onPlay() {
        this.isPlaying = !this.isPlaying
      },
      autoPlay() {
        // console.log('auto play')

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
        this.maze = clone(this.mazeBackup).slice()
        uni.showToast({
          title: '初始状态',
          duration: 1000
        })
      },
      changePlaySpeed(playSpeed) {
        this.playSpeed = playSpeed
      }
    },
  }
</script>

<style lang="scss">
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

  .cell-block {
    display: grid;
    grid-template-columns: repeat(30, 25rpx);
    margin: 0 auto;
    justify-content: center;
  }

  .cell {
    height: 25rpx;
    box-sizing: border-box;
    border: 1rpx solid #999;
    // transition: all 0.1s;
  }

  .cell-1 {
    background-color: #000;
  }

  .cell-3 {
    background-color: #ffc766;
  }

  .cell-5 {
    background-color: #59e985;
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

  .speed-picker-item {
    width: 64rpx;
    padding: 20rpx;
    display: flex;
    justify-content: center;

  }

  .speed-picker-item-selected {
    background-color: $theme-color;
    color: #fff;
  }
</style>
