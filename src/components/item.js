import m from "mithril"
import { load } from "../model"
import { ItemForm } from './forms'
import Pressure from 'pressure'

const setupPressure = (state) => ({ dom }) => {
  Pressure.set(dom, {
    startDeepPress: (x) => { console.log('deep', x); state.draggable = true },
    endDeepPress: () => state.draggable = false
  })
}

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

const leftSwipe = (mdl, state, item) => {
  state.left = true
  editItem(mdl, item)
  resetSwipeAction(mdl, state, item)
}
const rightSwap = (mdl, state, item) => {
  state.right = true
  deleteItem(mdl, item.id)
  resetSwipeAction(mdl, state, item)
}

const resetSwipeAction = (mdl, state, item) => {
  state.left = false;
  state.right = false
}

const getContainer = dom =>
  dom.classList.contains('swipe-container') ? dom : getContainer(dom.parentElement)

const runSwipe = ({ leftAction, rightAction, resetAction }, e) => {
  // define the minimum distance to trigger the action
  const container = getContainer(e.target);
  const minDistance = container.clientWidth * 60 / 100
  const swipeDistance = container.scrollLeft - container.clientWidth;
  // console.log(container.clientWidth, swipeDistance, minDistance * -1)
  // get the distance the user swiped
  console.log(swipeDistance)
  if (swipeDistance < (minDistance * -1)) {
    leftAction()
  } else if (swipeDistance > minDistance) {
    rightAction()
  } else {
    resetAction()
  }
}

const handleSwipe = (mdl, state, item) => e => state.draggable
  ? () => { } :
  runSwipe({
    leftAction: () => leftSwipe(mdl, state, item),
    rightAction: () => rightSwap(mdl, state, item),
    resetAction: () => resetSwipeAction(mdl, state, item)
  }, e)

const Item = () => {
  const state = {
    highlight: false,
    draggable: false
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li.w3-list-item.w3-leftbar.dragster-block",
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

          // onmousedown: () => state.draggable = true,
          // ontouchstart: () => state.draggable = true,
          // onmouseup: () => state.draggable = false,
          // ontouchend: () => state.draggable = false,
          // ontouchstart: (e) => {
          //   for (let i = 0; i < e.targetTouches.length; i++) {
          //     // Add code to "switch" based on the force value. For example
          //     // minimum pressure vs. maximum pressure could result in
          //     // different handling of the user's input.
          //     console.log(`targetTouches[${i}].force = ${e.targetTouches[i].force}`);
          //   }
          //   // console.log(e.targetTouches[0].force)
          // },
        },
        m('.w3-bar.swipe-container', {
          ontouchend: handleSwipe(mdl, state, item)
        },

          !state.draggable && m('.swipe-action.swipe-left',
            m('button.w3-button w3-border.w3-left', {
              onclick: () => editItem(mdl, item)
            }, 'Edit')
          ),

          m('.', {
            class: !state.draggable ? 'swipe-element' : '',
            style: { height: '98px', width: '395px' },
          },
            item.img && m("img.w3-bar-item.w3-circle", { src: item.img, style: { width: '85px' } }),

            m("h4.w3-bar-item", item.title),

            m('.w3-border.w3-right', {
              style: { height: '100%', },
              onpointerdown: e => state.draggable = true,
              onpointermove: e => console.log('pm', e, state),
              onpointerup: e => state.draggable = false,
              ontouchstart: () => state.draggable = true,
              onmouseup: () => state.draggable = false,
              ontouchend: () => state.draggable = false,
            }, 'Move'),

          ),




          !state.draggable && m('.swipe-action.swipe-right',
            m('icon', m.trust('&#9888;'))
          ),



        ),
        m('.w3-bar', item.quantity > 1 && m("p.w3-p", `${item.quantity} ${item.unit}`),)
      )
    },
  }
}

export default Item

