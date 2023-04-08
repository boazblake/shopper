import m from 'mithril'
import Sortable from 'sortablejs'
import { CatForm } from './cat-form'
import { propEq, clone } from 'ramda'
import { STORE, load, closeModal } from '../model'
import { DoubleTap } from '../helpers'


const StoreCat = () => {
  const setupCat = (state, cat) => ({ dom }) => {
    const hammer = new Hammer.Manager(dom)
    hammer.add(DoubleTap())
    hammer.on('doubletap', () => state.isEdit = true)
  }

  const state = {
    isEdit: false,
    hammer: null
  }

  return {
    view: ({ attrs: { mdl, cat } }) => m('.w3-row', {
      id: cat.id, key: cat.id,
      oncreate: setupCat(state, cat),
    },
      m('p.handle.w3-col s1', m.trust('&#8942;')),
      m('.w3-col s8',
        m('.w3-row',
          m("label",
            state.isEdit ? m(CatForm, { mdl, cat: cat, isEdit: state.isEdit, closeCatForm: () => state.isEdit = false }) : cat.title),
        ),

        m('.w3-row',
          m("label.w3-col", cat.items.length))

      ),
      m(".w3-col s3.w3-row",
        state.isEdit && m("button.w3-button.w3-col", {
          class: 'w3-border-red',
          onclick: (e) => {
            e.preventDefault()
            state.isEdit = false
          }
        }, 'Cancel'),

      ),

    )
  }
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


  const state = {}

  return {
    view: ({ attrs: { mdl } }) => {
      const store = mdl.currentStore()

      if (isEdit) {
        state.title = store.title
        state.order = store.order
        state.id = store.id
        state.cats = clone(store.cats)
      }

      return m(
        "form.w3-container.w3-card.w3-white.w3-animate-zoom",
        {
          onsubmit: (e) => {
            e.preventDefault()
            validateAddOrUpdateStore(mdl, state, isEdit)
          }
        },

        m(
          ".w3-section",
          m('.w3-row',
            m("input.w3-input.w3-border-bottom", {
              class: isEdit ? 'w3-col s6' : '',
              type: "text",
              value: state.title,
              placeholder: 'Store Name',
              oninput: (e) => {
                isEdit ? (store.title = e.target.value) :
                  state.title = e.target.value
              },
            }),
            m(
              "button.w3-button", {
              type: 'submit',
              class: isEdit ? 'w3-col s6' : '',
            }, isEdit ? "Update Name" : "Add Store"
            )
          ),

          isEdit && m('.w3-block', m(CatForm, { mdl, closeCatForm: () => mdl.state.showModal = false })),

        ),
        isEdit && m(
          ".w3-list", {
          oncreate: setupDrag(mdl),
          style: {
            maxHeight: '400px', verflowX: 'hidden', overflowY: 'auto'
          }
        },


          state.cats.map(cat => m(StoreCat, { mdl, state, cat })
          )
        )
        ,

        isEdit && m(
          "button.w3-button.w3-border.w3-border-red.w3-margin-top.w3-left",
          { onclick: (e) => { e.preventDefault(); deleteStore(mdl, store.id) } },
          "Delete"
        ),
      )
    }
  }
}


export { StoreForm }
