import m from "mithril"
import { load } from "../model"
import { ItemForm } from './forms'

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

const editItem = (mdl, item) => {
  mdl.state.showModal = true
  mdl.state.modalContent = m(ItemForm, { catId: item.catId, mdl, item, isEdit: true })
}


const handleSwipe = (mdl, item) => (e) => {
  // define the minimum distance to trigger the action
  const minDistance = 80;
  const container = document.querySelector('.swipe-container');
  const output = document.querySelector('.output');
  // get the distance the user swiped
  const swipeDistance = container.scrollLeft - container.clientWidth;
  if (swipeDistance < minDistance * -1) {
    console.log('left', e)
    editItem(mdl, item)
  } else if (swipeDistance > minDistance) {
    console.log('right', e)
    deleteItem(mdl, item.id)
  } else {
    console.log('nothing', e)
    output.innerHTML = `did not swipe ${minDistance}px`;
  }
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
          draggable: state.draggable,
          class: state.highlight ? "w3-orange" : "",
          ondrop: drop(mdl, state, item),
          ondragover: dragOver(mdl, state, item),
          ondragenter: dragEnter(mdl, state, item),
          ondragend: dragEnd(mdl, state, item),
          ondragleave: dragLeave(state, item),
          ondragstart: () => mdl.state.dragging.item = item,
        },
        m('.w3-bar.swipe-container', {
          ontouchend: handleSwipe(mdl, item),
        },

          m('.swipe-action.swipe-left',
            m('button.w3-button w3-border.w3-right', {
              onclick: () => editItem(mdl, item)
            }, 'Edit')
          ),

          m('.swipe-element',
            item.img && m("img.w3-bar-item.w3-circle", { src: item.img, style: { width: '85px' } }),
            m("h4.w3-bar-item", item.title)),


          m('.swipe-action.swipe-right',
            m('button.w3-button w3-border.w3-right', {
              onclick: () => deleteItem(mdl, item.id)
            }, 'Delete')
          ),
          // m('button.w3-button w3-border.w3-right', {
          //   onmousedown: () => state.draggable = true,
          //   ontouchstart: () => state.draggable = true,
          //   onmouseup: () => state.draggable = false,
          //   ontouchend: () => state.draggable = false,
          // }, 'Move'),

        ),
        m('.w3-bar', item.quantity > 1 && m("p.w3-p", `${item.quantity} ${item.unit}`),)

      )
    },
  }
}

export default Item

