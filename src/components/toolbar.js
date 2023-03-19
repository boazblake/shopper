import m from "mithril"
import { propEq } from "ramda"
import { openModal } from "../model"
import { StoreForm } from "../forms"


const saveChanges = mdl => {
  mdl.state.dragging.isDragging = false
  for (const cat in mdl.state.ItemdragList) {
    mdl.state.dragItemList[cat].option('disabled', true)
  }
}

// const updateStore = (mdl) => {
//   const onSuccess = (data) => {
//     load(mdl)
//   }
//   mdl.http
//     .putTask(mdl, `stores/${mdl.currentStore().id}`, mdl.currentStore)
//     .fork(log("error"), onSuccess)
// }

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(
        "nav.w3-fixed.w3-container",
        mdl.currentStore() &&
        m(
          ".w3-row",

          m(
            "button.w3-button.w3-orange.w3-col s4",
            {
              onclick: () => openModal({ mdl, content: StoreForm })
            },
            "New Store"
          ),

          m('select.w3-bar-item.w3-select.w3-border-0.w3-col s4 w3-center', {
            value: mdl.currentStore().id,
            onchange: e => {
              mdl.currentStore(mdl.stores.find(propEq('id', e.target.value)))
            }
          },
            mdl.stores.map(store => m('option', { value: store.id }, store.title))
          ),


          m(
            "button.w3-button.w3-col s4",
            {
              onclick: () =>
                openModal({ content: StoreForm, mdl, opts: { isEdit: true } })
              ,
            },
            "Edit Store"
          ),
          mdl.state.dragging.isDragging && m("button.w3-block.w3-button.w3-green", { onclick: () => saveChanges(mdl) }, 'Save Changes'),
        )
      )
    },
  }
}

export default Toolbar

