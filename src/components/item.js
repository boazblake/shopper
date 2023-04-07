import m from "mithril"
import { ItemForm } from '../forms'
import { openModal, load } from "../model";
import { DoubleTap } from "../helpers";

const setupItem = (mdl, item, state) => ({ dom }) => {
  const hammer = new Hammer.Manager(dom)
  hammer.add(DoubleTap())
  hammer.on('doubletap', e => { editItem(e, mdl, item) })
  // m.redraw()
}

const purchaseItem = (mdl, state, item) => e => {
  let dist = Array.from(e.target.children)[1].getBoundingClientRect().x
  if (state.scrolled > window.innerWidth / 3) {
    state.purchased = true
  }

  if (state.purchased) {
    if (dist < state.scrolled) {
      state.purchased = false
      item.purchased = !item.purchased
      mdl.http.putTask(mdl, `items/${item.id}`, item).fork(log('e'), () => load(mdl))
    }
  }
  state.scrolled = dist

}

const editItem = (e, mdl, item) => {
  openModal({ content: ItemForm, mdl, opts: { catId: item.catId, item, isEdit: true } })
  m.redraw()
}


const leftSwipe = (mdl, state, item) => {
  console.log(mdl, state, item)
  state.left = true
  resetSwipeAction(mdl, state, item)
}
const rightSwap = (mdl, state, item) => {
  state.right = true
  mdl.state.dragging.isDragging = !mdl.state.dragging.isDragging
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
      rightAction: () => rightSwap(mdl, state, item),
      resetAction: () => resetSwipeAction(mdl, state, item)
    }, e) : () => { }
}

const Item = () => {
  const state = {
    highlight: false,
    purchased: false,
    scrolled: 0
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li",
        {
          id: item.id,
          'data-hammer': item.id,
          oncreate: setupItem(mdl, item, state),
          class: item.purchased ? 'w3-grey w3-text-white' : ''
        },
        m('.swipe-container',
          {
            onscroll: purchaseItem(mdl, state, item),
            ontouchend: handleSwipe(mdl, state, item),
          },
          m('.swipe-action.swipe-left', m('icon', m.trust('&#9997;'))),
          m('.swipe-element', { 'data-id': item.id }, m("img.w3-left", {
            src: item.img, style: { maxWidth: '85px' }
          }),
            m(".w3-block", { style: { fontSize: '1.2rem' } }, item.title),
            m('.w3-bar',
              m('.w3-bar-item', item.quantity > 0 && m("", `${item.quantity} ${item.unit}`)),
              m('.w3-bar-item', item.price > 0 && m("", `$ ${item.price}`))
            ))
        ))
    },
  }
}

export default Item

