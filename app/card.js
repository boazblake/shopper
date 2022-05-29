import { propEq } from "ramda"

const drag = (mdl) => (colId) => (evt) => {
  mdl.state.dragging.cardId = evt.target.id
  mdl.state.dragging.oldColId = colId
}

const Card = () => {
  return {
    view: ({ attrs: { colId, cardId, mdl } }) => {
      let card = mdl.currentProject.cards.filter(propEq("id", cardId))[0]
      return m(
        "li.w3-list-item",
        { id: cardId, draggable: true, ondragstart: drag(mdl)(colId) },
        m("input.w3-input", {
          oninput: (e) => (card.title = e.target.value),
          placeholder: "issue",
          value: card.title,
        }),
        m("textarea.w3-input", {
          oninput: (e) => (card.text = e.target.value),
          placeholder: "text",
          value: card.text,
        })
      )
    },
  }
}

export default Card

