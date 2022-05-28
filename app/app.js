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

const initApp = (mdl, state) => (mdl.state.project = mdl.projects[0])

const App = (mdl) => {
  const state = {
    sidebar: { open: false },
    toggleSideBar: (state) => (state.sidebar.open = !state.sidebar.open),
  }
  console.log(mdl, state)

  initApp(mdl, state)

  return {
    view: () => {
      return m(
        "section",

        m(SideBar, { mdl, state }),

        m(
          "section.w3-main#main",
          {
            class: moveRight(state, mdl),
          },
          m(Toolbar, { mdl, state }),
          m(Modal, { mdl }),

          m(
            "article.w3-row w3-ul",
            { style: { overflowX: "auto" } },
            mdl.state.project.cols.map((col, idx) =>
              m(Column, { key: idx, col, mdl })
            )
          )
        )
      )
    },
  }
}

export default App

