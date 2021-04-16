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


    for (j = 0; j < array.length - i - 1; j++) {

      // yield {
      //   info: {
      //     i,
      //     j,
      //     desc: `i=${i},j=${j}`
      //   },
      //   sequence: tranceformFrame(array)
      // }

      array[j].status = array[j + 1].status = 'selected'

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


      array[j].status = 'compared'
      array[j + 1].status = 'compared'

        yield {
          info: {
            desc: 'a[j]>a[j+1]，交换两个元素'
          },
          sequence: tranceformFrame(array)
        }
      } else { //do nothing
      
      array[j].status = 'compared'
      array[j + 1].status = 'compared'
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
      array[j + 1].status = 'unsorted'
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

export default sortGenerator