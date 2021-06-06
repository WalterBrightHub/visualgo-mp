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
  let dx = [1, 0, 0, -1]
  let dy = [0, 1, -1, 0]


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
          from: 7,
          to: 7
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
  // maze[0][0] = 5
  flag = false
  // yield {
  //   x: 0,
  //   y: 0,
  //   from: 0,
  //   to: 5
  // }
  yield* dfs(maze, 0, 0)
}

let description=[
  '当前展示的是使用DFS（深度优先搜索）算法寻找起点到终点的连通路径的过程。',
  'BFS在访问一个顶点之后，递归访问它的邻接顶点。当某条路径无法继续时回溯访问。',
  '当访问到终点位置时，就找到了起点到终点的连通路径。',
  '当递归访问结束时，就找到了起点能够到达的所有连通单元，构成一个连通块。若终点没有被访问过，则起点到终点没有连通路径。',

]
  let code=[
    'link=false',
    ' ',
    'function visit( point )',
    '  visited[point]=1',
    '  for next = front 的未访问的，可连通的邻接点 ',
    '      if( next == target ) link = true',
    '    visit(next)',
    '   ',
    'function dfs(M)',
    '  return visit(source)'
  ]

export default {
  searchGenerator,
  featuredWord: '当前搜索到的单元',
  description,
  code
}
