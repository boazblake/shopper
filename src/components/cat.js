import m from "mithril"
import Item from "./item"
import { ItemForm } from "./forms"
import Dragster from 'dragsterjs';


const setupCat = ({ dom }) => {
  const drag = new Dragster({
    elementSelector: '.dragster-block',
    regionSelector: '.dragster-region',
    dragHandleCssClass: false,
    // dragOnlyRegionCssClass: PREFIX_CLASS_DRAGSTER + 'region--drag-only',
    replaceElements: false,
    updateRegionsHeight: true,
    minimumRegionHeight: 60,
    // onBeforeDragStart: dummyCallback,
    // onAfterDragStart: dummyCallback,
    // onBeforeDragMove: dummyCallback,
    // onAfterDragMove: dummyCallback,
    // onBeforeDragEnd: dummyCallback,
    // onAfterDragEnd: dummyCallback,
    // onAfterDragDrop: dummyCallback,
    scrollWindowOnDrag: true,
    dragOnlyRegionsEnabled: false,
    cloneElements: false,
    wrapDraggableElements: true,
    shadowElementUnderMouse: false,
  })

}

const Cat = ({ attrs: { mdl, cat } }) => {
  const state = {
    catId: cat.id,
    title: cat.title,
    items: cat.items,
    isSelected: false,
    togglePinSection: { onclick: () => (state.isSelected = !state.isSelected) },
  }

  return {
    oncreate: setupCat,
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
          m("p.w3-right", { style: { padding: '0 16px' } }, cat.title.toUpperCase()),
          m(
            "button.w3-btn w3-border-none w3-padding.w3-left",
            {
              onclick: () => {
                mdl.state.modalContent = m(ItemForm, { mdl, catId: cat.id })
                mdl.state.showModal = true
              }
            },
            m('strong', '+')
          )
        ),

        m(
          ".w3-ul",
          cat.items.map((item, idx) => m(Item, { key: item.id, item, mdl }))
        )
      ),
  }
}

export default Cat

