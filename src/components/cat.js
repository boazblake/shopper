import m from "mithril"
import Item from "./item"
import { ItemForm } from "./forms"
import Sortable from "sortablejs"
import { load } from "../model"
import { propEq } from "ramda"

const updateItemOrder = (mdl, { newIndex, item }) => {
  const updatedItem = mdl.items.find(propEq('id', item.id))
  updatedItem.order = newIndex
  mdl.http
    .putTask(mdl, `items/${item.id}`, updatedItem)
    .fork(log("error"), () => load(mdl))
}

const setupDrag = mdl => ({ dom }) => {
  const options = {
    ghostClass: 'dragging',
    animation: 150,
    onEnd: (item) => updateItemOrder(mdl, item),
    // filter: '.dont-drag',
    draggable: '.drag'
  }
  // [
  //   'onChoose',
  //   'onStart',
  //   'onEnd',
  //   'onAdd',
  //   'onUpdate',
  //   'onSort',
  //   'onRemove',
  //   'onChange',
  //   'onUnchoose'
  // ].forEach(function (name) {
  //   options[name] = function (evt) {
  //     console.log({
  //       'event': name,
  //       'this': this,
  //       'item': evt.item,
  //       'from': evt.from,
  //       'to': evt.to,
  //       'oldIndex': evt.oldIndex,
  //       'newIndex': evt.newIndex
  //     })
  //   }
  // })
  mdl.state.dragList = Sortable.create(dom, options)
}

const Cat = ({ attrs: { mdl, cat } }) => {
  const state = {
    catId: cat.id,
    title: cat.title,
    items: cat.items,
    isSelected: false,
  }

  return {
    view: ({ attrs: { cat, mdl, key } }) =>
      m(
        "section.w3-section.w3-border-left",
        {
          key,
          id: cat.id,
        },

        m(
          ".w3-bar",
          {
            style: {
              position: '-webkit-sticky',
              position: 'sticky',
              backgroundColor: 'white',
            }
          },
          m("strong.w3-right.w3-button", {
            onclick: () => {
              mdl.state.modalContent = m(ItemForm, { mdl, catId: cat.id })
              mdl.state.showModal = true
            }, style: { padding: '0 16px' }
          }, cat.title.toUpperCase()),
        ),

        m('.w3-list',
          {
            oncreate: setupDrag(mdl),
          },
          cat.items.map((item, idx) => m(Item, { key: item.id, item, mdl }))
        )
      ),
  }
}

export default Cat

