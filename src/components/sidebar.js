import m from "mithril"
import { isEmpty } from "ramda"
import { load, loadProject } from "../model"
import { NewProjectForm } from "./forms"
// import { findCurrentProject } from "./helpers"

const deleteProject = (mdl, projectId) => {
  mdl.http
    .deleteTask(mdl, `projects/${projectId}`)
    .fork(log("error deleteing"), () => load(mdl))
}
const selectProject = (mdl, state, project) =>
  Promise.resolve((mdl.currentProject = project))
    .then(() => loadProject(mdl))
    .then(() => state.toggleSideBar(state))

const SideBar = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        ".w3-sidebar#sidebar.w3-bar-block.w3-collapse.w3-card.w3-animate-left",
        {
          style: {
            width: "200px",
            display: state.sidebar.open ? "block" : "none",
          },
        },

        m(
          "button.w3-bar-item.w3-button.w3-large.w3-hide-large",
          { onclick: () => state.toggleSideBar(state) },
          "Close "
        ),

        m(
          "button.w3-button.w3-orange",
          {
            onclick: () => {
              mdl.state.modalContent = m(NewProjectForm, { mdl })
              mdl.state.showModal = true
            },
          },
          "New Project"
        ),

        mdl.projects.map((project, idx) =>
          m(
            ".w3-right-align",
            { key: idx },
            m(
              "button.w3-bar-item.w3-button",
              { onclick: () => selectProject(mdl, state, project) },
              project.title,
              m(
                "button.w3-button.w3-badge.w3-pink.w3-border-0.w3-circle.w3-hover-red",
                {
                  onclick: (e) => {
                    e.stopPropagation()
                    deleteProject(mdl, project.id)
                  },
                },
                "x"
              )
            ),

            !isEmpty(project.tickets) &&
              m(
                "ul.w3-list",
                project.tickets.map(
                  (ticket, idx) =>
                    ticket.title &&
                    m(
                      ".w3-list-item",
                      {
                        key: idx,
                        onclick: () => {
                          selectProject(mdl, state, project).then(() =>
                            setTimeout(() => {
                              console.log(
                                "changed",
                                document.getElementById(ticket.id)
                              )

                              document
                                .getElementById(ticket.id)
                                ?.scrollIntoView()
                            }, 1000)
                          )
                        },
                      },
                      ticket.title,
                      m(".w3-tag.w3-padding", ticket.issues?.length)
                    )
                )
              )
          )
        )
      ),
  }
}

export default SideBar

