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

*/

let bfs = function*(m) {
  let maze = clone(m)
  let q = new Queue()
  let dx = [0, 0, 1, -1]
  let dy = [1, -1, 0, 0]
  maze[0][0]=3
  q.push_back({
    x: 0,
    y: 0
  })
  yield {
    x: 0,
    y: 0,
    from: 0,
    to: 3
  }
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
            from: 0,
            to: 3
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

export default bfs
