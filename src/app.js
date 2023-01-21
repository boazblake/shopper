import m from "mithril"
import SideBar from "./components/sidebar"
import Toolbar from "./components/toolbar"
import Main from "./components/main"
import Modal from "./components/modal"
import { load } from "./model"
import Stream from "mithril-stream"



const App = (mdl) => {
  const state = {
    sidebar: { open: false },
    setTicket: Stream(null),
    toggleSideBar: (state) => (state.sidebar.open = !state.sidebar.open),
  }
  load(mdl)
  return {
    view: () => {
      return m(
        "section.w3-theme",
        m(Modal, { mdl }),

        m(SideBar, { mdl, state }),

        m(
          "section.#main",
          {
            style: { height: "100vh", overflow: "hidden", marginLeft: mdl.settings.profile == 'desktop' || state.sidebar.open ? '300px' : '0' },
          },
          m(Toolbar, { mdl, state }),
          m(Main, { mdl, state })
        )
      )
    },
  }
}

export default App

