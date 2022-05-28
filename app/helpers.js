const uuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const log = (m: string) => (v) => {
  console.log(m, v)
  v
}

// const updateDropped = mdl => cardId => newColId =>
// mdl.cols.filtet

export { uuid, log }
