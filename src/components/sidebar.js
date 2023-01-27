import m from "mithril"
import { isEmpty } from "ramda"
import { load, loadStore } from "../model"
import { NewStoreForm } from "./forms"
// import { findCurrentStore } from "./helpers"

const lists = new Set()

const deleteStore = (mdl, id) => {
  mdl.http
    .deleteTask(mdl, `stores/${id}`)
    .fork(log("error deleteing"), () => load(mdl))
}

const deleteTicket = (mdl, id) => {
  mdl.http
    .deleteTask(mdl, `cats/${id}`)
    .fork(log("error deleteing"), () => load(mdl))
}

const setCat = (state, id) => Promise.resolve(state.setCat(id))

const selectStore = (mdl, state, store) =>
  Promise.resolve((mdl.currentStore = store)).then(() =>
    state.toggleSideBar(state)
  )

const SideBar = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        ".w3-sidebar#sidebar.w3-bar-block.w3-collapse.w3-card.w3-animate-left",
        {
          style: {
            width: mdl.settings.profile == 'desktop' ? '300px' : "90%",
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
              mdl.state.modalContent = m(NewStoreForm, { mdl })
              mdl.state.showModal = true
            },
          },
          "New Store"
        ),

        mdl.stores.map((store, idx) =>
          m(
            ".w3-right-align.w3-row",
            { key: store.id },
            m(
              "button.w3-button.w3-left-align.w3-col",
              {
                class:
                  mdl.currentStore.id == store.id
                    ? "w3-leftbar w3-border-orange w3-border-10"
                    : "",
                onclick: (e) => {
                  e.stopPropagation()
                  selectStore(mdl, state, store)
                },
              },
              m(
                ".w3-left-align.w3-col.s4",
                m(
                  "button.pointer.w3-badge.w3-pink.w3-border-0.w3-circle.w3-hover-red.w3-left-align",
                  {
                    onclick: (e) => {
                      e.stopPropagation()
                      deleteStore(mdl, store.id)
                    },
                  },
                  "x"
                )
              ),
              m(
                "label.w3-label.w3-col.s4.w3-left-align.pointer",
                store.title
              ),
              !isEmpty(store.cats) &&
              m(
                ".w3-col.s4.w3-right-align",
                {
                  onclick: (e) => {
                    e.stopPropagation()
                    lists.has(store.id)
                      ? lists.delete(store.id)
                      : lists.add(store.id)
                  },
                },
                m("i.w3-btn.w3-circle", lists.has(store.id) ? "V" : ">")
              )
            ),

            !isEmpty(store.cats) &&
            m(
              "ul.w3-list",
              {
                class: lists.has(store.id) ? "w3-show" : "w3-hide",
                id: store.id,
              },
              store.cats.map(
                (cat, idx) =>
                  m(
                    ".w3-list-item.pointer.w3-row",
                    {
                      key: cat.id,
                      onclick: () => {
                        setCat(state, cat.id).then(() =>
                          selectStore(mdl, state, store)
                        )
                      },
                    },
                    m(
                      "button.pointer.w3-badge.w3-pink.w3-border-0.w3-circle.w3-hover-red.w3-left-align",
                      {
                        onclick: (e) => {
                          e.stopPropagation()
                          deleteTicket(mdl, cat.id)
                        },
                      },
                      "x"
                    ),
                    m("label.w3-col s4", cat.title),
                    m(
                      ".w3-right-align.w3-col s4",
                      m(".w3-tag w3-orange", cat.issues?.length)
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

