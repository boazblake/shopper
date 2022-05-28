import Card from "./card"
import { CARD } from "./model"
import { uuid } from "./helpers"
import { propEq, without } from "ramda"
import { PinLine, PinSolid } from "@mithril-icons/clarity/cjs/index"

const drop = (mdl) => (state) => (evt) => {
  evt.preventDefault()
  if (!state.isSelected) {
    let cardId = mdl.state.dragging.cardId
    let oldColId = mdl.state.dragging.oldColId

    let oldCol = mdl.state.project.cols.filter(propEq("id", oldColId))[0]
    oldCol.cards = without([cardId], oldCol.cards)
    let newCol = mdl.state.project.cols.filter(propEq("id", state.colId))[0]

    newCol.cards.push(cardId)
    state.highlight = false

    return mdl
  }
}

const dragOver = (mdl) => (state) => (evt) => {
  // let col = mdl.state.project.cols.filter(propEq("id", state.colId))[0]
  if (state.isSelected) {
    state.highlight = false
  } else {
    state.highlight = true
  }

  evt.preventDefault()
}

const dragEnter = (mdl) => (state) => (evt) => {
  // state.highlight = true
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
    mdl.state.project.cols.filter(propEq("id", colId)).map((col) => {
      let card = CARD(id)
      mdl.state.project.cards.push(card)
      col.cards.push(card.id)
    })

  return {
    view: ({ attrs: { col, mdl } }) =>
      m(
        ".w3-border w3-rest w3-cell",
        {
          style: { minWidth: "300px", height: "90vh" },
          id: col.id,
          class: state.highlight ? "highlight-col" : "",
          ondrop: drop(mdl)(state),
          ondragover: dragOver(mdl)(state),
          ondragenter: dragEnter(mdl)(state),
          ondragend: dragEnd(mdl)(state),
          ondragleave: dragLeave(mdl)(state),
        },

        m(
          ".w3-panel",
          col.name && m("p.w3-tag w3-border w3-white", col.name),
          m("p.w3-tag", col.id),

          m(
            "button.w3-button w3-border w3-large w3-padding",
            { onclick: () => addCard(mdl)(col.id)(uuid()) },
            "Add Card"
          ),
          m(state.isSelected ? PinSolid : PinLine, state.togglePinSection),

          m("input.w3-input", {
            oninput: (e) => (col.name = e.target.value),
            placeholder: "column title",
            value: col.name,
          })
        ),
        m(
          ".w3-ul",
          col.cards.map((cardId, idx) =>
            m(Card, { key: idx, colId: col.id, cardId, mdl })
          )
        )
      ),
  }
}

export default Column

