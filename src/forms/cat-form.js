import m from 'mithril'
import { CAT, load } from '../model'

const deleteCat = (mdl, cat, closeCatForm) => {

  const onError = log("error")
  const onSuccess = () => { closeCatForm(); load(mdl); }


  mdl.http.deleteTask(mdl, `cats/${cat.id}`).fork(onError, onSuccess)
}


const addOrEditCat = (mdl, state, isEdit, closeCatForm) => {
  const cat = isEdit ? state : CAT(state.title, mdl.currentStore().id)
  const onError = log("error")
  const onSuccess = (data) => {
    state.title = ""
    closeCatForm()
    load(mdl)
  }
  mdl.http.putTask(mdl, `cats/${cat.id}`, cat).fork(onError, onSuccess)
}


const CatForm = ({ attrs: { isEdit, cat, closeCatForm } }) => {
  let state = {
    title: "",
  }
  if (isEdit) state = cat

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-animate-opacity",
        { onsubmit: (e) => e.preventDefault() },
        m('.w3-row',
          m("input.w3-input.w3-border-bottom.w3-col s6", {
            oncreate: ({ dom }) => { dom.select(); dom.focus() },
            type: "text",
            value: state.title,
            placeholder: "Category Title",
            oninput: (e) => (state.title = e.target.value),
          }), m('.w3-row.w3-col s6', {
            class: isEdit ? 'w3-col s6' : 'w3-block',
          }, m(
            "button.w3-button.w3-border.w3-border-orange.w3-col",
            { class: isEdit ? 'w3-col s6' : 'w3-block', onclick: () => addOrEditCat(mdl, state, isEdit, closeCatForm) },
            isEdit ? "Save" : "Add"
          ),
            isEdit &&
            m("button.w3-button.w3-border.w3-border-red.w3-col s6", { onclick: () => deleteCat(mdl, cat, closeCatForm) }, 'Delete')))
      )
  }
}


export { CatForm }
