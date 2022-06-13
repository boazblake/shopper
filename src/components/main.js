import m from "mithril"
import Ticket from "./ticket"
import { NewProjectForm } from "./forms"
import { propEq } from "ramda"
import { pub } from "../pubsub"

const Main = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        "section.w3-section.w3-row w3-ul. w3-padding-row",
        {
          onupdate: ({ dom }) => {
            if (state.setTicket()) {
              Array.from(dom.children)
                .find(propEq("id", state.setTicket()))
                .scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "center",
                })
              state.setTicket(null)
            }
          },
          style: { height: "90vh", overflow: "auto" },
        },
        mdl.currentProject
          ? mdl.currentProject.tickets.map((ticket, key) =>
              m(Ticket, {
                key,
                ticket,
                mdl,
                state,
              })
            )
          : m(
              "section.w3-section",
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

