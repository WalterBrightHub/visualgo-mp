import tranceformFrame from './tranceformFrame.js'

const sortGenerator = function*(A) {
  const array = A.map(item => ({
    ...item
  })) //深拷贝
  // console.log(array)
  yield {
    info: {
      desc: '准备开始排序'
    },
    sequence: tranceformFrame(array)
  }


  const merge = (array1, array2) => {
    let i = 0
    let j = 0
    let ans = Array(array1.length + array2.length)
    while (i < array1.length || j < array2.length) {
      if (i === array1.length) {
        while (j < array2.length) {
          ans[i + j] = array2[j]
          j++
        }
      } else if (j === array2.length) {
        while (i < array1.length) {
          ans[i + j] = array1[i]
          i++
        }
      } else {
        if (array1[i].data <= array2[j].data) {
          ans[i + j] = array1[i]
          i++
        } else {
          ans[i + j] = array2[j]
          j++
        }
      }
    }
    return ans
  }
  const sort = function*(i, j) {
    if (j === i) {

      return array.slice(i, j + 1)
    } else {
      for (let t = 0; t < array.length; t++) {
        array[t].status = (t >= i && t <= j) ? "selected" : "unsorted"
      }
      yield {
        info: {
          desc: '排序[i,j]'
        },
        sequence: tranceformFrame(array)
      }
      let mid = Math.floor((i + j) / 2)
      let left = yield* sort(i, mid)
      let right = yield* sort(mid + 1, j)
      const now = merge(left, right)
      for (let t = i; t <= j; t++) {
        array[t] = now[t - i]
        array[t].status = "featured"
      }
      yield {
        info: {
          desc: '第i轮排序完成'
        },
        sequence: tranceformFrame(array)
      }
      return now
    }
  }
  yield* sort(0, array.length - 1)
}

const featuredRectWord = '当前合并的区间'
const code=[
  'function sort( left , right )',
  '  if( left == right)',
  '    return',
  '  else',
  '    middle = ( left + right ) / 2',
  '    sort( left , middle)',
  '    sort( middle , right)',
  '    merge( left , middle , right )',
  'function MergeSort',
  '  return sort( 0 , n-1 )'
]


const description=[
  '归并排序排序排序是一种高效率的排序算法。',
  '归并排序体现了分治的思想，将待排序的列表分为两份分别排序，然后将两个有序列表合并成一个有序列表。',
]

export default {
  sortGenerator,
  featuredRectWord,
  code,
  description
}
