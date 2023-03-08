import m from "mithril"
import { ItemForm } from './forms'
import Sortable from "sortablejs";

// const drop = (mdl, state) => (evt) => {
//   evt.preventDefault()
//   const onSuccess = () => {
//     load(mdl)
//     state.highlight = false
//     mdl.state.dragging.item = null
//     mdl.state.dragging.swapItem = null
//   }

//   mdl.state.dragging.item.order = mdl.state.dragging.swapItem.order
//   mdl.http
//     .putTask(mdl, `items/${mdl.state.dragging.item.id}`, mdl.state.dragging.item)
//     .fork(log("error"), onSuccess)

//   return mdl
// }

// const dragOver = (mdl, state, item) => (evt) => {
//   state.highlight = true
//   mdl.state.dragging.swapItem = item
//   evt.preventDefault()
// }

// const dragEnter = (mdl, state, item) => (evt) => {
//   console.log('d', evt)
//   state.highlight = true
//   mdl.state.dragging.swapItem = item
//   evt.preventDefault()
//   return true
// }

// const dragLeave = (state) => (evt) => {
//   state.highlight = false
//   evt.preventDefault()
//   return true
// }

// const dragEnd = (mdl, state, item) => (evt) => {
//   state.highlight = false
//   mdl.state.dragging.swapItem = item
//   evt.preventDefault()
//   return true
// }

const editItem = (mdl, item) => {
  mdl.state.showModal = true
  mdl.state.modalContent = m(ItemForm, { catId: item.catId, mdl, item, isEdit: true })
}

const leftSwipe = (mdl, state, item) => {
  state.left = true
  editItem(mdl, item)
  resetSwipeAction(mdl, state, item)
}
const rightSwipe = (mdl, state, item) => {
  state.right = true
  mdl.state.dragging.isDragging = true//!mdl.state.dragging.isDragging
  mdl.state.dragItemList[item.catId].option('disabled', false)
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
  const minDistance = container.clientWidth * 30 / 100
  const swipeDistance = container.scrollLeft - container.clientWidth;
  // get the distance the user swiped
  if (swipeDistance < (minDistance * -1)) {
    leftAction()
  } else if (swipeDistance > minDistance) {
    rightAction()
  } else {
    resetAction()
  }
}


const handleSwipe = (mdl, state, item) => e => {
  !mdl.state.dragging.isDragging
    ?
    runSwipe({
      leftAction: () => leftSwipe(mdl, state, item),
      rightAction: () => rightSwipe(mdl, state, item),
      resetAction: () => resetSwipeAction(mdl, state, item)
    }, e) : () => { }
}

const setupDrag = mdl => ({ dom }) => {


  mdl.dragging = Sortable.create(dom)
  console.log(mdl.dragging)
}

const Item = ({ attrs: { mdl } }) => {
  const state = {
    highlight: false,
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li.w3-leftbar",
        {
          id: item.id,
          class: mdl.state.dragging.isDragging ? 'drag' : 'dont-drag',
          ondblclick: e => rightSwipe(mdl, state, item),
          // ondbltouch: e => rightSwipe(mdl, state, item),
        },
        m('.swipe-container', {
          ontouchend: handleSwipe(mdl, state, item)
        },



          m('.swipe-action.swipe-left', m('icon', m.trust('&#9997;'))),

          m('.swipe-element',
            m("img.w3-left", {
              src: item.img, style: { maxWidth: '85px' }
            }),
            m(".w3-block", { style: { fontSize: '1.2rem' } }, item.title),
            m('.w3-bar',
              m('.w3-bar-item', item.quantity > 0 && m("", `${item.quantity} ${item.unit}`)),
              m('.w3-bar-item', item.price > 0 && m("", `$ ${item.price}`))
            )


          ),





          m('.swipe-action.swipe-right', m('icon', m.trust('&#9888;'))),



        ),
      )
    },
  }
}

export default Item

