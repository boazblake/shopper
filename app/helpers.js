import { propEq } from "ramda"

const uuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const log = (m) => (v) => {
  console.log(m, v)
  return v
}

// const updateDropped = mdl => cardId => newColId =>
// mdl.cols.filtet

const findCurrentProject = (mdl) =>
  mdl.projects.find(propEq("id", mdl.state.projectId))

export { uuid, log, findCurrentProject }

