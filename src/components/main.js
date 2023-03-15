import m from "mithril"
import Cat from "./cat"
import { StoreForm } from "../forms"
import { openModal } from "../model"
const Main = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        "section.w3-section.w3-row w3-ul.w3-padding-row",
        {
          style: { height: "90dvh", overflowX: "hidden", overflowY: 'auto' },
        },
        mdl.currentStore()
          ? mdl.currentStore().cats.map((cat, key) =>
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
              "button.w3-border w3-button w3-panel.w3-display-middle w3-light-grey w3-col-1",
              {
                onclick: () => openModal({ content: StoreForm, mdl, isEdit: false })
                ,
              },
              "Create a Store to Begin"
            )
          )
      ),
  }
}

export default Main

