import m from "mithril"
import { propEq } from "ramda"

const drag = (mdl) => (issue) => (evt) => {
  mdl.state.dragging.issue = issue
  mdl.state.dragging.oldTicketId = issue.ticketId
}

const Issue = () => {
  return {
    view: ({ attrs: { issue, mdl } }) => {
      return m(
        "li.w3-list-itemw3-leftbar w3-leftbar ",
        { id: issue.id, draggable: true, ondragstart: drag(mdl)(issue) },
        m("input.w3-input", {
          oninput: (e) => (issue.title = e.target.value),
          placeholder: "issue",
          value: issue.title,
        }),
        m("textarea.w3-input", {
          oninput: (e) => (issue.text = e.target.value),
          placeholder: "text",
          value: issue.text,
        })
      )
    },
  }
}

export default Issue

