import m from "mithril"
import SideBar from "./components/sidebar"
import Toolbar from "./components/toolbar"
import Main from "./components/main"
import Modal from "./components/modal"
import { load } from "./model"
import Stream from "mithril-stream"

const moveRight = (state, mdl) =>
  ["desktop", "tablet"].includes(mdl.settings.profile)
    ? "move-right"
    : state.sidebar.open
    ? "move-right"
    : ""

const App = (mdl) => {
  const state = {
    sidebar: { open: false },
    setTicket: Stream(null),
    observe: Stream(null),
    //   (dom, state) => {
    //   return Stream(dom)
    //   // const observer = new MutationObserver(([{ target }]) => {
    //   //   console.log(
    //   //     target.id,
    //   //     state.setTicket(),
    //   //     target.id == state.setTicket()
    //   //   )
    //   //   target.id == state.setTicket() &&
    //   //     target.scrollIntoView(state.setTicket())
    //   // })
    //   // observer.observe(dom, {
    //   //   childList: true,
    //   //   subtree: true,
    //   // })
    //   // return observer
    // },
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
          "section.w3-main#main",
          {
            style: { height: "100vh", overflow: "hidden" },
            class: moveRight(state, mdl),
          },
          m(Toolbar, { mdl, state }),
          m(Main, { mdl, state })
        )
      )
    },
  }
}

export default App

