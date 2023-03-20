import m from "mithril"
import { propEq } from "ramda"
import { ITEM, load, units, closeModal } from "../model"



const getCurrentCatItemLength = (mdl, id) => mdl.cats.find(propEq('id', id)).items.length || 0

const validateAddOrUpdateItem = (mdl, state, isEdit) => {
  const { catId, title, notes, order, quantity, unit, price, id } = state
  let item = isEdit ? { catId, title, notes, order, quantity, unit, price, id } : ITEM({ catId, title, notes, order: getCurrentCatItemLength(mdl, catId), quantity, unit, price })
  const onSuccess = (data) => {
    state = {
      catId, title: "", notes: "", order: 0, quantity: "", unit: "", price: 0
    }
    load(mdl)
    closeModal(mdl)
  }
  const addOrUpdateItemTask = (mdl, item) => isEdit
    ? mdl.http.postTask(mdl, "items", item)
    : mdl.http.putTask(mdl, `items/${item.id}`, item)

  //VALIDATIONSS
  return addOrUpdateItemTask(mdl, item).
    fork(log("error"), onSuccess)
}

const deleteItem = (mdl, id) =>
  mdl.http.deleteTask(mdl, `items/${id}`).fork(log('err'), () => {
    load(mdl);
    closeModal(mdl)
  })


const ItemForm = ({ attrs: { mdl, catId, item, isEdit } }) => {
  const state = {
    catId,
    catTitle: '',
    title: '',
    notes: '',
    order: '',
    quantity: '',
    unit: '',
    price: ''
  }

  if (catId) state.catTitle = mdl.cats.find(propEq('id', catId)).title

  if (isEdit) {
    state.catId = item.catId
    state.title = item.title
    state.notes = item.notes
    state.order = item.order
    state.quantity = item.quantity
    state.unit = item.unit
    state.price = item.price
    state.id = item.id
  }

  return {
    view: ({ attrs: { mdl } }) => m(
      "form.w3-container.w3-card.w3-white.w3-animate-zoom",
      { onsubmit: (e) => e.preventDefault() },
      m('.w3-section', m(
        "button.w3-button.w3-black.w3-border-black.w3-text-white",
        {
          // style: {
          //   position: 'absolute',
          //   top: '-50px',
          // },
          onclick: () => closeModal(mdl)
        }, m.trust("&#10005;")
      )),
      m(
        ".w3-section",
        m("label", m("b", "Item")),
        m("input.w3-input.w3-border-bottom", {
          oncreate: ({ dom }) => { dom.select(); dom.focus() },
          type: "text",
          value: state.title,
          oninput: (e) => (state.title = e.target.value),
        })
      ),
      m(
        ".w3-section",
        m("label", m("b", "Category")),
        m("select.w3-input.w3-border-bottom", {
          value: mdl.cats.find(propEq('id', state.catId))?.title || '',
          onchange: (e) => { state.catTitle = e.target.value; state.catId = mdl.cats.find(propEq('title', state.catTitle)).id },
        }, mdl.cats.map(cat => m(`option#${cat.id}`, cat.title)))
      ),
      m(
        ".w3-section",
        m("label", m("b", "Quantity")),
        m("input.w3-input.w3-border-bottom", {
          type: "number",
          value: state.quantity,
          pattern: "[0-9]*",
          inputmode: "numeric",
          oninput: (e) => (state.quantity = e.target.value),
        })
      ),
      m(
        ".w3-section",
        m("label", m("b", "Unit")),
        m("select.w3-input.w3-border-bottom", {
          value: state.unit,
          onchange: (e) => (state.unit = e.target.value),
        }, units.map(unit => m('option', unit)))
      ),
      m(
        ".w3-section",
        m("label", m("b", "Price")),
        m("input.w3-input.w3-border-bottom", {
          pattern: "[0-9]*",
          inputmode: "numeric",
          value: state.price,
          oninput: (e) => (state.price = e.target.value),
        })
      ),
      m(
        ".w3-section",
        m("label", m("b", "Notes")),
        m("textarea.w3-input.w3-border-bottom", { oninput: (e) => (state.notes = e.target.value), }, state.notes)
      ),

      m(
        "button.w3-button.w3-block.w3-orange.w3-margin-bottom",
        { onclick: () => validateAddOrUpdateItem(mdl, state, isEdit) },
        isEdit ? "Update" : "Add"
      ),

      isEdit && m(
        "button.w3-button.w3-red.w3-margin-top.w3-left",
        { onclick: () => deleteItem(mdl, item.id) },
        "Delete"
      ),

    )
  }
}
export { ItemForm }

