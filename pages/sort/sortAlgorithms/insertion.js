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

export default {
  sortGenerator,
  featuredRectWord
}
