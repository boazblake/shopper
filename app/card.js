import { propEq } from "ramda"

const drag = (mdl) => (colId) => (evt) => {
  mdl.state.dragging.cardId = evt.target.id
  mdl.state.dragging.oldColId = colId
}

const Card = () => {
  return {
    view: ({ attrs: { colId, cardId, mdl } }) => {
      let card = mdl.state.project.cards.filter(propEq("id", cardId))[0]
      return m(
        ".w3-list-item",
        { id: cardId, draggable: true, ondragstart: drag(mdl)(colId) },
        [
          m(".card-header", [
            m("p.card-id", cardId),

            m(
              "input.panel-title w3-border",
              {
                oninput: (e) => (card.name = e.target.value),
                placeholder: "card title",
              },
              card.name
            ),
          ]),
          m(".card-body", [
            m(
              "textbox.panel-title",
              {
                oninput: (e) => (card.name = e.target.value),
                placeholder: "card title",
              },
              card.name
            ),
          ]),
          m(".card-footer"),
        ]
      )
    },
  }
}

export default Card

