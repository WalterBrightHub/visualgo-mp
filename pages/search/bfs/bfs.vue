<template>
  <view>
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
          :src="isPlaying?'../../../static/button-icons/stop.png':'../../../static/button-icons/play.png'"></image>
        <view class="button-label">{{isPlaying?'暂停':'播放'}}</view>
      </view>
      <view class="control-item" @tap="onHead">
        <image class="control-button" src="@/static/button-icons/head.png"></image>
        <view class="button-label">重置</view>
      </view>
    </view>
  </view>
</template>

<script>
  import bfs from './bfs.js'
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
  let mazeBackup = null
  export default {
    data() {
      return {
        maze: [],
        pointer: 0,
        isPlaying: false,
        sequences: [],

      };
    },
    watch: {
      isPlaying(newIsPlaying) {
        if (newIsPlaying) {
          interval = setInterval(this.autoPlay, 4)
        } else {
          clearInterval(interval)
        }
      },
      pointer(newP, oldP) {
        if (newP ===1+ oldP) {
          //前进
          this.do(newP)
        } else if (newP === oldP-1) {
          //后退
          this.undo(oldP)
        }
      }
    },
    computed: {
      flatMaze() {
        // console.log('hello!')
        return this.maze.reduce((res, curr) => res.concat(curr), [])
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
    onLoad() {

      mazeBackup=getMaze()
        this.maze=clone(mazeBackup).slice()
      this.sequences = [...bfs(this.maze)]
      // this.do(0)
    },    onUnload() {

      clearInterval(interval)
    },
    onShow() {

    },
    onHide(){
      this.pointer=0
    },
    methods: {
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
        this.maze = clone(mazeBackup).slice()
        this.sequences = [...bfs(mazeBackup)].slice()
        uni.showToast({
          title: '初始状态',
          duration: 1000
        })
      },
    }
  }
</script>

<style lang="scss">
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
</style>
