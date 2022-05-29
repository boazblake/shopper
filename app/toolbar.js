import { COL } from "./model"
import { uuid } from "./helpers"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(
        "nav.w3-bar.w3-container.w3-padding",
        m(
          "button.w3-button.w3-hide-large",
          { onclick: () => state.toggleSideBar(state) },
          "MENU"
        ),
        m("hr"),
        m(
          ".w3-row",
          m("input.w3-input w3-border-bottom w3-col m6", {
            oninput: (e) => (mdl.currentProject.title = e.target.value),
            placeholder: "project title",
            value: mdl.currentProject.title,
          }),
          m(
            "button. w3-button  w3-border w3-large w3-col m1",
            { onclick: () => mdl.currentProject.cols.push(COL(uuid())) },
            "+"
          )
        )
      )
    },
  }
}

export default Toolbar

