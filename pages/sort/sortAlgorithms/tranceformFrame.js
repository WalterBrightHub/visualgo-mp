const tranceformFrame = array => array.reduce((pos, item, ind) => {
  pos[item.order] = { ...item, order: ind }
  return pos
}, Array(array.length))

export default tranceformFrame