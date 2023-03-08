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
        "nav.w3-fixed.w3-container",
        mdl.currentStore &&
        m(
          ".w3-row",
          m(
            "button.w3-button.w3-hide-large.w3-border.w3-col s4",
            { onclick: () => state.toggleSideBar(state) },
            "MENU"
          ),
          m(".w3-col s4 w3-center", mdl.currentStore.title),

          m(
            "button.w3-button.w3-border.w3-col s4",
            {
              onclick: () => {
                mdl.state.modalContent = m(ItemForm, { mdl, catId: null, })
                mdl.state.showModal = true
              },
            },
            "Add an Item"
          ),
          mdl.state.dragging.isDragging && m("button.w3-block.w3-button.w3-green", { onclick: () => { mdl.state.dragging.isDragging = false; console.log(mdl.state) } }, 'Save Changes'),
        )
      )
    },
  }
}

export default Toolbar

