const clone = obj => JSON.parse(JSON.stringify(obj))


/*
0:可走的路
1:不可走的路
3:在队列中的cell
5:已走过的cell

*/
let flag

let dfs = function*(maze, x, y) {
  if (flag) {
    return
  }
  yield {
    x,
    y,
    from: 3,
    to: 5
  }
  let dx = [1,0,0,-1]
  let dy = [0,1,-1,0]


  for (let i = 0; i < 4; i++) {
    if (flag) {
      return
    }
    let nx = x + dx[i]
    let ny = y + dy[i]
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
        flag = true
        return true
      } else if (maze[nx][ny] == 0) {
        maze[nx][ny] = 3
        yield {
          x: nx,
          y: ny,
          from: 0,
          to: 3
        }
        yield* dfs(maze, nx, ny)
      }
    }


  }
}

let searchGenerator = function*(m, x, y) {
  let maze = clone(m)
  maze[0][0] = 5
  flag = false
  yield {
    x: 0,
    y: 0,
    from: 0,
    to: 5
  }
  yield* dfs(maze, 0, 0)
}

export default   {searchGenerator}
