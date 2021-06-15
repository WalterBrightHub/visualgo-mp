import tranceformFrame from './tranceformFrame.js'

const sortGenerator = function*(A) { 
  const array = A.map(item => ({
    ...item
  })) //深拷贝
  let i = 0
  let j = 0
  let n = array.length
  let target = 0

  yield {
    info: {
      desc: '准备开始排序'
    },
    sequence: tranceformFrame(array)
  }
  array[0].status = 'sorted'


  for (i = 1; i < n; i++) {
    // console.log(array)
    target = array[i]
    array[i].status = 'featured'
    yield {
      info: {
        desc: '选择a[i]准备插入排好序的序列'
      },
      sequence: tranceformFrame(array)
    }
    for (j = i - 1; j >= 0 && array[j].data > target.data; j--) {
      array[j + 1] = array[j]
    }
    array[j + 1] = target
    yield {
      info: {
        desc: 'a[i]插入序列完成'
      },
      sequence: tranceformFrame(array)
    }
    array[j + 1].status = 'sorted'
    yield {
      info: {
        desc: '第i轮排序完成'
      },
      sequence: tranceformFrame(array)
    }
  }
}

const featuredRectWord = '待排序项'

const code=[
  'for i = 1 to n-1',
  '  向左移动 a[i] 使得 a[0:i] 有序',
]

const description=[
  '插入排序排序是一种基本的排序算法。',
  '在每一次操作中，将有序序列右边的项往左移动，直到新的序列有序。',
]

export default {
  sortGenerator,
  featuredRectWord,
  code,
  description
}
