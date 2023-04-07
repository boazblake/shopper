import m from "mithril"
import { closeModal } from "../model"
const Modal = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { mdl } }) => {

      return mdl.state.showModal ?
        m(
          ".w3-modal#modal.w3-card",
          {
            onclick: (e) => {
              if (e.target.id == "modal") return closeModal(mdl)
            },
            style: { display: mdl.state.showModal ? "block" : "none" },
          },
          m('.w3-card-header',

            m(
              "button.w3-btn.w3-black.w3-border-black.w3-text-white",
              {
                onclick: (e) => {
                  e.preventDefault();
                  closeModal(mdl)
                }
              }, m.trust("&#10005;")
            )),
          m(
            "modal.w3-modal-content",
            m(".w3-section", {
              style: {
                maxHeight: '80vh', overflowX: 'hidden', overflowY: 'auto'
              }
            }, m(mdl.state.modalContent.content, mdl.state.modalContent.attrs))
          ),
          m('.w3-card-footer')
        ) : null
    },
  }
}

export default Modal

