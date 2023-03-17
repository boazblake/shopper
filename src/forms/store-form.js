import m from 'mithril'
import Sortable from 'sortablejs'
import { CatForm } from './cat-form'
import { propEq } from 'ramda'
import { STORE, load, closeModal } from '../model'





const deleteCat = (mdl, cat) => {

  const onError = log("error")
  const onSuccess = () => {

    load(mdl)
  }

  mdl.http.deleteTask(mdl, `cats/${cat.id}`).fork(onError, onSuccess)
}


const addStore = (mdl, state) => {
  let store = STORE(state.title)

  const onError = log("error")
  const onSuccess = (data) => {
    state.title = ""
    closeModal(mdl)
    load(mdl)
  }

  mdl.http.postTask(mdl, "stores", store).fork(onError, onSuccess)
}

const updateCatOrder = (mdl, { newIndex, item }) => {
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
    handle: '.handle',
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

const validateAddOrUpdateStore = (mdl, state, isEdit) => {
  let store = isEdit ? { title: state.title, order: state.order, id: state.id } : STORE({ title: state.title, order: mdl.stores.length })
  const onSuccess = (data) => {
    state = {
      title: "",
    }
    load(mdl)
    closeModal(mdl)
  }

  const addOrUpdateStoreTask = (mdl, store) => isEdit
    ? mdl.http.putTask(mdl, `stores/${store.id}`, store)
    : mdl.http.postTask(mdl, "stores", store)

  //VALIDATIONSS
  return addOrUpdateStoreTask(mdl, store).
    fork(log("error"), onSuccess)
}

const deleteStore = (mdl, id) =>
  mdl.http.deleteTask(mdl, `stores/${id}`).fork(log('err'), () => {
    load(mdl);
    closeModal(mdl)
  })




const StoreForm = ({ attrs: { mdl, isEdit } }) => {


  const state = {
    title: "",
    addNewCat: false,
    editCat: false,
    cat: null,
  }

  const closeCatForm = () => {
    state.title = ""
    state.addNewCat = false
    state.editCat = false
    state.cat = null
  }


  return {
    view: ({ attrs: { mdl } }) => {
      const store = mdl.currentStore()

      if (isEdit) {
        state.title = store.title
        state.order = store.order
        state.id = store.id
        state.cats = store.cats
      }

      return m(
        "form.w3-container.w3-card.w3-white.w3-animate-zoom",
        { onsubmit: (e) => e.preventDefault() },
        m('.w3-section', m(
          "button.w3-button.w3-black.w3-border-black.w3-text-white",
          {
            // style: {
            //   position: 'absolute',
            //   top: '-50px',
            // },
            onclick: () => closeModal(mdl)
          }, m.trust("&#10005;")
        )),
        m(
          ".w3-section",
          m('.w3-cell-row',
            m('.w3-cell', m("input.w3-input.w3-border-bottom", {
              type: "text",
              value: state.title,
              placeholder: 'Store Name',
              oninput: (e) => (store.title = e.target.value),
            })),
            m(
              "button.w3-button.w3-cell",
              { onclick: () => validateAddOrUpdateStore(mdl, state, isEdit) },
              isEdit ? "Update Name" : "Add Store"
            )),
          // isEdit && m('.w3-section', m(
          //   "button.w3-button.w3-block", {
          //   class: state.addNewCat || state.editCat ? 'w3-red' : 'w3-green',
          //   onclick: () => state.addNewCat || state.editCat ? closeCatForm() : state.addNewCat = true,
          // }, state.addNewCat || state.editCat ? "Cancel / Close" : "Add New Category"
          // ),
          isEdit && m(CatForm, { mdl, closeCatForm }),

          // ),
        ),
        isEdit && m(
          ".w3-list", {
          oncreate: setupDrag(mdl),
          style: {
            height: '400px', overflowX: 'hidden', overflowY: 'auto'
          }
        },
          state.cats.map(cat =>
            m('.w3-row', {
              id: cat.id, key: cat.id,
            },
              m('p.handle.w3-col s1', m.trust('&#8942;')),
              m('.w3-col s11 w3-row',
                state.editCat == cat.id ?
                  m(CatForm, { mdl, cat: state.cat, isEdit, closeCatForm }) :

                  m("label.w3-col s7 m6 l6", cat.title),

                m(".w3-col s4", m("button.w3-button", {
                  onclick: () => {
                    state.cat = cat
                    state.editCat = cat.id
                  }
                }, 'Edit'),
                  m("button.w3-button", { onclick: () => deleteCat(mdl, cat) }, 'X')
                ),

              ),
              m('.w3-col s11',
                m('.w3-row',
                  m("label.w3-col", cat.items.length))
              ),
            )
          )),

        isEdit && m(
          "button.w3-button.w3-red.w3-margin-top.w3-left",
          { onclick: () => deleteStore(mdl, store.id) },
          "Delete"
        ),
      )
    }
  }
}


export { StoreForm }
