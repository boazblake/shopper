import m from "mithril"
import { load, TICKET } from "../model"
import { shortName, uuid } from "../helpers"

const addTicket = (mdl, state) => {
  const ticket = TICKET(shortName(mdl), mdl.currentProject.id)
  const onError = log("error")
  const onSuccess = (data) => {
    load(mdl)
    // console.log("success", data)
    // mdl.currentProject.tickets.push(ticket)
  }
  mdl.http.postTask(mdl, "tickets", ticket).fork(onError, onSuccess)
}

const updateProject = (mdl) => {
  const onSuccess = (data) => {
    console.log("update project", data)
    load(mdl)
  }
  mdl.http
    .putTask(mdl, `projects/${mdl.currentProject.id}`, mdl.currentProject)
    .fork(log("error"), onSuccess)
}

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(
        "nav.w3-bar.w3-container.w3-padding.w3-fixed",
        m(
          "button.w3-button.w3-hide-large.w3-border",
          { onclick: () => state.toggleSideBar(state) },
          "MENU"
        ),
        mdl.currentProject &&
          m(
            ".w3-row w3-section",
            m(
              ".m6 w3-left",
              m("input.w3-input w3-border-bottom w3-col", {
                oninput: (e) => (mdl.currentProject.title = e.target.value),
                placeholder: "project title",
                value: mdl.currentProject.title,
                onfocusout: () => updateProject(mdl),
              })
            ),
            m(
              ".m3 w3-right",
              m(
                "button. w3-button  w3-border w3-large w3-col",
                {
                  onclick: () => addTicket(mdl, state),
                },
                "Add Ticket"
              )
            )
          )
      )
    },
  }
}

export default Toolbar

