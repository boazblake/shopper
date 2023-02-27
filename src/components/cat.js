import m from "mithril"
import Item from "./item"
import { ItemForm } from "./forms"

const Cat = ({ attrs: { mdl, cat } }) => {
  const state = {
    catId: cat.id,
    title: cat.title,
    items: cat.items,
    isSelected: false,
    togglePinSection: { onclick: () => (state.isSelected = !state.isSelected) },
  }

  return {
    view: ({ attrs: { cat, mdl, key } }) =>
      m(
        "section.w3-section.w3-border-left.",
        {
          key,
          id: cat.id,
        },

        m(
          ".w3-panel.w3-bar",
          {
            style: {
              position: '-webkit-sticky',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
            }
          },
          m("p.w3-right", cat.title.toUpperCase()),
          m(
            "button.w3-btn w3-border-none w3-padding.w3-left",
            {
              onclick: () => {
                mdl.state.modalContent = m(ItemForm, { mdl, catId: cat.id })
                mdl.state.showModal = true
              }
            },
            "+"
          )
        ),

        m(
          ".w3-ul w3-paddings w3-border-top.dragster-region",
          cat.items.map((item, idx) => m(Item, { key: item.id, item, mdl }))
        )
      ),
  }
}

export default Cat

