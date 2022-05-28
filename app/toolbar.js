import { COL } from "./model"
import { uuid } from "./helpers"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(
        "nav.w3-bar.w3-container.w3-padding.w3-top",
        mdl.settings.profile != "desktop" &&
          m(
            "button.w3-button",
            { onclick: () => state.toggleSideBar(state) },
            "MENU"
          ),
        m("hr"),
        m(
          ".w3-row",
          m(
            ".w3-half",
            m("input.w3-bar-item w3-input w3-xxlarge w3-border-bottom", {
              oninput: (e) => (mdl.state.project.title = e.target.value),
              placeholder: "project title",
              value: mdl.state.project.title,
            })
          ),

          m(
            ".w3-half",
            m(
              "button. w3-button w3-bar-item w3-border w3-large",
              { onclick: () => mdl.state.project.cols.push(COL(uuid())) },
              "Add Column"
            )
          )
        )
      )
    },
  }
}

export default Toolbar

