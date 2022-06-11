import { isEmpty, head } from "ramda"
import { map, prop, propEq } from "ramda"

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

const shortName = (mdl) =>
  `${mdl.currentProject.title.slice(0, 3).toUpperCase()}-`

// const updateDropped = mdl => cardId => newColId =>
// mdl.cols.filtet

const findCurrentProject = (mdl) => {
  // mdl.db.allDocs(log("all doxs"), log("no docs"))

  return mdl.projects.find(propEq("id", mdl.state.projectId))
}

const toDto = (mdl) => ({
  of: (x) => {
    console.log("xx", x)

    mdl.projects.push(x)
  },
})

export { uuid, log, shortName, range }

