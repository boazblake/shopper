

const uuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const range = (size) => [...Array(size).keys()]

const log = (m) => (v) => {
  console.log(m, v)
  return v
}

window.log = log




const toDto = (mdl) => ({
  of: (x) => {
    console.log("xx", x)

    mdl.projects.push(x)
  },
})



export { uuid, log, range }

