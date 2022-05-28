import NewProjectForm from "./forms"

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
          m("button.w3-bar-item.w3-button", project.title)
        )
      ),
  }
}

export default SideBar

