/**
 * 将a上的t个盘子经过b交给c
 * 
 * @param {*} n
 */
let hanoi = function*(n) {
  let towers = [
    new Array(n).fill(0).map((value, index) => n - index),
    [],
    []
  ]
  let getSequence = () => {
    let sequence = new Array(n).fill({
      tower: 0,
      height: 0
    })
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < towers[i].length; j++) {
        sequence[towers[i][j] - 1] = {
          tower: i,
          height: j
        }
      }
    }
    return sequence
  }
  console.log(towers)
  yield {
    info:{from:0,to:0},
    sequence:getSequence()
    }
  let call = function*(t, from, buffer, to) {
    // console.log(t)
    if (t === 1) {
      let movedPan = towers[from].pop()
      // console.log(movedPan)
      towers[to] = towers[to].concat(movedPan)
      console.log(towers)
      yield {
        info:{from,to},
        sequence:getSequence()}
    } else {
      yield* call(t - 1, from, to, buffer)
      yield* call(1, from, buffer, to)
      yield* call(t - 1, buffer, from, to)
    }
  }
  yield* call(n, 0, 1, 2)
}

export default hanoi
