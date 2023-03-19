import m from "mithril"
import { ItemForm } from '../forms'
import { openModal } from "../model";

const editItem = (mdl, item) => {
  const content = ItemForm
  const opts = { catId: item.catId, item, isEdit: true }
  openModal({ content, mdl, opts })
}



const Item = () => {
  const state = {
    highlight: false,
  }
  return {
    view: ({ attrs: { item, mdl } }) => {
      return m(
        "li",
        {
          id: item.id,
          ondblclick: e => editItem(mdl, item),
        },
        m("img.w3-left", {
          src: item.img, style: { maxWidth: '85px' }
        }),
        m(".w3-block", { style: { fontSize: '1.2rem' } }, item.title),
        m('.w3-bar',
          m('.w3-bar-item', item.quantity > 0 && m("", `${item.quantity} ${item.unit}`)),
          m('.w3-bar-item', item.price > 0 && m("", `$ ${item.price}`))
        )
      )
    },
  }
}

export default Item

