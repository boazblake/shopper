import m from "mithril"
import { closeModal } from "../model"
const Modal = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { mdl } }) => {
      return mdl.state.modalContent ?
        m(
          ".w3-modal#modal",
          {
            onclick: (e) => {
              if (e.target.id == "modal") return closeModal(mdl)
            },
            style: { display: mdl.state.showModal ? "block" : "none" },
          },
          m(
            "modal.w3-modal-content",
            m(".w3-container", {
              style: {
                maxHeight: '80vh', overflowX: 'hidden', overflowY: 'auto'
              }
            }, m(mdl.state.modalContent.content, mdl.state.modalContent.attrs))
          )
        ) : null
    },
  }
}

export default Modal

