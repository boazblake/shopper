import m from "mithril"
import { load } from "../model"
import { NewItemForm } from './forms'

const deleteItem = (mdl, id) => {
  console.log(mdl, id)
  mdl.http.deleteTask(mdl, `items/${id}`).fork(log('err'), () => load(mdl))
}

const drop = (mdl, state) => (evt) => {
  evt.preventDefault()
  const onSuccess = () => {
    load(mdl)
    state.highlight = false
    mdl.state.dragging.item = null
    mdl.state.dragging.swapItem = null
  }


  mdl.state.dragging.item.order = mdl.state.dragging.swapItem.order
  mdl.http
    .putTask(mdl, `items/${mdl.state.dragging.item.id}`, mdl.state.dragging.item)
    .fork(log("error"), onSuccess)

  return mdl
}

const dragOver = (mdl, state, item) => (evt) => {
  state.highlight = true
  mdl.state.dragging.swapItem = item
  evt.preventDefault()
}

const dragEnter = (mdl, state, item) => (evt) => {
  state.highlight = true
  mdl.state.dragging.swapItem = item
  evt.preventDefault()
  return true
}

const dragLeave = (state) => (evt) => {
  state.highlight = false
  evt.preventDefault()
  return true
}

const dragEnd = (mdl, state, item) => (evt) => {
  state.highlight = false
  mdl.state.dragging.swapItem = item
  evt.preventDefault()
  return true
}

const Item = () => {
  const state = {
    highlight: false,
    draggable: false
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li.w3-list-item.w3-leftbar.w3-hover-border-orange.dragster-block",
        {
          id: item.id,
          draggable: true,//state.draggable,
          class: state.highlight ? "w3-orange" : "",
          ondrop: drop(mdl, state, item),
          ondragover: dragOver(mdl, state, item),
          ondragenter: dragEnter(mdl, state, item),
          ondragend: dragEnd(mdl, state, item),
          ondragleave: dragLeave(state, item),
          ondragstart: () => mdl.state.dragging.item = item,
        },
        m('.w3-bar',
          item.img && m("img.w3-bar-item.w3-circle", { src: item.img, style: { width: '85px' } }),
          m("p.w3-bar-item", item.title),
          m('button.w3-button w3-border.w3-right', {
            onclick: () => deleteItem(mdl, item.id)
          }, 'Delete'),
          m('button.w3-button w3-border.w3-right', {
            onmousedown: () => state.draggable = true,
            ontouchstart: () => state.draggable = true,
            onmouseup: () => state.draggable = false,
            ontouchend: () => state.draggable = false,
          }, 'Move'),
          m('button.w3-button w3-border.w3-right', {
            onclick: () => {
              mdl.state.showModal = true
              mdl.state.modalContent = m(NewItemForm, { catId: item.catId, mdl, item, isEdit: true })
            }
          }, 'Edit')
        ),
        m('.w3-bar', item.quantity > 1 && m("p.w3-p", `${item.quantity} ${item.unit}`),)

      )
    },
  }
}

export default Item

