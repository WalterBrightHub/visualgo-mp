<template>
  <view class="content">
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
      <view class="control-item" @tap="onNewMaze">
        <image class="control-button" src="@/static/button-icons/refresh.png"></image>
        <view class="button-label">换图</view>
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
    <view class="status-list">
      
      <view class="status-block">
        <view class="status-title">起点到终点的连通路径</view>
        <view class="status-context" :class="{['link-true']:canLink==='可连通',['link-false']:canLink==='不可连通'}">{{canLink}}</view>
      </view>
    </view>
    <view class="legend-card">
      <!-- <view class="title-block">

        <view class="card-title">图例</view>
      </view> -->
      <view class="legend-list">

        <view class="legend-block">
          <view class="legend legend-cell-block"></view>
          <view class="legend-text">不可连通的单元</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-cell-link"></view>
          <view class="legend-text">可连通的单元</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-green"></view>
          <view class="legend-text">起点可达到的单元</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-orange"></view>
          <view class="legend-text">{{featuredWord}}</view>
        </view>
        <view class="legend-block">
          <view class="legend legend-purple"></view>
          <view class="legend-text">起点和终点</view>
        </view>
      </view>
    </view>
    
    <div class="desc-list">
      <div class="desc-block" v-for="(desc,index) in algo.description" :key="index">{{desc}}</div>
    </div>
    
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
    // console.log(count)
    maze[0][0]=7
    maze[29][29]=7
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
      playSpeed(newSpeed) {
        this.isPlaying = false
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
      algo(){
        return searchAlgos[this.algoType.id]
      },
      sequences() {
        // console.log('change seuqence')
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
      },
      canLink(){
        return this.pointer===this.sequences.length-1?(this.currentSequence.x===29&&this.currentSequence.y===29?'可连通':'不可连通'):'搜索中'
      },
      featuredWord(){
        return this.algo.featuredWord
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
    onShareAppMessage() {
      return {
        title:'我在看搜索算法的可视化动画，推荐给你！'
      }
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
            title: '搜索完成',
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
      },
      onNewMaze() {
        let that = this
        uni.showModal({
          title: '确定更换地图？',
          content: '你将失去当前的进度。',
          success: function(res) {
            if (res.confirm) {
              that.isPlaying = false
              that.pointer = 0
              let mazeBackup = getMaze()
              that.mazeBackup = mazeBackup
              that.maze = clone(mazeBackup).slice()
            } else if (res.cancel) {}
          }
        })

      }
    },
  }
</script>

<style lang="scss">
  .content{
    
    padding-bottom: 128rpx;
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
  
  .cell-7 {
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
  
  .link-true{
    color:#23d662;
  }
  .link-false{
    color:#e74661;
  }
  
  .legend-card {
    background-color: $card-bg-color;
    padding: 20rpx;
    margin-bottom: 8rpx;
  }
  
  .legend-list {
  
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 20rpx;
  }
  
  .legend-block {
    display: flex;
    align-items: center;
  }
  
  .legend-block+.legend-block {
    // margin-left: 28rpx;
  }
  
  .legend {
    width: 28rpx;
    height: 28rpx;
    background-color: $theme-color;
  }
  
  .legend-orange {
    background-color: #e7b446;
  }
  
  .legend-purple {
  
    background-color: #a066ff;
  }
  
  .legend-green {
  
    background-color: #099f17;
  }
  
  .legend-cell-block {
  
    background-color: #000;
  }  
  .legend-cell-link {
  
    background-color: #fff;
    border: 1px solid $text-help-color;
    box-sizing: border-box;
  }
  .legend-text {
    display: flex;
    line-height: 28rpx;
    margin-left: 10rpx;
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
  
  .card-title {
    font-size: 32rpx;
  }
  
  .code-list {
    font-family: 'Consolas';
    background-color: $card-bg-color;
    margin-top: 8rpx;
    padding: 20rpx;
  }
  
  .code-block {
    display: flex;
  }
  
  .code-index {
    flex-shrink: 0;
    width: 2em;
    display: flex;
    justify-content: flex-end;
    margin-right: 1em;
    color: $text-help-color;
  }
  
  .code-text {
    word-break: break-all;
  }
  
  .code-block+.code-block {
    margin-top: 20rpx;
  }
</style>
