import m from "mithril"
import Issue from "./issue"
import { ISSUE, load } from "../model"
import { uuid } from "../helpers"
import { head, propEq, without } from "ramda"

const drop = (mdl) => (state) => (evt) => {
  evt.preventDefault()
  if (!state.isSelected) {
    let issue = mdl.state.dragging.issue
    issue.ticketId = state.ticketId

    const onSuccess = (data) => {
      load(mdl)
      state.highlight = false
    }

    mdl.http.putTask(mdl, "issues", issue).fork(log("error"), onSuccess)

    // let oldTicketId = mdl.state.dragging.ticketId

    // let oldTicket = mdl.currentProject.tickets.filter(
    //   propEq("id", oldTicketId)
    // )[0]
    // oldTicket.issues = oldTicket.issues.filter((i) => i.id !== issueId)
    // let newTicket = mdl.currentProject.tickets.filter(
    //   propEq("id", state.ticketId)
    // )[0]
    // console.log(newTicket, oldTicket, state)
    // newTicket.issues.push(issueId)

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

const Ticket = ({ attrs: { mdl, ticket } }) => {
  const state = {
    highlight: false,
    ticketId: ticket.id,
    title: ticket.title,
    issues: ticket.issues,
    isSelected: false,
    togglePinSection: { onclick: () => (state.isSelected = !state.isSelected) },
  }

  const addIssue = (mdl) => (ticketId) => (id) => {
    let issue = ISSUE(ticketId)
    const onSuccess = (data) => {
      load(mdl)
      // mdl.currentProject.tickets
      //   .filter(propEq("id", ticket.id))
      //   .map((ticket) => ticket.issues.push(data))
    }

    mdl.http.postTask(mdl, "issues", issue).fork(log("error"), onSuccess)
  }

  const updateTicket = (mdl) => {
    const onSuccess = (data) => {
      console.log("update project", data)
      load(mdl)
    }
    mdl.http
      .putTask(mdl, `tickets/${ticket.id}`, ticket)
      .fork(log("error"), onSuccess)
  }

  return {
    view: ({ attrs: { ticket, mdl } }) =>
      m(
        ".w3-border w3-cell w3-cell-row",
        {
          style: { minWidth: "300px", width: "300px", height: "90vh" },
          id: ticket.id,
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
            m("input.w3-input.w3-col.w3-large.w3-padding", {
              oninput: (e) => (ticket.title = e.target.value),
              placeholder: "Ticket-Number",
              value: ticket.title,
            }),
            m(
              "button.w3-button w3-border w3-padding w3-col",
              { onclick: () => addIssue(mdl)(ticket.id)(uuid()) },
              "Add Issue"
            )
          )
        ),
        m(
          ".w3-ul w3-hoverable w3-paddings",
          head(
            mdl.currentProject.tickets.filter(propEq("id", ticket.id))
          ).issues.map((issue, idx) => m(Issue, { key: idx, issue, mdl }))
        )
      ),
  }
}

export default Ticket

