import m from "mithril"
import { load } from "../model"
import { ItemForm } from './forms'



const updateStore = (mdl) => {
  const onSuccess = (data) => {
    console.log("update store", data)
    load(mdl)
  }
  mdl.http
    .putTask(mdl, `stores/${mdl.currentStore.id}`, mdl.currentStore)
    .fork(log("error"), onSuccess)
}

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(
        "nav.w3-bar.w3-container.w3-padding.w3-fixed",
        m(
          "button.w3-button.w3-hide-large.w3-border",
          { onclick: () => state.toggleSideBar(state) },
          "MENU"
        ),
        mdl.currentStore &&
        m(
          ".w3-row w3-section",
          m(
            ".m6 w3-left",
            m("h1.w3-title w3-col", mdl.currentStore.title)
          ),
          m(
            ".m3 w3-right",
            m(
              "button. w3-button  w3-border w3-large w3-col",
              {
                onclick: () => {
                  mdl.state.modalContent = m(ItemForm, { mdl, catId: null, })
                  mdl.state.showModal = true
                },
              },
              "+"
            )
          )
        )
      )
    },
  }
}

export default Toolbar

