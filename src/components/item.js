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


const isCorrectDom = dom => dom.classList.contains('swipe-container')

const getContainer = dom =>
  isCorrectDom(dom) ? dom : getContainer(dom.parentElement)

const runSwipe = ({ leftAction, rightAction, resetAction }, e) => {
  // define the minimum distance to trigger the action
  const container = getContainer(e.target);
  const minDistance = container.clientWidth * 60 / 100
  const swipeDistance = container.scrollLeft - container.clientWidth;
  // console.log(container.clientWidth, swipeDistance, minDistance * -1)
  // get the distance the user swiped
  console.log(swipeDistance)
  if (swipeDistance < (minDistance / 2 * -1)) {
    leftAction()
  } else if (swipeDistance > minDistance) {
    rightAction()
  } else {
    resetAction()
  }
}


const handleSwipe = (mdl, state, item) => e => {
  // log('no')('swipe'); isCorrectDom(e.target) &&
  !state.draggable
    ?
    runSwipe({
      leftAction: () => leftSwipe(mdl, state, item),
      rightAction: () => rightSwap(mdl, state, item),
      resetAction: () => resetSwipeAction(mdl, state, item)
    }, e) : () => { }
}

const Item = () => {
  const state = {
    highlight: false,
    draggable: false
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li.w3-li.w3-list-item.w3-leftbar.w3-border-bottom",
        {
          id: item.id,
          draggable: state.draggable,
          class: state.highlight ? "w3-orange" : "",
          style: { height: '70px' },
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
        m('.swipe-container', {
          ontouchend: handleSwipe(mdl, state, item)
        },

          !state.draggable && m('.swipe-action.swipe-left',
            m('', {
              // onclick: () => editItem(mdl, item)
            }, 'Edit')
          ),

          m('.', {
            class: !state.draggable ? 'swipe-element' : '',
            style: { height: '60px', },
          },
            m('.w3-left', m("img", { src: item.img, style: { maxWidth: '85px' } })),
            m("", { style: { fontSize: '1.2rem' } }, item.title),
            item.quantity > 0 && m(".w3-left", `${item.quantity} ${item.unit}`),
            item.price > 0 && m(".w3-right", `$ ${item.price}`)
            // m('.', {
            //   style: { height: '100%', },
            //   onpointerdown: e => { state.draggable = true; e.preventDefault(); e.stopPropagation(); },
            //   onpointerup: e => { state.draggable = false; e.preventDefault(); e.stopPropagation() },
            //   ondrop: drop(mdl, state, item),
            //   ondragover: dragOver(mdl, state, item),
            //   ondragenter: dragEnter(mdl, state, item),
            //   ondragend: dragEnd(mdl, state, item),
            //   ondragleave: dragLeave(state, item),
            //   ondragstart: () => mdl.state.dragging.item = item,

            // }, ''),

          ),




          !state.draggable && m('.swipe-action.swipe-right',
            m('icon', m.trust('&#9888;'))
          ),



        ),
      )
    },
  }
}

export default Item

