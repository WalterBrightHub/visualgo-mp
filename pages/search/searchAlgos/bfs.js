const clone = obj => JSON.parse(JSON.stringify(obj))
let MAX = 907
class Queue {
  constructor() {
    this.queue = new Array(MAX).fill(null)
    this.head = 0
    this.tail = 0
  }
  front() {
    return this.head === this.tail ? null : this.queue[this.head]
  }
  back() {
    return this.head === this.tail ? null : this.queue[(this.tail - 1 + MAX) % MAX]
  }
  empty() {
    return this.head === this.tail
  }
  size() {
    return (this.tail + MAX - this.head) % MAX
  }
  push_back(element) {
    if (this.head === (this.tail + 1) % MAX) {
      throw {
        info: 'full queue'
      }
    } else {
      this.queue[this.tail] = element
      this.tail = (this.tail + 1) % MAX
    }
  }
  pop_front() {
    let element = clone(this.front())
    this.queue[this.head] = null
    this.head = (this.head + 1) % MAX
    return element
  }
}

/*
0:可走的路
1:不可走的路
3:在队列中的cell
5:已走过的cell
7:起点和终点

*/

let bfs = function*(m) {
  let maze = clone(m)
  let q = new Queue()
  let dx = [1, 0, 0, -1]
  let dy = [0, 1, -1, 0]
  if (!maze[0]) {
    return
  }
  // maze[0][0]=3
  q.push_back({
    x: 0,
    y: 0
  })
  // yield {
  //   x: 0,
  //   y: 0,
  //   from: 0,
  //   to: 3
  // }
  while (!q.empty()) {
    let curr = q.pop_front()

    yield {
      x: curr.x,
      y: curr.y,
      from: 3,
      to: 5
    }
    for (let i = 0; i < 4; i++) {
      let nx = curr.x + dx[i]
      let ny = curr.y + dy[i]
      if (nx < 0 || nx >= 30 || ny < 0 || ny >= 30) {
        continue
      } else {
        if (nx === 29 && ny === 29) {

          yield {
            x: nx,
            y: ny,
            from: 7,
            to: 7
          }
          return true
        } else if (maze[nx][ny] == 0) {
          maze[nx][ny] = 3
          yield {
            x: nx,
            y: ny,
            from: 0,
            to: 3
          }
          q.push_back({
            x: nx,
            y: ny
          })
        }
      }
    }
  }

  return false
}

let description=[
  '当前展示的是使用BFS（广度优先搜索）算法寻找起点到终点的连通路径的过程。',
  'BFS在访问一个顶点之后，紧接着访问它的邻接顶点。因此所有的路径的搜索进度是一样的。',
  'BFS算法维护一个队列，一开始队列中只有起点。在每一步中，取出队首的单元，并且将的未遍历过的邻接的可连通单元加入队尾。',
  '重复上述步骤，当终点单元加入队列时，就说明起点到终点有连通路径。',
  '直到队列为空，并且没有新的单元加入队列时，就结束了搜索，并且找到了起点能够到达的所有连通单元，构成一个连通块。若此时终点没有加入过队列，则起点到终点没有连通路径。',

]

  let code=[
    'function bfs( M )',
    '  queue.push_back( source )',
    '  while( !queue.empty() )',
    '    front = queue.pop_front()',
    '    for next = front 的未访问的，可连通的邻接点 ',
    '      if( next == target ) return true',
    '      queue.push_back( next )',
    '  return false'
  ]
export default {
  searchGenerator: bfs,
  featuredWord: '搜索队列内的单元',
  description,
  code
}
