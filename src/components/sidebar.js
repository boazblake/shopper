import m from "mithril"
import { isEmpty, propEq } from "ramda"
import { load } from "../model"
import { StoreForm } from "./forms"
import Sortable from "sortablejs"



const updateCatOrder = (mdl, { newIndex, item }) => {
  // console.log(mdl, item)
  const updatedCat = mdl.cats.find(propEq('id', item.id))
  updatedCat.order = newIndex
  mdl.http
    .putTask(mdl, `cats/${item.id}`, updatedCat)
    .fork(log("error"), () => load(mdl))
}



const setupDrag = mdl => ({ dom }) => {
  const options = {
    ghostClass: 'dragging',
    animation: 150,
    onEnd: cat => updateCatOrder(mdl, cat)
  }

  // [
  //   'onChoose',
  //   'onStart',
  //   'onEnd',
  //   'onAdd',
  //   'onUpdate',
  //   'onSort',
  //   'onRemove',
  //   'onChange',
  //   'onUnchoose'
  // ].forEach(function (name) {
  //   options[name] = function (evt) {
  //     console.log({
  //       'event': name,
  //       'this': this,
  //       'item': evt.item,
  //       'from': evt.from,
  //       'to': evt.to,
  //       'oldIndex': evt.oldIndex,
  //       'newIndex': evt.newIndex
  //     })
  //   }
  // })
  mdl.state.dragCatList = Sortable.create(dom, options)
}

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
            onclick: () => openModal({ mdl, content: StoreForm }),
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
                    // const state = mdl.state.dragCatList[store.id].option('disabled')
                    // mdl.state.dragCatList[store.id].option('disabled', !state)
                    e.stopPropagation()
                    lists.has(store.id)
                      ? lists.delete(store.id)
                      : lists.add(store.id)
                  },
                },
                m("i.w3-tiny.w3-btn", lists.has(store.id) ? "Hide" : "Show")
              )
            ),

            !isEmpty(store.cats) &&
            m(
              ".w3-list",
              {
                class: lists.has(store.id) ? "w3-show" : "w3-hide",
                id: store.id,
                oncreate: setupDrag(mdl)
              },
              store.cats.map(
                (cat, idx) =>
                  m(
                    ".pointer.w3-row",
                    {
                      key: cat.id,
                      id: cat.id,
                      draggable: true,
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
                      m(".w3-tag w3-orange", cat.items?.length)
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

