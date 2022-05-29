import { uuid } from "./helpers"

export const CARD = (id) => ({ id, title: "", text: "" })
export const COL = (id) => ({ id, title: "", cards: [], isSelected: false })
export const PROJ = (id) => ({ id, title: "", cols: [], cards: [] })

const defaultProject = () => {
  let p = PROJ(uuid())
  p.title = "default project"
  return p
}

const model = {
  settings: {},
  state: {
    dragging: {
      oldColId: "",
      cardId: "",
    },
    cols: [],
    cards: [],
    showModal: false,
    modalContent: null,
  },
  currentProject: null,
  projects: [defaultProject()],
}
export default model

