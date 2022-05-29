import { findCurrentProject } from "./helpers"
import SideBar from "./sidebar"
import Toolbar from "./toolbar"
import Column from "./column"
import Modal from "./modal"

const moveRight = (state, mdl) =>
  mdl.settings.profile == "desktop"
    ? "move-right"
    : state.sidebar.open
    ? "move-right"
    : ""

const initApp = (mdl) => {
  if (!mdl.state.projectId) {
    mdl.state.projectId = mdl.projects[0].id
  }
  return findCurrentProject(mdl)
}

const App = (mdl) => {
  const state = {
    sidebar: { open: false },
    toggleSideBar: (state) => (state.sidebar.open = !state.sidebar.open),
  }
  console.log(mdl, state)

  mdl.currentProject = initApp(mdl)

  return {
    view: () => {
      return m(
        "section",
        m(Modal, { mdl }),

        m(SideBar, { mdl, state }),

        m(
          "section.w3-main#main",
          {
            class: moveRight(state, mdl),
          },
          m(Toolbar, { mdl, state }),
          m(
            "article.w3-row w3-ul",
            { style: { overflowX: "auto" } },
            mdl.currentProject.cols.map((col, idx) =>
              m(Column, { key: idx, col, mdl })
            )
          )
        )
      )
    },
  }
}

export default App

