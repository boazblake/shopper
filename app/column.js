import Card from "./card"
import { CARD } from "./model"
import { uuid } from "./helpers"
import { propEq, without } from "ramda"

const drop = (mdl) => (state) => (evt) => {
  evt.preventDefault()
  if (!state.isSelected) {
    let cardId = mdl.state.dragging.cardId
    let oldColId = mdl.state.dragging.oldColId

    let oldCol = mdl.currentProject.cols.filter(propEq("id", oldColId))[0]
    oldCol.cards = without([cardId], oldCol.cards)
    let newCol = mdl.currentProject.cols.filter(propEq("id", state.colId))[0]

    newCol.cards.push(cardId)
    state.highlight = false

    return mdl
  }
}

const dragOver = (mdl) => (state) => (evt) => {
  // let col = mdl.currentProject.cols.filter(propEq("id", state.colId))[0]
  if (state.isSelected) {
    state.highlight = false
  } else {
    state.highlight = true
  }

  evt.preventDefault()
}

const dragEnter = (mdl) => (state) => (evt) => {
  state.highlight = true
  evt.preventDefault()
  return true
}

const dragLeave = (mdl) => (state) => (evt) => {
  state.highlight = false
  evt.preventDefault()
  return true
}

const dragEnd = (mdl) => (state) => (evt) => {
  state.highlight = false
  evt.preventDefault()
  return true
}

const Column = ({ attrs: { mdl, col } }) => {
  const state = {
    highlight: false,
    colId: col.id,
    isSelected: false,
    togglePinSection: { onclick: () => (state.isSelected = !state.isSelected) },
  }

  const addCard = (mdl) => (colId) => (id) =>
    mdl.currentProject.cols.filter(propEq("id", colId)).map((col) => {
      let card = CARD(id)
      mdl.currentProject.cards.push(card)
      col.cards.push(card.id)
    })

  return {
    view: ({ attrs: { col, mdl } }) =>
      m(
        ".w3-border w3-cell w3-cell-row",
        {
          style: { minWidth: "300px", width: "300px", height: "90vh" },
          id: col.id,
          class: state.highlight ? "highlight-col" : "",
          ondrop: drop(mdl)(state),
          ondragover: dragOver(mdl)(state),
          ondragenter: dragEnter(mdl)(state),
          ondragend: dragEnd(mdl)(state),
          ondragleave: dragLeave(mdl)(state),
        },

        m(
          ".w3-panel w3-cell ",
          m(
            ".w3-row-padding",
            m("input.w3-input.w3-col", {
              oninput: (e) => (col.title = e.target.value),
              placeholder: "Ticket-Number",
              value: col.title,
            }),
            m(
              "button.w3-button w3-border w3-padding w3-col",
              { onclick: () => addCard(mdl)(col.id)(uuid()) },
              "+"
            )
          )
        ),
        m(
          ".w3-ul w3-hoverable w3-paddings",
          col.cards.map((cardId, idx) =>
            m(Card, { key: idx, colId: col.id, cardId, mdl })
          )
        )
      ),
  }
}

export default Column

