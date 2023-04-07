import Hammer from "hammerjs"

export const DoubleTap = () => new Hammer.Tap({
  event: 'doubletap',
  taps: 2
})

const isCorrectDom = (dom, key, value) => dom[key] == value //!= null || undefined

const getContainer = (dom, key, value) =>
  isCorrectDom(dom, key, value) ? dom : getContainer(dom.parentElement)

const setupDoubleTap = ({ fn, state, id, dom }) => {
  console.log(dom, id, state, fn)
  state[dom.id].hammer = new Hammer.Manager(dom)
  state[dom.id].hammer.add(DoubleTap)
  state[dom.id].hammer.on('doubletap', (e) => {
    console.log(e.target.parentElement.parentElement.parentElement['data-hammer-id'] == id)
    console.log('e', getContainer(e.target, 'data-id', data))
    fn(e)
  })
  return state
}

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



export { uuid, log, range, setupDoubleTap }

