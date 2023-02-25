import m from "mithril"
import { propEq } from "ramda"
import { STORE, CAT, ITEM, load, units } from "../model"

const addStore = (mdl, state) => {
  let store = STORE(state.title)

  const onError = log("error")
  const onSuccess = (data) => {
    state.title = ""
    mdl.state.showModal = false
    mdl.state.modalContent = null
    load(mdl)
  }

  mdl.http.postTask(mdl, "stores", store).fork(onError, onSuccess)
}

const NewStoreForm = () => {
  const state = {
    title: "",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-container.w3-card.w3-white.w3-animate-zoom",
        { onsubmit: (e) => e.preventDefault() },
        m(
          "div.w3-section",
          m("label", m("b", "Store Title")),
          m("input.w3-input.w3-border-bottom", {
            oncreate: ({ dom }) => { dom.select(); dom.focus() },
            type: "text",
            value: state.title,
            oninput: (e) => (state.title = e.target.value),
          })
        ),
        m(
          "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
          { onclick: () => addStore(mdl, state) },
          "add"
        )
      ),
  }
}


const addCat = (mdl, state) => {
  const cat = CAT(state.title, mdl.currentStore.id)
  const onError = log("error")
  const onSuccess = (data) => {
    state.title = ""
    mdl.state.showModal = false
    mdl.state.modalContent = null
    load(mdl)
  }
  mdl.http.postTask(mdl, "cats", cat).fork(onError, onSuccess)
}


const NewCatForm = () => {
  const state = {
    title: "",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-container.w3-card.w3-white.w3-animate-zoom",
        { onsubmit: (e) => e.preventDefault() },
        m(
          "div.w3-section",
          m("label", m("b", "Category Title")),
          m("input.w3-input.w3-border-bottom", {
            oncreate: ({ dom }) => { dom.select(); dom.focus() },
            type: "text",
            value: state.title,
            oninput: (e) => (state.title = e.target.value),
          })
        ),
        m(
          "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
          { onclick: () => addCat(mdl, state) },
          "add"
        )
      ),
  }
}

const getCurrentCatItemLength = (mdl, id) => mdl.cats.find(propEq('id', id)).items.length

const addOrUpdateItem = (mdl, state, isEdit) => {
  const { catId, title, notes, order, quantity, unit, price, id } = state
  let item = isEdit ? { catId, title, notes, order, quantity, unit, price, id } : ITEM({ catId, title, notes, order: getCurrentCatItemLength(mdl, catId), quantity, unit, price })
  const onSuccess = (data) => {
    state = {
      catId, title: "", notes: "", order: 0, quantity: "", unit: "", price: 0
    }
    load(mdl)
    mdl.state.showModal = false
    mdl.state.modalContent = null
  }
  const addOrUpdateItemTask = (mdl, item) => isEdit
    ? mdl.http.postTask(mdl, "items", item)
    : mdl.http.putTask(mdl, `items/${item.id}`, item)

  return addOrUpdateItemTask(mdl, item).
    fork(log("error"), onSuccess)
}

const NewItemForm = ({ attrs: { mdl, catId, item, isEdit } }) => {
  const state = {
    catId,
    catTitle: '',
    title: '',
    notes: '',
    order: 0,
    quantity: 0,
    unit: '',
    price: 0
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
      m(
        "div.w3-section",
        m("label", m("b", "Title")),
        m("input.w3-input.w3-border-bottom", {
          oncreate: ({ dom }) => { dom.select(); dom.focus() },
          type: "text",
          value: state.title,
          oninput: (e) => (state.title = e.target.value),
        })
      ),
      m(
        "div.w3-section",
        m("label", m("b", "Category")),
        m("select.w3-input.w3-border-bottom", {
          value: mdl.cats.find(propEq('id', state.catId))?.title || '',
          onchange: (e) => { state.catTitle = e.target.value; state.catId = mdl.cats.find(propEq('title', state.catTitle)).id },
        }, mdl.cats.map(cat => m(`option#${cat.id}`, cat.title)))
      ),
      m(
        "div.w3-section",
        m("label", m("b", "Quantity")),
        m("input.w3-input.w3-border-bottom", {
          type: "number",
          value: state.quantity,
          oninput: (e) => (state.quantity = e.target.value),
        })
      ),
      m(
        "div.w3-section",
        m("label", m("b", "Unit")),
        m("select.w3-input.w3-border-bottom", {
          value: state.unit,
          onchange: (e) => (state.unit = e.target.value),
        }, units.map(unit => m('option', unit)))
      ),
      m(
        "div.w3-section",
        m("label", m("b", "Price")),
        m("input.w3-input.w3-border-bottom", {
          type: "number",
          value: state.price,
          oninput: (e) => (state.price = e.target.value),
        })
      ),
      m(
        "div.w3-section",
        m("label", m("b", "Notes")),
        m("textarea.w3-input.w3-border-bottom", { oninput: (e) => (state.notes = e.target.value), }, state.notes)
      ),
      m(
        "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
        { onclick: () => addOrUpdateItem(mdl, state, isEdit) },
        "add"
      )
    )
  }
}
export { NewStoreForm, NewCatForm, NewItemForm }

