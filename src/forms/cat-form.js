import m from 'mithril'
import { CAT, load } from '../model'

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
        "form.w3-container.w3-card.w3-white.w3-animate-opacity",
        { onsubmit: (e) => e.preventDefault() },
        m('.w3-cell-row',
          m('.w3-cell', m("input.w3-input.w3-border-bottom", {
            oncreate: ({ dom }) => { dom.select(); dom.focus() },
            type: "text",
            value: state.title,
            placeholder: "Category Title",
            oninput: (e) => (state.title = e.target.value),
          })),
          m(
            "button.w3-cell.w3-button.w3-orange.w3-section.w3-padding",
            { onclick: () => addOrEditCat(mdl, state, isEdit, closeCatForm) },
            isEdit ? "Edit" : "add"
          ))
      ),
  }
}


export { CatForm }
