import tranceformFrame from './tranceformFrame.js'

const sortGenerator = function*(A) {
  const array = A.map(item => ({
    ...item
  })) //深拷贝
  let i = 0
  let j = 0

  yield {
    info: {
      desc: '准备开始排序'
    },
    sequence: tranceformFrame(array)
  }

  for (i = 0; i < array.length - 1; i++) {


    array[0].status = 'featured'


    for (j = 0; j < array.length - i - 1; j++) {

      // yield {
      //   info: {
      //     i,
      //     j,
      //     desc: `i=${i},j=${j}`
      //   },
      //   sequence: tranceformFrame(array)
      // }

      array[j + 1].status = 'selected'

      yield {
        info: {
          i,
          j,
          desc: `选择并比较a[j]和a[j+1]}`
        },
        sequence: tranceformFrame(array)
      }

      if (array[j].data > array[j + 1].data) {
        let t = array[j]
        array[j] = array[j + 1]
        array[j + 1] = t


        array[j].status = 'selected'
        array[j + 1].status = 'featured'

        yield {
          info: {
            desc: 'a[j]>a[j+1]，交换两个元素'
          },
          sequence: tranceformFrame(array)
        }
      } else { //do nothing

        array[j].status = 'selected'
        array[j + 1].status = 'featured'
        yield {
          info: {
            desc: 'a[j]<a[j+1]，保持原状'
          },
          sequence: tranceformFrame(array)
        }
      }

      // yield {
      //   info: {
      //     desc: '完成一次比较'
      //   },
      //   sequence: tranceformFrame(array)
      // }
      array[j].status = 'unsorted'
      // array[j + 1].status = 'unsorted'
    }

    array[array.length - i - 1].status = 'sorted'

    yield {
      info: {
        desc: `已完成i=${i}时对j的遍历`
      },
      sequence: tranceformFrame(array)
    }
  }

  array[0].status = 'sorted'

  yield {
    info: {
      desc: '已完成冒泡排序'
    },
    sequence: tranceformFrame(array)
  }
}

const featuredRectWord = '泡泡'
const code=[
  'for i = 0 to n-1',
  '  for j = 0 to n-i-1',
  '    if( a[j] > a[j+1] ) swap( a[j] , a[j+1] )'
]

const description=[
  '冒泡排序是一种基本的排序算法。',
  '在每一次操作中，从左往右两两比较，并让较大的数往左移动，就好像大的泡泡往左冒一样。',
]

export default {
  sortGenerator,
  featuredRectWord,
  code,
  description
}
