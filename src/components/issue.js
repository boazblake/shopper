import m from "mithril"
import { load } from "../model"

const drag = (mdl) => (issue) => (evt) => {
  mdl.state.dragging.issue = issue
  mdl.state.dragging.oldTicketId = issue.ticketId
}

const updateIssue = (mdl, issue) => {
  const onSuccess = (data) => {
    console.log("updated issue", data)
    load(mdl)
  }
  mdl.http
    .putTask(mdl, `issues/${issue.id}`, issue)
    .fork(log("error"), onSuccess)
}

const Issue = () => {
  return {
    view: ({ attrs: { issue, mdl } }) => {
      return m(
        "li.w3-list-item.w3-leftbar w3-border-orange.w3-hover-orange",
        { id: issue.id, draggable: true, ondragstart: drag(mdl)(issue) },
        m("input.w3-input", {
          oninput: (e) => (issue.title = e.target.value),
          onfocusout: (e) => updateIssue(mdl, issue),
          placeholder: "issue",
          value: issue.title,
        }),
        m("textarea.w3-input", {
          oninput: (e) => (issue.text = e.target.value),
          onfocusout: (e) => updateIssue(mdl, issue),
          placeholder: "text",
          value: issue.text,
        })
      )
    },
  }
}

export default Issue

