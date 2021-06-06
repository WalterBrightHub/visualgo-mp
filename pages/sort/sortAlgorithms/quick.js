import tranceformFrame from './tranceformFrame.js'

const sortGenerator = function*(A) {
  const array = A.map(item => ({
    ...item
  })) //深拷贝
  yield {
        info: {
          desc: '第i轮排序完成'
        },
        sequence:tranceformFrame(array)
  }
  const sort = function*(l, r) {
    if (l < r) {
      let i = l
      let j = r + 1
      let x = array[l]
      array[l].status = 'featured'
      yield {
        info: {
          desc: '第i轮排序完成'
        },
        sequence: tranceformFrame(array)
      }
      while (true) {
        while (array[++i].data < x.data && i < r);
        while (array[--j].data > x.data);
        if (i >= j) {
          break
        } else {
          array[i].status = array[j].status = 'selected'
          yield {
            info: {
              desc: '准备交换'
            },
            sequence: tranceformFrame(array)
          }
          let t = array[j]
          array[j] = array[i]
          array[i] = t
          yield {
            info: {
              desc: '交换完成'
            },
            sequence: tranceformFrame(array)
          }
          array[i].status = array[j].status = 'unsorted'
        }
      }
      array[l].status = 'unsorted'
      array[l] = array[j]
      array[j] = x
      // yield tranceformFrame(array)
      yield {
        info: {
          desc: '第i轮排序完成'
        },
        sequence: tranceformFrame(array)
      }
      yield* sort(l, j - 1)
      yield* sort(j + 1, r)
    }
  }
  yield* sort(0, array.length - 1)
}

const featuredRectWord = '基准位置'

const code=[
  'function sort( left , right )',
  '  选定基准t = left',
  '  i = left+1',
  '  j = right',
  '  i 和 j 向中间移动, 移动的过程中若出现 a[i] > a[j] , 则 swap( a[i] , a[j] )',
  '  swap( a[left] , a[j] ) // 此时 a[left:j-1] 均小于 a[j], a[j+1:right] 均大于 a[j]',
  '  sort( left , j-1 )',
  '  sort( j+1 , right )',
  '',
  'function QuickSort',
  '  return sort( 0 , n-1 )'
]

export default {
  sortGenerator,
  featuredRectWord,
  code
}
