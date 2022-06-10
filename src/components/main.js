import m from "mithril"
import Ticket from "./ticket"
import { NewProjectForm } from "./forms"

const Main = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "article.w3-row w3-ul",
        { style: { height: "90vh", overflow: "auto" } },
        mdl.currentProject
          ? mdl.currentProject.tickets.map((ticket, key) =>
              m(Ticket, { key, ticket, mdl })
            )
          : m(
              "",
              m(
                "button.w3-border-0 w3-button w3-panel.w3-display-middle w3-light-grey w3-col-1",
                {
                  onclick: () => {
                    mdl.state.modalContent = m(NewProjectForm, { mdl })
                    mdl.state.showModal = true
                  },
                },
                "Create a Project to Begin"
              )
            )
      ),
  }
}

export default Main

