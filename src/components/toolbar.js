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
          ".w3-bar",
          m(
            "button.w3-button.w3-hide-large.w3-border.w3-bar-item.w3-left",
            { onclick: () => state.toggleSideBar(state) },
            "MENU"
          ),
          m(".w3-bar-item", mdl.currentStore.title),

          m(
            "button.w3-button.w3-border.w3-bar-item.w3-right",
            {
              onclick: () => {
                mdl.state.modalContent = m(ItemForm, { mdl, catId: null, })
                mdl.state.showModal = true
              },
            },
            "Add an Item"
          ),
          mdl.state.dragging.isDragging && m("button.w3-block.w3-button.w3-green", { onclick: () => mdl.state.dragging.isDragging = false }, 'Save Changes'),
        )
      )
    },
  }
}

export default Toolbar

