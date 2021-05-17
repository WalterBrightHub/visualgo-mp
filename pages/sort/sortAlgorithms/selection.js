import tranceformFrame from './tranceformFrame.js'

const sortGenerator = function*(A) {
  const array = A.map(item => ({
    ...item
  })) //深拷贝
  let i = 0
  let j = 0
  let n = array.length
  let min = 0

  yield {
    info: {
      desc: '准备开始排序'
    },
    sequence: tranceformFrame(array)
  }

  for (i = 0; i < array.length - 1; i++) {

    min = i
    array[i].status = 'selected'
    yield {
      info: {
        desc: 'a[i]待交换'
      },
      sequence: tranceformFrame(array)
    }
    for (j = i + 1; j < n; j++) {
      if (array[j].data < array[min].data) {
        min = j
      }
    }
    if (array[i].data > array[min].data) {
      array[min].status = 'featured'
      yield {
        info: {
          desc: 'a[i]<a[min]，交换两个元素'
        },
        sequence: tranceformFrame(array)
      }
      let t = array[i]
      array[i] = array[min]
      array[min] = t

      array[i].status = "sorted"
      array[min].status = "unsorted"

      yield {
        info: {
          desc: '第i轮排序完成'
        },
        sequence: tranceformFrame(array)
      }
    } else {
      array[i].status = 'sorted'
      yield {
        info: {
          desc: 'a[i]是待排序中最小的元素'
        },
        sequence: tranceformFrame(array)
      }


    }

      // array[i].status = "sorted"

      // yield {
      //   info: {
      //     desc: '第i轮排序完成'
      //   },
      //   sequence: tranceformFrame(array)
      // }

  }
  array[n-1].status='sorted'
  yield {
    info: {
      desc: '已完成选择排序'
    },
    sequence: tranceformFrame(array)
  }
}

const featuredRectWord = '最小项'

export default {
  sortGenerator,
  featuredRectWord
}
