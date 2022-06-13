import m from "mithril"
import { isEmpty } from "ramda"
import { load, loadProject } from "../model"
import { NewProjectForm } from "./forms"
// import { findCurrentProject } from "./helpers"

const lists = new Set()

const deleteProject = (mdl, id) => {
  mdl.http
    .deleteTask(mdl, `projects/${id}`)
    .fork(log("error deleteing"), () => load(mdl))
}

const deleteTicket = (mdl, id) => {
  mdl.http
    .deleteTask(mdl, `tickets/${id}`)
    .fork(log("error deleteing"), () => load(mdl))
}

const setTicket = (state, id) => Promise.resolve(state.setTicket(id))

const selectProject = (mdl, state, project) =>
  Promise.resolve((mdl.currentProject = project)).then(() =>
    state.toggleSideBar(state)
  )

const SideBar = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        ".w3-sidebar#sidebar.w3-bar-block.w3-collapse.w3-card.w3-animate-left",
        {
          style: {
            width: "300px",
            display: state.sidebar.open ? "block" : "none",
          },
        },

        mdl.settings.profile != "desktop" &&
          m(
            "button.w3-bar-item.w3-button.w3-large",
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
            ".w3-right-align.w3-row",
            { key: project.id },
            m(
              "button.w3-button.w3-left-align.w3-col",
              {
                class:
                  mdl.currentProject.id == project.id
                    ? "w3-leftbar w3-border-orange w3-border-10"
                    : "",
                onclick: (e) => {
                  e.stopPropagation()
                  selectProject(mdl, state, project)
                },
              },
              m(
                ".w3-left-align.w3-col.s4",
                m(
                  "button.pointer.w3-badge.w3-pink.w3-border-0.w3-circle.w3-hover-red.w3-left-align",
                  {
                    onclick: (e) => {
                      e.stopPropagation()
                      deleteProject(mdl, project.id)
                    },
                  },
                  "x"
                )
              ),
              m(
                "label.w3-label.w3-col.s4.w3-left-align.pointer",
                project.title
              ),
              !isEmpty(project.tickets) &&
                m(
                  ".w3-col.s4.w3-right-align",
                  {
                    onclick: (e) => {
                      e.stopPropagation()
                      lists.has(project.id)
                        ? lists.delete(project.id)
                        : lists.add(project.id)
                    },
                  },
                  m("i.w3-btn.w3-circle", lists.has(project.id) ? "V" : ">")
                )
            ),

            !isEmpty(project.tickets) &&
              m(
                "ul.w3-list",
                {
                  class: lists.has(project.id) ? "w3-show" : "w3-hide",
                  id: project.id,
                },
                project.tickets.map(
                  (ticket, idx) =>
                    ticket.title &&
                    m(
                      ".w3-list-item.pointer.w3-row",
                      {
                        key: ticket.id,
                        onclick: () => {
                          setTicket(state, ticket.id).then(() =>
                            selectProject(mdl, state, project)
                          )
                        },
                      },
                      m(
                        "button.pointer.w3-badge.w3-pink.w3-border-0.w3-circle.w3-hover-red.w3-left-align",
                        {
                          onclick: (e) => {
                            e.stopPropagation()
                            deleteTicket(mdl, ticket.id)
                          },
                        },
                        "x"
                      ),
                      m("label.w3-col s4", ticket.title),
                      m(
                        ".w3-right-align.w3-col s4",
                        m(".w3-tag w3-orange", ticket.issues?.length)
                      )
                    )
                )
              )
          )
        )
      ),
  }
}

export default SideBar

