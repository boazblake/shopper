import m from "mithril"
import Toolbar from "./components/toolbar"
import Main from "./components/main"
import Modal from "./components/modal"
import { load } from "./model"



const mainStyle = mdl => ({
  maxHeight: "100dvh",
  overflow: "hidden",
  marginLeft: mdl.settings.profile == 'desktop' ? '300px' : '0'
})


const App = (mdl) => {
  const state = {
    sidebar: { open: false },
    toggleSideBar: (state) => (state.sidebar.open = !state.sidebar.open),
  }
  load(mdl)
  return {
    view: () => {
      return m(
        "page.w3-theme",
        m(Modal, { mdl }),


        m(
          "section.#main",
          {
            style: mainStyle(mdl),
          },
          m(Toolbar, { mdl, state }),
          m(Main, { mdl, state })
        )
      )
    },
  }
}

export default App

