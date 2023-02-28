import m from "mithril"
import Cat from "./cat"
import { StoreForm } from "./forms"

const Main = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        "section.w3-section.w3-row w3-ul. w3-padding-row",
        {
          // onupdate: ({ dom }) => {
          //   if (state.setCat()) {
          //     Array.from(dom.children)
          //       .find(propEq("id", state.setCat()))
          //       .scrollIntoView({
          //         behavior: "smooth",
          //         block: "start",
          //         inline: "center",
          //       })
          //     state.setCat(null)
          //   }
          // },
          style: { height: "80dvh", overflow: "auto" },
        },
        mdl.currentStore
          ? mdl.currentStore.cats.map((cat, key) =>
            m(Cat, {
              key,
              cat,
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
                  mdl.state.modalContent = m(StoreForm, { mdl })
                  mdl.state.showModal = true
                },
              },
              "Create a Store to Begin"
            )
          )
      ),
  }
}

export default Main

