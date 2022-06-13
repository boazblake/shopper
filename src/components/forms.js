import m from "mithril"
import { uuid } from "../helpers"
import { PROJECT, load } from "../model"

const addProject = (mdl, state) => {
  let project = PROJECT(state.title)

  const onError = log("error")
  const onSuccess = (data) => {
    state.title = ""
    mdl.state.showModal = false
    load(mdl)
  }

  mdl.http.postTask(mdl, "projects", project).fork(onError, onSuccess)
}

const NewProjectForm = () => {
  const state = {
    title: "",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-container.w3-card.w3-white.w3-animate-zoom",
        { onsubmit: (e) => e.preventDefault() },
        m(
          "div.w3-section",
          m("label", m("b", "Project Title")),
          m("input.w3-input.w3-border-bottom", {
            type: "text",
            value: state.title,
            oninput: (e) => (state.title = e.target.value),
          })
        ),
        m(
          "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
          { onclick: () => addProject(mdl, state) },
          "add"
        )
      ),
  }
}

export { NewProjectForm }

