import { m } from "mithril"
import { isEmpty } from "ramda"
import NewProjectForm from "./forms"
import { findCurrentProject } from "./helpers"

const selectProject = (mdl, project) => {
  console.log(project)
  mdl.state.projectId = project.id
  mdl.currentProject = findCurrentProject(mdl)
}

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
          "button",
          {
            onclick: () => {
              mdl.state.modalContent = m(NewProjectForm, { mdl })
              mdl.state.showModal = true
            },
          },
          "New Project"
        ),

        mdl.projects.map((project) =>
          m(
            ".w3-right-align",
            m(
              "button.w3-bar-item.w3-button",
              { onclick: () => selectProject(mdl, project) },
              project.title
            ),

            !isEmpty(project.cols) &&
              m(
                "ul.w3-list",
                project.cols.map((col) => m(".w3-list-item", col.title))
              )
          )
        )
      ),
  }
}

export default SideBar

